'use client';
// Variant D, "Object": the daruma is the hero. One eye was painted in Kobe (2026);
// clicking the doll, or hovering / focusing the primary button, paints the second
// eye with a cyan brush stroke and the doll wobbles and rights itself (okiagari).
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import speakers from '@/content/speakers-2026.json';
import s from './HeroD.module.css';

export function HeroD() {
  const h = site.hero;
  const [painted, setPainted] = useState(false);
  const body = useRef<HTMLSpanElement>(null);

  const wobble = () => {
    const el = body.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.remove(s.wobble);
    void el.offsetWidth; // restart the animation
    el.classList.add(s.wobble);
  };
  const paint = () => {
    if (!painted) setPainted(true);
    wobble();
  };

  // One small wobble after load, so the eye reads as something that moves.
  useEffect(() => {
    const t = window.setTimeout(wobble, 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className={`${s.hero} ${painted ? s.isPainted : ''}`} id="top">
      <div className={s.beam} aria-hidden="true" />
      <div className={s.inner}>
        <figure className={s.object}>
          <div className={s.stage}>
            <button
              type="button"
              className={s.doll}
              onClick={paint}
              aria-pressed={painted}
              aria-label={painted ? 'Daruma doll with both eyes painted' : 'Paint the daruma’s second eye'}
            >
              <span ref={body} className={s.body} onAnimationEnd={() => body.current?.classList.remove(s.wobble)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/daruma.png" alt="" width={122} height={128} decoding="async" fetchPriority="high" />
                <svg className={s.eye} viewBox="0 0 122 128" aria-hidden="true">
                  {/* waiting outline: the empty eye */}
                  <circle className={s.wait} cx="39.6" cy="46.6" r="12.6" />
                  {/* one continuous brush stroke spiralling in to fill the iris */}
                  <path
                    className={s.stroke}
                    pathLength={1}
                    d="M45.5 39.6 C40 36.2 32.6 38.4 31.6 45 C30.6 51.6 35.4 55.4 40.4 54.6 C46.2 53.6 48.4 47.2 46 42.6 C43.6 38.6 37.4 39.6 36 44.4 C34.8 48.6 38.4 51 41.4 49.6 C43.6 48.4 43.4 45.2 41 45"
                  />
                  <circle className={s.pupil} cx="40" cy="46.8" r="3.4" />
                  <circle className={s.glint} cx="37" cy="43.6" r="1.5" />
                </svg>
              </span>
            </button>

            <p className={`${s.callout} ${s.calloutLeft}`} aria-hidden="true">
              <b>2027</b>
              <span className={s.state}>{painted ? 'Second eye' : 'Not painted yet'}</span>
            </p>
            <p className={`${s.callout} ${s.calloutRight}`} aria-hidden="true">
              <b>2026</b>
              <span className={s.state}>Painted in Kobe</span>
            </p>
          </div>
          <figcaption className={s.plaque}>
            {painted ? 'Daruma · both eyes painted' : 'Tap the doll to paint the second eye'}
          </figcaption>
        </figure>

        <div className={s.text}>
          <p className="eyebrow">{h.eyebrow}</p>
          <h1 className={s.h1}>
            {h.headline.map(line => <span key={line}>{line}</span>)}
          </h1>
          <p className={s.custom}>
            A daruma doll gets one eye painted when you make a wish, and the second when it comes true.
            We painted the first in Kobe in October 2026.
          </p>
          <ul className={s.facts}>
            <li>Port Island, Kobe</li>
            <li>Oct 1–31, 2026</li>
            <li>2 summits</li>
            <li>{speakers.length} speakers</li>
            <li>Demo Day</li>
          </ul>
          <div className={s.actions}>
            <a
              className={`btn accent ${s.primary}`}
              href={site.notifyHref}
              onMouseEnter={paint}
              onFocus={paint}
            >
              {h.primary}
            </a>
            <a className={s.secondary} href="#2026">{h.secondary}</a>
          </div>
        </div>
      </div>
      <a className={s.continue} href="#2026">
        <span>The 2026 recap</span>
        <span className={s.arrow} aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
