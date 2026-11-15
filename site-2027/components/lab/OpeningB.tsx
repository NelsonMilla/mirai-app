'use client';
// Opening B · Sculpture. Mount Fuji as a generated object: a WebGL2 heightfield drawn as
// a dawn-lit sculpture with contour lines, a scanning altitude ring and a lake reflection
// (OpeningB.gl.ts, lazy-loaded). Scrolling raises the camera from the lake to a plan view
// where the contours become rings, and the legend beat takes over from the hero.
// First paint is an SVG of the same mountain; the canvas fades in over it once a frame
// exists. No WebGL2 or reduced motion: the SVG (or one still WebGL frame) and a plain,
// non-sticky layout. Copy comes only from content/residency.ts.
import { Instrument_Serif } from 'next/font/google';
import { useEffect, useRef } from 'react';
import { residency as r } from '@/content/residency';
import type { Sculpture } from './OpeningB.gl';
import s from './OpeningB.module.css';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], display: 'swap', variable: '--b-serif' });

// ── static first frame (same profile as the shader, without noise) ─────────────
const F = { R: 20, HP: 2.45, K: 2.25, APRON: 0.55, GROUND: 1.0, TOP: 3.776, E: 1.8, SNOW: 2.42 };
function smin(a: number, b: number, k: number) {
  const h = Math.min(Math.max(0.5 + (0.5 * (b - a)) / k, 0), 1);
  return b * (1 - h) + a * h - k * h * (1 - h);
}
function profile(km: number) {
  const rn = km / F.R;
  return smin(F.GROUND + F.HP * Math.pow(Math.max(1 - rn, 0), F.K) + F.APRON * Math.exp(-rn * 2.2), F.TOP, 0.1);
}
function radiusAt(a: number) {
  let lo = 0, hi = F.R * 1.4;
  for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (profile(m) > a) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
const f1 = (n: number) => Math.round(n * 10) / 10;
// Drawn in a 1440×900 box with the WebGL resting camera's numbers (summit at 60% / 25%,
// ~48 px per km across, ~50 px per exaggerated km up, water line mirrored at y 481).
const sx = (km: number) => f1(864 + km * 48);
const sy = (alt: number) => f1(222 + (6.8 - alt * F.E) * 50);
const STILL = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 1440; x += 6) pts.push(`${x} ${sy(profile(Math.abs(x - 864) / 48))}`);
  const body = `M0 600L${pts.join('L')}L1440 600Z`;
  const rs = radiusAt(F.SNOW);
  const top: string[] = [], teeth: string[] = [];
  for (let k = -rs; k <= rs; k += 0.1) top.push(`${sx(k)} ${sy(profile(Math.abs(k)))}`);
  for (let k = rs; k >= -rs; k -= 0.12) {
    const tooth = Math.pow(Math.abs(Math.sin(k * 3.1 + 1) * Math.sin(k * 7.7)), 4) * 0.5 + Math.pow(Math.abs(Math.sin(k * 13.3)), 12) * 0.25 + 0.03;
    teeth.push(`${sx(k)} ${sy(Math.min(F.SNOW - tooth, profile(Math.abs(k))))}`);
  }
  const snow = `M${top.join('L')}L${teeth.join('L')}Z`;
  const minor: string[] = [], major: string[] = [];
  for (let a = 11; a <= 37; a++) {
    const hw = f1(radiusAt(a / 10) * 48), y = sy(a / 10), ry = f1(hw * 0.035);
    (a % 5 === 0 ? major : minor).push(`M${f1(864 - hw)} ${y}A${hw} ${ry} 0 0 0 ${f1(864 + hw)} ${y}`);
  }
  const scanW = f1(radiusAt(3) * 48);
  return { body, snow, minor: minor.join(''), major: major.join(''), scan: `M${f1(864 - scanW)} ${sy(3)}H${f1(864 + scanW)}` };
})();

