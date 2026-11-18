// Why now · B, "Years as monuments": 2025, 2026 and 2027 are the structure of the section, set as
// giant numerals; the dated events sit at reading size beside them. The one gesture is CSS-only:
// each year is position: sticky inside its own group, so it holds while its events pass and the
// next year takes over. No JS, so reduced motion and no-JS see the same finished layout.
import { Fragment } from 'react';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import s from './WjNowB.module.css';

type Entry = (typeof t.now.entries)[number];

// Group the entries by year. An undated entry ("The standard.") continues the entry before it.
const years: { year: string; items: Entry[][] }[] = [];
for (const e of t.now.entries) {
  const y = e.date.match(/\d{4}/)?.[0];
  const last = years[years.length - 1];
  if (!y) { last.items[last.items.length - 1].push(e); continue; }
  if (last?.year === y) last.items.push([e]);
  else years.push({ year: y, items: [[e]] });
}

// Today is Nov 18 2026: a year after the current one has not happened yet.
const AHEAD_AFTER = 2026;
const AHEAD_LABEL = 'Ahead'; // the one added label, plain and literal

export function WjNowB() {
  return (
    <section id="why-now" className={s.section} aria-labelledby="now-title">
      <div className={s.head}>
        <p className="eyebrow">{t.now.label}</p>
        <h2 id="now-title" className={s.h2}>{t.now.title}</h2>
      </div>

      <ol className={s.years}>
        {years.map(({ year, items }) => {
          const ahead = Number(year) > AHEAD_AFTER;
          return (
            <li key={year} className={ahead ? `${s.year} ${s.ahead}` : s.year}>
              <div className={s.mark}>
                <h3 className={s.num}>{year}</h3>
                {ahead && <span className={s.aheadTag}>{AHEAD_LABEL}</span>}
              </div>
              <ol className={s.events}>
                {items.map((group, i) => (
                  <li key={i} className={s.event}>
                    {group[0].date !== year && <p className={s.date}>{group[0].date}</p>}
                    {group.map((e, j) => (
                      <Fragment key={j}>
                        {e.head && <p className={s.evHead}>{e.head}{e.fn && <Fn n={e.fn} />}</p>}
                        {e.body && <p className={s.evBody}><b>{e.bold}</b> {e.body}</p>}
                      </Fragment>
                    ))}
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
