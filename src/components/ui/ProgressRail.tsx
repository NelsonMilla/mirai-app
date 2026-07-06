'use client';

import React from 'react';
import { SECTIONS } from '@/lib/constants';
import { useActiveSection } from '@/hooks/useActiveSection';

export function ProgressRail() {
  const activeSection = useActiveSection(SECTIONS.map((s) => s.id));

  // Same scroll approach the Navbar links use.
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="progress-rail" aria-label="Section navigation">
      <ul className="progress-rail__list">
        {SECTIONS.map(({ id, railLabel }) => {
          const isActive = activeSection === id;
          return (
            <li key={id} className="progress-rail__item">
              <button
                type="button"
                className={`progress-rail__dot${isActive ? ' is-active' : ''}`}
                aria-label={`Go to ${railLabel}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => scrollTo(id)}
              >
                <span className="progress-rail__label" aria-hidden="true">{railLabel}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .progress-rail {
          position: fixed;
          top: 50%;
          right: 22px;
          transform: translateY(-50%);
          z-index: 40;
          pointer-events: none;
        }
        .progress-rail__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 18px;
        }
        .progress-rail__item {
          display: flex;
          justify-content: flex-end;
        }
        .progress-rail__dot {
          pointer-events: auto;
          position: relative;
          display: block;
          width: 10px;
          height: 10px;
          padding: 0;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          background: var(--slate);
          opacity: 0.4;
          transition: transform 0.3s ease, opacity 0.3s ease,
            background 0.3s ease, box-shadow 0.3s ease;
        }
        .progress-rail__dot:hover,
        .progress-rail__dot:focus-visible {
          opacity: 0.85;
          transform: scale(1.25);
        }
        .progress-rail__dot:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }
        .progress-rail__dot.is-active {
          background: var(--accent);
          opacity: 1;
          transform: scale(1.7);
          box-shadow: 0 0 12px rgba(var(--accent-rgb), 0.9);
        }
        .progress-rail__label {
          position: absolute;
          top: 50%;
          right: 22px;
          transform: translateY(-50%) translateX(6px);
          white-space: nowrap;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--white);
          background: rgba(10, 10, 18, 0.85);
          border: 1px solid rgba(var(--accent-rgb), 0.35);
          padding: 4px 9px;
          border-radius: 4px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .progress-rail__dot:hover .progress-rail__label,
        .progress-rail__dot:focus-visible .progress-rail__label {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
        @media (max-width: 900px) {
          .progress-rail {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .progress-rail__dot,
          .progress-rail__label {
            transition: none;
          }
        }
      `}</style>
    </nav>
  );
}
