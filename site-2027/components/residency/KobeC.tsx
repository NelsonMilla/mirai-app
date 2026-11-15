'use client';
// Kobe (神戸), variant C "Day to night": week 4 told as one day.
//
// Default (no JS, reduced motion, phones, short or narrow screens): a diptych. Day on the
// left (pale overcast panel: Port Island meetings, the lab and supercomputer prints), night
// on the right (the saucer at night, Demo Day). Phones stack the day block over the night
// block, split by one gold line.
// Wide screens with motion: the stage pins for 70vh. At first the whole frame is day: the
// meetings panel beside the UFO building in overcast daylight, looking up. Scrolling sweeps
// a gold terminator from left to right; behind it is night (the lit saucer video, full
// stage). The meetings copy flips from ink to cream as the line crosses it (a cream copy
// clipped by the same wipe), the daylight saucer turns into the lit one, and the Demo Day
// copy is uncovered last. One rAF scroll handler writes --p (0→1); CSS does the rest with
// transforms and opacity only.
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { residency, type Residency } from '@/content/residency';
import photos2026 from '@/content/photos-2026.json';
import photosKobe from '@/content/photos-kobe.json';
import s from './KobeC.module.css';

const find = <T extends { src: string }>(list: T[], file: string): T => {
  const p = list.find(ph => ph.src.endsWith(`/${file}`));
  if (!p) throw new Error(`KobeC: ${file} is missing from the photo manifests`);
  return p;
};
const COMPUTE = find(photos2026, 'lab-supercomputer-01.webp');
const LAB = find(photos2026, 'lab-surgical-robot-01.webp');
const DAY_UFO = find(photosKobe, 'ufo-exterior-day-01.webp');
// The loop is the same footage as this frame (manifest notes), so its alt describes the video.
const NIGHT_UFO = find(photosKobe, 'ufo-exterior-night-02.webp');
const VIDEO = { wide: '/media/ufo-loop.mp4', small: '/media/ufo-loop-720.mp4', poster: '/media/ufo-loop-poster.jpg' };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type Text = (p: { src: string; alt: string; caption: string }) => { alt: string; caption: string };

