// Why now · C "Dossier". Each milestone is a filed record on a hairline-ruled form: a mono date
// stamp, the entry, and its footnoted source cited on the record itself. The undated
// "The standard." is filed with Feb 2026. Jan 2027 is still ahead (today is Nov 18 2026), so its
// stamp is dashed and unfiled. One Mirai seal (未来) marks the file; it is the section's only
// gesture, CSS scroll-driven, and shows finished without JS or with reduced motion.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import { Fn } from '@/components/why-japan/Notes';
import s from './WjNowC.module.css';

type Entry = (typeof t.now.entries)[number];

// Fold undated entries into the record before them.
const records = t.now.entries.reduce<Entry[][]>((acc, e) => {
  if (!e.date && acc.length) acc[acc.length - 1].push(e);
  else acc.push([e]);
  return acc;
}, []);

// The one added label: marks the January 2027 record as not yet reached.
const UPCOMING = 'Upcoming';
const isAhead = (date: string) => date.includes('2027');

export function WjNowC() {
  return (
    <section id="why-now" className={s.sec} aria-labelledby="now-title">
      <div className={s.head}>
        <div>
          <p className="eyebrow">{t.now.label}</p>
          <h2 id="now-title" className={s.h2}>{t.now.title}</h2>
        </div>
        <div className={s.cover}>
          <span className={`${s.print} grain`}>
            <Image className="grade" src={t.now.img} alt="" fill sizes="(max-width: 640px) 60vw, 280px" />
          </span>
          <span className={s.seal} aria-hidden="true">未来</span>
        </div>
      </div>

      <ol className={s.file}>
        {records.map((group, i) => {
          const date = group[0].date;
          const ahead = isAhead(date);
          const fns = group.filter(e => 'fn' in e && e.fn).map(e => (e as { fn: number }).fn);
          return (
            <li key={i} className={ahead ? `${s.rec} ${s.ahead}` : s.rec}>
              <div className={s.stampCell}>
                <span className={s.stamp}>{date}</span>
                {ahead && <span className={s.upcoming}>{UPCOMING}</span>}
              </div>
              <div className={s.text}>
                {group.map((e, j) => (
                  <div key={j} className={s.item}>
                    {'head' in e && e.head && <p className={s.entryHead}>{e.head}{'fn' in e && e.fn && <Fn n={e.fn} />}</p>}
                    {'body' in e && e.body && <p className={s.entryBody}><b>{e.bold}</b> {e.body}</p>}
                  </div>
                ))}
              </div>
              <div className={s.cite}>
                {fns.length ? fns.map(n => (
                  <p key={n} className={s.note}><span className={s.noteN}>{n}</span>{t.notes[n - 1]}</p>
                )) : <span className={s.blank} aria-hidden="true">—</span>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
