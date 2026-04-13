'use client';

import React from 'react';
import { useSound } from '@/components/audio/SoundContext';

export function Navbar() {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <>
      <nav>
        <a className="nav-logo" href="#">
          <div className="nav-mark">未</div>
          <span className="nav-name">Mirai Tech</span>
        </a>
        <div className="nav-links">
          <a href="#tracks">Tracks</a>
          <a href="#month">Program</a>
          <a href="#kobe">Kobe</a>
          <a className="btn btn-primary" href="/apply">Apply Now</a>
        </div>
      </nav>
      <button
        className={`sound-toggle ${soundEnabled ? 'active' : ''}`}
        onClick={toggleSound}
        title="Toggle ambient sound"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: soundEnabled ? 'var(--pink)' : 'var(--slate)' }}
        >
          {soundEnabled ? (
            <>
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" fill="currentColor" />
              <circle cx="18" cy="16" r="3" fill="currentColor" />
            </>
          ) : (
            <>
              <path d="M9 18V5l12-2v13" opacity="0.4" />
              <circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.4" />
              <circle cx="18" cy="16" r="3" fill="currentColor" opacity="0.4" />
              <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
