// /lab/wj-reasons-c · "Editorial spreads". The reasons as a magazine feature: the two strongest
// reasons (Nobel researchers, iPS cells) each get a near-full-viewport spread with a large graded
// photo and display type; the five smaller reasons follow at a faster tempo, as a tight run of
// numbers with small prints, and end on the route's returns set over one wide band.
// Server component, no JS. The only motion is a CSS scroll-driven settle on the two spread photos.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import s from './WjReasonsC.module.css';

type Card = (typeof t.cards)[number];

export function WjReasonsC() {
  const [nobel, ips, ...rest] = t.cards as Card[];
  const run = rest.filter(c => !c.ledger);
  const finale = rest.find(c => c.ledger);

  return (
    <section id="routes" className={s.wrap} aria-labelledby="routes-title">
      <header className={s.head}>
        <div>
          {/* Added label: the section's kanji chapter mark (理由, riyū, "reasons"). */}
          <p className="kanjiMark"><b lang="ja">理由</b><span>Riyū</span></p>
          <p className={`eyebrow ${s.eyebrow}`}>{t.routes.label}</p>
          <h2 id="routes-title" className={s.h2}>{t.routes.title}</h2>
        </div>
        <p className={s.lead}>
          {t.routes.lead.map((p, i) =>
            typeof p === 'string' ? p : <span key={i}><b>{p.b}</b>{p.fn && <Fn n={p.fn} />}</span>,
          )}
        </p>
      </header>

      {/* Spread 1: photo bleeds off the left edge, type stands on the right. */}
      <article className={`${s.spread} ${s.spreadA}`} aria-labelledby="wj-c-nobel">
        <figure className={`${s.photo} grain`}>
          <Image className={`grade ${s.settle}`} src={nobel.img.src} alt={nobel.img.alt} fill
            sizes="(max-width: 860px) 100vw, 50vw" style={{ objectPosition: nobel.img.pos }} />
        </figure>
        <div className={s.copy}>
          <p className="mono">{nobel.label}</p>
          <h3 id="wj-c-nobel" className={s.titleA}>{nobel.title}</h3>
          <p className={s.body}>{nobel.body}</p>
          {nobel.fact && <Ledger fact={nobel.fact} />}
        </div>
      </article>

      {/* Spread 2: a bigger headline, a narrower print bleeding off the right edge. */}
      <article className={`${s.spread} ${s.spreadB}`} aria-labelledby="wj-c-ips">
        <div className={s.copy}>
          <p className="mono">{ips.label}</p>
          <h3 id="wj-c-ips" className={s.titleB}>{ips.title}</h3>
          <div className={s.foot}>
            <p className={s.body}>{ips.body}</p>
            {ips.fact && <Ledger fact={ips.fact} />}
          </div>
        </div>
        <figure className={`${s.photo} grain`}>
          <Image className={`grade ${s.settle}`} src={ips.img.src} alt={ips.img.alt} fill
            sizes="(max-width: 860px) 100vw, 38vw" style={{ objectPosition: ips.img.pos }} />
        </figure>
      </article>

      {/* The run: four quick rows, number first, small print last. */}
      <ol className={s.run}>
        {run.map(c => (
          <li key={c.label} className={s.row}>
            {c.figure
              ? <p className={s.fig}>{c.figure}{c.fn && <Fn n={c.fn} />}</p>
              : <h3 className={s.rowTitle}>{c.title}</h3>}
            <div className={s.rowText}>
              {c.figure ? <h3 className="mono">{c.label}</h3> : <p className="mono">{c.label}</p>}
              <p className={s.rowBody}>{c.body}</p>
            </div>
            <span className={`${s.thumb} grain`}>
              <Image className="grade" src={c.img.src} alt={c.img.alt} fill
                sizes="(max-width: 640px) 88px, 200px" style={c.img.pos ? { objectPosition: c.img.pos } : undefined} />
            </span>
          </li>
        ))}
      </ol>

      {/* The close: what the route returns, set along the foot of one wide band. */}
      {finale?.ledger && (
        <div className={s.finale}>
          <h3 className={`mono ${s.finaleLabel}`}>{finale.label}</h3>
          <div className={`${s.band} grain`}>
            <Image className="grade" src={finale.img.src} alt={finale.img.alt} fill
              sizes="(max-width: 1440px) 88vw, 1270px" />
            <dl className={s.returns}>
              {finale.ledger.map(r => (
                <div key={r.figure}>
                  <dt>{r.figure}</dt>
                  <dd><b>{r.bold}</b><span className="mono">{r.label}</span></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}

function Ledger({ fact }: { fact: { label: string; value: string } }) {
  return (
    <dl className={s.ledger}>
      <dt className="mono">{fact.label}</dt>
      <dd>{fact.value}</dd>
    </dl>
  );
}
