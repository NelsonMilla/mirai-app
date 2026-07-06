'use client';

import React from 'react';
import Image from 'next/image';
import { communities } from '@/data/communities';
import { RevealSection } from '@/components/ui/RevealSection';

export default function CommunitiesSection() {
  return (
    <RevealSection id="communities" threshold={0.05} once>
      {(inView) => (
        <>
          <div className="section-label">Ecosystem</div>

          <h2 className="communities-title display">
            The communities <em>behind it</em>
          </h2>

          <div className="communities-grid">
            {communities.map((community, idx) => (
              <a
                key={community.name}
                href={community.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`community-tile ${inView ? 'tile-in' : ''}`}
                style={{ '--tile-i': idx } as React.CSSProperties}
                aria-label={community.name}
              >
                <div className={`community-logo-box ${community.lightBg ? 'light-chip' : ''}`}>
                  {community.logo ? (
                    <Image
                      src={community.logo}
                      alt={community.name}
                      fill
                      sizes="(max-width: 640px) 40vw, 200px"
                      className="community-logo"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <span className="community-placeholder display">{community.name}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </RevealSection>
  );
}