function Still() {
  const mountain = (
    <>
      <path d={STILL.body} fill="url(#bBody)" />
      <path d={STILL.snow} fill="url(#bSnow)" />
      <path d={STILL.minor} fill="none" stroke="#ffc9b4" strokeOpacity=".2" strokeWidth=".8" />
      <path d={STILL.major} fill="none" stroke="#ffd2bf" strokeOpacity=".42" />
      <path d={STILL.scan} fill="none" stroke="#fff3ea" strokeWidth="2" />
    </>
  );
  return (
    <svg className={s.still} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#05061a" />
          <stop offset=".24" stopColor="#262445" />
          <stop offset=".37" stopColor="#6e4a68" />
          <stop offset=".425" stopColor="#4b3b58" />
          <stop offset=".44" stopColor="#262840" />
        </linearGradient>
        <linearGradient id="bBody" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#1a1626" />
          <stop offset=".6" stopColor="#120f1d" />
          <stop offset="1" stopColor="#0b0b16" />
        </linearGradient>
        <linearGradient id="bSnow" x1="0" x2="1" y1="0" y2="0">
          <stop offset=".3" stopColor="#ef93ad" />
          <stop offset=".62" stopColor="#d47ea0" />
          <stop offset=".8" stopColor="#8a6a98" />
        </linearGradient>
        <clipPath id="bLake"><rect x="0" y="600" width="1440" height="300" /></clipPath>
      </defs>
      <rect width="1440" height="900" fill="url(#bSky)" />
      <rect y="392" width="1440" height="208" fill="#0b0b17" />
      {mountain}
      <rect y="600" width="1440" height="300" fill="#080915" />
      <g clipPath="url(#bLake)">
        <g transform="matrix(1 0 0 -1 0 962)" opacity=".55">{mountain}</g>
      </g>
    </svg>
  );
}

const clamp = (x: number) => Math.min(Math.max(x, 0), 1);
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

