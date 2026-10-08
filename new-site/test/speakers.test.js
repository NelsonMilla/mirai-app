import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Evaluate the classic scripts the way the page does (sheet.js, then speakers.js),
// in one context whose globals the test controls (fetch, document, console).
const src = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const boot = (globals = {}) => {
  const window = {};
  const ctx = vm.createContext({ window, console, AbortController, setTimeout, clearTimeout, ...globals });
  ['sheet.js', 'speakers.js'].forEach(f => vm.runInContext(src(f), ctx));
  return window;
};
// vm objects come from another realm; clone so deepStrictEqual compares plain values.
const plain = (v) => JSON.parse(JSON.stringify(v));
const { MiraiSheet, MiraiSpeakers: S } = boot();
const model = (csv) => plain(S.buildModel(MiraiSheet.rowsFromCsv(csv)));
const HEAD = 'Display name,First name,Last name,Affiliation,Talk,Bio,Sessions,Group,Show on,Photo,Name JP,Role JP,Focus JP,Publish\n';
const one = (row) => model(HEAD + row).speakers[0];

/* ─── Sheet helper ─── */

const res = (status, body = '') => ({ ok: status >= 200 && status < 300, status, text: async () => body });

test('fetchCsv resolves row objects and asks for an uncached copy', async () => {
  const calls = [];
  const { MiraiSheet: sheet } = boot({ fetch: async (url, opts) => { calls.push([url, opts]); return res(200, 'First name,Group\nAda,Sci\n'); } });
  assert.deepEqual(plain(await sheet.fetchCsv('https://sheet.test/csv')), [{ firstname: 'Ada', group: 'Sci' }]);
  assert.equal(calls[0][0], 'https://sheet.test/csv');
  assert.equal(calls[0][1].cache, 'no-store');
  assert.ok(calls[0][1].signal);
});

test('fetchCsv rejects on a non-2xx answer', async () => {
  const { MiraiSheet: sheet } = boot({ fetch: async () => res(500) });
  await assert.rejects(sheet.fetchCsv('https://sheet.test/csv'), /HTTP 500/);
});

test('fetchCsv aborts a fetch that never answers once the timeout passes', async () => {
  let signal;
  const hang = (url, opts) => new Promise((_, reject) => {
    signal = opts.signal;
    signal.addEventListener('abort', () => reject(new Error('aborted')));
  });
  const { MiraiSheet: sheet } = boot({ fetch: hang });
  await assert.rejects(sheet.fetchCsv('https://sheet.test/csv', { timeout: 20 }), /aborted/);
  assert.equal(signal.aborted, true);
});

test('loading sheet.js alone never touches fetch', () => {
  assert.doesNotThrow(() => boot({ fetch: undefined }));
});

/* ─── Speakers core ─── */

test('name is First + Last, or the display name as typed', () => {
  assert.equal(one(',Aubrey,de Grey,,,,,,,,,,,').name, 'Aubrey de Grey');
  assert.equal(one('"Louise Hecker, PhD",Louise,Hecker,,,,,,,,,,,').name, 'Louise Hecker, PhD');
  assert.equal(one(',Florian,,Antler,,,,,,,,,,').name, 'Florian');
  const s = one('Prof. Stuart Reid,Stuart,Reid,University of Strathclyde,A talk,A bio,,,,,,,,');
  assert.deepEqual([s.first, s.last, s.affiliation, s.talk, s.bio], ['Stuart', 'Reid', 'University of Strathclyde', 'A talk', 'A bio']);
});

test('id and derived photo come from the full name, folded and underscored', () => {
  assert.deepEqual([one(',José,Cordeiro,,,,,,,,,,,')].map(s => [s.id, s.photo]), [['jose_cordeiro', '/img/speakers/jose_cordeiro.jpeg']]);
  assert.equal(one(',Aubrey,de Grey,,,,,,,,,,,').id, 'aubrey_de_grey');
  assert.equal(one(',Joe,Betts-LaCroix,,,,,,,,,,,').id, 'joe_betts_lacroix');
  assert.equal(one(',Brandon,Possin,,,,,,,,,,,').id, 'brandon_possin');
  assert.equal(one('Prof. Takashi Aoi,Takashi,Aoi,,,,,,,,,,,').id, 'takashi_aoi'); // display name plays no part
  assert.equal(one(',Florian,,,,,,,,,,,,').id, 'florian');
});

