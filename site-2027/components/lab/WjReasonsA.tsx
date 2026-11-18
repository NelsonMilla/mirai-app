// Reasons A · Reel. One fixed header, then the seven reasons as an Apple-style horizontal reel:
// a native overflow-x scroller with scroll-snap that starts on the page column's left edge and
// bleeds off the right edge of the viewport. Nobel and iPS get the wide format (~50vw, max 720px),
// the rest ~33vw (max 480px), ~84vw on phones. Every card leads with a photo at one plate height,
// one grade, one edge veil; the text sits below the photo on night, never over it.
// Server component; the only client code is the controls in WjReasonsAReel.tsx.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import { Reel } from './WjReasonsAReel';
import s from './WjReasonsA.module.css';

const WIDE = '(max-width: 640px) 84vw, (max-width: 1000px) 66vw, (max-width: 1440px) 50vw, 720px';
const NARROW = '(max-width: 640px) 84vw, (max-width: 1000px) 46vw, (max-width: 1440px) 33vw, 480px';
// The reel's plates are wider than the grid's, so this portrait needs its own crop: the gloved hands
// and the culture vessels, with the face out of frame. Other photos keep the manifest focal point.
const CROP: Record<string, string> = { '/img/why-japan/lab-hood.webp': '50% 92%' };

export function WjReasonsA() {
  return (
    <section id="routes" className={s.section} aria-labelledby="routes-title">
      <div className={s.head}>
        <div className={s.top}>
          <p className="eyebrow">{t.routes.label}</p>
          {/* Added label: the site's chapter mark for this section, 理由 (riyū, reasons). */}
          <p className="kanjiMark" aria-hidden="true"><b>理由</b><span>Riyū</span></p>
        </div>
        <div className={s.headRow}>
          <h2 id="routes-title" className={s.h2}>{t.routes.title}</h2>
          <p className={s.sub}>
            {t.routes.lead.map((p, i) =>
              typeof p === 'string' ? p : <span key={i}><b>{p.b}</b>{p.fn && <Fn n={p.fn} />}</span>,
            )}
          </p>
        </div>
      </div>

      <Reel labelledBy="routes-title">
        {t.cards.map(c => (
          <li key={c.label} className={c.wide ? `${s.card} ${s.wide}` : s.card}>
            <span className={`${s.plate} grain`}>
              <Image className="grade" src={c.img.src} alt={c.img.alt} fill sizes={c.wide ? WIDE : NARROW}
                style={{ objectPosition: CROP[c.img.src] ?? c.img.pos }} />
            </span>
            <div className={s.read}>
              <span className="mono">{c.label}</span>
              {c.title && <h3 className={s.title}>{c.title}</h3>}
              {c.figure && <span className={s.fig}>{c.figure}{c.fn && <Fn n={c.fn} />}</span>}
              {c.body && <p className={s.body}>{c.body}</p>}
              {c.fact && (
                <div className={s.fact}>
                  <span className="mono">{c.fact.label}</span>
                  <span className={s.factVal}>{c.fact.value}</span>
                </div>
              )}
              {c.ledger && (
                <dl className={s.ledger}>
                  {c.ledger.map(r => (
                    <div key={r.figure}>
                      <dt className={s.ledgerFig}>{r.figure}</dt>
                      <dd className="mono">{r.label}<br /><b>{r.bold}</b></dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </li>
        ))}
      </Reel>
    </section>
  );
}
