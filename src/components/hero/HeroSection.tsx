'use client';

import { useEffect, useRef } from 'react';
import { useScrollState } from '@/hooks/useScrollState';

const HERO_STATS = [
  { value: '4', label: 'Weeks' },
  { value: '300', label: 'Residents' },
  { value: '30', label: 'Residency Companies' },
  { value: '5', label: 'Summit Days' },
] as const;

export function HeroSection() {
  const heroKanjiRef = useRef<HTMLDivElement>(null);
  const { scroll } = useScrollState();

  // Parallax effect on hero kanji
  useEffect(() => {
    const kanji = heroKanjiRef.current;
    if (!kanji) return;

    // Only update within first 1.5 viewport heights for performance
    if (scroll < window.innerHeight * 1.5) {
      kanji.style.transform = `translate(-50%, calc(-55% + ${scroll * 0.2}px))`;
    }
  }, [scroll]);

  return (
    <section className="hero" data-section="hero">
      <div className="hero-bg"></div>
      <div className="hero-kanji" id="heroKanji" ref={heroKanjiRef}>
        未来
      </div>
      <div className="hero-inner">
        <div className="hero-eyebrow hero-eyebrow--split">
          <span className="hero-eyebrow-tagline">
            Japan&rsquo;s Premier Longevity Biomedical Pop-up City
          </span>
          <span className="hero-eyebrow-meta">Kobe Port Island · October 2026</span>
        </div>
        <h1 className="display">
          <span className="line">
            <span className="line-inner">Build the</span>
          </span>
          <span className="line">
            <span className="line-inner">
              <em>future</em>
            </span>
          </span>
          <span className="line">
            <span className="line-inner">of biotech —</span>
          </span>
          <span className="line">
            <span className="line-inner">in 4 weeks</span>
          </span>
        </h1>
        <p className="hero-sub">
          One month of co-building at KBIC — Japan&rsquo;s most advanced biomedical National Strategic
          Special Zone. Three tracks moving from &ldquo;working on it&rdquo; to &ldquo;in patients&rdquo; —
          culminating in the Frontier Human Fashion Show.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#apply">
            Apply Now
          </a>
          <a className="btn btn-outline" href="#tracks">
            Learn More
          </a>
        </div>
        <dl className="hero-stats">
          {HERO_STATS.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <dt className="hero-stat-value display">{stat.value}</dt>
              <dd className="hero-stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <style>{`
        /* Two stacked centered lines: the one-line layout sat right at the
           800px .hero-inner cap and wrapped unpredictably, orphaning the
           separator dot. */
        .hero-eyebrow--split {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .hero-eyebrow-tagline {
          color: var(--pink);
        }
        .hero-eyebrow-meta {
          color: var(--slate);
        }
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
          max-width: 560px;
          margin: 1.5rem auto 0;
          border-top: 1px solid rgba(133, 133, 168, 0.22);
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.95s both;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          padding: 0.95rem 0.5rem 0;
          border-left: 1px solid rgba(133, 133, 168, 0.16);
        }
        .hero-stat:first-child {
          border-left: none;
        }
        .hero-stat-value {
          font-size: clamp(1.6rem, 3.5vw, 2.15rem);
          font-weight: 300;
          line-height: 1;
          color: var(--white);
        }
        .hero-stat-label {
          margin: 0;
          font-family: var(--font-jetbrains), monospace;
          font-size: var(--fs-label);
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--slate);
        }
        /* On viewports shorter than the full-size hero (~1132px tall) the
           whole hero can't fit at full scale. Shrink the HEADLINE and inner
           margins to reclaim space — but NEVER the top padding: it must keep
           clearing the fixed ~85px navbar with a gap, or the eyebrow jams
           against the nav. (Base desktop padding-top is 8rem = 128px.) */
        @media (min-width: 641px) and (max-height: 1130px) {
          .hero {
            padding-bottom: 2.5rem;
          }
          .hero-eyebrow {
            margin-bottom: 1.5rem;
          }
          .hero h1 {
            font-size: clamp(3.5rem, 7vw, 6rem);
            margin-bottom: 1.25rem;
          }
          .hero-sub {
            margin-bottom: 1.25rem;
          }
        }
        /* Laptop heights (16" MacBook ≈ 900px, down to ~745px): the 6rem
           headline would push the stat strip below the fold, so drop to a
           smaller headline. Top padding still inherits the 8rem nav clearance
           above; content simply centers in the remaining space. */
        @media (min-width: 641px) and (max-height: 940px) {
          .hero {
            padding-bottom: 1.5rem;
          }
          .hero-eyebrow {
            margin-bottom: 1rem;
          }
          .hero h1 {
            font-size: clamp(2.75rem, 5.5vw, 4.5rem);
            margin-bottom: 1rem;
          }
          .hero-sub {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          .hero-stats {
            margin-top: 1rem;
          }
          .hero-stat {
            padding-top: 0.7rem;
          }
        }
        @media (max-width: 640px) {
          .hero-eyebrow-meta {
            font-size: calc(var(--fs-label) - 0.5px);
            letter-spacing: 0.18em;
          }
          .hero-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            max-width: 340px;
          }
          .hero-stat {
            padding: 1rem 0.5rem;
            border-left: 1px solid rgba(133, 133, 168, 0.16);
            border-top: 1px solid rgba(133, 133, 168, 0.16);
          }
          .hero-stat:nth-child(-n + 2) {
            border-top: none;
          }
          .hero-stat:nth-child(odd) {
            border-left: none;
          }
        }
        html.loading .hero-eyebrow,
        html.loading .hero-stats {
          animation: none !important;
          opacity: 0 !important;
        }
      `}</style>
    </section>
  );
}
