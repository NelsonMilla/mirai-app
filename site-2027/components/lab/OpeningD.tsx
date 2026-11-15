'use client';

// Variant D · Atmosphere (after monopo London).
// The sky is the hero: a living pre-dawn field over Fuji that turns to sunrise as you
// scroll, ending with the sun on the summit and the legend. A glass lens rests above
// the summit showing 不死; it follows the cursor (or a tap) and reveals the Japanese
// layer under the English headline. First paint is a static CSS + SVG frame; the
// WebGL sky fades in over it and the CSS frame stays as the no-WebGL fallback.

import { useEffect, useRef, type CSSProperties } from 'react';
import { Noto_Serif_JP } from 'next/font/google';
import { residency } from '@/content/residency';
import { createSky, type FujiBox } from './OpeningD.gl';
import s from './OpeningD.module.css';

const serifJP = Noto_Serif_JP({
  weight: '600',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-jp-d',
});

const { hero, legend } = residency;
const CLAIM = hero.claims[0]; // "A month at Mount Fuji"
const SPLIT = CLAIM.indexOf('Mount');
const LINE_1 = SPLIT > 0 ? CLAIM.slice(0, SPLIT).trim() : CLAIM;
const LINE_2 = SPLIT > 0 ? CLAIM.slice(SPLIT) : '';
// "不死, fushi, without death", lifted from the legend so no new words are introduced.
const FUSHI = legend.paragraphs[1].match(/不死[^.]*/)?.[0] ?? hero.kanji;
const FUSHI_GLOSS = FUSHI.replace(/^不死,\s*/, '');
const ROUTE_EN = hero.meta[1]; // "Mount Fuji → Kobe"
const ROUTE_JP = `${residency.month.stages[0].kanji} → ${residency.month.stages[1].kanji}`; // 富士 → 神戸

// Fuji's profile, shared with the shader: flat crater, concave flanks. xn ∈ [-1, 1] → 0..1.
function profile(xn: number) {
  const d = Math.abs(xn);
  const dd = Math.max(d - 0.05, 0) / 0.95;
  let h = Math.pow(Math.max(1 - dd, 0), 1.7);
  const t = Math.min(d / 0.05, 1);
  h -= 0.008 * (1 - t * t * (3 - 2 * t));
  return h;
}
const STEPS = 160;
const X = (i: number) => -1 + (2 * i) / STEPS;
const MOUNTAIN = (() => {
  let d = 'M0 1000';
  for (let i = 0; i <= STEPS; i++) d += ` L${((X(i) + 1) * 500).toFixed(1)} ${((1 - profile(X(i))) * 1000).toFixed(1)}`;
  return `${d} L1000 1000 Z`;
})();
// Snow fingers run along lines through the summit (constant xn / (1 - h)), like the shader.
const SNOW = (() => {
  const sm = (e0: number, e1: number, x: number) => {
    const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
    return t * t * (3 - 2 * t);
  };
  let d = 'M0 0';
  for (let i = 0; i <= STEPS; i++) {
    const a = X(i);
    const fing = sm(0.7, 0.98, 0.5 + 0.25 * Math.sin(a * 21 + 1.3) + 0.25 * Math.sin(a * 37 + 0.4));
    const sl = 0.66 + 0.02 * Math.sin(a * 5 + 0.8) - 0.15 * fing;
    d += ` L${((a * (1 - sl) + 1) * 500).toFixed(1)} ${((1 - sl) * 1000).toFixed(1)}`;
  }
  return `${d} L1000 0 Z`;
})();

const REDUCED_DAWN = 0.45;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

function NewTab() {
  return <span className={s.sr}> (opens in a new tab)</span>;
}

