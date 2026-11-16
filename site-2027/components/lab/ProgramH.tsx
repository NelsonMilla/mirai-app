'use client';
// Lab variant H · "Answer with the people" (mission round three, Nov 16 2026).
// "Who we are" is answered by the room, not by a graphic. "10,000 cures" is set at sentence
// size, with paragraph 1 beside it as the lead. Directly under the claim hangs one large framed
// print: the Summit I panel, seven people mid-size on stage, seen from the seats. Under it, the
// other three paragraphs as one column of wall text beside one medium print (a conversation on
// stage). One gesture: when the large print comes into view, the lights come up on the prints
// once (opacity only, staggered). Without JS or with reduced motion they are lit at once.
// Copy comes from content/residency.ts. The "What you get" list is unchanged from
// components/residency/Program.tsx.
import Image from 'next/image';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import photos from '@/content/photos-2026.json';
import { residency, type Residency } from '@/content/residency';
import s from './ProgramH.module.css';

type Photo = (typeof photos)[number];
const byName = new Map(photos.map(p => [p.src.slice(p.src.lastIndexOf('/') + 1, -'.webp'.length), p]));
const get = (name: string): Photo => {
  const p = byName.get(name);
  if (!p) throw new Error(`ProgramH: no photo "${name}" in content/photos-2026.json`);
  return p;
};

// The large print. 2000px source. Cropped to a wide band around the panel: the manifest focal's
// x, but y sits low: the 未来 seal stays in the phone crop, and the wider band shows the people, not the screen's title.
const ROOM = 'stage-summit-i-01';
// One medium print (1024px source): a conversation on stage.
const TALK = 'stage-panel-01';

// Honest `sizes`. Content width is min(1440px, 88vw); 12 columns from 900px.
const SIZES = {
  room: '(min-width: 1637px) 1440px, 88vw',
  talk: '(max-width: 599px) 69vw, (max-width: 899px) 460px, (min-width: 1637px) 581px, 36vw',
};

// Digits always in Switzer: next to kanji ("1万") the browser otherwise draws them in the
// Japanese fallback font.
const digits = (text: string): ReactNode[] =>
  text.split(/([\d,]+)/).map((part, i) => (/\d/.test(part) ? <span key={i} className={s.digits}>{part}</span> : part));

function Print({ name, r, sizes, className, position, i }: {
  name: string; r: Residency; sizes: string; className: string; position?: string; i: number;
}) {
  const p = get(name);
  const t = r.photoText[name];
  // A manifest caption is English: on /jp only a Japanese caption from r.photoText shows.
  const caption = t?.caption ?? (r === residency ? p.caption : '');
  return (
    <figure className={`${s.print} ${className}`} style={{ '--i': i } as CSSProperties}>
      <div className={`${s.frame} grain`}>
        <Image className={`${s.img} grade`} src={p.src} alt={t?.alt ?? p.alt} fill sizes={sizes}
          style={{ objectPosition: position ?? p.focal }} />
        <i className={s.veil} aria-hidden="true" />
      </div>
      {caption && <figcaption className={s.cap}>{caption}</figcaption>}
    </figure>
  );
}

export function ProgramH({ r = residency }: { r?: Residency } = {}) {
  const root = useRef<HTMLElement>(null);
  const unit = r.mission.unit;
  // "10,000 cures" needs a space; "1万の治療法" must not get one.
  const gap = /^[A-Za-z]/.test(unit) ? ' ' : '';
  const [who, goal, asrm, network] = r.mission.body;
  const room = get(ROOM);

  // Lights up: once, when the large print is in the upper three quarters of the screen.
  useEffect(() => {
    const el = root.current;
    const frame = el?.querySelector(`.${s.room}`);
    if (!el || !frame) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.dataset.lit = '';
      io.disconnect();
    }, { rootMargin: '0px 0px -25% 0px' });
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          <h2 id="program-title" className={s.statement}>
            <span className={s.num}>{digits(r.mission.big)}</span>{gap}<span className={s.unit}>{unit}</span>
          </h2>
          <p className={s.lead}>{who}</p>

          <Print r={r} name={ROOM} i={0} sizes={SIZES.room} className={s.room}
            position={`${room.focal.split(' ')[0]} 89%`} />
          <div className={s.wall}>
            <p>{goal}</p>
            <p className={s.asrm}>{asrm}</p>
            <p>{network}</p>
          </div>
          <Print r={r} name={TALK} i={1} sizes={SIZES.talk} className={s.talk} />
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
