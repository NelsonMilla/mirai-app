'use client';
// Residency 2027 opening. Winner of the Nov 12 2026 opening round (lab A, "Monument"),
// with one graft from each runner-up: the Diamond Fuji sun (D), the summit survey mark and
// hanko seal (B), and the vertical 不死 that fills with ink in the legend (C).
//
// The photograph is drawn twice, identically shaded. The back copy is the sky; the front
// copy is masked to everything below the ridge line (traced from the photo), so FUJI, and
// the sun, sit *behind* the mountain. Scroll sets the word behind the ridge while the sun
// rises on the summit (and the photo's own sun on the left dims, so one light source reads
// at a time), then the legend arrives: beside the mountain on wide screens, as a
// stacked block that slides over it on narrow ones.
// Without JS or with reduced motion, it is two still frames: the hero, then the legend.
import { useEffect, useRef } from 'react';
import { residency, type Residency } from '@/content/residency';
import s from './Opening.module.css';

// 1600×1063, CC BY 2.0 (credit in r.credits, shown in the legend). The only source we have,
// so it is served as-is at full width (fetchpriority=high) instead of through the resizer.
const PHOTO = '/img/fuji/fuji-dawn.webp';
// Keep "one-month", "early-stage" whole when the line wraps.
const keepHyphens = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className={s.nb}>{part}</span> : part));

// Width of the giant word in em (Switzer 900, uppercase, −.04em tracking), measured in the
// browser. The word's size, the line above it and the seal are placed from this. When
// hero.word changes, measure the new word and add it here; others get a wide estimate.
const WORD_EM: Record<string, number> = { FUJI: 1.996, JAPAN: 3.108 };
const wordEm = (word: string) => WORD_EM[word.toUpperCase()] ?? word.length * 0.66;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t: number) => 1 - Math.pow(1 - t, 3);
const VARS = ['--zoom', '--sink', '--copy', '--sun', '--survey', '--dark', '--legend', '--fill'];

