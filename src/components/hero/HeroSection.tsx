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
            Japan&rsquo;s Premier Longevity Biomedical PopUp City
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
        <dl className="hero-stats">
          {HERO_STATS.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <dt className="hero-stat-value display">{stat.value}</dt>
              <dd className="hero-stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
