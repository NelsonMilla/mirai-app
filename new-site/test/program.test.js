import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Evaluate the classic scripts the way the page does (sheet.js, speakers.js, then program.js).
const src = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const boot = (globals = {}) => {
  const window = {};
  const ctx = vm.createContext({ window, console, AbortController, setTimeout, clearTimeout, ...globals });
  ['sheet.js', 'speakers.js', 'program.js'].forEach(f => vm.runInContext(src(f), ctx));
  return window;
};
const plain = (v) => JSON.parse(JSON.stringify(v));
const { MiraiSheet, MiraiSpeakers, MiraiProgram: P } = boot();

const SPK_HEAD = 'Display name,First name,Last name,Affiliation,Talk,Bio,Sessions,Group,Show on,Photo,Name JP,Role JP,Focus JP,Publish\n';
const SPEAKERS = MiraiSpeakers.buildModel(MiraiSheet.rowsFromCsv(SPK_HEAD + [
  'Prof. Takahiro Yasuda,Takahiro,Yasuda,,,,,,,,,,,',
  '"Louise Hecker, PhD",Louise,Hecker,,,,,,,,,,,',
  ',José,Cordeiro,,,,,,,,,,,',
  ',Aubrey,de Grey,,,,,,,,,,,',
  'Dr. Aubrey Smith,Aubrey,Smith-de Grey,,,,,,,,,,,', // same "aubrey_grey" key: the first row keeps it
  ',Florian,,,,,,,,,,,,',
].join('\n')));

const HEAD = 'Day,Venue,Venue link,Start,End,Kind,Block,Title,Speakers,Notes,Publish\n';
const model = (body, speakers = SPEAKERS) => plain(P.buildModel(MiraiSheet.rowsFromCsv(HEAD + body), speakers));
const slot = (row) => model('Saturday 17 October,,,' + row).days[0].slots[0];
const people = (cell) => slot(`11:00,11:10,,,A talk,"${cell}",,`).speakers;

/* ─── Program core ─── */

test('days group in order of first appearance, slots in row order, id is the label slug', () => {
  const m = model([
    'Sunday 18 October,,,09:00,,,,A,,,', 'Saturday 17 October,,,10:00,,,,B,,,',
    'Sunday 18 October,,,11:00,,,,C,,,', 'Saturday 17 October,,,12:00,,,,D,,,',
  ].join('\n'));
  assert.deepEqual(m.days.map(d => [d.id, d.label, d.slots.map(s => s.title)]),
    [['sunday_18_october', 'Sunday 18 October', ['A', 'C']], ['saturday_17_october', 'Saturday 17 October', ['B', 'D']]]);
  assert.equal(m.count, 4);
});

test('short label: "Weekday N Month" shortens, anything else stays as typed', () => {
  const short = (label) => model(`"${label}",,,,,,,T,,,`).days[0].short;
  assert.equal(short('Saturday 17 October'), 'Sat 17 Oct');
  assert.equal(short('  Monday   26 October '), 'Mon 26 Oct');
  assert.equal(short('Mon 5 Oct'), 'Mon 5 Oct');
  for (const label of ['Demo Day', 'Saturday, 17 October', '17 October', 'Saturday 170 October', 'Saturday 17 October 2026'])
    assert.equal(short(label), label.trim(), label);
});

test('venue and link come once per day from the first non-empty cell; only https links are kept', () => {
  const m = model([
    'Day A,,,,,,,T,,,', 'Day A,Hall 1,https://maps.test/a,,,,,T,,,', 'Day A,Hall 2,https://maps.test/b,,,,,T,,,',
    'Day B,Hall 3,http://maps.test/c,,,,,T,,,', 'Day B,,https://maps.test/d,,,,,T,,,',
    'Day C,Hall 4,javascript:alert(1),,,,,T,,,',
    'Day D,Hall 5,HTTPS://maps.test/e,,,,,T,,,',
  ].join('\n'));
  assert.deepEqual(m.days.map(d => [d.venue, d.venueLink]),
    [['Hall 1', 'https://maps.test/a'], ['Hall 3', ''], ['Hall 4', ''], ['Hall 5', 'HTTPS://maps.test/e']]);
  assert.deepEqual(Object.keys(m.days[0]), ['id', 'label', 'short', 'venue', 'venueLink', 'slots']);
});

test('kind: open, keynote, panel, break, pitch in any case; anything else is a talk', () => {
  const kind = (cell) => slot(`,,${cell},,T,,,`).kind;
  assert.deepEqual(['open', ' KEYNOTE ', 'Panel', 'break', 'pitch', '', 'talk', 'workshop', 'lunch'].map(kind),
    ['open', 'keynote', 'panel', 'break', 'pitch', 'talk', 'talk', 'talk', 'talk']);
});

test('tbc when the title is empty or says "to be confirmed"', () => {
  const tbc = (title) => slot(`,,,,"${title}",,,`).tbc;
  assert.equal(tbc('Title to be confirmed'), true);
  assert.equal(tbc('Talk (TO BE CONFIRMED)'), true);
  assert.equal(tbc(''), true);
  assert.equal(tbc('  '), true);
  assert.equal(tbc('The information theory of ageing'), false);
});