test('photo: /path as given, none or anything off-site means no photo', () => {
  const photo = (cell) => one(`,Ada,Cyborg,,,,,,,"${cell}",,,,`).photo;
  assert.equal(photo('/img/ada.webp'), '/img/ada.webp');
  for (const bad of ['none', 'NONE', ' None ', 'https://evil', 'http://x.com/a.jpg', 'javascript:alert(1)', 'data:image/png;base64,x', '//evil.com/a.jpg', 'img/a.jpg'])
    assert.equal(photo(bad), '', bad);
});

test('initials: first letters of first and last, or two letters of a single name', () => {
  assert.equal(one(',Marian,Goodell,,,,,,,,,,,').initials, 'MG');
  assert.equal(one(',Aubrey,de Grey,,,,,,,,,,,').initials, 'AD');
  assert.equal(one(',Florian,,,,,,,,,,,,').initials, 'FL');
});

test('sessions: S1, S2, F, Online in that order, any separator or case, label joined with a dot', () => {
  const ses = (cell) => { const s = one(`,A,B,,,,"${cell}",,,,,,,`); return [s.sessions, s.sessionsLabel]; };
  assert.deepEqual(ses('S2, F'), [['S2', 'F'], 'S2 · F']);
  assert.deepEqual(ses('online/s2 ; s1'), [['S1', 'S2', 'Online'], 'S1 · S2 · Online']);
  assert.deepEqual(ses('S3, Finale, x'), [[], '']);
  assert.deepEqual(ses(''), [[], '']);
});

test('group: anything starting with "sci" is scientists, the rest founders', () => {
  const grp = (cell) => one(`,A,B,,,,,${cell},,,,,,`).group;
  assert.deepEqual(['Scientists', 'science', 'SCI', 'Founders', 'Investors', ''].map(grp),
    ['scientists', 'scientists', 'scientists', 'founders', 'founders', 'founders']);
});

test('show on: lowercase page tokens, unknown ones dropped', () => {
  assert.deepEqual(one(',A,B,,,,,,"Landing; JP,conferences  startups, home, Experience",,,,,').showOn,
    ['landing', 'jp', 'conferences', 'startups', 'experience']);
  assert.deepEqual(one(',A,B,,,,,,,,,,,').showOn, []);
});

test('Japanese fields carry through', () => {
  const s = one(',Yuki,Hanyu,IntegriCulture,,,,,,,羽生 雄毅,創業者兼CEO,細胞農業,');
  assert.deepEqual([s.nameJp, s.roleJp, s.focusJp], ['羽生 雄毅', '創業者兼CEO', '細胞農業']);
});

test('publish filter, empty first name skipped, order kept, count matches', () => {
  const shown = ['', 'TRUE', ' yes ', '1'], hidden = ['FALSE', 'No', '0', 'HIDDEN'];
  const rows = [...shown, ...hidden].map((p, i) => `,P${i},X,,,,,,,,,,,${p}`);
  rows.splice(2, 0, ',,Nofirst,,,,,,,,,,,', ',  ,Blank,,,,,,,,,,,');
  const m = model(HEAD + rows.join('\n'));
  assert.deepEqual(m.speakers.map(s => s.first), ['P0', 'P1', 'P2', 'P3']);
  assert.equal(m.count, 4);
});

test('cell text is kept verbatim (renderers set it as text, never HTML)', () => {
  assert.equal(one(',A,B,"R&D <b>now</b>",,"<img src=x onerror=alert(1)>",,,,,,,,').bio, '<img src=x onerror=alert(1)>');
});

test('featured, others and groups split the model without reordering', () => {
  const m = model(HEAD + [
    ',A,One,,,,,Sci,landing,,,,,', ',B,Two,,,,,Founders,,,,,,', ',C,Three,,,,,Sci,,,,,,', ',D,Four,,,,,Founders,"landing, jp",,,,,',
  ].join('\n'));
  const names = (list) => plain(list).map(s => s.first);
  assert.deepEqual(names(S.featured(m, 'landing')), ['A', 'D']);
  assert.deepEqual(names(S.others(m, 'landing')), ['B', 'C']);
  assert.deepEqual(names(S.featured(m, 'jp')), ['D']);
  const g = S.groups(m);
  assert.deepEqual([names(g.scientists), names(g.founders)], [['A', 'C'], ['B', 'D']]);
});

