'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which page section currently occupies the middle band of the
 * viewport. Shared by the Navbar and ProgressRail so they can never
 * disagree about what "active" means.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join(',');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    key.split(',').forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [key]);

  return activeId;
}