test('slot fields are trimmed and carried through', () => {
  assert.deepEqual(slot(' 11:00 , 11:10 ,open, Opening , Welcome ,"Pedro Henrich (Unchain Bio)", A note ,TRUE'), {
    start: '11:00', end: '11:10', kind: 'open', block: 'Opening', title: 'Welcome', tbc: false, notes: 'A note',
    speakers: [{ name: 'Pedro Henrich', affiliation: 'Unchain Bio', id: null }],
  });
});

test('speaker cell: ";"-separated, affiliation optional, stray spaces and empty entries dropped', () => {
  const pairs = (cell) => people(cell).map(p => [p.name, p.affiliation]);
  assert.deepEqual(pairs('A One (X Corp); B Two; C  Three ( KBIC / FBRI ) ;'),
    [['A One', 'X Corp'], ['B Two', ''], ['C Three', 'KBIC / FBRI']]);
  assert.deepEqual(pairs(' ;  ; D Four;;'), [['D Four', '']]);
  assert.deepEqual(pairs(''), []);
  assert.deepEqual(pairs('Foo (Bar) Baz'), [['Foo Baz', 'Bar']]);
  assert.deepEqual(pairs('Foo (Old) (New Co)'), [['Foo (Old)', 'New Co']]);
});

test('speaker ids resolve leniently: honorifics, punctuation, diacritics and middle names ignored', () => {
  const ids = (cell) => people(cell).map(p => p.id);
  assert.deepEqual(ids('Prof. Takahiro Yasuda (Kobe University)'), ['takahiro_yasuda']);
  assert.deepEqual(ids('Prof Takahiro Yasuda FRSE; Dr Takahiro Yasuda Jr.; Assoc. Prof. Takahiro Yasuda, PhD, MD, JD, BAgr'),
    ['takahiro_yasuda', 'takahiro_yasuda', 'takahiro_yasuda']);
  assert.deepEqual(ids('Louise Hecker, PhD (Baylor College of Medicine); Louise Hecker'), ['louise_hecker', 'louise_hecker']);
  assert.deepEqual(ids('Jose Cordeiro; JOSÉ CORDEIRO; José Luis Cordeiro'), ['jose_cordeiro', 'jose_cordeiro', 'jose_cordeiro']);
  assert.deepEqual(ids('Aubrey de Grey; Aubrey Smith-de Grey'), ['aubrey_de_grey', 'aubrey_de_grey']); // first match wins
  assert.deepEqual(ids('Florian (Antler)'), ['florian']);
  assert.deepEqual(ids('Nobody Known (Somewhere); Takahiro; Yasuda'), [null, null, null]);
});

test('speakerKey: first and last token, honorifics dropped', () => {
  assert.deepEqual(['Prof. Stuart Reid FRSE', 'Natalie S. Coles de Grey', 'Florian', 'Ph.D.', ''].map(P.speakerKey),
    ['stuart_reid', 'natalie_grey', 'florian', '', '']);
});

test('without a speakers model ids are null and speakerCount is 0', () => {
  const m = plain(P.buildModel(MiraiSheet.rowsFromCsv(HEAD + 'D,,,,,,,T,Prof. Takahiro Yasuda (Kobe University),,')));
  assert.deepEqual(m.days[0].slots[0].speakers, [{ name: 'Prof. Takahiro Yasuda', affiliation: 'Kobe University', id: null }]);
  assert.equal(m.speakerCount, 0);
  assert.equal(model('D,,,,,,,T,,,').speakerCount, SPEAKERS.count);
});

test('publish filter and empty days skipped; empty input yields no days', () => {
  const shown = ['', 'TRUE', ' yes ', '1'], hidden = ['FALSE', 'No', '0', 'HIDDEN'];
  const rows = [...shown, ...hidden].map((p, i) => `D,,,,,,,T${i},,,${p}`);
  rows.splice(2, 0, ',,,,,,,Nodaay,,,', '  ,,,,,,,Blank,,,');
  const m = model(rows.join('\n'));
  assert.deepEqual(m.days[0].slots.map(s => s.title), ['T0', 'T1', 'T2', 'T3']);
  assert.equal(m.count, 4);
  assert.deepEqual(model(''), { days: [], count: 0, speakerCount: SPEAKERS.count });
  assert.deepEqual(plain(P.buildModel(undefined)), { days: [], count: 0, speakerCount: 0 });
});

test('cell text is kept verbatim (the page sets it as text, never HTML)', () => {
  assert.equal(slot(',,,,"<img src=x onerror=alert(1)>",,,').title, '<img src=x onerror=alert(1)>');
});

/* ─── The shipped snapshot ─── */