test('an empty sheet, or a header with no rows, yields zero speakers', () => {
  assert.deepEqual(model(''), { speakers: [], count: 0 });
  assert.deepEqual(model(HEAD), { speakers: [], count: 0 });
  assert.deepEqual(plain(S.buildModel(undefined)), { speakers: [], count: 0 });
});

test('numberWords spells 0–99', () => {
  assert.deepEqual([0, 7, 13, 18, 20, 28, 40, 55, 99].map(S.numberWords),
    ['zero', 'seven', 'thirteen', 'eighteen', 'twenty', 'twenty-eight', 'forty', 'fifty-five', 'ninety-nine']);
  assert.equal(S.numberWords(100), '100');
});

test('the shipped snapshot builds the merged 72 speakers', () => {
  const w = {};
  vm.runInNewContext(src('speakers-data.js'), { window: w });
  assert.equal(w.MIRAI_SPEAKERS_SHEET_CSV, 'https://docs.google.com/spreadsheets/d/1KVHJxp5W5VirLNMh6UQftPhF4iE9F247pQq5EZ8q-fI/gviz/tq?tqx=out:csv&sheet=Speakers');
  const m = S.buildModel(w.MIRAI_SPEAKERS_SNAPSHOT);
  assert.equal(m.count, 72);
  const featured = (page) => plain(S.featured(m, page)).map(s => s.name);
  assert.deepEqual(featured('landing'), ['Aubrey de Grey', 'Motoshi Hayano', 'Yuki Hanyu', 'Adam Gries']);
  assert.deepEqual(featured('experience'), ['Aubrey de Grey', 'Motoshi Hayano', 'José Cordeiro', 'Yuki Hanyu', 'Adam Gries']);
  assert.deepEqual(featured('startups'), ['Aubrey de Grey', 'Motoshi Hayano', 'Yuki Hanyu', 'Adam Gries']);
  assert.deepEqual(featured('jp'), ['Aubrey de Grey', 'José Cordeiro', 'Yuki Hanyu', 'Adam Gries']);
  const g = plain(S.groups(m));
  assert.equal(g.scientists.length, 27);
  assert.equal(g.founders.length, 45);
  assert.equal(g.scientists.filter(s => s.showOn.includes('conferences')).length, 4);
  assert.equal(g.founders.filter(s => s.showOn.includes('conferences')).length, 5);
  assert.equal(featured('conferences').length, 9);
  const by = (name) => plain(m.speakers).find(s => s.name === name);
  assert.deepEqual([by('Marian Goodell').photo, by('Marian Goodell').initials], ['', 'MG']);
  assert.deepEqual([by('José Cordeiro').id, by('José Cordeiro').photo], ['jose_cordeiro', '/img/cordeiro.webp']);
  assert.deepEqual([by('Florian Geier').id, by('Florian Geier').initials], ['florian_geier', 'FG']);
  assert.equal(by('Natalie S. Coles de Grey').photo, '/img/speakers/natalie_coles_de_grey.jpeg');
  assert.equal(by('Walter Marion Patterson').sessionsLabel, 'S1');
  assert.equal(by('Kentaroh Takagaki').sessionsLabel, 'S1 · S2');
  assert.ok(!JSON.stringify(w.MIRAI_SPEAKERS_SNAPSHOT).includes('&amp;'));
});

/* ─── DOM helpers (against a minimal fake document) ─── */

function fakeDocument(found = []) {
  const make = (tag) => {
    const n = { tagName: tag.toUpperCase(), className: '', textContent: '', attrs: {}, replacedBy: null };
    n.setAttribute = (k, v) => { n.attrs[k] = String(v); };
    n.replaceWith = (other) => { n.replacedBy = other; };
    return n;
  };
  return { createElement: make, querySelectorAll: (sel) => (sel === '[data-speakers-count]' ? found : []) };
}
const speaker = (row) => S.buildModel(MiraiSheet.rowsFromCsv(HEAD + row)).speakers[0];

test('photoEl: an <img> with lazy loading, given size, and the initials tile if it fails', () => {
  const doc = fakeDocument();
  const { MiraiSpeakers: Sp } = boot({ document: doc });
  const img = Sp.photoEl(speaker(',Aubrey,de Grey,,,,,,,/img/aubrey.webp,,,,'), { width: 768, height: 710, sizes: '20vw' });
  assert.equal(img.tagName, 'IMG');
  assert.deepEqual([img.src, img.alt], ['/img/aubrey.webp', 'Aubrey de Grey']);
  assert.deepEqual({ ...img.attrs }, { width: '768', height: '710', sizes: '20vw', loading: 'lazy', decoding: 'async' });
  img.onerror();
  assert.equal(img.replacedBy.className, 'spk-initials');
  assert.equal(img.replacedBy.textContent, 'AD');
  assert.equal(Sp.photoEl(speaker(',Yuki,Hanyu,,,,,,,/img/yuki.webp,,,,'), { alt: '' }).alt, '');
});

