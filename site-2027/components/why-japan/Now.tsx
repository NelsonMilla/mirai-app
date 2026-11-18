// Why now, "Years as monuments": 2025, 2026 and 2027 are the structure of the section, set as
// giant numerals; the dated events sit at reading size beside them. The one gesture is CSS-only
// (desktop): the events column sets each row's height and the numeral is position: sticky inside
// its row, so 2026 holds while its events and a 2026 dinner print pass. 2027 breaks the split:
// no sticky column, the hollow numeral across the full measure, its entry beneath it.
// Today and Ahead come from NowMarks (client, after mount), so they never go stale.
import { Fragment } from 'react';
import Image from 'next/image';
import photos from '@/content/photos-2026.json';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import { AheadLabel, TodayInline, TodayRule } from './NowMarks';
import s from './Now.module.css';

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

const PHOTO_YEAR = '2026';
// Mirai's own 2026 print (replaces the stock night train). Checked by eye: a long dinner table,
// not a selfie, no stage speakers, no readable brand marks; cups on the table, not the subject.
const PHOTO = (photos as { src: string; alt: string; caption: string; focal: string }[])
  .find(p => p.src.endsWith('/meal-long-table-01.webp'))!;
const LAST_YEAR = years[years.length - 1].year;

export function Now() {
  return (
    <section id="why-now" className={s.section} aria-labelledby="now-title">
      <div className={s.head}>
        {/* Added label: the section's kanji chapter mark, 今 (ima) = now. */}
        <p className={`kanjiMark ${s.kanji}`} aria-hidden="true"><b>今</b><span>Ima</span></p>
        <p className={`eyebrow ${s.eyebrow}`}>{t.now.label}</p>
        <h2 id="now-title" className={s.h2}>{t.now.title}</h2>
      </div>

      <ol className={s.years}>
        {years.map(({ year, items }) => {
          const last = year === LAST_YEAR;
          return (
            <Fragment key={year}>
              {last && <TodayRule />}
              <li className={last ? `${s.year} ${s.last}` : s.year}>
                <div className={s.mark}>
                  <h3 className={s.num}>{year}</h3>
                  {last && <AheadLabel />}
                </div>
                <ol className={s.events}>
                  {items.map((group, i) => (
                    <li key={i} className={s.event}>
                      {group[0].date !== year && (
                        <p className={s.date}>{group[0].date}{last && <TodayInline />}</p>
                      )}
                      {group.map((e, j) => (
                        <Fragment key={j}>
                          {e.head && <p className={s.evHead}>{e.head}{e.fn && <Fn n={e.fn} />}</p>}
                          {e.body && <p className={s.evBody}><b>{e.bold}</b> {e.body}</p>}
                        </Fragment>
                      ))}
                    </li>
                  ))}
                  {year === PHOTO_YEAR && (
                    <li className={s.photo}>
                      <figure>
                        <span className={`${s.plate} grain`}>
                          <Image className="grade" src={PHOTO.src} alt={PHOTO.alt} fill
                            sizes="(max-width: 900px) 88vw, (max-width: 1440px) 36vw, 520px"
                            style={{ objectPosition: PHOTO.focal }} />
                        </span>
                        {PHOTO.caption ? <figcaption className="mono">{PHOTO.caption}</figcaption> : null}
                      </figure>
                    </li>
                  )}
                </ol>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </section>
  );
}
