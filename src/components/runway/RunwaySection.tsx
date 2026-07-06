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

      <style jsx>{`
        /* Date slate — sharp mono call-sheet stub above the title */
        .rw-slate {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--pink);
          padding: 0.4rem 0.85rem;
          margin-bottom: 1.25rem;
          border: 1px solid rgba(245, 160, 181, 0.35);
          border-radius: 4px;
          background: rgba(245, 160, 181, 0.05);
        }
        .rw-slate-slash {
          color: rgba(245, 160, 181, 0.45);
        }
        .rw-slate-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--pink);
          opacity: 0.6;
          margin: 0 0.15rem;
        }

        /* Teaser row — a quiet catwalk of dark, ?-filled slots ending in a CTA */
        .rw-teaser {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem 1.5rem;
          margin-top: 2rem;
          padding-top: 1.75rem;
          text-decoration: none;
          /* Runway strip: thin gradient line of light the slots sit along */
          border-top: 1px solid transparent;
          border-image: linear-gradient(
              90deg,
              transparent,
              rgba(245, 160, 181, 0.55),
              transparent
            )
            1;
          transition: opacity 0.25s ease;
        }
        .rw-teaser:hover {
          opacity: 0.95;
        }
        .rw-teaser:focus-visible {
          outline: 2px solid var(--pink);
          outline-offset: 6px;
          border-radius: 4px;
        }

        .rw-teaser-line {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .rw-teaser-count {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          color: var(--slate);
          white-space: nowrap;
        }

        .rw-slots {
          display: flex;
          gap: 0.4rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .rw-slot {
          position: relative;
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(245, 160, 181, 0.22);
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.35);
          color: var(--slate);
          overflow: hidden;
          transition: color 0.25s, border-color 0.25s;
        }
        .rw-slot-glyph {
          font-size: 0.8rem;
          opacity: 0.28;
          transition: opacity 0.25s;
        }
        .rw-slot-q {
          position: absolute;
          font-size: 0.7rem;
          font-weight: 700;
          opacity: 0.55;
          transition: opacity 0.25s;
        }
        .rw-teaser:hover .rw-slot {
          border-color: rgba(245, 160, 181, 0.45);
          color: var(--pink);
        }
        .rw-teaser:hover .rw-slot-glyph {
          opacity: 0.5;
        }
        .rw-teaser:hover .rw-slot-q {
          opacity: 0.15;
        }

        .rw-cta {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--pink);
          white-space: nowrap;
        }
        .rw-cta span {
          display: inline-block;
          transition: transform 0.25s;
        }
        .rw-teaser:hover .rw-cta span,
        .rw-teaser:focus-visible .rw-cta span {
          transform: translateX(4px);
        }

        @media (max-width: 640px) {
          .rw-teaser {
            gap: 0.85rem;
          }
          .rw-slot {
            width: 22px;
            height: 22px;
          }
        }
      `}</style>
    </RevealSection>
  );
}
