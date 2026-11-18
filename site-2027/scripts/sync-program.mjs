// Copies the final 2026 agenda from the static site into this app, for the /2026 page:
// reads ../new-site/program-data.js (the sheet snapshot; refresh it first with
// `npm run program:snapshot` in new-site/), keeps published rows and writes
// content/program-2026.json grouped as event → day → sessions.
// Run from site-2027/: npm run program:sync. Commit the output (Vercel deploys this folder alone).
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('../../new-site/program-data.js', import.meta.url), 'utf8'), ctx);
const rows = ctx.window.MIRAI_PROGRAM_SNAPSHOT;

const str = v => String(v ?? '').trim();
const EVENTS = {
  'Summit I': { id: 'summit-i', name: 'Summit I', dates: 'Oct 17–18' },
  'Summit II': { id: 'summit-ii', name: 'Summit II', dates: 'Oct 24–25' },
  Finale: { id: 'demo-day', name: 'Demo Day', dates: 'Oct 26' },
};
// "Oct 17 (Sat) 10:00–11:00" → day "Oct 17 (Sat)", time "10:00–11:00"
const DATE = /^(\w{3} \d{1,2} \(\w{3}\))\s*(.*)$/;
// Rows that are not talks: shown as a quiet line, without speakers.
const QUIET = /^(break|networking|registration|close and networking)/i;

const events = [];
for (const r of rows) {
  // The sheet's first header cell was overwritten (it reads "C85", not "Block"), so take
  // the block from the first column whatever its name.
  const block = str(Object.values(r)[0]);
  const title = str(r.title);
  if (!EVENTS[block] || !title || ['false', 'no', '0', 'hidden', 'hide'].includes(str(r.publish).toLowerCase())) continue;
  const m = str(r.date).match(DATE);
  if (!m || !m[2]) continue; // the undated awards summary row repeats the timed award rows
  const [, day, time] = m;

  let event = events.find(e => e.id === EVENTS[block].id);
  if (!event) events.push(event = { ...EVENTS[block], days: [] });
  let d = event.days.find(x => x.day === day);
  if (!d) event.days.push(d = { day, sessions: [] });

  // "Paulo Refinetti (REM Analytics). Winner: GlobalDeal Japan Landing Award"
  let people = str(r.subtitle);
  let winner = '';
  const w = people.match(/^(.*?)\.\s*Winner:\s*(.+)$/);
  if (w) [, people, winner] = w;
  const track = str(r.blocktitle);
  const quiet = QUIET.test(track) || /^networking/i.test(title);
  people = people.replace(/,\s*online$/i, ''); // "online" already shows from the track
  d.sessions.push({
    time,
    track: track.replace(/\s*·\s*(online|recorded)$/i, ''),
    remote: (track.match(/·\s*(online|recorded)$/i)?.[1] ?? '').toLowerCase() || undefined,
    title,
    people: quiet ? '' : people,
    quiet: quiet || undefined,
    winner: winner || undefined,
  });
}
for (const e of events) for (const d of e.days) d.sessions.sort((a, b) => a.time.localeCompare(b.time));

writeFileSync(new URL('../content/program-2026.json', import.meta.url), JSON.stringify(events, null, 2) + '\n');
console.log(events.map(e => `${e.name}: ${e.days.reduce((n, d) => n + d.sessions.length, 0)} sessions`).join(', '));
