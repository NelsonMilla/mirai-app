'use client';
// Opening lab, variant C: "Restraint". A light washi page with sumi type and one dawn
// accent. The only Fuji photograph hangs like a museum print and warms from pre-dawn to
// sunrise on load; 不死 is set vertically beside it. Below, the legend is revealed slowly
// as you scroll while a large 不死 fills with ink. All copy comes from content/residency.ts.
import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Shippori_Mincho } from 'next/font/google';
import { useEffect, useRef, type ReactNode } from 'react';
import { residency as r } from '@/content/residency';
import s from './OpeningC.module.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--c-serif',
  display: 'swap',
});
// Japanese glyphs come from Google's unicode-range slices; only the slices holding the
// few kanji on this page are downloaded, so nothing is preloaded.
const mincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: '500',
  variable: '--c-mincho',
  display: 'swap',
  preload: false,
});

const KANJI = r.hero.kanji; // 不死
const GLOSS = 'fushi · without death'; // from legend.paragraphs[1]
const PLACE = r.month.stages[0]; // { place: 'Mount Fuji', kanji: '富士' }

// "A month at Mount Fuji" → "A month at" / "Mount Fuji" (the place set in italic).
const claim = r.hero.claims[0];
const cut = claim.lastIndexOf(PLACE.place);
const claimLead = cut > 0 ? claim.slice(0, cut) : claim;
const claimPlace = cut > 0 ? claim.slice(cut) : '';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

function withKanji(text: string): ReactNode[] {
  return text.split(KANJI).flatMap((part, i) =>
    i === 0 ? [part] : [<span key={i} lang="ja" className={s.inlineKanji}>{KANJI}</span>, part],
  );
}

export function OpeningC({ children }: { children?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const legendRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    const legend = legendRef.current;
    if (!root || !hero || !legend) return;
    // Reduced motion (or no JS): the legend is fully shown and 不死 fully inked.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const vh0 = window.innerHeight;
    const items = Array.from(legend.querySelectorAll<HTMLElement>(`.${s.rv}`));
    // Anything already on screen (a reload mid-page) stays visible: no flash.
    for (const el of items) if (el.getBoundingClientRect().top < vh0 * 0.85) el.classList.add(s.in);
    root.dataset.motion = 'on';

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add(s.in);
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -16% 0px', threshold: 0.01 },
    );
    items.forEach(el => { if (!el.classList.contains(s.in)) io.observe(el); });

    // --h: hero scrolled away 0 → 1 (the photo drifts inside its frame).
    // --p: legend progress 0 → 1, from its top at 60% of the viewport to its bottom
    // at 90%. Drives the ink in the large 不死.
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const hr = hero.getBoundingClientRect();
      if (hr.bottom > 0) hero.style.setProperty('--h', Math.min(1, Math.max(0, -hr.top / hr.height)).toFixed(4));
      const rect = legend.getBoundingClientRect();
      const travel = Math.max(1, rect.height - vh * 0.3);
      const p = Math.min(1, Math.max(0, (vh * 0.6 - rect.top) / travel));
      legend.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const [p1, p2, p3] = r.legend.paragraphs;

  return (
    <div ref={rootRef} className={`${s.root} ${serif.variable} ${mincho.variable}`}>
      <header className={s.header}>
        <Link href="/" className={s.mark}>Mirai Tech City</Link>
        <a href={r.applyHref} {...NEW_TAB} className={s.headApply}>
          {r.navCta}<span aria-hidden="true" className={s.arrow}>↗</span>
          <span className={s.sr}> (opens in a new tab)</span>
        </a>
      </header>

      <main>
        <section ref={heroRef} className={s.hero} aria-labelledby="c-title">
          <div className={s.heroGrid}>
            <div className={s.copy}>
              <p className={`${s.eyebrow} ${s.heroEyebrow} ${s.a} ${s.d1}`}>{r.hero.eyebrow}</p>
              <h1 id="c-title" className={s.title}>
                <span className={`${s.line} ${s.d2}`}>{claimLead}</span>
                {claimPlace && <em className={`${s.line} ${s.d3}`}>{claimPlace}</em>}
              </h1>
              <p className={`${s.sub} ${s.a} ${s.d4}`}>{r.hero.sub}</p>
              <ul className={`${s.meta} ${s.a} ${s.d5}`}>
                {r.hero.meta.map(m => <li key={m}>{m}</li>)}
              </ul>
              <div className={`${s.actions} ${s.a} ${s.d6}`}>
                <a href={r.applyHref} {...NEW_TAB} className={s.apply}>
                  {r.apply}<span aria-hidden="true" className={s.arrow}>↗</span>
                  <span className={s.sr}> (opens in a new tab)</span>
                </a>
                <a href={r.talkHref} {...NEW_TAB} className={s.talk}>
                  {r.talk}<span className={s.sr}> (opens in a new tab)</span>
                </a>
              </div>
            </div>

            <figure className={s.print}>
              <div className={s.mat}>
                <div className={s.glass}>
                  <span className={s.plate}>
                    <Image
                      src="/img/fuji/fuji-dawn.webp"
                      alt="Mount Fuji at sunrise above a still lake"
                      width={1600}
                      height={1063}
                      sizes="(max-width: 860px) 92vw, 50vw"
                      preload
                      className={s.photo}
                    />
                    <span className={s.glow} aria-hidden="true" />
                  </span>
                </div>
              </div>
              <figcaption className={s.caption}>
                <span lang="ja" className={s.capJp}>{PLACE.kanji}</span>
                <span>{r.credits}</span>
              </figcaption>
            </figure>

            <div className={s.inscription}>
              <span className={s.sun} aria-hidden="true" />
              <div className={s.fushiRow}>
                <span className={s.gloss}>{GLOSS}</span>
                <span lang="ja" className={s.fushi}>{KANJI}</span>
              </div>
            </div>
          </div>

          <a href="#c-legend" className={s.cue}>
            <span className={s.cueLine} aria-hidden="true" />
            {r.hero.scrollCue}
          </a>
        </section>

        <section id="c-legend" ref={legendRef} className={s.legend} aria-labelledby="c-legend-title">
          <div className={s.legendHead}>
            <p className={s.eyebrow}>{r.legend.eyebrow}</p>
            <p className={s.headJp} lang="ja" aria-hidden="true">{PLACE.kanji}</p>
          </div>
          <div className={s.legendGrid}>
            <div className={s.legendText}>
              <h2 id="c-legend-title" className={`${s.legendTitle} ${s.rv}`}>{r.legend.headline}</h2>
              <p className={`${s.para} ${s.rv}`}>{withKanji(p1)}</p>
              <p className={`${s.para} ${s.rv}`}>{withKanji(p2)}</p>
              <p className={`${s.coda} ${s.rv}`}>{withKanji(p3)}</p>
              <a href={r.applyHref} {...NEW_TAB} className={`${s.codaLink} ${s.rv}`}>
                <span className={s.u}>{r.apply}</span><span aria-hidden="true" className={s.arrow}>↗</span>
                <span className={s.sr}> (opens in a new tab)</span>
              </a>
            </div>
            <div className={s.legendInk} aria-hidden="true">
              <div className={s.inkSticky}>
                <span className={s.inkGloss}>{GLOSS}</span>
                <span className={s.inkChars} lang="ja">
                  <span className={s.inkBase}>{KANJI}</span>
                  <span className={s.inkFill}>{KANJI}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
