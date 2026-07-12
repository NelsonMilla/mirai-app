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
    </nav>
  );
}
