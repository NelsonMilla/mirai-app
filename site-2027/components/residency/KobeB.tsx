'use client';
// Week 4 · Kobe, variant B "Transit diagram". Chapter mark 神戸.
//
// Kobe's two man-made islands drawn as a transit diagram: hairline shores, hatched land,
// a gold route from the Kobe Biomedical Innovation Cluster stop on Port Island to a
// terminal on Rokko Island drawn as a small saucer. Under each island hangs its print:
// the supercomputer hall (meetings) and, large, the saucer itself at night (Demo Day).
// On wide screens the terminal's leader line drops straight into the photograph and
// ends on the real saucer, at the same x as the glyph.
//
// Default (no JS, reduced motion): everything drawn and visible. With motion, ONE scroll
// gesture: the route draws itself as the map crosses the viewport (--p, 0→1, applied by
// CSS as per-segment scale transforms). Two time-based entrances are latched on the way:
// [data-a] the Port Island print, [data-b] arrival at the terminal: the leader drops,
// the dark frame develops into the night film.
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { residency, type Residency } from '@/content/residency';
import photos from '@/content/photos-2026.json';
import kobePhotos from '@/content/photos-kobe.json';
import s from './KobeB.module.css';

type Pt = readonly [number, number];
type Photo = { src: string; w: number; h: number; alt: string; caption: string; focal: string };

const find = (list: Photo[], file: string) => {
  const p = list.find(ph => ph.src.endsWith(`/${file}`));
  if (!p) throw new Error(`KobeB: ${file} is missing from the photo manifest`);
  return p;
};
const LAB = find(photos, 'lab-supercomputer-01.webp');
const LOOP = find(kobePhotos, 'ufo-exterior-night-02.webp'); // same footage as the loop
const VIDEO = { wide: '/media/ufo-loop.mp4', small: '/media/ufo-loop-720.mp4', poster: '/media/ufo-loop-poster.jpg' };

// ── the diagram ─────────────────────────────────────────────
// Schematic, not to scale: 90°/45° shores, north up. Land is hatched, water is night.
type Geo = {
  w: number; h: number;
  land: Pt[]; coast: Pt[]; port: Pt[]; rokko: Pt[];
  route: Pt[]; // KBIC → terminal
  kbic: Pt; ufo: Pt;
  leader?: [Pt, Pt]; // wide only: terminal → bottom edge (continues in the photo)
  north?: Pt;
  at: { port: Pt; rokko: Pt; route: Pt; kbic?: Pt; ufo?: Pt };
};

// Wide: the terminal sits at x = 65.08% of the column, which is where the saucer lands
// in the photo below (photo column starts at 36%, saucer at 45.44% of it).
const WIDE: Geo = {
  w: 1200, h: 270,
  land: [[0, 0], [1200, 0], [1200, 58], [452, 58], [424, 86], [0, 86]],
  coast: [[0, 86], [424, 86], [452, 58], [1200, 58]],
  port: [[156, 112], [234, 112], [250, 128], [250, 160], [314, 160], [330, 176], [330, 234], [314, 250], [86, 250], [70, 234], [70, 176], [86, 160], [140, 160], [140, 128]],
  rokko: [[646, 96], [914, 96], [930, 112], [930, 220], [914, 236], [646, 236], [630, 220], [630, 112]],
  route: [[196, 208], [196, 62], [224, 34], [753, 34], [781, 62], [781, 147]],
  kbic: [196, 208],
  ufo: [781, 160],
  leader: [[781, 177], [781, 270]],
  north: [1176, 14],
  at: { port: [86, 243], rokko: [646, 229], route: [488, 27], kbic: [214, 200], ufo: [808, 151] },
};

