// Hero variant B, "Faces": the 72 speakers of 2026 as an edge-to-edge drifting wall,
// with the headline and button on a veiled band across the middle. Pure CSS motion.
import Image from 'next/image';
import { site, type Copy, type Speaker } from '@/content/site';
import speakers from '@/content/speakers-2026.json';
import s from './HeroB.module.css';

const ROWS = 6;
const COPIES = 4; // each row is repeated so the loop is seamless up to 1920px+ wide
const JOE = 'joe_betts_lacroix';
const LEV = ['aubrey_de_grey', 'natalie_coles_de_grey'];

// Deterministic shuffle so server and client render the same wall.
function shuffled<T>(list: T[], seed: number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Speaker rule: Joe Betts-LaCroix is never next to Aubrey de Grey or Natalie Coles de Grey.
// Rows drift at different speeds, so any face can end up beside, above, below or
// diagonal to any face in its own row or the row next to it. Joe therefore goes in
// row 0 and both LEV faces in rows 3 and 4: always at least two rows apart. The row
// count never changes between breakpoints, so this holds at every width.
function buildRows(): Speaker[][] {
  const pinned = new Set([JOE, ...LEV]);
  const rest = shuffled((speakers as Speaker[]).filter(p => p.photo && !pinned.has(p.id)), 2026);
  const rows: Speaker[][] = Array.from({ length: ROWS }, () => []);
  rest.forEach((p, i) => rows[i % ROWS].push(p));
  const byId = (id: string) => (speakers as Speaker[]).find(p => p.id === id);
  const place = (id: string, row: number, at: number) => {
    const p = byId(id);
    if (p) rows[row].splice(Math.min(at, rows[row].length), 0, p);
  };
  place(JOE, 0, 3);
  place(LEV[0], 3, 6);
  place(LEV[1], 4, 2);

  const rowOf = (id: string) => rows.findIndex(r => r.some(p => p.id === id));
  const j = rowOf(JOE);
  for (const id of LEV) {
    const r = rowOf(id);
    if (j >= 0 && r >= 0 && Math.abs(j - r) < 2) throw new Error(`HeroB: ${JOE} would sit next to ${id}`);
  }
  return rows;
}

const rows = buildRows();
const shortName = (name: string) => name.split(',')[0].replace(/^(Prof\.|Dr\.)\s+/, '');

export function HeroB({ t = site }: { t?: Copy }) {
  const h = t.hero;
  return (
    <section className={s.hero} id="top" aria-labelledby="heroB-title">
      <div className={s.wall} aria-hidden="true">
        {rows.map((row, r) => (
          <div key={r} className={s.row} style={{ '--r': r } as React.CSSProperties}>
            <div className={`${s.track} ${r % 2 ? s.reverse : ''}`}
              style={{ '--dur': `${150 + r * 23}s` } as React.CSSProperties}>
              {Array.from({ length: COPIES }, (_, c) => row.map((p, i) => {
                const n = c * row.length + i;
                return (
                  <figure key={`${c}-${p.id}`} className={`${s.tile} ${(n * 7 + r * 3) % 11 === 0 ? s.lit : ''}`}
                    style={{ '--d': `${-((n * 37 + r * 53) % 160) / 10}s` } as React.CSSProperties}>
                    <Image src={p.photo!} alt="" fill sizes="(max-width: 760px) 110px, 180px" loading="eager" />
                    <figcaption className={s.name}>
                      <span>{shortName(p.name)}</span>
                    </figcaption>
                  </figure>
                );
              }))}
            </div>
          </div>
        ))}
      </div>
      <div className={s.veil} />

      <div className={s.band}>
        <div className={s.inner}>
          <div className={s.titleCol}>
            <p className="eyebrow">{h.eyebrow}</p>
            <h1 id="heroB-title" className={s.title}>
              {h.headline.map(line => <span key={line}>{line}</span>)}
            </h1>
          </div>
          <div className={s.textCol}>
            <p className={s.facts}>
              <span>Oct 1–31, 2026</span><span>Port Island, Kobe</span><span>{speakers.length} speakers</span>
            </p>
            <p className={s.lead}>{"In October 2026, scientists, founders and builders lived and worked on Port Island, Kobe, for a month. The next edition is in 2027."}</p>
            <div className={s.actions}>
              <a className="btn accent" href={t.notifyHref}>{h.primary}</a>
              <a className="btn ghost" href="#2026">{h.secondary}</a>
            </div>
          </div>
        </div>
      </div>

      <a className={s.continue} href="#2026" aria-label="Scroll to the 2026 recap">
        <span className={s.continueLbl}>The 2026 recap</span>
        <span className={s.arrow} aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