test('the shipped snapshot builds five days, 106 slots and the Demo Day pitches', () => {
  const w = {};
  vm.runInNewContext(src('speakers-data.js') + src('program-data.js'), { window: w });
  assert.equal(w.MIRAI_PROGRAM_SHEET_CSV, 'https://docs.google.com/spreadsheets/d/1KVHJxp5W5VirLNMh6UQftPhF4iE9F247pQq5EZ8q-fI/gviz/tq?tqx=out:csv&sheet=Program');
  const speakers = MiraiSpeakers.buildModel(w.MIRAI_SPEAKERS_SNAPSHOT);
  const m = plain(P.buildModel(w.MIRAI_PROGRAM_SNAPSHOT, speakers));
  assert.deepEqual(m.days.map(d => d.label),
    ['Saturday 17 October', 'Sunday 18 October', 'Saturday 24 October', 'Sunday 25 October', 'Monday 26 October']);
  assert.deepEqual(m.days.map(d => d.short), ['Sat 17 Oct', 'Sun 18 Oct', 'Sat 24 Oct', 'Sun 25 Oct', 'Mon 26 Oct']);
  assert.equal(m.count, 106);
  assert.equal(m.speakerCount, 72);
  for (const d of m.days) assert.match(d.venueLink, /^https:\/\//, d.label);
  const pitches = m.days.map(d => d.slots.filter(s => s.kind === 'pitch'));
  assert.deepEqual(pitches.map(p => p.length), [0, 0, 0, 0, 8]);
  for (const p of pitches[4]) assert.ok(p.title && p.block === 'Demo Day pitches', p.title);
  assert.ok(pitches[4].filter(p => p.notes).length >= 7); // the booklet had a line for 7 of the 8 startups
  const first = m.days[0].slots[0];
  assert.deepEqual([first.start, first.end, first.kind], ['11:00', '11:10', 'open']);
  assert.equal(first.speakers.length, 1);
  assert.deepEqual([first.speakers[0].name, first.speakers[0].affiliation], ['Pedro Henrich', 'Unchain Bio']);
  assert.equal(first.speakers[0].id, speakers.speakers.find(s => s.name === 'Pedro Henrich').id);
  const all = m.days.flatMap(d => d.slots.flatMap(s => s.speakers));
  const yasuda = all.find(p => p.name === 'Prof. Takahiro Yasuda');
  assert.equal(yasuda.id, speakers.speakers.find(s => s.first === 'Takahiro' && s.last === 'Yasuda').id);
  assert.ok(m.days[0].slots.some(s => s.title === 'Title to be confirmed' && s.tbc));
  assert.ok(!JSON.stringify(w.MIRAI_PROGRAM_SNAPSHOT).includes('&amp;'));
});

/* ─── load ─── */

const res = (status, body = '') => ({ ok: status >= 200 && status < 300, status, text: async () => body });
const SNAP = [{ day: 'Snap day', title: 'Snap' }];
function loader(fetch) {
  const warns = [];
  const quiet = { ...console, warn: (...a) => warns.push(a.map(String).join(' ')) };
  const { MiraiProgram: Pr } = boot({ fetch, console: quiet });
  const seen = [];
  const run = (opts) => Pr.load({ snapshot: SNAP, speakersModel: SPEAKERS, render: m => seen.push(m.days.map(d => d.label)), ...opts });
  return { run, seen, warns };
}

test('load paints the snapshot at once, then the sheet, with speakers resolved', async () => {
  const { MiraiProgram: Pr } = boot({ fetch: async () => res(200, HEAD + 'Live day,,,,,,,T,Prof. Takahiro Yasuda,,\n') });
  const seen = [];
  const done = Pr.load({ url: 'https://sheet.test/csv', snapshot: SNAP, speakersModel: SPEAKERS, render: m => seen.push(plain(m)) });
  assert.deepEqual(seen.map(m => m.days[0].label), ['Snap day']); // synchronous, before the fetch answers
  assert.equal(await done, 'sheet');
  assert.deepEqual(seen.map(m => m.days[0].label), ['Snap day', 'Live day']);
  assert.equal(seen[1].days[0].slots[0].speakers[0].id, 'takahiro_yasuda');
  assert.equal(seen[1].speakerCount, SPEAKERS.count);
});

test('load keeps the snapshot when the sheet fails, is empty, or there is no url', async () => {
  for (const fetch of [async () => res(500), async () => { throw new Error('offline'); }, async () => res(200, HEAD + 'D,,,,,,,T,,,FALSE\n')]) {
    const { run, seen, warns } = loader(fetch);
    assert.equal(await run({ url: 'https://sheet.test/csv' }), 'snapshot');
    assert.deepEqual(plain(seen), [['Snap day']]);
    assert.equal(warns.length, 1);
    assert.match(warns[0], /^\[program\] sheet unavailable, showing snapshot/);
  }
  const { run, seen } = loader(() => assert.fail('no fetch without a url'));
  assert.equal(await run({ url: '' }), 'snapshot');
  assert.deepEqual(plain(seen), [['Snap day']]);
});

test('load never throws, even when render does', async () => {
  const { MiraiProgram: Pr } = boot({ fetch: async () => res(200, HEAD + 'Live,,,,,,,T,,,\n'), console: { ...console, warn() {} } });
  const render = () => { throw new Error('boom'); };
  assert.equal(await Pr.load({ url: 'https://sheet.test/csv', snapshot: SNAP, render }), 'snapshot');
  assert.equal(await Pr.load(), 'snapshot');
});
