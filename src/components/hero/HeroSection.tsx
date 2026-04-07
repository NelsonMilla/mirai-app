'use client';

import { useEffect, useRef } from 'react';
import { useScrollState } from '@/hooks/useScrollState';

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
        <div className="hero-eyebrow">KOBE PORT ISLAND · OCTOBER 2026</div>
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
          Three tracks. One month. Kobe&rsquo;s Port Island. Biomedical devices, therapeutic pathways, and the
          builder community — culminating in the Frontier Human Fashion Show.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#apply">
            Apply Now
          </a>
          <a className="btn btn-outline" href="#tracks">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
