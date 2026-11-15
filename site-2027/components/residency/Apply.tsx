// Apply (応募): who it is for, then the final call, which ends on people: the cohort on a
// night street. The photo carries the close, so it has a real alt. On desktop it fills the
// band from the copy column to the right edge; on phones it sits above the copy. Either way
// the copy stands on night, never on a face.
// All content is static markup: nothing depends on JS or an observer.
import Image from 'next/image';
import photos from '@/content/photos-2026.json';
import { residency, type Residency } from '@/content/residency';
import s from './Apply.module.css';

// Manifest focal is 35% 45%, the selfie-taker on the left. The crop in Apply.module.css starts
// at 27% of the frame, so he falls outside and the group leads.
const KEY = 'people-group-night-street-01';
const CROWD = photos.find(p => p.src.endsWith(`/${KEY}.webp`))!;

export function Apply({ r = residency }: { r?: Residency } = {}) {
  const NEW_TAB = <span className={s.sr}> {r.newTab}</span>;
  const alt = r.photoText[KEY]?.alt ?? CROWD.alt;
  return (
    <section id="apply" className={s.apply} aria-labelledby="apply-fit">
      <div className={s.fit}>
        <p className="kanjiMark"><b lang="ja">応募</b><span>{r.marks.apply}</span></p>
        <div className={s.fitGrid}>
          <div>
            <p className="eyebrow">{r.fit.eyebrow}</p>
            <h2 id="apply-fit" className={s.fitHead}>{r.fit.headline}</h2>
            <p className={s.fitBody}>{r.fit.body}</p>
          </div>
          <ul className={s.yes}>
            {r.fit.yes.map((y, i) => (
              <li key={y}><span className={s.yn}>{String(i + 1).padStart(2, '0')}</span>{y}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.final} aria-labelledby="apply-final">
        <div className={s.photo}>
          {/* grain on the crop, not the masked panel: on the panel it leaves a seam at the clip edge */}
          <div className={`${s.crop} grain`}>
            <Image
              className={`${s.img} grade`}
              src={CROWD.src}
              alt={alt}
              fill
              sizes="(max-width: 1099px) 150vw, 86vw"
            />
          </div>
        </div>
        <div className={s.copy}>
          <p className="eyebrow">{r.final.eyebrow}</p>
          <h2 id="apply-final" className={s.head}>{r.final.headline}</h2>
          <p className={s.body}>{r.final.body}</p>
          <div className={s.actions}>
            <a className={s.pill} href={r.applyHref} target="_blank" rel="noopener">
              {r.apply}<span className={s.arrow} aria-hidden="true">↗</span>{NEW_TAB}
            </a>
            <a className={s.talk} href={r.talkHref} target="_blank" rel="noopener">{r.talk}{NEW_TAB}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