export default function OpeningD() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fujiRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const fuji = fujiRef.current;
    const rim = rimRef.current;
    if (!root || !stage || !canvas || !fuji || !rim) return;

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let reduced = mqReduce.matches;
    let sky = createSky(canvas, { maxDpr: 1.5, maxPixels: coarse ? 7e5 : 1.6e6 });
    root.dataset.gl = sky ? 'on' : 'off';

    const lensed = Array.from(root.querySelectorAll<HTMLElement>('[data-lensed]')).map((el) => ({ el, x: 0, y: 0 }));
    let sw = 1, sh = 1, secTop = 0, secH = 1, R = 100;
    let fb: FujiBox = { cx: 0, top: 0, hb: 1, bottom: 0 };
    const park = { x: 0, y: 0 };
    const lens = { x: Number.NaN, y: 0, r: 0 };
    const ptr = { x: 0, y: 0, mouse: false, touch: false };
    let park01 = 1, tapP = 0, p = 0, stageTop = 0, visible = true;
    let raf = 0, last = performance.now(), tick = 0, rendered = 0, lastRender = 0, painted = false, dirty = true;
    let domKey = '', skyKey = '';
    let quality = 1, slow = 0;
    const t0 = last;

    const stageTopAt = (y: number) => {
      const top = secTop - y;
      return top < 0 ? Math.min(0, secTop + secH - sh - y) : top;
    };

    const measure = () => {
      const sr = stage.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      const fr = fuji.getBoundingClientRect();
      sw = sr.width;
      sh = sr.height;
      secTop = rr.top + window.scrollY;
      secH = rr.height;
      fb = { cx: fr.left + fr.width / 2 - sr.left, top: fr.top - sr.top, hb: fr.width / 2, bottom: fr.bottom - sr.top };
      R = Math.round(Math.min(130, Math.max(56, Math.min(sw, sh) * 0.14)));
      park.x = fb.cx;
      park.y = Math.max(fb.top - R - Math.max(14, sh * 0.025), 72 + R);
      for (const l of lensed) {
        const r = l.el.getBoundingClientRect();
        l.x = r.left;
        l.y = r.top + window.scrollY;
      }
      root.style.setProperty('--lr0', `${R}px`);
      stage.style.setProperty('--px', `${park.x.toFixed(1)}px`);
      stage.style.setProperty('--py', `${park.y.toFixed(1)}px`);
      rim.style.width = rim.style.height = `${R * 2}px`;
      // Caption beside the parked lens: to its right when there is room, else above it, else hidden.
      const cap = stage.querySelector<HTMLElement>('[data-cap]');
      if (cap && cap.children.length === 2) {
        const jpW = (cap.children[0] as HTMLElement).offsetWidth;
        const glossW = (cap.children[1] as HTMLElement).offsetWidth;
        const rowW = jpW + 10 + glossW;
        const right = park.x + R + 20 + Math.max(jpW, glossW) <= sw - 20;
        const above = park.y - R - 40 >= 84 && park.x - rowW / 2 >= 16 && park.x + rowW / 2 <= sw - 16;
        cap.dataset.cap = right ? 'right' : above ? 'above' : 'none';
      }
      if (Number.isNaN(lens.x)) {
        lens.x = park.x;
        lens.y = park.y + stageTopAt(window.scrollY);
        lens.r = reduced ? R : 0;
      }
      sky?.resize(sw, sh, quality);
      dirty = true;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const y = window.scrollY;
      p = Math.min(Math.max((y - secTop) / Math.max(secH - sh, 1), 0), 1);
      stageTop = stageTopAt(y);

      if (ptr.touch && Math.abs(p - tapP) > 0.18) ptr.touch = false;
      const inStageY = (cy: number) => cy >= stageTop && cy <= stageTop + sh;
      const following = (ptr.mouse || ptr.touch) && inStageY(ptr.y);
      // The parked lens gives way to the real sun; on phones it leaves sooner so it never sits on the copy.
      const parkFade = sw < 760 ? 1 - smooth(0.06, 0.26, p) : 1 - smooth(0.3, 0.55, p);

      const tx = following ? ptr.x : park.x;
      const ty = following ? ptr.y : park.y + stageTop;
      const tr = following ? R : R * parkFade;
      const kp = reduced ? 1 : 1 - Math.exp(-dt * 9);
      const kr = reduced ? 1 : 1 - Math.exp(-dt * 4.5);
      lens.x += (tx - lens.x) * kp;
      lens.y += (ty - lens.y) * kp;
      lens.r += (tr - lens.r) * kr;
      park01 += ((following ? 0 : parkFade) - park01) * kr;
      const r = lens.r > 0.6 && lens.y > stageTop - lens.r && lens.y < stageTop + sh + lens.r ? lens.r : 0;
      const ly = lens.y - stageTop;
      const pOut = reduced ? REDUCED_DAWN : p;

      const dk = `${lens.x.toFixed(1)}|${lens.y.toFixed(1)}|${r.toFixed(1)}|${y}|${pOut.toFixed(4)}|${park01.toFixed(3)}`;
      if (dk !== domKey || dirty) {
        domKey = dk;
        root.style.setProperty('--p', pOut.toFixed(4)); // dawn (fixed under reduced motion)
        root.style.setProperty('--s', p.toFixed(4)); // scroll progress through the opening
        root.style.setProperty('--lr', `${r.toFixed(1)}px`);
        stage.style.setProperty('--lx', `${lens.x.toFixed(1)}px`);
        stage.style.setProperty('--ly', `${ly.toFixed(1)}px`);
        stage.style.setProperty('--park', park01.toFixed(3));
        for (const l of lensed) {
          l.el.style.setProperty('--mx', `${(lens.x - l.x).toFixed(1)}px`);
          l.el.style.setProperty('--my', `${(lens.y - (l.y - y)).toFixed(1)}px`);
        }
        rim.style.transform = `translate3d(${(lens.x - R).toFixed(1)}px, ${(lens.y - R).toFixed(1)}px, 0) scale(${(r / R).toFixed(4)})`;
        rim.style.opacity = r > 1 ? '1' : '0';
      }

      if (sky) {
        const sk = `${lens.x.toFixed(1)}|${ly.toFixed(1)}|${r.toFixed(1)}|${pOut.toFixed(4)}`;
        const needs = !reduced || sk !== skyKey || dirty;
        // Phones: hold the idle drift at ~30fps; anything the visitor does renders at full rate.
        const idleSkip = coarse && !reduced && sk === skyKey && !dirty && (tick++ & 1) === 1;
        if (needs && !idleSkip) {
          skyKey = sk;
          sky.render({
            time: reduced ? 18 : (now - t0) / 1000 + 18,
            dawn: pOut,
            lensDawn: 0.58,
            lens: [lens.x, ly, r],
            fuji: fb,
          });
          if (!painted) {
            painted = true;
            root.dataset.glReady = '1';
          }
          // Adaptive resolution: if frames stay slow after warm-up, render fewer pixels.
          const gap = (now - lastRender) / 1000;
          lastRender = now;
          if (!reduced && rendered++ > 90 && gap < 0.2) {
            slow = slow * 0.95 + (gap > (coarse ? 0.05 : 0.024) ? 0.05 : 0);
            if (slow > 0.6 && quality > 0.5) {
              quality *= 0.8;
              slow = 0;
              sky.resize(sw, sh, quality);
            }
          }
        }
      }
      dirty = false;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.mouse = true;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) ptr.mouse = false;
    };
    let down: { x: number; y: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') down = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || !down) return;
      const tap = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 12 && performance.now() - down.t < 500;
      down = null;
      if (!tap) return;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.touch = true;
      tapP = p;
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      sky = null;
      root.dataset.gl = 'off';
      delete root.dataset.glReady;
    };
    const onReduce = () => {
      reduced = mqReduce.matches;
      dirty = true;
    };

    measure();
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(stage);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseout', onOut);
    canvas.addEventListener('webglcontextlost', onLost);
    root.addEventListener('animationend', measure);
    mqReduce.addEventListener('change', onReduce);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseout', onOut);
      canvas.removeEventListener('webglcontextlost', onLost);
      root.removeEventListener('animationend', measure);
      mqReduce.removeEventListener('change', onReduce);
      sky?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className={`${s.root} ${serifJP.variable}`} data-gl="pending">
      <header className={s.header}>
        <a className={s.brand} href="/">
          <span>Mirai Tech City</span>
          <span className={s.brandSep} aria-hidden="true" />
          <span className={s.brandSub}>{residency.short}</span>
        </a>
        <a className={s.headCta} href={residency.applyHref} target="_blank" rel="noopener noreferrer">
          {residency.navCta}
          <span aria-hidden="true">↗</span>
          <NewTab />
        </a>
      </header>

      <div ref={stageRef} className={s.stage} aria-hidden="true">
        <div className={s.skyNight} />
        <div className={s.skyDawn} />
        <div ref={fujiRef} className={s.fuji}>
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" focusable="false">
            <defs>
              <linearGradient id="odRock" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1e1836" />
                <stop offset="1" stopColor="#0b0a1a" />
              </linearGradient>
              <linearGradient id="odSnow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#aaa2c4" />
                <stop offset="1" stopColor="#57527a" />
              </linearGradient>
              <clipPath id="odClip">
                <path d={MOUNTAIN} />
              </clipPath>
            </defs>
            <path d={MOUNTAIN} fill="url(#odRock)" />
            <path d={SNOW} fill="url(#odSnow)" clipPath="url(#odClip)" opacity="0.55" />
          </svg>
        </div>
        <div className={s.lake} />
        <div className={s.fujiRefl}>
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" focusable="false">
            <path d={MOUNTAIN} fill="#100d22" />
            <path d={SNOW} fill="#4a4568" clipPath="url(#odClip)" opacity="0.5" />
          </svg>
        </div>
        <div className={s.grain} />
        <canvas ref={canvasRef} className={s.canvas} />
        <div className={s.glass} />
        <div className={s.mark}>{hero.kanji}</div>
        <div className={s.orbLayer}>
          <span className={s.orbKanji}>{hero.kanji}</span>
        </div>
        <p className={s.orbCap} data-cap="right">
          <span className={s.orbCapJp}>{hero.kanji}</span>
          <span>{FUSHI_GLOSS}</span>
        </p>
      </div>

      <div className={s.flow}>
        <div className={s.hero}>
          <div className={s.heroMain}>
            <p className={`${s.eyebrow} ${s.rise}`} style={{ '--i': 0 } as CSSProperties}>
              {hero.eyebrow}
            </p>
            <div className={`${s.headWrap} ${s.lensed} ${s.rise}`} data-lensed="" style={{ '--i': 1 } as CSSProperties}>
              <h1 className={`${s.h1} ${s.en}`}>
                <span>{LINE_1}</span> <span>{LINE_2}</span>
              </h1>
              <span className={`${s.jp} ${s.h1Jp}`} aria-hidden="true">
                {hero.kanji}
              </span>
            </div>
            <p className={`${s.sub} ${s.rise}`} style={{ '--i': 2 } as CSSProperties}>
              {hero.sub}
            </p>
            <div className={`${s.ctaRow} ${s.rise}`} style={{ '--i': 3 } as CSSProperties}>
              <a className={s.cta} href={residency.applyHref} target="_blank" rel="noopener noreferrer">
                {residency.apply}
                <span aria-hidden="true">↗</span>
                <NewTab />
              </a>
              <a className={s.talk} href={residency.talkHref} target="_blank" rel="noopener noreferrer">
                {residency.talk}
                <NewTab />
              </a>
            </div>
          </div>

          <div className={`${s.bottom} ${s.rise}`} style={{ '--i': 4 } as CSSProperties}>
            <ul className={s.meta}>
              <li>{hero.meta[0]}</li>
              <li>
                <span className={s.lensed} data-lensed="">
                  <span className={s.en}>{ROUTE_EN}</span>
                  <span className={s.jp} aria-hidden="true">
                    {ROUTE_JP}
                  </span>
                </span>
              </li>
              <li>{hero.meta[2]}</li>
            </ul>
            <a className={s.scroll} href="#d-legend">
              <span>{hero.scrollCue}</span>
              <span className={s.scrollLine} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={s.bridge} aria-hidden="true" />

        <section className={s.legend} id="d-legend" aria-labelledby="d-legend-h">
          <p className={s.eyebrow}>{legend.eyebrow}</p>
          <h2 id="d-legend-h" className={s.lgHead}>
            {legend.headline}
          </h2>
          <div className={s.lgParas}>
            {legend.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </section>
      </div>

      <div ref={rimRef} className={s.rim} aria-hidden="true" />
    </div>
  );
}
