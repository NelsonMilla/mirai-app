'use client';
// Lab variant A, "Monument": the word FUJI set as architecture behind the summit.
// The photograph is drawn twice. The back copy is the sky; the front copy is masked to
// everything below the ridge line (traced from the photo), so the giant word and the
// rising 不死 sit *behind* the mountain. Scroll sets the word behind the ridge, the
// kanji rises over the summit, and the opening ends on the legend.
// Without JS or with reduced motion, the opening is two still frames: hero, then legend.
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { residency as r } from '@/content/residency';
import s from './OpeningA.module.css';

const PHOTO = '/img/fuji/fuji-dawn.webp';
// The photo is 1600×1063; when the viewport is narrower than that ratio it is height-limited.
const SIZES = '(max-aspect-ratio: 1600/1063) 151vh, 100vw';

const claim = r.hero.claims[0]; // "A month at Mount Fuji"
const cut = claim.lastIndexOf(' ');
const pre = claim.slice(0, cut); // "A month at Mount"
const word = claim.slice(cut + 1); // "Fuji"
const stop = r.hero.sub.indexOf('. ') + 1;
const lead = r.hero.sub.slice(0, stop); // "A one-month residency for early-stage regenerative medicine startups."
const rest = r.hero.sub.slice(stop + 1);
const [story1, story2, close] = r.legend.paragraphs;
const caption = story2.slice(story2.indexOf(r.hero.kanji)).replace(/\.$/, ''); // "不死, fushi, without death"

const NEW_TAB = <span className={s.sr}> (opens in a new tab)</span>;
// Keep "one-month", "early-stage" whole when the line wraps.
const keepHyphens = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className={s.nb}>{part}</span> : part));
const meta = r.hero.meta.map(m => <li key={m}>{m}</li>);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t: number) => 1 - Math.pow(1 - t, 3);

export function OpeningA() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const VARS = ['--zoom', '--sink', '--copy', '--rise', '--legend', '--dark'];
    let raf = 0;

    const paint = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      const p = span > 0 ? clamp01(-box.top / span) : 0;
      const seg = (a: number, b: number) => clamp01((p - a) / (b - a));
      const set = (k: string, v: number) => el.style.setProperty(k, v.toFixed(4));
      set('--zoom', 1 + 0.14 * inOut(p));
      set('--sink', inOut(seg(0.02, 0.46)));
      set('--copy', 1 - seg(0, 0.14));
      set('--rise', out(seg(0.36, 0.78)));
      set('--legend', out(seg(0.56, 0.84)));
      set('--dark', inOut(seg(0.38, 0.76)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const mode = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (mq.matches) {
        delete el.dataset.motion;
        VARS.forEach(v => el.style.removeProperty(v));
        return;
      }
      el.dataset.motion = 'on';
      paint();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    };
    mode();
    mq.addEventListener('change', mode);
    return () => {
      mq.removeEventListener('change', mode);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header className={s.bar}>
        <Link className={s.mark} href="/">Mirai Tech City</Link>
        <span className={s.barNote}>{r.hero.eyebrow}</span>
        <a className={s.barCta} href={r.applyHref} target="_blank" rel="noopener noreferrer">
          {r.navCta}{NEW_TAB}
        </a>
      </header>

      <div className={s.track} ref={track}>
        <div className={s.stage}>
          {/* back: the whole photograph (sky) */}
          <div className={`${s.scene} ${s.back}`}>
            <div className={s.settle}>
              <Image className={s.photo} src={PHOTO} alt="Mount Fuji at sunrise, across a still lake" fill preload sizes={SIZES} />
              <div className={s.skyShade} aria-hidden="true" />
            </div>
          </div>

          {/* between the two photos: everything that sits behind the mountain */}
          <div className={s.kanji} aria-hidden="true">{r.hero.kanji}</div>
          <h1 className={s.title}>
            <span className={s.sr}>{claim}</span>
            <span className={s.pre} aria-hidden="true"><span>{pre}</span></span>
            <span className={s.word} aria-hidden="true">
              {word.split('').map((ch, i, all) => (
                <span key={i} className={s.letter} style={{ '--i': i - (all.length - 1) / 2 } as React.CSSProperties}>
                  <span className={s.glyph}>{ch}</span>
                </span>
              ))}
            </span>
          </h1>
          <ul className={s.metaTop}>{meta}</ul>

          {/* front: the same photograph, masked to the mountain, the trees and the lake */}
          <div className={`${s.scene} ${s.front}`} aria-hidden="true">
            <div className={s.settle}>
              <Image className={s.photo} src={PHOTO} alt="" fill loading="eager" sizes={SIZES} />
              <div className={s.skyShade} />
            </div>
          </div>

          <div className={`${s.scene} ${s.light}`} aria-hidden="true">
            <div className={s.settle}><div className={s.sun} /></div>
          </div>
          <div className={s.shade} aria-hidden="true" />
          <div className={s.grain} aria-hidden="true" />

          <div className={s.foot}>
            <p className={s.lead}>{keepHyphens(lead)}</p>
            <p className={s.rest}>{rest}</p>
            <ul className={s.meta}>{meta}</ul>
            <div className={s.ctas}>
              <a className={s.apply} href={r.applyHref} target="_blank" rel="noopener noreferrer">
                {r.apply}<span className={s.arrow} aria-hidden="true">↗</span>{NEW_TAB}
              </a>
              <a className={s.talk} href={r.talkHref} target="_blank" rel="noopener noreferrer">
                {r.talk}{NEW_TAB}
              </a>
            </div>
          </div>

          <div className={s.cue} aria-hidden="true">
            <span>{r.hero.scrollCue}</span>
            <i />
          </div>
        </div>

        <div className={s.legend}>
          <div className={s.legendKanji} aria-hidden="true">{r.hero.kanji}</div>
          <div className={s.legendText}>
            <p className={s.legendEyebrow}>{r.legend.eyebrow}</p>
            <h2 className={s.legendHead}>{r.legend.headline}</h2>
            <div className={s.story}>
              <p>{story1}</p>
              <p>{story2}</p>
            </div>
            <p className={s.caption} aria-hidden="true">{caption}</p>
            <p className={s.close}>{close}</p>
            <p className={s.credit}>{r.credits}</p>
          </div>
        </div>
      </div>
    </>
  );
}
