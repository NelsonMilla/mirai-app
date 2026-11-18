// /why-japan hero, variant C · "The people who came". The claim sits beside a contact sheet of
// real 2026 photos (stage, lab, meals, groups), each a framed print with its manifest caption
// underneath. Server component; the only motion is a CSS develop-in that ends in the finished state.
import Image from 'next/image';
import photos from '@/content/photos-2026.json';
import { whyJapan as t } from '@/content/why-japan';
import s from './WjHeroC.module.css';

// Captioned, non-selfie shots only, in reading order. Two columns: left = a, right = b (offset).
// Never lab-kobe-university-01; never two wide selfies side by side (none are used here).
const PICKS = {
  a: ['stage-summit-i-01', 'meal-pub-01', 'people-friends-hike-01'],
  b: ['lab-surgical-robot-01', 'people-group-laughing-01', 'meal-long-table-01'],
};

type Photo = { src: string; alt: string; caption: string; focal: string };
const bySlug = (slug: string) => (photos as Photo[]).find(p => p.src.endsWith(`/${slug}.webp`))!;

function Print({ slug, i }: { slug: string; i: number }) {
  const p = bySlug(slug);
  return (
    <figure className={s.print} style={{ '--i': i } as React.CSSProperties}>
      <span className={`${s.plate} grain`}>
        <Image className="grade" src={p.src} alt={p.alt} fill priority={i < 2}
          sizes="(max-width: 900px) 44vw, (max-width: 1920px) 21vw, 400px"
          style={{ objectPosition: p.focal }} />
      </span>
      <figcaption className="mono">{p.caption}</figcaption>
    </figure>
  );
}

export function WjHeroC() {
  return (
    <header className={s.hero}>
      <div className={s.type}>
        <p className="kanjiMark"><b>日本</b><span>Nihon</span></p>
        <p className={`eyebrow ${s.eyebrow}`}>{t.eyebrow}</p>
        <h1 className={s.h1}>{t.headline}</h1>
        <p className={s.lead}>{t.lead}</p>
        {/* "Next" is the one added label: a plain pointer to the section below. */}
        <a className={s.next} href="#routes">
          <span className="mono">Next</span>
          <span className={s.nextTitle}>{t.routes.title}</span>
          <span className={s.arrow} aria-hidden="true">↓</span>
        </a>
      </div>

      <div className={s.sheet}>
        <div className={s.col}>{PICKS.a.map((slug, i) => <Print key={slug} slug={slug} i={i * 2} />)}</div>
        <div className={`${s.col} ${s.colB}`}>{PICKS.b.map((slug, i) => <Print key={slug} slug={slug} i={i * 2 + 1} />)}</div>
      </div>
    </header>
  );
}
