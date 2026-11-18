// The /why-japan page body: the thesis from the 2026 /conferences page (copy in content/why-japan.ts).
// Server-rendered, no JS: the seven cards sit in a grid instead of the old carousel.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import s from './WhyJapan.module.css';

const Fn = ({ n }: { n: number }) => (
  <sup className={s.fn}><a href={`#fn${n}`} id={`fnref${n}`} aria-label={`Note ${n}`}>{n}</a></sup>
);

export function WhyJapan() {
  return (
    <>
      <header className="masthead">
        <span className="mastKanji" aria-hidden="true">日本</span>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.headline}</h1>
        <div className="mastRow">
          <p className="lead">{t.lead}</p>
        </div>
      </header>

      <div className={`${s.band} grain`}>
        <Image className="grade" src={t.hero.src} alt={t.hero.alt} fill priority sizes="(max-width: 1440px) 88vw, 1270px" />
      </div>

      <section id="routes" className={s.block} aria-labelledby="routes-title">
        <div className={s.head}>
          <div>
            <p className="eyebrow">{t.routes.label}</p>
            <h2 id="routes-title" className={s.h2}>{t.routes.title}</h2>
          </div>
          <p className={s.sub}>
            {t.routes.lead.map((p, i) =>
              typeof p === 'string' ? p : <span key={i}><b>{p.b}</b>{p.fn && <Fn n={p.fn} />}</span>,
            )}
          </p>
        </div>

        <ul className={s.cards}>
          {t.cards.map(c => (
            <li key={c.label} className={c.wide ? `${s.card} ${s.wide}` : s.card}>
              <span className={`${s.plate} grain`}>
                <Image className="grade" src={c.img.src} alt={c.img.alt} fill
                  sizes={c.wide ? '(max-width: 760px) 88vw, 44vw' : '(max-width: 760px) 88vw, 30vw'}
                  style={c.img.pos ? { objectPosition: c.img.pos } : undefined} />
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
                        <dt className={s.fig}>{r.figure}</dt>
                        <dd className="mono">{r.label}<br /><b>{r.bold}</b></dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="why-now" className={s.block} aria-labelledby="now-title">
        <div className={s.head}>
          <div>
            <p className="eyebrow">{t.now.label}</p>
            <h2 id="now-title" className={s.h2}>{t.now.title}</h2>
          </div>
        </div>
        <div className={s.now}>
          <span className={`${s.nowPlate} grain`} aria-hidden="true">
            <Image className="grade" src={t.now.img} alt="" fill sizes="(max-width: 1000px) 88vw, 40vw" />
          </span>
          <ol className={s.chron}>
            {t.now.entries.map((e, i) => (
              <li key={i} className={s.entry}>
                <span className={s.date}>{e.date}</span>
                <div>
                  {e.head && <p className={s.entryHead}>{e.head}{e.fn && <Fn n={e.fn} />}</p>}
                  {e.body && <p className={s.entryBody}><b>{e.bold}</b> {e.body}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.block} ${s.notes}`} aria-labelledby="notes-title">
        <h2 id="notes-title" className="mono">{t.notesTitle}</h2>
        <ol>
          {t.notes.map((n, i) => (
            <li key={i} id={`fn${i + 1}`}>
              {n} <a href={`#fnref${i + 1}`} aria-label={`Back to reference ${i + 1}`}>Back</a>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
