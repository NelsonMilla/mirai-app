'use client';

import React from 'react';
import { useSound } from '@/components/audio/SoundContext';

export function Navbar() {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <nav>
      <a className="nav-logo" href="#">
        <div className="nav-mark">未</div>
        <span className="nav-name">Mirai Tech</span>
      </a>
      <div className="nav-links">
        <a href="#tracks">Tracks</a>
        <a href="#month">Program</a>
        <a href="#kobe">Kobe</a>
        <button
          className={`sound-toggle ${soundEnabled ? 'active' : ''}`}
          onClick={toggleSound}
          title="Toggle ambient sound"
        >
          <div className="sound-bars">
            <div className="sound-bar" style={{ height: '3px' }} />
            <div className="sound-bar" style={{ height: '6px' }} />
            <div className="sound-bar" style={{ height: '4px' }} />
          </div>
        </button>
        <a className="btn btn-primary" href="#apply">Apply Now</a>
      </div>
    </nav>
  );
}
