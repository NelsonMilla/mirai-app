// /why-japan closing beat: the 2027 numeral hands straight into the residency. One graded 2026
// print (left, where the numerals stand) and, in the events column, the residency's own eyebrow,
// headline and one-line summary from content/residency.ts, the Apply pill and a plain link to the
// program. No new copy. Server component, no motion. The 応募 chapter mark opens the beat; at
// 900px and under the order is mark, print, then the headline and the call.
import Image from 'next/image';
import photos from '@/content/photos-2026.json';
import { residency } from '@/content/residency';
import { whyJapan as t } from '@/content/why-japan';
import s from './Closing.module.css';

// The 2026 group (moved here from the hero, Nov 18 2026). Checked by eye: a posed group
// (photographer's shot, not a selfie); no stage, no drinks, no readable brand marks.
const PHOTO = (photos as { src: string; alt: string; caption: string; focal: string }[])
  .find(p => p.src.endsWith('/people-group-laughing-01.webp'))!;

export function Closing() {
  return (
    <section className={s.closing} aria-labelledby="wj-apply-title">
      <div className={s.inner}>
        {/* Added label: the section's kanji chapter mark, 応募 (ōbo) = apply. */}
        <p className={`kanjiMark ${s.mark}`} aria-hidden="true"><b>応募</b><span>Ōbo</span></p>
        <figure className={s.print}>
          <span className={`${s.plate} grain`}>
            <Image className="grade" src={PHOTO.src} alt={PHOTO.alt} fill
              sizes="(max-width: 900px) 88vw, (max-width: 1440px) 51vw, 735px"
              style={{ objectPosition: PHOTO.focal }} />
          </span>
          {PHOTO.caption ? <figcaption className="mono">{PHOTO.caption}</figcaption> : null}
        </figure>

        <div className={s.copy}>
          <p className="eyebrow">{residency.final.eyebrow}</p>
          <h2 id="wj-apply-title" className={s.h2}>{residency.final.headline}</h2>
          <p className={s.sub}>{residency.hero.sub}</p>
          <div className={s.actions}>
            <a className="btn accent" href={residency.applyHref} target="_blank" rel="noopener">{residency.apply}</a>
            <a className={s.link} href="/#program">{t.programLink}<span className={s.arrow} aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
