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

  // Parallax drift on the neon sign
  useEffect(() => {
    const kanji = heroKanjiRef.current;
    if (!kanji) return;

    // Only update within first 1.5 viewport heights for performance
    if (scroll < window.innerHeight * 1.5) {
      kanji.style.setProperty('--drift', `${scroll * 0.15}px`);
    }
  }, [scroll]);

  return (
    <section className="hero" data-section="hero">
      <div className="hero-bg"></div>
      <div className="hero-kanji" id="heroKanji" ref={heroKanjiRef} aria-hidden="true">
        <div className="hero-kanji-glyphs">
          <span className="hero-kanji-glyph">未</span>
          <span className="hero-kanji-glyph">来</span>
        </div>
        <span className="hero-kanji-plaque">Mirai — The Future</span>
      </div>
      <div className="hero-inner">
        <p className="hero-eyebrow">
          Japan&rsquo;s Premier Longevity Biomedical PopUp City
        </p>
        <h1 className="display">
          <span className="line">
            <span className="line-inner">Build the</span>
          </span>
          <span className="line">
            <span className="line-inner">
              <em>future</em>{' '}of health&thinsp;&mdash;
            </span>
          </span>
          <span className="line">
            <span className="line-inner">in 4 weeks</span>
          </span>
        </h1>
        <p className="hero-sub">
          One month of co-building at KBIC, Japan&rsquo;s largest biomedical cluster. Three tracks
          that move you from &ldquo;working on it&rdquo; to &ldquo;in patients,&rdquo; culminating in
          the Frontier Human Fashion Show.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#apply">
            Apply Now
          </a>
          <a className="btn btn-outline" href="#city">
            Learn More
          </a>
        </div>
      </div>
      <div className="hero-readout">
        <span className="hero-readout-loc">
          Kobe Port Island &middot; October 1&ndash;31, 2026
        </span>
        <span className="hero-readout-stats">
          {HERO_STATS.map((stat) => (
            <span className="hero-readout-stat" key={stat.label}>
              <b>{stat.value}</b> {stat.label}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}