const NARROW: Geo = {
  w: 340, h: 236,
  land: [[0, 0], [340, 0], [340, 52], [170, 52], [150, 72], [0, 72]],
  coast: [[0, 72], [150, 72], [170, 52], [340, 52]],
  port: [[60, 92], [94, 92], [104, 102], [104, 128], [136, 128], [146, 138], [146, 202], [136, 212], [26, 212], [16, 202], [16, 138], [26, 128], [50, 128], [50, 102]],
  rokko: [[204, 80], [316, 80], [326, 90], [326, 196], [316, 206], [204, 206], [194, 196], [194, 90]],
  route: [[77, 172], [77, 44], [95, 26], [242, 26], [260, 44], [260, 135]],
  kbic: [77, 172],
  ufo: [260, 148],
  at: { port: [26, 205], rokko: [204, 199], route: [168, 19] },
};

const path = (pts: Pt[], close = false) => `M${pts.map(p => p.join(' ')).join(' L')}${close ? ' Z' : ''}`;

// Segment i of a route covers [t0, t0 + dt] of the whole drawing (by length).
function segments(route: Pt[]) {
  const lens = route.slice(1).map((b, i) => Math.hypot(b[0] - route[i][0], b[1] - route[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  return lens.map((len, i) => {
    const seg = { a: route[i], b: route[i + 1], t0: acc / total, dt: len / total };
    acc += len;
    return seg;
  });
}
const SEGS = { wide: segments(WIDE.route), narrow: segments(NARROW.route) };

function pointAt(segs: ReturnType<typeof segments>, p: number): Pt {
  for (const g of segs) {
    if (p <= g.t0 + g.dt) {
      const k = Math.max(0, (p - g.t0) / g.dt);
      return [g.a[0] + (g.b[0] - g.a[0]) * k, g.a[1] + (g.b[1] - g.a[1]) * k];
    }
  }
  return segs[segs.length - 1].b;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(3)}%`;
type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

// The saucer glyph: inverted cone, lit rim, a short column, ground line. Centred on (0, 0).
function Saucer({ className }: { className?: string }) {
  return (
    <g className={className}>
      <path className={s.cone} d="M-18 -5 L18 -5 L6 6 L-6 6 Z" />
      <ellipse className={s.rim} cx="0" cy="-5" rx="18" ry="3.2" />
      <rect className={s.column} x="-3" y="6" width="6" height="7" />
      <path className={s.ground} d="M-12 13.5 H12" />
    </g>
  );
}

function Diagram({ geo, kind, labels, hatchId }: {
  geo: Geo; kind: 'wide' | 'narrow'; hatchId: string;
  labels: { port: string; rokko: string; route: string; kbic: string; ufo: string };
}) {
  const at = (p: Pt, anchor: 'top' | 'bottom' = 'top'): React.CSSProperties =>
    anchor === 'top'
      ? { left: pct(p[0], geo.w), top: pct(p[1], geo.h) }
      : { left: pct(p[0], geo.w), bottom: pct(geo.h - p[1], geo.h) };
  return (
    <div className={`${s.map} ${s[kind]}`} data-map={kind} role="img" aria-label={labels.route}>
      <svg viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true" focusable="false">
        <defs>
          <pattern id={hatchId} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line className={s.hatchLine} x1="0" y1="0" x2="0" y2="7" />
          </pattern>
        </defs>
        {/* land: mainland and the two islands, hatched; shores as hairlines */}
        <path d={path(geo.land, true)} fill={`url(#${hatchId})`} />
        <path d={path(geo.port, true)} fill={`url(#${hatchId})`} />
        <path d={path(geo.rokko, true)} fill={`url(#${hatchId})`} />
        <path className={s.shore} d={path(geo.coast)} />
        <path className={`${s.shore} ${s.island}`} d={path(geo.port, true)} />
        <path className={`${s.shore} ${s.island}`} d={path(geo.rokko, true)} />

        {geo.north && (
          <g className={s.north} transform={`translate(${geo.north[0]} ${geo.north[1]})`}>
            <path d="M0 0 L5 12 L0 9 L-5 12 Z" />
            <text x="0" y="26" textAnchor="middle">N</text>
          </g>
        )}

        {/* the route, one line per segment so it can draw itself with transforms */}
        <g className={s.route}>
          {SEGS[kind].map(g => (
            <line
              key={`${g.a}-${g.b}`}
              className={s.seg}
              x1={g.a[0]} y1={g.a[1]} x2={g.b[0]} y2={g.b[1]}
              style={{ '--t0': g.t0.toFixed(4), '--dt': g.dt.toFixed(4), transformOrigin: `${g.a[0]}px ${g.a[1]}px` } as CSSVars}
            />
          ))}
        </g>

        {geo.leader && (
          <line className={s.leader} x1={geo.leader[0][0]} y1={geo.leader[0][1]} x2={geo.leader[1][0]} y2={geo.leader[1][1]} />
        )}

        {/* stop: Kobe Biomedical Innovation Cluster */}
        <g transform={`translate(${geo.kbic[0]} ${geo.kbic[1]})`}>
          <circle className={s.stopRing} r="8" />
          <circle className={s.stopDot} r="3.4" />
        </g>

        {/* terminal: the UFO building */}
        <g transform={`translate(${geo.ufo[0]} ${geo.ufo[1]})`}>
          <circle className={s.halo} r="26" />
          <Saucer className={s.ufoMark} />
        </g>

        {/* the head of the line while it draws */}
        <g className={s.head}>
          <circle className={s.headGlow} r="11" />
          <circle className={s.headDot} r="4" />
        </g>
      </svg>

      <span className={`${s.label} ${s.islandName}`} style={at(geo.at.port, 'bottom')}>{labels.port}</span>
      <span className={`${s.label} ${s.islandName}`} style={at(geo.at.rokko, 'bottom')}>{labels.rokko}</span>
      <span className={`${s.label} ${s.routeName}`} style={at(geo.at.route, 'bottom')}>{labels.route}</span>
      {geo.at.kbic && <span className={`${s.label} ${s.stopName}`} style={at(geo.at.kbic)}>{labels.kbic}</span>}
      {geo.at.ufo && <span className={`${s.label} ${s.stopName} ${s.ufoName}`} style={at(geo.at.ufo)}>{labels.ufo}</span>}
    </div>
  );
}

// Small markers repeated in front of each stop's copy.
const StopIcon = () => (
  <svg className={s.icon} viewBox="-10 -10 20 20" aria-hidden="true" focusable="false">
    <circle className={s.stopRing} r="7" />
    <circle className={s.stopDotStatic} r="3" />
  </svg>
);
const UfoIcon = () => (
  <svg className={`${s.icon} ${s.iconUfo}`} viewBox="-20 -10 40 26" aria-hidden="true" focusable="false">
    <Saucer />
  </svg>
);

export function Kobe({ r = residency }: { r?: Residency } = {}) {
  const k = r.kobe;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const titleId = `kobe-title-${uid}`;
  // Alt text in this page's language (English falls back to the manifest).
  const tx = (p: Photo) => {
    const t = r.photoText[p.src.slice(p.src.lastIndexOf('/') + 1, -'.webp'.length)];
    return { alt: t?.alt ?? p.alt, caption: t?.caption ?? p.caption };
  };
  // "Port Island · Kobe Biomedical Innovation Cluster" → island, stop ("・" in Japanese).
  const split = (place: string) => {
    const m = place.match(/^(.+?)\s*[·・]\s*(.+)$/);
    return m ? [m[1], m[2]] : [place, place];
  };
  const [portName, kbicName] = split(k.meetings.place);
  const labels = { port: portName, rokko: k.venue.island, route: k.route, kbic: kbicName, ufo: k.venue.name };
  // Two display lines: split after the colon ("：" in Japanese).
  const hm = k.headline.match(/^(.+?[:：])\s*([\s\S]*)$/);
  const [head1, head2] = hm ? [hm[1], hm[2]] : [k.headline, ''];

  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [canPlay, setCanPlay] = useState(false);
  const [paused, setPaused] = useState(false);

  // The one scroll gesture: route progress from the map's position, plus two latches.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const maps = Array.from(el.querySelectorAll<HTMLElement>('[data-map]'));
    const print = el.querySelector<HTMLElement>('[data-print]');
    const panel = el.querySelector<HTMLElement>('[data-panel]');
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)');
    let raf = 0;

    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      const map = maps.find(m => m.offsetWidth > 0);
      if (!map) return;
      // Starts as the map's top passes 75% of the viewport, done at 15%.
      const p = clamp01((vh * 0.75 - map.getBoundingClientRect().top) / (vh * 0.6));
      el.style.setProperty('--p', p.toFixed(4));
      const kind = map.dataset.map as 'wide' | 'narrow';
      const [hx, hy] = pointAt(SEGS[kind], p);
      map.style.setProperty('--hx', hx.toFixed(1));
      map.style.setProperty('--hy', hy.toFixed(1));
      if (!('a' in el.dataset) && print && print.getBoundingClientRect().top < vh * 0.88) el.dataset.a = '';
      if (!('b' in el.dataset) && p > 0.995 && panel && panel.getBoundingClientRect().top < vh * 0.72) el.dataset.b = '';
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const mode = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (!mq.matches) {
        delete el.dataset.motion;
        delete el.dataset.a;
        delete el.dataset.b;
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

  return (
    <section id="kobe" ref={root} className={s.kobe} aria-labelledby={titleId}>
      <header className={s.top}>
        <p className="kanjiMark"><b lang="ja">神戸</b><span>{r.marks.kobe}</span></p>
        <p className={s.eyebrow}>{k.eyebrow}</p>
      </header>
      <h2 id={titleId} className={s.headline}>
        <span className="sr-only">{k.headline}</span>
        <span aria-hidden="true"><span>{head1}</span> <span className={s.headline2}>{head2}</span></span>
      </h2>

      <Diagram geo={WIDE} kind="wide" labels={labels} hatchId={`kobe-hatch-w-${uid}`} />
      <Diagram geo={NARROW} kind="narrow" labels={labels} hatchId={`kobe-hatch-n-${uid}`} />

      <div className={s.row}>
        {/* Port Island · meetings */}
        <div className={s.stopA}>
          <div className={`${s.print} grain`} data-print>
            <Image
              className="grade"
              src={LAB.src}
              alt={tx(LAB).alt}
              width={LAB.w}
              height={LAB.h}
              sizes="(max-width: 1023px) 88vw, 31vw"
              style={{ objectPosition: '50% 44%' }}
            />
          </div>
          <div className={s.copy}>
            <p className={s.place}><StopIcon />{k.meetings.place}</p>
            <h3 className={s.title}>{k.meetings.title}</h3>
            <p className={s.body}>{k.meetings.body}</p>
          </div>
        </div>

        {/* Rokko Island · Demo Day: the saucer, large */}
        <div className={s.stopB}>
          <div className={`${s.panel} grain`} data-panel>
            <div className={s.media}>
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
                aria-label={tx(LOOP).alt}
              />
            </div>
            <div className={s.shade} aria-hidden="true" />
            <div className={s.veil} aria-hidden="true" />
            {/* the glyph's saucer, blown up over the real one: the frame develops through it */}
            <svg className={s.ghost} viewBox="-18.6 -8.8 37.2 15.4" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path className={s.cone} d="M-18 -5 L18 -5 L6 6 L-6 6 Z" />
              <ellipse className={s.rim} cx="0" cy="-5" rx="18" ry="3.2" />
            </svg>
            <span className={s.drop} aria-hidden="true" />
            <span className={s.ring} aria-hidden="true" />
            <p className={s.callout} aria-hidden="true"><b>{k.venue.nickname}</b><span>{k.venue.hall}</span></p>
          </div>
          <div className={`${s.copy} ${s.demoCopy}`}>
            <div className={s.placeRow}>
              <p className={s.place}><UfoIcon />{k.demo.place}</p>
              {canPlay && (
                <button type="button" className={s.toggle} onClick={toggle} aria-pressed={paused}>
                  {paused ? r.ui.play : r.ui.pause}
                </button>
              )}
            </div>
            <h3 className={`${s.title} ${s.demoTitle}`}>{k.demo.title}</h3>
            <p className={s.body}>{k.demo.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
