'use client';
// The month: Mount Fuji (weeks 1–3) → Kobe (week 4) → Demo Day (last day). Chapter mark 富士.
//
// Default (no JS, reduced motion, phones): the three stages stacked, each a full-bleed
// photograph with its kanji; the copy sits over the photo on wide screens, under it on phones.
// Wide screens with motion: the stage pins for 300vh and each place takes the screen in turn.
// The next photograph is uncovered from below (a wipe made of two opposite translations),
// the route line along the bottom fills week by week from Fuji to Kobe, 神戸 rises from
// behind the Rokko mountains (the page's second and last depth mask) and 発表 lights up on
// the Demo Day screen. One rAF scroll handler writes CSS variables; CSS does the rest.
//
// Photos are placed with the opening's geometry: --u is CSS px per photo px and --ox/--oy
// the photo's offset, so kanji and masks are pinned to points in the photograph.
import Image, { getImageProps } from 'next/image';
import { useEffect, useRef } from 'react';
import { residency, type Residency } from '@/content/residency';
import photos from '@/content/photos-2026.json';
import s from './Month.module.css';

const photo = (file: string) => {
  const p = photos.find(ph => ph.src.endsWith(`/${file}`));
  if (!p) throw new Error(`Month: ${file} is missing from content/photos-2026.json`);
  return p;
};
const HARBOR = photo('japan-kobe-harbor-01.webp');
const LAB = photo('lab-surgical-robot-01.webp');
const PITCH_WIDE = photo('demo-day-pitch-01.webp');
const PITCH_TALL = photo('demo-day-pitch-02.webp');

// Demo Day: landscape photo on wide screens, portrait on phones (one download either way).
const PITCH_WIDE_SIZES = '(max-aspect-ratio: 3/2) 113vw, 100vw';
const pitchCommon = { alt: PITCH_TALL.alt, loading: 'eager' as const, sizes: '100vw' };
const { props: { srcSet: pitchWideSet } } = getImageProps({
  ...pitchCommon, sizes: PITCH_WIDE_SIZES, src: PITCH_WIDE.src, width: PITCH_WIDE.w, height: PITCH_WIDE.h,
});
const { props: { srcSet: pitchTallSet, src: pitchTallSrc, alt: pitchAlt, ...pitchTall } } = getImageProps({
  ...pitchCommon, src: PITCH_TALL.src, width: PITCH_TALL.w, height: PITCH_TALL.h,
});


const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t: number) => 1 - Math.pow(1 - t, 3);

type Stage = Residency['month']['stages'][number];
function Copy({ st }: { st: Stage }) {
  return (
    <div className={s.copy}>
      <p className={s.label}>
        <span className={s.when}>{st.when}</span>
        <span className={s.place}>{st.place}</span>
      </p>
      <h3 className={s.title}>{st.title}</h3>
      <p className={s.body}>{st.body}</p>
    </div>
  );
}

