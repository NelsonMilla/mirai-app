// /why-japan Reasons · B "Numbers wall". The approved figures are the visual: one ruled,
// asymmetric typographic composition. The regenerative-medicine route (6–12 months) and iPS lead;
// "4 years ahead of the FDA" sits as a modest fact under the Nobel reason. Server component, no motion.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import s from './WjReasonsB.module.css';

const [nobel, ips, database, market, amed, insurance, ledger] = t.cards;

// Figure footnote: fixed size so the marker does not scale with the monumental numeral.
const FigFn = ({ n }: { n: number }) => <span className={s.figFn}><Fn n={n} /></span>;

export function WjReasonsB() {
  const [ipsNum, ...ipsUnit] = ips.fact!.value.split(' ');
  return (
    <section id="routes" className={s.wall} aria-labelledby="routes-title">
      <div className={s.head}>
        <div className={s.headLeft}>
          {/* Added label: the section's kanji chapter mark, 理由 (riyū) = reasons. */}
          <p className="kanjiMark" aria-hidden="true"><b>理由</b><span>Riyū</span></p>
          <p className="eyebrow">{t.routes.label}</p>
          <h2 id="routes-title" className={s.h2}>{t.routes.title}</h2>
        </div>
        <p className={s.lead}>
          {t.routes.lead.map((p, i) =>
            typeof p === 'string' ? p : <span key={i}><b>{p.b}</b>{p.fn && <Fn n={p.fn} />}</span>,
          )}
        </p>
      </div>

      <ul className={s.grid}>
        {/* 1 · iPS + the regenerative-medicine route: the hero row */}
        <li className={`${s.cell} ${s.ips}`}>
          <div className={s.ipsFig}>
            <span className="mono">{ips.fact!.label}</span>
            <p className={s.hero}>
              <span className={s.heroNum}>{ipsNum}</span>
              <span className={s.heroUnit}>{ipsUnit.join(' ')}</span>
            </p>
          </div>
          <div className={s.ipsText}>
            <span className={`${s.thumb} ${s.thumbTall} grain`}>
              <Image className="grade" src={ips.img.src} alt={ips.img.alt} fill sizes="(max-width: 640px) 34vw, 180px"
                style={ips.img.pos ? { objectPosition: ips.img.pos } : undefined} />
            </span>
            <span className="mono">{ips.label}</span>
            <h3 className={s.bigTitle}>{ips.title}</h3>
            <p className={s.body}>{ips.body}</p>
          </div>
        </li>

        {/* 2 · Nobel: typographic counterweight; the CEA fact stays modest */}
        <li className={`${s.cell} ${s.nobel}`}>
          <span className={`${s.thumb} ${s.thumbTall} grain`}>
            <Image className="grade" src={nobel.img.src} alt={nobel.img.alt} fill sizes="(max-width: 640px) 34vw, 180px"
              style={nobel.img.pos ? { objectPosition: nobel.img.pos } : undefined} />
          </span>
          <span className="mono">{nobel.label}</span>
          <h3 className={s.title}>{nobel.title}</h3>
          <p className={s.body}>{nobel.body}</p>
          <p className={s.fact}>
            <span className="mono">{nobel.fact!.label}</span>
            <span className={s.factVal}>{nobel.fact!.value}</span>
          </p>
        </li>

        {/* 3 · $146B */}
        <li className={`${s.cell} ${s.market}`}>
          <span className="mono">{market.label}</span>
          <p className={`${s.num} ${s.numMarket}`}>{market.figure}<FigFn n={market.fn!} /></p>
          <p className={s.body}>{market.body}</p>
        </li>

        {/* 4 · 2:1 */}
        <li className={`${s.cell} ${s.amed}`}>
          <span className="mono">{amed.label}</span>
          <p className={`${s.num} ${s.numAmed}`}>{amed.figure}<FigFn n={amed.fn!} /></p>
          <p className={s.body}>{amed.body}</p>
        </li>

        {/* 5 · 70–90% */}
        <li className={`${s.cell} ${s.insurance}`}>
          <span className="mono">{insurance.label}</span>
          <p className={`${s.num} ${s.numIns}`}>{insurance.figure}<FigFn n={insurance.fn!} /></p>
          <p className={s.body}>{insurance.body}</p>
        </li>

        {/* 6 · One national database: typographic counterweight */}
        <li className={`${s.cell} ${s.database}`}>
          <div>
            <span className="mono">{database.label}</span>
            <h3 className={s.bigTitle}>{database.title}</h3>
            <p className={s.body}>{database.body}</p>
          </div>
          <span className={`${s.thumb} ${s.thumbWide} grain`}>
            <Image className="grade" src={database.img.src} alt={database.img.alt} fill sizes="(max-width: 640px) 50vw, 240px" />
          </span>
        </li>

        {/* 7 · The ledger */}
        <li className={`${s.cell} ${s.ledgerCell}`}>
          <span className="mono">{ledger.label}</span>
          <dl className={s.ledger}>
            {ledger.ledger!.map(r => (
              <div key={r.figure}>
                <dt className={s.ledgerFig}>{r.figure}</dt>
                <dd className="mono">{r.label}<br /><b>{r.bold}</b></dd>
              </div>
            ))}
          </dl>
        </li>
      </ul>
    </section>
  );
}
