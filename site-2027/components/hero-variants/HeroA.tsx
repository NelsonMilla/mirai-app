'use client';
// Variant A, "Maximal type": the letters are the hero. KOBE is a window onto the
// harbour (video multiplied through white type on black), and the year rolls 2026 → 2027.
import { useEffect, useRef } from 'react';
import { site, type Copy } from '@/content/site';
import speakers from '@/content/speakers-2026.json';
import s from './HeroA.module.css';

export function HeroA({ t = site }: { t?: Copy }) {
  const video = useRef<HTMLVideoElement>(null);

  // Same rule as the live hero: poster first, loop only on desktop, after load, when idle.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const skip = window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches
      || conn?.saveData || /2g/.test(conn?.effectiveType ?? '');
    if (skip) return;
    const start = () => {
      v.src = '/media/kobe_harbor_night.mp4';
      v.addEventListener('playing', () => v.classList.add(s.playing), { once: true });
      v.play().catch(() => {});
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    if (document.readyState === 'complete') idle(start);
    else window.addEventListener('load', () => idle(start), { once: true });
  }, []);

  const h = t.hero;
  return (
    <section className={s.hero} id="top">
      <span className={s.kanji} aria-hidden="true" lang="ja">未来</span>

      <p className={s.top}>
        <span className={s.eyebrow}>{h.eyebrow}</span>
        <span className={s.topMeta}>Port Island · Oct 1–31 · {speakers.length} speakers</span>
      </p>

      {/* KOBE: harbour footage shows only inside the letters. */}
      <div className={s.kobe} aria-hidden="true">
        {/* Kobe Harborland at night, Pexels (pexels.com/video/35145859), Pexels license. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.media} src="/media/kobe_harbor_night_poster.jpg" alt="" fetchPriority="high" decoding="async" />
        <video ref={video} className={`${s.media} ${s.video}`} muted loop playsInline preload="none" />
        <div className={s.knock}>
          {'KOBE'.split('').map((c, i) => <span key={i} style={{ animationDelay: `${i * 70}ms` }}>{c}</span>)}
        </div>
      </div>

      <div className={s.lower}>
        <div className={s.yearRow} aria-hidden="true">
          <span className={s.year}>
            202
            <span className={s.roll}>
              <span className={s.rollInner}>
                <span>6</span>
                <span className={s.seven}>7</span>
              </span>
            </span>
          </span>
          <span className={s.yearNotes}>
            <span><b>2026</b> Happened in Kobe</span>
            <span className={s.next}><b>2027</b> Coming back</span>
          </span>
        </div>
  
        <div className={s.base}>
          <h1 className={s.h1}>
            <span>{h.headline[0]}</span>
            <span>returns in <em>2027</em></span>
          </h1>
          <div className={s.actions}>
            <a className="btn accent" href={t.notifyHref}>{h.primary}</a>
            <a className="btn ghost" href="#2026">{h.secondary}</a>
          </div>
        </div>
      </div>

      <a className={s.cue} href="#2026">
        <span>Below: October 2026 in Kobe</span>
        <span className={s.arrow} aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