export function OpeningB() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const summit = useRef<HTMLDivElement>(null);
  const scan = useRef<HTMLDivElement>(null);
  const scanVal = useRef<HTMLSpanElement>(null);
  const prog = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tr = track.current, st = stage.current, cv = canvas.current;
    if (!tr || !st || !cv) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    if (!reduced) tr.dataset.motion = 'on';

    let sculpt: Sculpture | null = null;
    let raf = 0, alive = true, onScreen = true, slowChecked = false;
    let dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
    const t0 = performance.now();
    const m = { x: 0, y: 0, tx: 0, ty: 0, p: 0 };
    const timing = { n: 0, sum: 0, last: 0 };
    let scanTxt = '', progTxt = '';

    const place = (el: HTMLElement | null, a: [number, number, boolean]) => {
      if (!el) return;
      el.style.transform = `translate3d(${a[0].toFixed(1)}px,${a[1].toFixed(1)}px,0)`;
      el.dataset.on = a[2] ? '1' : '0';
    };
    const progress = () => {
      if (reduced) return 0;
      const range = tr.offsetHeight - window.innerHeight;
      return range > 0 ? clamp(-tr.getBoundingClientRect().top / range) : 0;
    };
    const size = () => {
      if (!sculpt) return;
      const w = cv.clientWidth || 1, h = cv.clientHeight || 1;
      // pixel budget: about 4.2 MP on big screens, so thin contours stay sharp without melting a laptop GPU
      sculpt.resize(w, h, Math.min(dpr, Math.sqrt(4.2e6 / (w * h))));
    };

    const draw = (now: number) => {
      raf = 0;
      if (!sculpt || !alive) return;
      const t = reduced ? 30 : (now - t0) / 1000;
      const target = progress();
      m.p += (target - m.p) * (reduced ? 1 : 0.12);
      if (Math.abs(target - m.p) < 0.0004) m.p = target;
      m.x += (m.tx - m.x) * 0.04;
      m.y += (m.ty - m.y) * 0.04;
      const alt = reduced ? 3.0 : 1.25 + (3.7 - 1.25) * (0.5 - 0.5 * Math.cos((t * 2 * Math.PI) / 18));
      const a = sculpt.render({ p: m.p, mx: m.x, my: m.y, t, scan: alt });
      place(summit.current, a.summit);
      place(scan.current, a.scan);
      const txt = `${(Math.round(alt * 100) * 10).toLocaleString('en-US')} m`;
      if (txt !== scanTxt && scanVal.current) scanVal.current.textContent = scanTxt = txt;
      const pt = String(Math.round(m.p * 100)).padStart(2, '0');
      if (pt !== progTxt && prog.current) prog.current.textContent = progTxt = pt;
      st.style.setProperty('--hero', (1 - smooth(0.03, 0.2, m.p)).toFixed(3));
      st.style.setProperty('--legend', smooth(0.5, 0.72, m.p).toFixed(3));
      st.style.setProperty('--k', smooth(0, 0.88, m.p).toFixed(3));
      st.dataset.beat = m.p > 0.45 ? 'legend' : 'hero';
      if (st.dataset.gl !== 'on') st.dataset.gl = 'on';

      // One-time quality check: if the first ~60 frames run slow, drop the resolution.
      if (!slowChecked && timing.last) {
        timing.sum += now - timing.last;
        if (++timing.n === 60) {
          slowChecked = true;
          if (timing.sum / 60 > 26 && dpr > 1) { dpr = Math.max(1, dpr * 0.7); size(); }
        }
      }
      timing.last = now;
      if (!reduced && onScreen && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf && sculpt && alive) raf = requestAnimationFrame(draw); };

    import('./OpeningB.gl').then(mod => {
      if (!alive) return;
      sculpt = mod.createSculpture(cv, { lite });
      if (!sculpt) { st.dataset.gl = 'off'; return; }
      size();
      kick();
    }).catch(() => { st.dataset.gl = 'off'; });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      m.tx = (e.clientX / window.innerWidth) * 2 - 1;
      m.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onVis = () => { if (!document.hidden) kick(); };
    const onLost = (e: Event) => { e.preventDefault(); sculpt = null; st.dataset.gl = 'off'; };
    const ro = new ResizeObserver(() => { size(); timing.last = 0; kick(); });
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick(); });
    ro.observe(cv);
    io.observe(tr);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    cv.addEventListener('webglcontextlost', onLost);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      cv.removeEventListener('webglcontextlost', onLost);
      sculpt?.dispose();
    };
  }, []);

  const claim = r.hero.claims[0];
  const cut = claim.indexOf('Mount Fuji');
  const lead = cut > 0 ? claim.slice(0, cut).trim() : claim;
  const place = cut > 0 ? claim.slice(cut) : '';
  const stop = r.hero.sub.indexOf('. ');
  const subLead = stop > 0 ? r.hero.sub.slice(0, stop + 1) : r.hero.sub;
  const subMore = stop > 0 ? r.hero.sub.slice(stop + 2) : '';
  const fushi = r.legend.paragraphs[1].match(/fushi, without death/)?.[0];

  return (
    <div ref={track} className={`${s.track} ${serif.variable}`}>
      <header className={s.header}>
        <a className={s.mark} href="/">Mirai Tech City</a>
        <a className={s.headCta} href={r.applyHref} target="_blank" rel="noopener noreferrer">
          {r.navCta}<span className={s.sr}> (opens in a new tab)</span>
        </a>
      </header>

      <div ref={stage} className={s.stage} style={{ '--hero': 1, '--legend': 0, '--k': 0 } as React.CSSProperties}>
        <section className={s.frame} aria-labelledby="b-h1">
          <div className={s.visual} aria-hidden="true">
            <Still />
            <canvas ref={canvas} className={s.canvas} />
          </div>
          <div className={s.scrim} aria-hidden="true" />

          <div className={s.hud} aria-hidden="true">
            <div ref={summit} className={s.summit}>
              <span className={s.pin} />
              <span className={s.leader} />
              <span className={s.tag}>
                <b>3,776 m</b>
                <span>35.3606° N</span> <span>138.7274° E</span>
              </span>
              <span className={s.hudSeal} lang="ja">{r.hero.kanji}</span>
            </div>
            <div ref={scan} className={s.scan}>
              <span className={s.tick} />
              <span className={s.scanTag}>Alt <span ref={scanVal}>3,000 m</span></span>
            </div>
          </div>

          <div className={s.hero}>
            <div className={s.eyebrowRow}>
              <p className={s.eyebrow}>{r.hero.eyebrow}</p>
              <span className={s.cueInline} aria-hidden="true">{r.hero.scrollCue} ↓</span>
            </div>
            <h1 id="b-h1" className={s.h1}>
              {lead}{place && <> <em>{place}</em></>}
            </h1>
            <p className={s.sub}>
              {subLead}
              {subMore && <span className={s.subMore}> {subMore}</span>}
            </p>
            <ul className={s.meta}>
              {r.hero.meta.slice(1).map(x => <li key={x}>{x}</li>)}
            </ul>
            <div className={s.ctas}>
              <a className={s.apply} href={r.applyHref} target="_blank" rel="noopener noreferrer">
                {r.apply}<span aria-hidden="true" className={s.arrow}>↗</span>
                <span className={s.sr}> (opens in a new tab)</span>
              </a>
              <a className={s.talk} href={r.talkHref} target="_blank" rel="noopener noreferrer">
                {r.talk}<span className={s.sr}> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div className={s.cue} aria-hidden="true">
            <span className={s.cueLine} />
            <span>{r.hero.scrollCue}</span>
            <span className={s.cueNum}><span ref={prog}>00</span></span>
          </div>
        </section>

        <section className={s.legend} aria-labelledby="b-legend">
          <div className={s.legendText}>
            <p className={s.eyebrow}>{r.legend.eyebrow}</p>
            <h2 id="b-legend" className={s.h2}>{r.legend.headline}</h2>
            <p className={s.legendBody}>{r.legend.paragraphs[2]}</p>
          </div>
          <div className={s.seal} lang="ja">
            <span className={s.kanji}>{r.hero.kanji}</span>
            {fushi && <span className={s.fushi} lang="en">{fushi}</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
