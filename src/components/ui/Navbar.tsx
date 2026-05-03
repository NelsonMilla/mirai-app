'use client';

import React, { useEffect, useState } from 'react';
import { InviteCodeLink } from '@/components/ui/InviteCodeLink';

const NAV_ITEMS = [
  { id: 'tracks', label: 'Tracks' },
  { id: 'month', label: 'Program' },
  { id: 'kobe', label: 'Kobe' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav>
      <a className="nav-logo" href="/">
        <div className="nav-mark">未</div>
        <span className="nav-name">Mirai Tech</span>
      </a>
      <div className="nav-links">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            className={`nav-btn${activeSection === id ? ' active' : ''}`}
            onClick={() => scrollTo(id)}
          >
            {label}
          </button>
        ))}
        <InviteCodeLink variant="nav" />
        <a className="btn btn-primary" href="/apply">Apply Now</a>
      </div>
    </nav>
  );
}
