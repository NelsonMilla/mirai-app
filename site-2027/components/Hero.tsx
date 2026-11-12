'use client';
// Homepage hero: a six-shot trailer of 2026 above a fixed lower third (eyebrow, headline,
// the 2027 line, two buttons). Chosen in the Nov 4 2026 hero round (variant E: trailer +
// 2026 → 2027 digit roll + a speakers-faces shot). The reel is decorative; the lower third
// never moves, so the offer is always readable. Copy and shots live in content/site.ts
// (hero.shots); 2027 is described as Japan only, never Kobe.
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { site, type Copy } from '@/content/site';
import s from './Hero.module.css';

const SHOT_MS = 3600;

// Faces for the speakers shot: headliners first, then alphabetical. Joe Betts-LaCroix is
// left out of this grid entirely, so he can never land beside Aubrey de Grey / LEV.
function faceList(t: Copy) {
  const byId = new Map(t.speakers.list.map(p => [p.id, p]));
  const top = t.speakers.headliners.map(id => byId.get(id)).filter(p => p !== undefined);
  const rest = t.speakers.list.filter(p => !t.speakers.headliners.includes(p.id));
  return [...top, ...rest].filter(p => p.photo && p.id !== 'joe_betts_lacroix').slice(0, 32);
}

const tc = (ms: number) => `00:${String(Math.floor(ms / 1000)).padStart(2, '0')}`;

export function Hero({ t = site }: { t?: Copy }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const SHOTS = t.hero.shots;
  const END = SHOTS.length - 1;
  const TOTAL_MS = SHOTS.length * SHOT_MS;
  const people = SHOTS.some(x => x.src === 'faces') ? faceList(t) : [];

  // Reduced motion: start paused on the end card. The viewer can still press Play.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      setUserPaused(true);
      setElapsed(END * SHOT_MS);
    }
  }, [END]);

  // Pause the clock while the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const vis = () => setOffscreen(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  const running = !userPaused && !offscreen;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed(e => (e + 100) % TOTAL_MS), 100);
    return () => window.clearInterval(id);
  }, [running, TOTAL_MS]);

  // Harbour video: desktop only, after load, when idle (same rule as Hero.tsx).
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

  useEffect(() => {
    const v = video.current;
    if (!v || !v.src) return;
    if (running) v.play().catch(() => {}); else v.pause();
  }, [running]);

  const i = Math.floor(elapsed / SHOT_MS);
  const within = (elapsed % SHOT_MS) / SHOT_MS;
  const jump = (n: number) => setElapsed(n * SHOT_MS);
  const h = t.hero;
  const [line1, line2] = h.headline;
  // "returns in 2027" → "returns in 202" + rolling digit, when the line ends in 2027.
  const flipMatch = line2.match(/^(.*202)7$/);

  return (
    <section ref={root} className={`${s.hero}${running ? '' : ` ${s.paused}`}`} id="top" aria-label="Mirai Tech City 2026 trailer">
      {/* The reel. Decorative: everything it says is also in the lower third or the recap. */}
      <div className={s.reel} aria-hidden="true">
        {SHOTS.map((shot, n) => (
          <div key={n} className={`${s.shot}${n === i ? ` ${s.on}` : ''}`}>
            {shot.src === 'video' ? (
              <>
                {/* Kobe Harborland at night, Pexels (pexels.com/video/35145859), Pexels license. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={s.media} src="/media/kobe_harbor_night_poster.jpg" alt="" fetchPriority="high" decoding="async" />
                <video ref={video} className={`${s.media} ${s.video}`} muted loop playsInline preload="none" />
              </>
            ) : shot.src === 'faces' ? (
              <div className={s.faces}>
                {people.map((p, k) => (
                  <span key={p.id} style={{ animationDelay: `${(k % 8) * 40 + Math.floor(k / 8) * 60}ms` }}>
                    <Image src={p.photo!} alt="" fill sizes="(max-width: 700px) 25vw, 12.5vw" quality={60} />
                  </span>
                ))}
              </div>
            ) : (
              <Image className={s.media} src={shot.src} alt="" fill sizes="100vw" quality={70} />
            )}
          </div>
        ))}
        <div className={s.veil} />
        <div key={`flash-${i}`} className={s.flash} />
      </div>

      {/* Title card for the current shot. */}
      <div className={s.cardWrap} aria-hidden="true">
        {SHOTS.map((shot, n) => (
          <div key={n} className={`${s.card}${n === i ? ` ${s.on}` : ''}${n === END ? ` ${s.end}` : ''}`}>
            <p className={s.kicker}>{shot.kicker}</p>
            <p className={s.title}>{shot.lines.map(l => <span key={l}>{l}</span>)}</p>
            {shot.sub && <p className={s.sub}>{shot.sub}</p>}
          </div>
        ))}
      </div>

      {/* Persistent lower third: the claim and the buttons, never hidden by the reel. */}
      <div className={s.lower}>
        <div className={s.claim}>
          <p className="eyebrow">{h.eyebrow}</p>
          <h1 className={s.h1} aria-label={`${line1} ${line2}`}>
            <span aria-hidden="true">{line1}</span>
            {flipMatch ? (
              <span className={s.accent} aria-hidden="true">
                {flipMatch[1]}
                <span className={s.roller}><span><span className={s.was}>6</span><span>7</span></span></span>
              </span>
            ) : (
              <span className={s.accent} aria-hidden="true">{line2}</span>
            )}
          </h1>
          <p className={s.next}>{h.next}</p>
          <div className={s.actions}>
            <a className="btn accent" href={t.notifyHref}>{h.primary}</a>
            <a className="btn ghost" href="#2026">{h.secondary}</a>
          </div>
        </div>

        <div className={s.deck}>
          <div className={s.readout}>
            <span className={s.rec} aria-hidden="true" />
            <span>SC {String(i + 1).padStart(2, '0')}/{String(SHOTS.length).padStart(2, '0')}</span>
            <span className={s.place}>{SHOTS[i].place}</span>
            <span className={s.time}>{tc(elapsed)} / {tc(TOTAL_MS)}</span>
          </div>
          <div className={s.controls}>
            <button type="button" className={s.pause} onClick={() => setUserPaused(p => !p)}
              aria-pressed={userPaused} aria-label={userPaused ? 'Play the trailer' : 'Pause the trailer'}>
              <span aria-hidden="true">{userPaused ? '▶' : '❚❚'}</span>
              {userPaused ? 'Play' : 'Pause'}
            </button>
            <ol className={s.chapters} aria-label="Trailer shots">
              {SHOTS.map((shot, n) => (
                <li key={n}>
                  <button type="button" className={s.chapter} onClick={() => jump(n)}
                    aria-label={`Shot ${n + 1}: ${shot.place}`} aria-current={n === i ? 'step' : undefined}>
                    <span className={s.fill}
                      style={{ transform: `scaleX(${n < i ? 1 : n === i ? (reduced && userPaused ? 1 : within) : 0})` }} />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <a className={s.bar} href="#2026">
        <span>{h.cue}</span>
        <span className={s.arrow} aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
