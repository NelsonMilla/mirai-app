// Lab variant E · "Still frame". The mission block becomes one real photograph of the
// community, used big: "10,000 cures" is set on the photo's dark top edge like a title card,
// the room rises out of the night under it, and the lead line follows as the photo's voice.
// One display size, no motion. The "What you get in four weeks" list is copied unchanged
// from components/residency/Program.tsx.
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import photos from '@/content/photos-2026.json';
import { residency, type Residency } from '@/content/residency';
import s from './ProgramE.module.css';

// Everyone in the house, mid-celebration: the community itself, lit by its own lamp.
const KEY = 'people-group-house-01';
const STILL = photos.find(p => p.src.endsWith(`/${KEY}.webp`))!;
// The manifest focal's x; y moves up from its 45% to keep the ceiling band (no faces) for the
// statement while every face stays in frame from 3:2 to 1.82:1.
const POSITION = `${STILL.focal.split(' ')[0]} 25%`;

// Digits always in Switzer: next to kanji ("1万") the browser otherwise draws them in the
// Japanese fallback font.
const digits = (text: string): ReactNode[] =>
  text.split(/([\d,]+)/).map((part, i) => (/\d/.test(part) ? <span key={i} className={s.digits}>{part}</span> : part));

export function ProgramE({ r = residency }: { r?: Residency } = {}) {
  const unit = r.mission.unit;
  // "10,000 cures" needs a space; "1万の治療法" must not get one.
  const gap = /^[A-Za-z]/.test(unit) ? ' ' : '';
  const [who, goal, asrm, network] = r.mission.body;
  const alt = r.photoText[KEY]?.alt ?? STILL.alt;
  const caption = r.photoText[KEY]?.caption ?? STILL.caption;

  return (
    <section id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          <h2 id="program-title" className={s.statement}>
            <span className={s.num}>{digits(r.mission.big)}</span>{gap}<span className={s.unit}>{unit}</span>
          </h2>

          <figure className={s.still}>
            <div className={`${s.frame} grain`}>
              <Image
                className={`${s.img} grade`}
                src={STILL.src}
                alt={alt}
                fill
                sizes="100vw"
                style={{ objectPosition: POSITION } as CSSProperties}
              />
            </div>
            {caption && <figcaption className={s.cap}>{caption}</figcaption>}
          </figure>

          <p className={s.lead}>{who}</p>
          <div className={s.text}>
            <p>{goal}</p>
            <p className={s.asrm}>{asrm}</p>
            <p>{network}</p>
          </div>
        </div>

        <div className={s.receive}>
          <header className={s.receiveHead}>
            <p className={s.eyebrow}>{r.receive.eyebrow}</p>
            <h3 className={s.receiveTitle}>{r.receive.headline}</h3>
          </header>
          <ol className={s.list}>
            {r.receive.items.map((it) => (
              <li key={it.n} className={s.row}>
                <span className={s.n}>{it.n}</span>
                <h4 className={s.title}>{it.title}</h4>
                <p className={s.body}>{it.body}</p>
                <span className={s.kanji} aria-hidden="true">{it.kanji}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