export function Month({ r = residency }: { r?: Residency } = {}) {
  // Alt text and captions in this page's language (English falls back to the manifest).
  const tx = (p: { src: string; alt: string; caption: string }) => {
    const t = r.photoText[p.src.slice(p.src.lastIndexOf('/') + 1, -'.webp'.length)];
    return { alt: t?.alt ?? p.alt, caption: t?.caption ?? p.caption };
  };
  const [fuji, kobe, demo] = r.month.stages;
  // Two display lines: split after the first sentence (". " in English, "、" or "。" in Japanese).
  const hm = r.month.headline.match(/^(.+?[.、。])\s*([\s\S]*)$/);
  const [head1, head2] = hm ? [hm[1], hm[2]] : [r.month.headline, ''];
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const stops = Array.from(el.querySelectorAll<HTMLElement>('[data-stop]'));
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 560px)');
    const STOP_VARS = ['--w', '--c', '--k', '--kb'];
    const TRACK_VARS = ['--f', '--r2', '--r3', '--on1', '--on2', '--on3'];
    let raf = 0;
    let last = -1;

    const paint = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      const p = span > 0 ? clamp01(-box.top / span) : 0;
      if (p === last) return;
      last = p;
      const seg = (a: number, b: number) => clamp01((p - a) / (b - a));
      const set = (node: HTMLElement, k: string, v: number) => node.style.setProperty(k, v.toFixed(4));
      const w2 = inOut(seg(0.27, 0.42)); // Kobe uncovers
      const w3 = inOut(seg(0.62, 0.77)); // Demo Day uncovers
      const [a, b, c] = stops;
      set(a, '--kb', seg(0, 0.42));
      set(a, '--c', w2);
      set(b, '--w', w2);
      set(b, '--k', out(seg(0.34, 0.56)));
      set(b, '--kb', seg(0.27, 0.77));
      set(b, '--c', w3);
      set(c, '--w', w3);
      set(c, '--k', out(seg(0.7, 0.86)));
      set(c, '--kb', seg(0.62, 1));
      // The route is drawn to scale: three weeks at Fuji, one in Kobe, then the last day.
      set(el, '--f', 0.75 * seg(0.02, 0.4) + 0.25 * seg(0.44, 0.75));
      set(el, '--r2', clamp01((w2 - 0.4) * 5));
      set(el, '--r3', clamp01((w3 - 0.4) * 5));
      set(el, '--on1', 1 - clamp01((w2 - 0.4) * 5));
      set(el, '--on2', clamp01((w2 - 0.4) * 5) - clamp01((w3 - 0.4) * 5));
      set(el, '--on3', clamp01((w3 - 0.4) * 5));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const mode = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      last = -1;
      if (!mq.matches) {
        delete el.dataset.motion;
        stops.forEach(n => STOP_VARS.forEach(v => n.style.removeProperty(v)));
        TRACK_VARS.forEach(v => el.style.removeProperty(v));
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

  return (
    <section id="month" className={s.month} aria-labelledby="month-title">
      <div className={s.intro}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">{fuji.kanji}</b><span>{r.marks.month}</span></p>
          <p className={s.eyebrow}>{r.month.eyebrow}</p>
        </header>
        <h2 id="month-title" className={s.headline}>
          <span>{head1}</span> <span className={s.headline2}>{head2}</span>
        </h2>
      </div>

      <div className={s.track} ref={track}>
        <div className={s.stage}>
          {/* The month to scale: weeks 1–3 at Fuji, week 4 in Kobe, Demo Day on the last day. */}
          <div className={s.route} aria-hidden="true">
            <p className={`${s.stopLabel} ${s.endLabel}`}><span>{demo.when}</span><b>{demo.title}</b></p>
            <div className={s.rail}>
              <i className={s.fill} />
              <i className={s.tick} style={{ '--at': 0.25 } as React.CSSProperties} />
              <i className={s.tick} style={{ '--at': 0.5 } as React.CSSProperties} />
              <i className={`${s.dot} ${s.dot1}`} />
              <i className={`${s.dot} ${s.dot2}`} />
              <i className={`${s.dot} ${s.dot3}`} />
              <i className={s.head} />
            </div>
            <p className={`${s.stopLabel} ${s.fujiLabel}`}><span>{fuji.when}</span><b>{fuji.place}</b></p>
            <p className={`${s.stopLabel} ${s.kobeLabel}`}><span>{kobe.when}</span><b>{kobe.place}</b></p>
          </div>

          <ol className={s.stops}>
            {/* 1 · Mount Fuji: a tighter crop than the opening, the cone fills the frame */}
            <li className={`${s.stop} ${s.fuji}`} data-stop>
              <div className={s.frame}>
                <div className={s.inner}>
                  <div className={`${s.scene} grain`}>
                    <div className={s.plate}>
                      {/* Same file as the opening (already in cache); it is only 1600px, so the
                          resizer would just re-encode it. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={`${s.photo} grade`}
                        src="/img/fuji/fuji-dawn.webp"
                        alt={r.fujiAlt}
                        width={1600}
                        height={1063}
                        decoding="async"
                      />
                      <span className={s.kanji} aria-hidden="true">{fuji.kanji}</span>
                    </div>
                    <div className={s.shade} aria-hidden="true" />
                    <div className={s.dim} aria-hidden="true" />
                  </div>
                  <Copy st={fuji} />
                </div>
              </div>
            </li>

            {/* 2 · Kobe: 神戸 stands behind the Rokko mountains (depth mask) */}
            <li className={`${s.stop} ${s.kobe}`} data-stop>
              <div className={s.frame}>
                <div className={s.inner}>
                  <div className={`${s.scene} grain`}>
                    <div className={s.plate}>
                      <div className={s.layer}>
                        <Image
                          className={`${s.photo} grade`}
                          src={HARBOR.src}
                          alt={tx(HARBOR).alt}
                          width={HARBOR.w}
                          height={HARBOR.h}
                          loading="eager" fetchPriority="low"
                          sizes="(max-width: 899px) 170vw, (max-aspect-ratio: 4/3) 134vw, 100vw"
                        />
                        <div className={s.sky} />
                      </div>
                      <span className={s.kanji} aria-hidden="true">{kobe.kanji}</span>
                      <div className={`${s.layer} ${s.front}`} aria-hidden="true">
                        <Image
                          className={`${s.photo} grade`}
                          src={HARBOR.src}
                          alt=""
                          width={HARBOR.w}
                          height={HARBOR.h}
                          loading="eager" fetchPriority="low"
                          sizes="(max-width: 899px) 170vw, (max-aspect-ratio: 4/3) 134vw, 100vw"
                        />
                        <div className={s.sky} />
                      </div>
                    </div>
                    <div className={s.shade} aria-hidden="true" />
                    <div className={s.dim} aria-hidden="true" />
                  </div>
                  <Copy st={kobe} />
                  <figure className={s.print}>
                    <div className={`${s.printPhoto} grain`}>
                      <Image
                        className="grade"
                        src={LAB.src}
                        alt={tx(LAB).alt}
                        width={LAB.w}
                        height={LAB.h}
                        loading="eager" fetchPriority="low"
                        sizes="(max-width: 899px) 62vw, 20vw"
                        style={{ objectPosition: LAB.focal }}
                      />
                    </div>
                    {tx(LAB).caption && <figcaption className={s.caption}>{tx(LAB).caption}</figcaption>}
                  </figure>
                </div>
              </div>
            </li>

            {/* 3 · Demo Day: 発表 on the stage screen (wide), beside the speaker (phones) */}
            <li className={`${s.stop} ${s.demo}`} data-stop>
              <div className={s.frame}>
                <div className={s.inner}>
                  <div className={`${s.scene} grain`}>
                    <div className={s.plate}>
                      <picture>
                        <source media="(min-width: 900px)" srcSet={pitchWideSet} sizes={PITCH_WIDE_SIZES} />
                        <img {...pitchTall} src={pitchTallSrc} srcSet={pitchTallSet} alt={tx(PITCH_TALL).alt} className={`${s.photo} grade`} />
                      </picture>
                      <div className={s.screen} aria-hidden="true" />
                      <span className={s.kanji} aria-hidden="true">{demo.kanji}</span>
                    </div>
                    <div className={s.shade} aria-hidden="true" />
                  </div>
                  <Copy st={demo} />
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
