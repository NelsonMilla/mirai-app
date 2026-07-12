'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { LUMA_EVENT_URL } from '@/lib/constants';

const SHOW_DATE = new Date('2026-10-26T19:00:00+09:00');

const CATEGORIES = [
  { tag: 'EXO',   kanji: '鎧', name: 'Exoskeletons',     desc: 'Worn robotics that augment strength, mobility, or endurance.' },
  { tag: 'NEUR',  kanji: '脳', name: 'Neural Interfaces',desc: 'BCIs and non-invasive neurotech, on-body for the first time.' },
  { tag: 'PROS',  kanji: '義', name: 'Smart Prosthetics',desc: 'Next-gen limbs — sensor-rich, actuated, intent-aware.' },
  { tag: 'BIO',   kanji: '感', name: 'Biosensors',       desc: 'Garments and patches that read physiology in real time.' },
  { tag: 'HAP',   kanji: '触', name: 'Haptic Suits',     desc: 'Whole-body feedback systems for sensory augmentation.' },
  { tag: 'BION',  kanji: '機', name: 'Bionics',          desc: 'Hybrid devices that blur the line between hardware and body.' },
  { tag: 'WEAR',  kanji: '衣', name: 'Smart Wearables',  desc: 'Adaptive clothing, on-skin UI, and ambient health tech.' },
  { tag: 'AR/VR', kanji: '視', name: 'Spatial Medical',  desc: 'Optics and spatial compute as medical-grade interfaces.' },
  { tag: 'GEN',   kanji: '命', name: 'Genes & Cells',    desc: 'Wearable delivery hardware for gene and cell therapies.' },
] as const;

const SPONSOR_MAILTO =
  'mailto:pedro@frontierhumans.com?subject=Fashion%20Show%20Sponsor%20Deck%20Request';

function useCountdown(target: Date): number | null {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      setDays(Math.max(0, Math.ceil(diff / 86_400_000)));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [target]);
  return days;
}