function Print({ p, tx, ghost, big }: { p: typeof LAB; tx: Text; ghost: boolean; big?: boolean }) {
  const { alt, caption } = tx(p);
  return (
    <figure className={`${s.print} ${big ? s.big : s.small}`}>
      <div className={`${s.printPhoto} grain`}>
        <Image
          className="grade"
          src={p.src}
          alt={ghost ? '' : alt}
          width={p.w}
          height={p.h}
          sizes={big ? '(max-width: 899px) 52vw, 300px' : '(max-width: 899px) 38vw, 216px'}
          style={{ objectPosition: p.focal }}
        />
      </div>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}

// The meetings panel. Drawn twice on wide screens with motion: once in ink on the day
// ground, once in cream (ghost, aria-hidden) inside the night wipe, pixel for pixel.
function Meetings({ r, tx, ghost = false }: { r: Residency; tx: Text; ghost?: boolean }) {
  const m = r.kobe.meetings;
  const Title = ghost ? 'p' : 'h3';
  return (
    <div className={s.panel}>
      <div className={s.prints}>
        <Print p={COMPUTE} tx={tx} ghost={ghost} big />
        <Print p={LAB} tx={tx} ghost={ghost} />
      </div>
      <div className={s.copy}>
        <p className={s.label}><span className={s.place}>{m.place}</span></p>
        <Title className={s.title}>{m.title}</Title>
        <p className={s.body}>{m.body}</p>
      </div>
    </div>
  );
}

export function Kobe({ r = residency }: { r?: Residency } = {}) {
  const k = r.kobe;
  const titleId = useId();
  // Alt text and captions in this page's language (English falls back to the manifest).
  const tx: Text = p => {
    const t = r.photoText[p.src.slice(p.src.lastIndexOf('/') + 1, -'.webp'.length)];
    return { alt: t?.alt ?? p.alt, caption: t?.caption ?? p.caption };
  };
  // Two display lines: split after the colon (":" in English, "：" in Japanese).
  const hm = k.headline.match(/^(.+?[:：])\s*([\s\S]*)$/);
  const [head1, head2] = hm ? [hm[1], hm[2]] : ['', k.headline];
  const [from, to] = k.route.split('→').map(t => t.trim());

  const track = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [canPlay, setCanPlay] = useState(false);
  const [paused, setPaused] = useState(false);

  // The sweep: wide screens with motion only. Writes --p on the track.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 1000px) and (min-height: 700px)');
    let raf = 0;
    let last = -1;
    const paint = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      const raw = span > 0 ? clamp01(-box.top / span) : 0;
      const t = clamp01((raw - 0.06) / 0.84); // a short hold on day, a longer one on night
      const p = t * t * (3 - 2 * t);
      if (p === last) return;
      last = p;
      el.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const mode = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      last = -1;
      if (!mq.matches) {
        delete el.dataset.motion;
        el.style.removeProperty('--p');
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

  // Video: poster only for reduced motion or Save-Data. Otherwise it loads and plays while
  // the night plate is visible (behind the wipe, that is only once night has arrived).
  useEffect(() => {
    const v = video.current;
    const box = plate.current;
    if (!v || !box) return;
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
    io.observe(box);
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
    <section id="kobe" className={s.kobe} aria-labelledby={titleId}>
      <div className={s.track} ref={track}>
        <div className={s.stage}>
          <header className={s.head}>
            <div className={s.mark}>
              <p className="kanjiMark"><b lang="ja">神戸</b><span>{r.marks.kobe}</span></p>
              <p className={s.eyebrow}>{k.eyebrow}</p>
            </div>
            {/* read once as one line; drawn as two */}
            <h2 id={titleId} className={s.headline}>
              <span className="sr-only">{k.headline}</span>
              {head1 && <span className={s.head1} aria-hidden="true">{head1}</span>}
              <span aria-hidden="true">{head2}</span>
            </h2>
          </header>

          {/* Day: Port Island. In motion, also the UFO building by daylight on the right. */}
          <div className={s.frame}>
            <div className={s.day}>
              <Meetings r={r} tx={tx} />
              <div className={`${s.dayPhoto} grain`} aria-hidden="true">
                <Image
                  className={`${s.dayImg} grade`}
                  src={DAY_UFO.src}
                  alt=""
                  width={DAY_UFO.w}
                  height={DAY_UFO.h}
                  sizes="(min-aspect-ratio: 16/9) 56vw, 76vw"
                />
                <div className={s.cool} />
              </div>
              <div className={s.dusk} aria-hidden="true" />
            </div>
            {/* the same panel in cream, revealed by the same wipe as the night */}
            <div className={s.inv} aria-hidden="true">
              <div className={s.invIn}>
                <Meetings r={r} tx={tx} ghost />
              </div>
            </div>
          </div>

          {/* Night: Rokko Island, the saucer lit, Demo Day */}
          <div className={s.night}>
            <div className={s.nightIn}>
              <div className={`${s.plate} grain`} ref={plate}>
                <div className={s.push}>
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
                    aria-label={tx(NIGHT_UFO).alt}
                  />
                </div>
                <div className={s.shade} aria-hidden="true" />
              </div>
              <div className={s.demo}>
                <p className={s.label}>
                  <span className={s.nick}>{k.venue.nickname}</span>
                  <span className={s.place}>{k.demo.place}</span>
                </p>
                <h3 className={s.title}>{k.demo.title}</h3>
                <p className={s.body}>{k.demo.body}</p>
              </div>
            </div>
          </div>

          {/* the terminator: a seam when still, the sweeping line in motion */}
          <div className={s.sweep} aria-hidden="true">
            <i className={s.ahead} />
            <i className={s.behind} />
            <i className={s.line} />
          </div>

          <div className={s.rail}>
            <div className={s.bar} aria-hidden="true">
              <i className={s.fill} />
              <i className={s.dot} />
            </div>
            <p className={s.ends}>
              <span>{from}</span>
              <span className="sr-only"> → </span>
              <span className={s.to}>{to}</span>
              {canPlay && (
                <button type="button" className={s.toggle} onClick={toggle} aria-pressed={paused}>
                  {paused ? r.ui.play : r.ui.pause}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
