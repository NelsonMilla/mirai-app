// /why-japan hero · "The people who came". The claim on the left, set on night; one large graded
// print of the 2026 group bleeding to the right and top edges (behind the glass header), the way
// the homepage opens on Fuji. Type never sits on the photo: the print only fades into the night at
// its inner and bottom edges. Captions come only from the manifest.
// Server component; the only motion is a CSS develop-in that ends in the finished state.
// At 900px and under the claim, lead and Next come first, then the print full-bleed.
import Image from 'next/image';
import photos from '@/content/photos-2026.json';
import { whyJapan as t } from '@/content/why-japan';
import s from './Hero.module.css';

// Checked by eye: a posed group (photographer's shot, not a selfie) in front of a glass wall of
// compute racks; no stage, no speakers on stage, no drinks, no readable brand marks once the
// bottom edge (a railing and a leaflet) is under the night fade.
type Photo = { src: string; alt: string; caption: string; focal: string };
const LEAD = (photos as Photo[]).find(p => p.src.endsWith('/people-group-laughing-01.webp'))!;

export function Hero() {
  return (
    <header className={s.hero}>
      <div className={s.type}>
        <p className={`kanjiMark ${s.mark}`}><b lang="ja">日本</b><span>Nihon</span></p>
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

      <figure className={s.print}>
        <span className={`${s.plate} grain`}>
          <Image className={`grade ${s.img}`} src={LEAD.src} alt={LEAD.alt} fill priority
            sizes="(max-width: 900px) 100vw, 60vw" style={{ objectPosition: LEAD.focal }} />
          <span className={s.fade} aria-hidden="true" />
        </span>
        {LEAD.caption ? <figcaption className={`mono ${s.caption}`}>{LEAD.caption}</figcaption> : null}
      </figure>
    </header>
  );
}
