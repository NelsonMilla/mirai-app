'use client';
// A 2px cyan reading-progress bar along the top, and a sticky contents rail that
// highlights the section being read. The rail only shows on wide screens.
import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/post-format';
import { CopyLink } from './CopyLink';

export function ReadingRail({ toc }: { toc: TocItem[] }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(toc[0]?.id);

  useEffect(() => {
    const body = document.querySelector('.prose');
    if (!body) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = body.getBoundingClientRect();
        const total = r.height - innerHeight * 0.6;
        setProgress(Math.min(1, Math.max(0, -r.top / Math.max(1, total))));
        let cur = toc[0]?.id;
        for (const t of toc) {
          const el = document.getElementById(t.id);
          if (el && el.getBoundingClientRect().top < innerHeight * 0.3) cur = t.id;
        }
        setActive(cur);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [toc]);

  return (
    <>
      <div className="readBar" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <aside className="rail" aria-label="Contents">
        <div className="railInner">
          {toc.length > 1 && (
            <>
              <p className="mono">Contents</p>
              <ol>
                {toc.map((t, i) => (
                  <li key={t.id} className={t.id === active ? 'on' : undefined}>
                    <a href={`#${t.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{t.text}</a>
                  </li>
                ))}
              </ol>
            </>
          )}
          <p className="mono railPct">{Math.round(progress * 100)}% read</p>
          <CopyLink />
        </div>
      </aside>
    </>
  );
}