test('photoEl: no photo gives an aria-hidden initials tile', () => {
  const { MiraiSpeakers: Sp } = boot({ document: fakeDocument() });
  const tile = Sp.photoEl(speaker(',Marian,Goodell,,,,,,,none,,,,'), { alt: 'Marian Goodell' });
  assert.deepEqual([tile.tagName, tile.className, tile.textContent, tile.attrs['aria-hidden']], ['DIV', 'spk-initials', 'MG', 'true']);
});

test('fillCounts writes the count into every [data-speakers-count]', () => {
  const spans = [{ textContent: '55' }, { textContent: '' }];
  const { MiraiSpeakers: Sp } = boot({ document: fakeDocument(spans) });
  Sp.fillCounts({ speakers: [], count: 3 });
  assert.deepEqual(spans.map(s => s.textContent), ['3', '3']);
  const other = [{ textContent: '' }];
  Sp.fillCounts({ speakers: [], count: 7 }, fakeDocument(other));
  assert.deepEqual([spans[0].textContent, other[0].textContent], ['3', '7']);
});

/* ─── load ─── */

const SNAP = [{ firstname: 'Snap', lastname: 'Shot' }];
function loader(fetch) {
  const warns = [];
  const quiet = { ...console, warn: (...a) => warns.push(a.map(String).join(' ')) };
  const { MiraiSpeakers: Sp } = boot({ fetch, console: quiet });
  const seen = [];
  const run = (opts) => Sp.load({ snapshot: SNAP, render: m => seen.push(m.speakers.map(s => s.first)), ...opts });
  return { run, seen, warns };
}

test('load paints the snapshot at once, then the sheet', async () => {
  const { run, seen, warns } = loader(async () => res(200, 'First name\nLive\n'));
  const done = run({ url: 'https://sheet.test/csv' });
  assert.deepEqual(plain(seen), [['Snap']]); // synchronous, before the fetch answers
  assert.equal(await done, 'sheet');
  assert.deepEqual(plain(seen), [['Snap'], ['Live']]);
  assert.deepEqual(warns, []);
});

test('load keeps the snapshot when the sheet fails, is empty, or there is no url', async () => {
  for (const fetch of [async () => res(500), async () => { throw new Error('offline'); }, async () => res(200, 'First name,Publish\nHidden,FALSE\n')]) {
    const { run, seen, warns } = loader(fetch);
    assert.equal(await run({ url: 'https://sheet.test/csv' }), 'snapshot');
    assert.deepEqual(plain(seen), [['Snap']]);
    assert.equal(warns.length, 1);
    assert.match(warns[0], /^\[speakers\] /);
  }
  const { run, seen } = loader(() => assert.fail('no fetch without a url'));
  assert.equal(await run({ url: '' }), 'snapshot');
  assert.deepEqual(plain(seen), [['Snap']]);
});

test('load never throws, even when render does', async () => {
  const { MiraiSpeakers: Sp } = boot({ fetch: async () => res(200, 'First name\nLive\n'), console: { ...console, warn() {} } });
  const render = () => { throw new Error('boom'); };
  assert.equal(await Sp.load({ url: 'https://sheet.test/csv', snapshot: SNAP, render }), 'snapshot');
  assert.equal(await Sp.load(), 'snapshot');
});

test('a blank Photo cell derives a file only when the manifest lists it', () => {
  const w = {}; const src = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
  vm.runInNewContext(src('sheet.js') + src('speakers.js'), { window: w, console });
  w.MIRAI_SPEAKER_PHOTOS = ['ada_lovelace'];
  const m = w.MiraiSpeakers.buildModel([
    { firstname: 'Ada', lastname: 'Lovelace' }, { firstname: 'Grace', lastname: 'Hopper' }, { firstname: 'Alan', lastname: 'Turing', photo: '/img/alan.webp' },
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(m.speakers.map(s => s.photo))), ['/img/speakers/ada_lovelace.jpeg', '', '/img/alan.webp']);
});
