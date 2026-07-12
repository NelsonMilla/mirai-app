'use client';

import { useEffect, useRef } from 'react';
import { runwayDevices } from '@/lib/constants';
import { RevealSection } from '@/components/ui/RevealSection';

// Device-category glyphs for the mystery-reveal slots (9 total, matching the
// fashion-show lineup's "0 / 9 PRESENTERS REVEALED" counter). Borrowed look
// only — kanji echo the /fashion-show lineup cards.
const TEASER_SLOTS = ['鎧', '脳', '義', '感', '触', '機', '衣', '視', '命'];

export default function RunwaySection() {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (blockRef.current) {
        const rect = blockRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
        const parallaxOffset = scrollProgress * 30;
        blockRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <RevealSection id="runway" variant="reveal-track">
      <div className="section-label">The Runway</div>

      <div className="runway-block" ref={blockRef}>
        {/* Date slate — ticket-stub / call-sheet idiom, borrowed from /fashion-show */}
        <div className="rw-slate mono" aria-label="Show date: October 26, 2026 at 19:00 Japan Standard Time">
          <span aria-hidden="true">10</span>
          <span className="rw-slate-slash" aria-hidden="true">/</span>
          <span aria-hidden="true">26</span>
          <span className="rw-slate-slash" aria-hidden="true">/</span>
          <span aria-hidden="true">2026</span>
          <span className="rw-slate-dot" aria-hidden="true" />
          <span aria-hidden="true">19:00 JST</span>
        </div>

        <h2 className="runway-title display">
          The Frontier Human<br />
          <em>Fashion Show</em>
        </h2>

        <p className="runway-desc">
          A live demo day reimagined as a runway show. Device residents showcase their medical technology prototypes on models, blending cutting-edge science with high fashion. Think CES meets Tokyo Fashion Week — but everyone&apos;s wearing exoskeletons and neural interfaces.
        </p>

        <div className="runway-devices">
          {runwayDevices.map((device) => (
            <span key={device} className="rd">
              {device}
            </span>
          ))}
        </div>

        {/* Mystery teaser + CTA — whole row links to the dedicated show page */}
        <a
          className="rw-teaser"
          href="/fashion-show"
          aria-label="Explore the Frontier Human Fashion Show — 0 of 9 presenters revealed"
        >
          <div className="rw-teaser-line">
            <span className="rw-teaser-count mono">0 / 9 PRESENTERS REVEALED</span>
            <ul className="rw-slots" role="presentation" aria-hidden="true">
              {TEASER_SLOTS.map((glyph, i) => (
                <li key={i} className="rw-slot">
                  <span className="rw-slot-glyph jp">{glyph}</span>
                  <span className="rw-slot-q mono">?</span>
                </li>
              ))}
            </ul>
          </div>
          <span className="rw-cta mono">
            Explore the show <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </RevealSection>
  );
}