export function FashionShowContent() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const daysOut = useCountdown(SHOW_DATE);
  const [progress, setProgress] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [heroOffset, setHeroOffset] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blocks = sectionRef.current?.querySelectorAll<HTMLElement>('.fs-reveal');
    if (!blocks) return;

    if (reduced) {
      blocks.forEach((b) => b.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );

    blocks.forEach((b) => {
      const rect = b.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        b.classList.add('in');
      } else {
        io.observe(b);
      }
    });

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(total > 0 ? Math.min(1, y / total) : 0);
      const heroBottom = heroRef.current
        ? heroRef.current.getBoundingClientRect().bottom
        : 0;
      setShowStickyCta(heroBottom < 80);
      setHeroOffset(y);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="fs-page" ref={sectionRef}>
      <div
        className={`fs-sticky-bar ${showStickyCta ? 'visible' : ''}`}
        aria-hidden={!showStickyCta}
      >
        <div className="fs-sticky-inner">
          <a href="/" className="fs-sticky-logo mono" aria-label="Back to Mirai Tech">
            <span className="fs-sticky-mark jp">未</span>
            <span>FRONTIER HUMAN FASHION SHOW · KOBE · OCT 2026</span>
          </a>
          <a className="btn btn-primary fs-sticky-cta" href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">
            Apply to Walk
          </a>
        </div>
        <div className="fs-sticky-progress" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="fs-page-inner">
        {/* ── SCENE 01: HERO ── */}
        <header className="fs-hero" ref={heroRef}>
          <a href="/" className="fs-back mono">&larr; miraitech.city</a>
          <div
            className="fs-hero-kanji jp"
            aria-hidden="true"
            style={{ ['--py' as string]: `${heroOffset * -0.12}px` } as React.CSSProperties}
          >
            服
          </div>
          <div className="fs-hero-rim" aria-hidden="true" />
          <div className="fs-hero-text">
            <div className="fs-eyebrow mono">[ KOBE · OCT 26 · 2026 ]</div>
            <h1 className="fs-title display">
              <span>Frontier</span>
              <span>Human</span>
              <em>Fashion Show</em>
            </h1>
            <p className="fs-tagline">
              Working prototypes on a runway.<br />
              <span className="fs-tagline-emph">One night. 90 minutes. Streamed live.</span>
            </p>
            <div className="fs-hero-ctas">
              <a className="btn btn-primary fs-btn-solid" href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">
                Apply to Walk →
              </a>
              <a className="btn btn-outline" href="#lineup">
                See the Lineup
              </a>
            </div>
          </div>
          <div className="fs-hero-scroll mono" aria-hidden="true">SCROLL ↓</div>
        </header>

        {/* ── SCENE 02: DATE SLATE ── */}
        <section className="fs-slate fs-reveal" aria-labelledby="fs-slate-h">
          <div className="fs-slate-eyebrow mono">[ ONE NIGHT ONLY ]</div>
          <h2 id="fs-slate-h" className="fs-slate-date display">
            <span>10</span>
            <span className="fs-slate-slash">/</span>
            <span>26</span>
            <span className="fs-slate-slash">/</span>
            <span>2026</span>
          </h2>
          <div className="fs-slate-meta mono">
            <span>KOBE PORT ISLAND</span>
            <span className="fs-slate-dot" />
            <span>19:00 JST</span>
            <span className="fs-slate-dot" />
            <span>{daysOut !== null ? `${daysOut} DAYS OUT` : 'COUNTDOWN LOADING'}</span>
          </div>
        </section>

        {/* ── SCENE 03: CONCEPT ── */}
        <section className="fs-concept fs-reveal" aria-label="Enhanced Fashion">
          <div className="fs-concept-circuit" aria-hidden="true" />
          <div className="fs-concept-eyebrow mono">[ THE CONCEPT ]</div>
          <h2 className="fs-concept-title mono">ENHANCED FASHION</h2>
          <p className="fs-concept-sub">
            CES meets Tokyo Fashion Week. Every look is a working prototype —
            exoskeleton, neural interface, smart prosthetic, biosensor garment,
            haptic suit. <em>Not a render. Not a booth demo. On a body, under
            stage light.</em>
          </p>
        </section>

        {/* ── SCENE 04: FORMAT TRIPTYCH ── */}
        <section className="fs-triptych fs-reveal" aria-labelledby="fs-tri-h">
          <div className="section-label">The format</div>
          <h2 id="fs-tri-h" className="display fs-h2">A 90-minute live broadcast.</h2>

          <div className="fs-tri-scene fs-tri-scene--01">
            <div className="fs-tri-num mono">01</div>
            <div className="fs-tri-body">
              <h3 className="fs-tri-name display">The Walk</h3>
              <p>
                Each Device cohort gets a ten-minute slot. It opens with the
                walk: the prototype moves down the runway under stage light,
                soundtracked by a custom score.
                <em> No slides. No pitch. The device speaks.</em>
              </p>
              <p className="fs-tri-cue mono">ACT 1 · THE WALK · CUSTOM SCORE</p>
            </div>
          </div>

          <div className="fs-tri-scene fs-tri-scene--02">
            <div className="fs-tri-num mono">02</div>
            <div className="fs-tri-body">
              <h3 className="fs-tri-name display">The Live Demo</h3>
              <p>
                The resident steps to the front of the runway and runs the
                device in real time. One camera,
                <em> no edits</em>.
              </p>
              <p className="fs-tri-cue mono">ACT 2 · LIVE · ONE CAMERA</p>
            </div>
          </div>

          <div className="fs-tri-scene fs-tri-scene--03">
            <div className="fs-tri-num mono">03</div>
            <div className="fs-tri-body">
              <h3 className="fs-tri-name display">The Conversation</h3>
              <p>
                A short on-stage interview: what it does, who it&apos;s for,
                where it goes next — streamed live for investors, press, and
                operators.
              </p>
              <p className="fs-tri-cue mono">ACT 3 · BROADCAST Q&amp;A</p>
            </div>
          </div>
        </section>

        {/* ── SCENE 05: LINEUP ── */}
        <section
          id="lineup"
          className="fs-lineup fs-reveal"
          aria-labelledby="fs-lineup-h"
        >
          <div className="fs-lineup-header">
            <div className="section-label">Cohort FH-01</div>
            <h2 id="fs-lineup-h" className="display fs-h2">
              Nine slots. Nine reveals.
            </h2>
            <p className="fs-lineup-sub mono">
              0 / 9 REVEALED · FIRST NAMES DROP THIS SUMMER
            </p>
          </div>
          <ul className="fs-lineup-grid" role="list">
            {CATEGORIES.map((c) => (
              <li
                key={c.name}
                className="fs-lineup-card"
                style={
                  {
                    ['--cat-tag' as string]: `'${c.tag}'`,
                  } as React.CSSProperties
                }
              >
                <span className="fs-lineup-tag mono">{c.tag}</span>
                <span className="fs-lineup-stamp mono" aria-hidden="true">TBA</span>
                <span className="fs-lineup-kanji jp" aria-hidden="true">{c.kanji}</span>
                <div className="fs-lineup-silhouette" aria-hidden="true">
                  <svg viewBox="0 0 60 100" preserveAspectRatio="xMidYMid meet">
                    <path
                      d="M30 8 q-7 0 -7 8 q0 6 3 9 q-9 4 -10 14 l-2 16 q0 4 4 4 l4 0 l1 30 q0 3 3 3 l8 0 q3 0 3 -3 l1 -30 l4 0 q4 0 4 -4 l-2 -16 q-1 -10 -10 -14 q3 -3 3 -9 q0 -8 -7 -8 z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.6"
                    />
                  </svg>
                </div>
                <div className="fs-lineup-meta">
                  <h3 className="fs-lineup-name">{c.name}</h3>
                  <p className="fs-lineup-desc">{c.desc}</p>
                </div>
                <div className="fs-lineup-status mono">RESIDENT · TBA</div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── SCENE 06: LINEAGE ── */}
        <section className="fs-lineage fs-reveal" aria-labelledby="fs-lineage-heading">
          <div className="fs-lineage-header">
            <div className="section-label">Community lineage</div>
            <h2 id="fs-lineage-heading" className="display fs-h2">
              Built on a community we&apos;ve been gathering for years.
            </h2>
            <p className="fs-lineage-sub mono">
              TOKYO · CAMBRIDGE · KOBE — ONE EMERGING CATEGORY: ENHANCED FASHION
            </p>
          </div>

          <div className="fs-lineage-grid">
            <article className="fs-lineage-card fs-lineage-card--upcoming">
              <div className="fs-lineage-img-wrap">
                <Image
                  src="/images/fs/luma.png"
                  alt="Frontier Human Fashion Show — Kobe, Japan · October 2026"
                  fill
                  sizes="(max-width: 980px) 100vw, 33vw"
                  className="fs-lineage-img"
                />
              </div>
              <div className="fs-lineage-meta">
                <span className="fs-lineage-tag mono">UPCOMING · JAPAN</span>
                <h3 className="fs-lineage-name display">Frontier Human Fashion Show</h3>
                <p className="fs-lineage-desc">
                  Kobe Port Island. The inaugural edition — closing Mirai Tech
                  PopUp City, October 2026.
                </p>
                <p className="fs-lineage-press mono">DOORS OPEN · OCT 2026</p>
              </div>
            </article>

            <article className="fs-lineage-card fs-lineage-card--past">
              <div className="fs-lineage-img-wrap">
                <Image
                  src="/images/fs/fttokyo.png"
                  alt="Frontier Humans · Enhanced Fashion Meetup — Tokyo"
                  fill
                  sizes="(max-width: 980px) 100vw, 33vw"
                  className="fs-lineage-img"
                />
              </div>
              <div className="fs-lineage-meta">
                <span className="fs-lineage-tag mono">TOKYO · NOV 2025</span>
                <h3 className="fs-lineage-name display">Enhanced Fashion Meetup</h3>
                <p className="fs-lineage-desc">
                  Shinjuku Higashiguchi. Frontier Humans Tokyo cohort, November 2025.
                </p>
                <p className="fs-lineage-press mono">RECAP · AVAILABLE ON REQUEST</p>
              </div>
            </article>

            <article className="fs-lineage-card fs-lineage-card--past">
              <div className="fs-lineage-img-wrap">
                <Image
                  src="/images/fs/hum.png"
                  alt="Human Augmentation Summit — MIT Media Lab"
                  fill
                  sizes="(max-width: 980px) 100vw, 33vw"
                  className="fs-lineage-img"
                />
              </div>
              <div className="fs-lineage-meta">
                <span className="fs-lineage-tag mono">CAMBRIDGE · AUG 2025</span>
                <h3 className="fs-lineage-name display">Human Augmentation Summit</h3>
                <p className="fs-lineage-desc">
                  MIT Media Lab. Augmentation Lab x Frontier Humans.
                </p>
                <p className="fs-lineage-press mono">MIT MEDIA LAB · PARTNER WRITE-UP</p>
              </div>
            </article>
          </div>
        </section>

        {/* ── SCENE 07: APPLY / ATTEND SPLIT ── */}
        <section className="fs-split fs-reveal" aria-label="Get involved">
          <a className="fs-split-card fs-split-card--apply" href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">
            <div className="fs-split-eyebrow mono">[ FOR BUILDERS ]</div>
            <h2 className="fs-split-title display">
              Apply to <em>Walk.</em>
            </h2>
            <p className="fs-split-sub">
              Device cohorts only. One prototype, one slot, one runway.
              Applications close Aug 27 — 60 days out.
            </p>
            <span className="fs-split-cta mono">APPLY NOW →</span>
          </a>
          <a
            className="fs-split-card fs-split-card--attend"
            href="mailto:pedro@frontierhumans.com?subject=Fashion%20Show%20-%20Get%20on%20the%20List"
          >
            <div className="fs-split-eyebrow mono">[ FOR EVERYONE ]</div>
            <h2 className="fs-split-title display">
              Get on the <em>List.</em>
            </h2>
            <p className="fs-split-sub">
              Seats are limited. Press, builders, friends of the residency.
              We&apos;ll send the door code.
            </p>
            <span className="fs-split-cta mono">REQUEST INVITE →</span>
          </a>
        </section>

        {/* ── SCENE 08: SPONSOR BAND (DEMOTED) ── */}
        <aside className="fs-sponsor-band fs-reveal" aria-label="Sponsor the show">
          <span className="fs-sponsor-eyebrow mono">[ FOR BRANDS ]</span>
          <span className="fs-sponsor-line">
            Sponsor the broadcast — Title, Runway, Category, and Media tiers.
          </span>
          <a className="fs-sponsor-link mono" href={SPONSOR_MAILTO}>
            REQUEST DECK →
          </a>
          <a className="fs-sponsor-link mono" href="/showcase">
            SHOWCASE YOUR COMPANY →
          </a>
        </aside>

        {/* ── FOOTER ── */}
        <section className="fs-footer">
          <div className="fs-attribution">
            <span className="mono fs-attribution-text">An event by</span>
            <Image
              src="/images/fs/frontierHumans.svg"
              alt="Frontier Humans"
              width={220}
              height={36}
              className="fs-attribution-logo"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
