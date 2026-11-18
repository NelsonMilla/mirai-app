// /why-japan hero, variant B · "Film still" (lab round, Nov 18 2026).
// The first screen is one full-bleed photograph, edge to edge and full viewport height, like a
// film's title card. The claim sits bottom-left on an edge-only dark gradient; the frame fades
// into --night at its foot so the reasons section continues the same ground.
// Server component, no JS. The one gesture is the photo settling (scale, once, CSS only);
// reduced motion shows the settled frame.
//
// Photo: "Autumn in Kyoto" by Fg2, public domain (Wikimedia Commons, KyotoAutumn.jpg), the
// 1920×1272 original from new-site/img/kansai-kyoto-autumn.jpg, re-encoded to WebP. It is the
// only Japan-as-a-place candidate that holds at 1920 wide without upscaling.
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import { residency } from '@/content/residency';
import s from './WjHeroB.module.css';

const PHOTO = '/img/why-japan/wj-hero-b/kyoto-autumn.webp';
const ALT = 'A Kyoto temple garden in autumn, red and gold maples reflected in a still pond';

export function WjHeroB() {
  return (
    <section className={`${s.hero} grain`} aria-labelledby="wj-hero-title">
      <div className={s.frame}>
        <Image className={`${s.photo} grade`} src={PHOTO} alt={ALT} fill priority sizes="100vw" />
      </div>
      <div className={s.veil} aria-hidden="true" />

      <div className={s.copy}>
        <p className={`kanjiMark ${s.mark}`}><b lang="ja">日本</b><span>Nihon</span></p>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 id="wj-hero-title" className={s.h1}>{t.headline}</h1>
        <div className={s.foot}>
          <p className={s.lead}>{t.lead}</p>
          {/* The page continues: a real link to the next section, labelled with the homepage's own cue word. */}
          <a className={s.cue} href="#routes">
            <span>{residency.hero.scrollCue}</span>
            <i aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
