'use client';

import React from 'react';
import { LUMA_EVENT_URL, SECTIONS } from '@/lib/constants';
import { useActiveSection } from '@/hooks/useActiveSection';

const NAV_ITEMS = SECTIONS.filter(
  (s): s is typeof s & { navLabel: string } => s.navLabel !== undefined,
);

export function Navbar() {
  const activeSection = useActiveSection(NAV_ITEMS.map((s) => s.id));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="site-nav">
      <a className="nav-logo" href="/">
        <div className="nav-mark">未</div>
        <span className="nav-name">Mirai Tech</span>
      </a>
      <div className="nav-links">
        {NAV_ITEMS.map(({ id, navLabel }) => (
          <button
            key={id}
            className={`nav-btn${activeSection === id ? ' active' : ''}`}
            onClick={() => scrollTo(id)}
          >
            {navLabel}
          </button>
        ))}
        <a className="btn btn-primary" href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">Apply Now</a>
      </div>
    </nav>
  );
}
