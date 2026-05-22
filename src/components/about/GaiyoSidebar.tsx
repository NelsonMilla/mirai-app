'use client';

import React, { useEffect, useState } from 'react';

/**
 * GaiyoSidebar — sticky 280px right rail (desktop ≥ 1100px) with:
 *   - brand line (Mirai Tech · 会社案内 / Corporate outline)
 *   - compressed §01 facts (single source of truth — same values as the table)
 *   - section nav with IntersectionObserver-driven active-section dot
 *
 * Below 1100px the sidebar drops into the document flow as a top-bar-like
 * block (handled in CSS). The active-section observer still runs but the
 * sticky behavior is disabled.
 */

export type SidebarFact = { key: string; value: React.ReactNode };
export type SidebarSection = { id: string; num: string; en: string; ja?: string };

export function GaiyoSidebar({
  facts,
  sections,
}: {
  facts: SidebarFact[];
  sections: SidebarSection[];
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <aside className="gaiyo-sidebar" aria-label="Corporate outline">
      <div className="gaiyo-sidebar-brand">
        <div className="gaiyo-sidebar-name">Mirai Tech</div>
        <div className="gaiyo-sidebar-tag mono">会社案内 · Corporate outline</div>
      </div>

      <dl className="gaiyo-sidebar-facts">
        {facts.map((f, i) => (
          <div key={i} className="gaiyo-sidebar-fact">
            <dt className="mono">{f.key}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <nav className="gaiyo-sidebar-nav" aria-label="Sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`gaiyo-sidebar-nav-item${activeId === s.id ? ' active' : ''}`}
          >
            <span className="gaiyo-sidebar-nav-num">{s.num}</span>
            <span className="gaiyo-sidebar-nav-label">{s.en}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
