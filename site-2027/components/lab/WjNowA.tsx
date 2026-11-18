// /lab/wj-now-a · "The rail". One horizontal time axis from Jan 2025 to Jan 2027, every date on
// its true proportional position, Today (Nov 18 2026) marked in gold with Jan 2027 still ahead.
// Hairline leaders fan down from each point to its column of copy. Below 1100px the columns
// stack; the rail stays, still to scale. Server component, no JS: the one gesture (the rail
// drawing to Today) is a CSS scroll-driven animation that degrades to the finished state.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import s from './WjNowA.module.css';

// Time scale in months from 1 Jan 2025. The axis ends just after January 2027.
const END = 25.5;
const pct = (m: number) => `${((m / END) * 100).toFixed(3)}%`;
// Today: Nov 18 2026 = month 22 plus 17.5 of 30 days.
const TODAY = 22 + 17.5 / 30;

// Where each dated entry sits on the axis (mid-month; "2025" is the whole year, drawn as a span).
// The undated "The standard." entry (index 2) travels with Feb 2026 in the same column.
const points: Record<string, { at: number; from?: number; dt: string }> = {
  '2025': { at: 6, from: 0, dt: '2025' },
  'Feb 2026': { at: 13.5, dt: '2026-02' },
  'Jun 2026': { at: 17.5, dt: '2026-06' },
  'Oct 2026': { at: 21.5, dt: '2026-10' },
  'Jan 2027': { at: 24.5, dt: '2027-01' },
};
const columns = [[0], [1, 2], [3], [4], [5]];
const weights = [1, 1.5, 1, 1.3, 1];
const wsum = weights.reduce((a, b) => a + b, 0);
const colLeft = weights.map((_, i) => (weights.slice(0, i).reduce((a, b) => a + b, 0) / wsum) * 100);

const months = Array.from({ length: 26 }, (_, i) => i);

export function WjNowA() {
  const e = t.now.entries;
  return (
    <section id="why-now" className={s.section} aria-labelledby="now-title">
      <div className={s.wrap}>
        <p className="eyebrow">{t.now.label}</p>
        <h2 id="now-title" className={s.h2}>{t.now.title}</h2>
      </div>

      <div className={s.wrap}>
        <span className={`${s.plate} grain`} aria-hidden="true">
          <Image className="grade" src={t.now.img} alt="" fill sizes="(max-width: 1440px) 88vw, 1270px" />
        </span>
      </div>

      {/* The axis is decorative: the same dates are read in the list below. */}
      <div className={s.rail} aria-hidden="true">
        <div className={s.wrap}>
          <div className={s.track}>
            <span className={s.base} />
            <span className={s.past} style={{ width: pct(TODAY) }} />
            <span className={s.ahead} style={{ left: pct(TODAY) }} />
            {months.map(m => (
              <span key={m} className={m % 12 === 0 ? `${s.tick} ${s.year}` : s.tick} style={{ left: pct(m) }} />
            ))}
            <span className={s.span} style={{ left: pct(0), width: pct(12) }} />
            {Object.entries(points).filter(([k]) => k !== '2025').map(([k, p]) => (
              <span key={k} className={p.at > TODAY ? `${s.dot} ${s.future}` : s.dot} style={{ left: pct(p.at) }} />
            ))}
            <span className={s.today} style={{ left: pct(TODAY) }}>
              {/* Added label (allowed by the brief): marks Nov 18 2026 on the axis. */}
              <span className={s.todayLabel}>Today</span>
            </span>
          </div>
          <svg className={s.leaders} viewBox="0 0 100 10" preserveAspectRatio="none">
            {columns.map((c, i) => {
              const p = points[e[c[0]].date];
              return <line key={i} x1={(p.at / END) * 100} y1="0" x2={colLeft[i] + 0.15} y2="10" vectorEffect="non-scaling-stroke" />;
            })}
          </svg>
        </div>
      </div>

      <div className={s.wrap}>
        <ol className={s.cols} style={{ '--cols': weights.map(w => `minmax(0, ${w}fr)`).join(' ') } as React.CSSProperties}>
          {columns.map((c, i) => {
            const p = points[e[c[0]].date];
            return (
              <li key={i} className={p.at > TODAY ? `${s.col} ${s.colAhead}` : s.col}>
                <time className={s.date} dateTime={p.dt}>{e[c[0]].date}</time>
                {c.map(j => (
                  <div key={j} className={s.item}>
                    {e[j].head && <p className={s.head}>{e[j].head}{e[j].fn && <Fn n={e[j].fn} />}</p>}
                    {e[j].body && <p className={s.body}><b>{e[j].bold}</b> {e[j].body}</p>}
                  </div>
                ))}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
