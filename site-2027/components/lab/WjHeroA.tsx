// /lab/wj-hero-a · "Monument": the claim is the image. The headline is set at viewport scale;
// the harbour photo is a slit window that closes the last line, never the backdrop.
// Server component, no JS. One gesture: the window's shutter opens once (CSS, transform only).
import Image from 'next/image';
import { whyJapan as t } from '@/content/why-japan';
import s from './WjHeroA.module.css';

export function WjHeroA() {
  const words = t.headline.split(' ');
  const last = words.pop();

  return (
    <section className={s.hero} aria-labelledby="wj-claim">
      <div className={s.top}>
        <p className="eyebrow">{t.eyebrow}</p>
        <p className={`kanjiMark ${s.mark}`}><b lang="ja">日本</b><span>Nihon</span></p>
      </div>

      <h1 id="wj-claim" className={s.claim}>
        {words.join(' ')}{' '}
        <span className={s.last}>
          <span className={s.word}>{last}</span>
          {/* The photo is described by the visible caption below, so it is silent here. */}
          <span className={`${s.window} grain`} aria-hidden="true">
            <Image className="grade" src={t.hero.src} alt="" fill priority
              sizes="(max-width: 640px) 88vw, 52vw" style={{ objectPosition: '50% 62%' }} />
            <span className={s.shutter} />
          </span>
        </span>
      </h1>

      <div className={s.foot}>
        <p className={s.lead}>{t.lead}</p>
        <div className={s.side}>
          <p className={s.caption}>{t.hero.alt}</p>
          {/* Added label: a plain scroll cue to the next section. */}
          <a className={s.cue} href="#routes">Scroll<span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
