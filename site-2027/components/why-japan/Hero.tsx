// /why-japan hero. The claim on the left, set on night; a large graded film loop from inside the
// Kobe Biomedical Innovation Cluster (HeroFilm) bleeding to the right and top edges (behind the
// glass header), the way the homepage opens on Fuji. Type never sits on the film: it only fades
// into the night at its inner and bottom edges. (The 2026 group photo moved to the closing.)
// Server component; the only motion is a CSS develop-in that ends in the finished state.
// At 900px and under the claim, lead and Next come first, then the print full-bleed.
import { whyJapan as t } from '@/content/why-japan';
import { HeroFilm } from './HeroFilm';
import s from './Hero.module.css';

export function Hero() {
  return (
    <header className={s.hero}>
      <div className={s.type}>
        <p className={`kanjiMark ${s.mark}`}><b lang="ja">日本</b><span>Nihon</span></p>
        <p className={`eyebrow ${s.eyebrow}`}>{t.eyebrow}</p>
        <h1 className={s.h1}>{t.headline}</h1>
        <p className={s.lead}>{t.lead}</p>
        {/* "Next" is the one added label: a plain pointer to the section below. The section's
            title stays visually out of the link so it is not shown twice in a row (anti-slop pass). */}
        <a className={s.next} href="#routes">
          <span className="mono">Next</span>
          <span className="sr-only">{t.routes.title}</span>
          <span className={s.arrow} aria-hidden="true">↓</span>
        </a>
      </div>

      <HeroFilm />
    </header>
  );
}
