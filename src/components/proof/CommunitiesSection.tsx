'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { communities } from '@/data/communities';
import { RevealSection } from '@/components/ui/RevealSection';

// Partnership contact for the open slot.
const SPONSOR_HREF = 'mailto:pedro@frontierhumans.com';

// Cells are padded to a full row at every breakpoint. Column counts are 2
// (mobile) and 4 (641px+), so padding to a multiple of 4 covers both.
const GRID_MODULE = 4;

/** Ticks 00 → total while the section is in view (skips animation for reduced motion). */
function CreditCounter({ total, run }: { total: number; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(total);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= total) clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, [run, total]);
  return <span className="eco-credit">{String(n).padStart(2, '0')}</span>;
}

export default function CommunitiesSection() {
  const total = communities.length;
  const fillers = (GRID_MODULE - ((total + 1) % GRID_MODULE)) % GRID_MODULE;
  // The 2-column mobile grid needs fewer fillers (fillers % 2) — the rest
  // carry eco-blank--wide and are hidden below 641px so no blank row forms.
  const mobileFillers = fillers % 2;

  return (
    <RevealSection id="communities" threshold={0.05} once>
      {(inView) => (
        <>
          <div className="section-label">Ecosystem</div>

          <h2 className="communities-title display">
            The communities <em>behind it</em>
          </h2>

          <div className="eco-monolith">
            <div className="eco-marquee mono">
              <span>Licensed partners</span>
              <span>▸ credit <CreditCounter total={total} run={inView} /></span>
            </div>

            <div className="eco-grid">
              {communities.map((community, idx) => (
                <a
                  key={community.name}
                  href={community.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    'eco-cell',
                    community.logo ? `eco-${community.treatment ?? 'stamp'}` : '',
                    inView ? 'cell-in' : '',
                  ].filter(Boolean).join(' ')}
                  style={{ '--cell-i': idx } as React.CSSProperties}
                  aria-label={community.name}
                >
                  {community.logo ? (
                    <span className="eco-mark">
                      <Image
                        src={community.logo}
                        alt={community.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 240px"
                        style={{ objectFit: 'contain' }}
                      />
                    </span>
                  ) : (
                    <span className="eco-wordmark display">{community.name}</span>
                  )}
                  <span className="eco-caption mono">
                    {String(idx + 1).padStart(2, '0')} · {community.name}
                  </span>
                </a>
              ))}

              {/* The wall openly recruits: the next credit is always for sale. */}
              <a
                href={SPONSOR_HREF}
                className={`eco-cell eco-cta ${inView ? 'cell-in' : ''}`}
                style={{ '--cell-i': total } as React.CSSProperties}
              >
                <span className="eco-cta-line mono">Your logo here</span>
                <span className="eco-caption mono">
                  {String(total + 1).padStart(2, '0')} · Continue?<span className="eco-blink">▮</span>
                </span>
              </a>

              {Array.from({ length: fillers }, (_, i) => (
                <div
                  key={`blank-${i}`}
                  className={[
                    'eco-cell eco-blank',
                    i >= mobileFillers ? 'eco-blank--wide' : '',
                    inView ? 'cell-in' : '',
                  ].filter(Boolean).join(' ')}
                  style={{ '--cell-i': total + 1 + i } as React.CSSProperties}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </>
      )}
    </RevealSection>
  );
}
