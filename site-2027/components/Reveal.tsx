'use client';
// Adds .in to every .rv element as it scrolls into view (same as new-site).
import { useEffect } from 'react';

export function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv:not(.in)');
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
