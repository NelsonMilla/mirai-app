// Copies the 2026 speaker roll from the live static site into this app:
// reads ../new-site/speakers-data.js (the sheet snapshot), keeps published rows,
// writes content/speakers-2026.json and copies each portrait into public/img/speakers/.
// Run from site-2027/: npm run speakers:sync. Commit the output — Vercel deploys
// this folder alone, so nothing here may reference ../new-site at runtime.
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const SRC = new URL('../../new-site/', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('speakers-data.js', SRC), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('speakers-photos.js', SRC), 'utf8'), ctx);
const rows = ctx.window.MIRAI_SPEAKERS_SNAPSHOT;
const photos = new Set(ctx.window.MIRAI_SPEAKER_PHOTOS);

const str = v => String(v ?? '').trim();
const slug = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const speakers = rows
  .filter(r => str(r.firstname) && !['false', 'no', 'hide', 'hidden'].includes(str(r.publish).toLowerCase()))
  .map(r => {
    const first = str(r.firstname), last = str(r.lastname);
    const id = slug([first, last].filter(Boolean).join(' '));
    let photo = null;
    if (photos.has(id)) {
      copyFileSync(new URL(`img/speakers/${id}.jpeg`, SRC), new URL(`../public/img/speakers/${id}.jpeg`, import.meta.url));
      photo = `/img/speakers/${id}.jpeg`;
    }
    return {
      id,
      name: str(r.displayname) || [first, last].filter(Boolean).join(' '),
      last,
      affiliation: str(r.affiliation),
      group: /^sci/i.test(str(r.group)) ? 'scientists' : 'founders',
      // Which 2026 events they spoke at, from the sheet's Sessions cell ("S1, S2, F, Online").
      events: ['S1', 'S2', 'F'].filter(e => str(r.sessions).split(/\s*,\s*/).includes(e)),
      photo,
    };
  })
  .sort((a, b) => a.last.localeCompare(b.last, 'en', { sensitivity: 'base' }));

// Standing rule: Joe Betts-LaCroix is never placed beside Aubrey de Grey or Natalie Coles
// de Grey (LEV). Alphabetical order keeps them apart today; the /2026 grid is at most 6
// across, so 8 places apart is never a neighbour (side, above or diagonal). Fail loudly
// if a new name ever closes the gap.
const at = l => speakers.findIndex(s => s.last === l);
for (const lev of ['de Grey', 'Coles de Grey']) {
  if (at('Betts-LaCroix') >= 0 && at(lev) >= 0 && Math.abs(at('Betts-LaCroix') - at(lev)) < 8) {
    throw new Error(`Betts-LaCroix and ${lev} are within 8 places; reorder before shipping.`);
  }
}

writeFileSync(new URL('../content/speakers-2026.json', import.meta.url), JSON.stringify(speakers, null, 2) + '\n');
console.log(`${speakers.length} speakers, ${speakers.filter(s => s.photo).length} with photos`);
