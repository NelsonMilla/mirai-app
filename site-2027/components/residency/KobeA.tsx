'use client';
// Kobe · 神戸 (variant A, "Saucer"): week 4 in two places, day then night.
//
// Day: the meetings on Port Island as a calm cream sheet, ruled, with two prints (the
// supercomputer hall and a lab visit). The sheet ends on the route Port Island → Rokko
// Island and fades through dawn into night.
// Night: the Kobe Fashion Museum, the UFO building, full-bleed in a cinemascope frame (the
// loop, the saucer at night) with a cinema title card: venue line, DEMO DAY set huge, the
// building's name. The demo copy sits under the frame in a ruled row with the Play/Pause.
//
// One scroll-linked gesture: a slow push-in on the saucer while the frame crosses the
// viewport (--p 0→1 on the frame; transform only). Without JS or with reduced motion the
// frame rests at --p .5 and everything is in its finished state; JS only arms entrances
// for blocks that start below the fold, and plays the video while it is in view.
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { residency, type Residency } from '@/content/residency';
import photos from '@/content/photos-2026.json';
import kobePhotos from '@/content/photos-kobe.json';
import s from './KobeA.module.css';

type Photo = { src: string; w: number; h: number; alt: string; caption: string; focal: string };
const find = (list: Photo[], file: string) => {
  const p = list.find(ph => ph.src.endsWith(`/${file}`));
  if (!p) throw new Error(`KobeA: ${file} is missing from the photo manifest`);
  return p;
};
const HALL = find(photos, 'lab-supercomputer-01.webp');
const LAB = find(photos, 'lab-surgical-robot-01.webp');
const LOOP_STILL = find(kobePhotos, 'ufo-exterior-night-02.webp'); // same footage as the loop

const VIDEO = { wide: '/media/ufo-loop.mp4', small: '/media/ufo-loop-720.mp4', poster: '/media/ufo-loop-poster.jpg' };
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Entrance for a block that starts below the fold: armed only then, so the finished
// state is never hidden without JS and never flashes.
function useRise<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.armed = '';
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.dataset.in = '';
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Kobe({ r = residency }: { r?: Residency } = {}) {
  const k = r.kobe;
  // Alt text and captions in this page's language (English falls back to the manifest).
  const tx = (p: Photo) => {
    const t = r.photoText[p.src.slice(p.src.lastIndexOf('/') + 1, -'.webp'.length)];
    return { alt: t?.alt ?? p.alt, caption: t?.caption ?? p.caption };
  };
  const [from, to] = k.route.split(/\s*→\s*/);
  const titleId = useId();

  const sheet = useRise<HTMLDivElement>();
  const card = useRise<HTMLDivElement>();
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [canPlay, setCanPlay] = useState(false);
  const [paused, setPaused] = useState(false);

  // The push-in: --p runs 0→1 while the frame crosses the viewport.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)');
    let raf = 0;
    const paint = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      el.style.setProperty('--p', clamp01((vh - box.top) / (vh + box.height)).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const mode = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (!mq.matches) { el.style.removeProperty('--p'); return; }
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

  // Video: poster only for reduced motion or Save-Data; otherwise load and play in view.
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
        if (!v.getAttribute('src')) {
          v.src = window.matchMedia('(max-width: 760px)').matches ? VIDEO.small : VIDEO.wide;
        }
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

  const prints = [
    { p: HALL, cls: s.printHall, sizes: '(max-width: 759px) 88vw, (max-width: 999px) 44vw, 22vw' },
    { p: LAB, cls: s.printLab, sizes: '(max-width: 759px) 62vw, (max-width: 999px) 44vw, 22vw' },
  ];

  return (
    <section id="kobe" className={s.kobe} aria-labelledby={titleId}>
      <header className={s.head}>
        <div className={s.top}>
          <p className="kanjiMark"><b lang="ja">神戸</b><span>{r.marks.kobe}</span></p>
          <p className={s.eyebrow}>{k.eyebrow}</p>
        </div>
        <h2 id={titleId} className={s.headline}>{k.headline}</h2>
      </header>

      {/* Day: Port Island */}
      <div className={s.day}>
        <div className={s.sheet} ref={sheet}>
          <div className={s.meet}>
            <p className={s.place}>{k.meetings.place}</p>
            <h3 className={s.meetTitle}>{k.meetings.title}</h3>
            <p className={s.meetBody}>{k.meetings.body}</p>
          </div>
          <div className={s.prints}>
            {prints.map(({ p, cls, sizes }) => {
              const t = tx(p);
              return (
                <figure key={p.src} className={`${s.print} ${cls}`}>
                  <div className={`${s.printPhoto} grain`}>
                    <Image
                      className="grade"
                      src={p.src}
                      alt={t.alt}
                      width={p.w}
                      height={p.h}
                      sizes={sizes}
                      style={{ objectPosition: p.focal }}
                    />
                  </div>
                  {t.caption && <figcaption className={s.printCaption}>{t.caption}</figcaption>}
                </figure>
              );
            })}
          </div>
          <p className={s.route}>
            {to ? (
              <>
                <span>{from}</span>
                <i className={s.routeLine} aria-hidden="true" />
                <span className="sr-only">→</span>
                <span>{to}</span>
              </>
            ) : <span>{k.route}</span>}
          </p>
        </div>
        <div className={s.dusk} aria-hidden="true" />
      </div>

      {/* Night: Rokko Island, the UFO building */}
      <figure className={s.film}>
        <div className={`${s.frame} grain`} ref={frame}>
          <div className={s.plate}>
            <video
              ref={video}
              className={`${s.video} grade`}
              poster={VIDEO.poster}
              width={1920}
              height={1080}
              muted
              loop
              playsInline
              preload="none"
              aria-label={tx(LOOP_STILL).alt}
            />
          </div>
          <div className={s.shade} aria-hidden="true" />
          <div className={s.card} ref={card}>
            <p className={s.credit}>{k.venue.hall} · {k.venue.island}</p>
            <h3 className={s.demoTitle}>{k.demo.title}</h3>
            <p className={s.venue}>
              <span className={s.venueName}>{k.venue.name}</span>
              <span className={s.nick}>{k.venue.nickname}</span>
            </p>
          </div>
        </div>
        <figcaption className={s.below}>
          <div className={s.belowMeta}>
            <p className={s.place}>{k.demo.place}</p>
            {canPlay && (
              <button type="button" className={s.toggle} onClick={toggle} aria-pressed={paused}>
                {paused ? r.ui.play : r.ui.pause}
              </button>
            )}
          </div>
          <p className={s.demoBody}>{k.demo.body}</p>
        </figcaption>
      </figure>
    </section>
  );
}
