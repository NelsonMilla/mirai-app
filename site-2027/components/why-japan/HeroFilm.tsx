'use client';
// /why-japan hero film: a silent 6-second loop from Mirai's own 4K film of the Kobe Biomedical
// Innovation Cluster (shots and crops in public/media/kbic-loop.json). Same rules as the
// homepage's Cohort 0 loop: poster only with reduced motion or Save-Data (and without JS);
// otherwise load and play while in view, with a visible pause control.
import { useEffect, useRef, useState } from 'react';
import { residency } from '@/content/residency';
import { whyJapan as t } from '@/content/why-japan';
import s from './Hero.module.css';

const VIDEO = { wide: '/media/kbic-loop.mp4', small: '/media/kbic-loop-720.mp4', poster: '/media/kbic-loop-poster.jpg' };

export function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [canPlay, setCanPlay] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    v.muted = true;
    setCanPlay(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.getAttribute('src')) v.src = window.matchMedia('(max-width: 900px)').matches ? VIDEO.small : VIDEO.wide;
        if (!userPaused.current) v.play().catch(() => {});
      } else {
        v.pause();
      }
    }, { threshold: 0.2 });
    io.observe(v);
    return () => { io.disconnect(); v.pause(); };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    if (userPaused.current) v.pause();
    else v.play().catch(() => {});
  };

  return (
    <figure className={s.print}>
      <span className={`${s.plate} grain`}>
        <video ref={video} className={`grade ${s.img}`} poster={VIDEO.poster} width={1920} height={1080}
          muted loop playsInline preload="none" aria-label={t.film.label} />
        <span className={s.fade} aria-hidden="true" />
      </span>
      <figcaption className={`mono ${s.caption}`}>
        <span>{t.film.caption}</span>
        {canPlay && (
          <button type="button" className={s.toggle} onClick={toggle} aria-pressed={paused}>
            {paused ? residency.ui.play : residency.ui.pause}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
