// /why-japan Reasons. Two monumental beats only: 6–12 months (gold) under the paragraph that
// carries the full sentence, and the iPS reason as the section's one full-bleed photo spread.
// Everything else is a quiet hairline ledger: Conditional Early Approval sits beside 6–12 months
// in the narrow column (reading size, never louder than the copy); Nobel and the national database are
// reading-size headlines; $146B, 2:1 and 70–90% share one modest figure size with 10× / 100× / +61%.
// Server component. The only motion is a CSS scroll-driven settle on the spread photo.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import s from './Reasons.module.css';

const [nobel, ips, database, market, amed, insurance, ledger] = t.cards;

// Footnote on a figure: a fixed-size marker set tight against the numeral's top-right.
const FigFn = ({ n }: { n: number }) => <span className={s.figFn}><Fn n={n} /></span>;

export function Reasons() {
  return (
    <section id="routes" className={s.wall} aria-labelledby="routes-title">
      <div className={s.inner}>
        <div className={s.head}>
          <div>
            {/* Added label: the section's kanji chapter mark, 理由 (riyū) = reasons. */}
            <p className="kanjiMark" aria-hidden="true"><b>理由</b><span>Riyū</span></p>
            <h2 id="routes-title" className={s.h2}>{t.routes.title}</h2>
          </div>
          <p className={s.lead}>
            {t.routes.lead.map((p, i) =>
              typeof p === 'string' ? p : <span key={i}><b>{p.b}</b>{p.fn && <Fn n={p.fn} />}</span>,
            )}
          </p>
        </div>

        {/* 6–12 months, with the route it belongs to; the second route sits beside it in the
            narrow column, at reading size (never louder than the copy). */}
        <div className={s.lede}>
          <div className={s.ledeMain}>
            <p className="mono">{ips.fact!.label}</p>
            <p className={`${s.num} ${s.gold}`}>{ips.fact!.value}</p>
          </div>
          <p className={s.cea}>
            <span className="mono">{nobel.fact!.label}</span>
            <span className={s.ceaVal}>{nobel.fact!.value}</span>
          </p>
        </div>
      </div>

      {/* The one photograph: the iPS reason as a spread, print bleeding off the right edge */}
      <article className={s.spread} aria-labelledby="wj-ips">
        <div className={s.copy}>
          <p className="mono">{ips.label}</p>
          <h3 id="wj-ips" className={s.spreadTitle}>{ips.title}</h3>
          <p className={s.spreadBody}>{ips.body}</p>
        </div>
        <figure className={`${s.photo} grain`}>
          <Image className={`grade ${s.settle}`} src={ips.img.src} alt={ips.img.alt} fill
            sizes="(max-width: 860px) 100vw, 38vw" style={{ objectPosition: ips.img.pos }} />
        </figure>
      </article>

      <div className={`${s.inner} ${s.after}`}>
        {/* Left: the Nobel headline, then what the route returns; right: the three figures, then
            the national database. Split this way the two columns end together. */}
        <div className={s.left}>
          <ul className={s.heads}>
            {[nobel].map(c => (
              <li key={c.title} className={s.row}>
                <span className="mono">{c.label}</span>
                <div>
                  <h3 className={s.title}>{c.title}</h3>
                  <p className={s.body}>{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className={`mono ${s.ledgerLabel}`}>{ledger.label}</p>
          <dl className={`${s.ledger} ${s.returns}`}>
            {ledger.ledger!.map(r => (
              <div key={r.figure} className={s.row}>
                <dt className={s.fig}>{r.figure}</dt>
                <dd>
                  <span className="mono">{r.label}</span>
                  <b className={s.bold}>{r.bold}</b>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The quiet ledger: every figure on one modest size */}
        <div className={s.right}>
          <dl className={s.ledger}>
            {[market, amed, insurance].map(c => (
              <div key={c.figure} className={s.row}>
                <dt className={s.fig}>{c.figure}<FigFn n={c.fn!} /></dt>
                <dd>
                  <span className="mono">{c.label}</span>
                  <span className={s.body}>{c.body}</span>
                </dd>
              </div>
            ))}
          </dl>
          <ul className={`${s.heads} ${s.headsAfter}`}>
            <li className={s.row}>
              <span className="mono">{database.label}</span>
              <div>
                <h3 className={s.title}>{database.title}</h3>
                <p className={s.body}>{database.body}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