export function Opening({ r = residency }: { r?: Residency } = {}) {
  const NEW_TAB = <span className={s.sr}> {r.newTab}</span>;
  const SURVEY = r.hero.survey;
  const pre = r.hero.pre; // "Build Your Biotech Startup in"
  const word = r.hero.word; // "Japan"
  // First sentence vs the rest; works for ". " (English) and "。" (Japanese).
  const m = r.hero.sub.match(/^(.+?[.。])\s*([\s\S]*)$/);
  const lead = m ? m[1] : r.hero.sub;
  const rest = m ? m[2] : '';
  const [story1, story2, close] = r.legend.paragraphs;
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const legend = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current, st = stage.current, lg = legend.current;
    if (!el || !st || !lg) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 900px)');
    let raf = 0;

    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const overlay = el.dataset.motion === 'overlay';
      // overlay: the whole track; stacked: the spacer before the legend slides in
      const span = overlay ? el.offsetHeight - vh : lg.offsetTop - st.offsetHeight;
      const p = clamp01(-top / Math.max(1, span));
      const seg = (a: number, b: number) => clamp01((p - a) / (b - a));
      const set = (k: string, v: number) => el.style.setProperty(k, v.toFixed(4));
      // The offer fades with --copy; once gone it must not catch clicks (CSS: [data-faded]).
      const fade = (v: number) => { set('--copy', v); if (v < 0.05) el.dataset.faded = ''; else delete el.dataset.faded; };
      set('--zoom', 1 + 0.12 * inOut(p));
      if (overlay) {
        fade(1 - seg(0, 0.12));
        set('--sink', inOut(seg(0.02, 0.36)));
        set('--sun', out(seg(0.1, 0.5)));
        set('--survey', seg(0.16, 0.28));
        set('--dark', inOut(seg(0.4, 0.72)));
        set('--legend', out(seg(0.48, 0.76)));
        set('--fill', seg(0.58, 0.94));
      } else {
        fade(1 - seg(0, 0.16));
        set('--sink', inOut(seg(0.02, 0.5)));
        set('--sun', out(seg(0.14, 0.75)));
        set('--survey', seg(0.22, 0.4));
        const lt = lg.getBoundingClientRect().top;
        set('--fill', clamp01((vh * 0.55 - lt) / (vh * 0.5)));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const mode = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      VARS.forEach(v => el.style.removeProperty(v));
      if (reduce.matches) { delete el.dataset.motion; return; }
      el.dataset.motion = wide.matches ? 'overlay' : 'stacked';
      paint();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    };
    mode();
    reduce.addEventListener('change', mode);
    wide.addEventListener('change', mode);
    return () => {
      reduce.removeEventListener('change', mode);
      wide.removeEventListener('change', mode);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={s.track} id="top" ref={track}>
      <div className={s.stage} ref={stage} style={{ '--wem': wordEm(word) } as React.CSSProperties}>
        {/* back: the whole photograph (sky) */}
        <div className={`${s.scene} ${s.back}`}>
          <div className={s.settle}>
            {/* eslint-disable-next-line @next/next/no-img-element -- full-width original, see PHOTO */}
            <img className={s.photo} src={PHOTO} alt={r.fujiAlt} width={1600} height={1063} fetchPriority="high" />
            <div className={s.skyShade} aria-hidden="true" />
            <div className={s.sunDim} aria-hidden="true" />
          </div>
        </div>

        {/* between the two photos: everything that sits behind the mountain */}
        <div className={`${s.scene} ${s.dawn}`} aria-hidden="true">
          <div className={s.settle}><div className={s.disc} /></div>
        </div>
        <h1 className={s.title}>
          <span className={s.sr}>{`${pre} ${word}`}</span>
          <span className={s.pre} aria-hidden="true"><span>{pre}</span></span>
          <span className={s.word} aria-hidden="true">
            {word.split('').map((ch, i, all) => (
              <span key={i} className={s.letter} style={{ '--i': i - (all.length - 1) / 2 } as React.CSSProperties}>
                <span className={s.glyph}>{ch}</span>
              </span>
            ))}
          </span>
        </h1>

        {/* front: the same photograph, masked to the mountain, the trees and the lake */}
        <div className={`${s.scene} ${s.front}`} aria-hidden="true">
          <div className={s.settle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.photo} src={PHOTO} alt="" width={1600} height={1063} fetchPriority="high" />
            <div className={s.skyShade} />
            <div className={s.sunDim} />
          </div>
        </div>

        {/* light: the dawn grade, the real sun on the left (fades as the summit sun rises),
            the Diamond Fuji glow on the summit */}
        <div className={s.warm} aria-hidden="true" />
        <div className={`${s.scene} ${s.light}`} aria-hidden="true">
          <div className={s.settle}>
            <div className={s.sun} />
            <div className={s.bloom} />
          </div>
        </div>
        <div className={s.shade} aria-hidden="true" />
        <div className={s.grain} aria-hidden="true" />

        <p className={s.survey}>
          <span>{SURVEY[0]}</span><span className={s.sep} aria-hidden="true"> · </span><span>{SURVEY[1]}</span>
        </p>
        <span className={s.seal} aria-hidden="true">{r.hero.kanji}</span>

        <div className={s.foot}>
          <p className={s.lead}>{keepHyphens(lead)}</p>
          <p className={s.rest}>{rest}</p>
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

      <div className={s.legend} ref={legend}>
        <div className={s.legendIn}>
          <div className={s.fushi} aria-hidden="true">
            <span className={s.fushiLine}>{r.hero.kanji}</span>
            <span className={s.fushiInk}>{r.hero.kanji}</span>
          </div>
          <p className={s.legendEyebrow}>{r.legend.eyebrow}</p>
          <h2 className={s.legendHead}>{r.legend.headline}</h2>
          <div className={s.story}>
            <p>{story1}</p>
            <p>{story2}</p>
          </div>
          <p className={s.close}>{close}</p>
          <p className={s.credit}>{r.credits} <a href={r.creditLinks.source} target="_blank" rel="noopener">{r.ui.source}</a> · <a href={r.creditLinks.license} target="_blank" rel="noopener">CC BY 2.0</a></p>
        </div>
      </div>
    </div>
  );
}
