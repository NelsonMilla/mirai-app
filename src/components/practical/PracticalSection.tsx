'use client';

import React from 'react';
import { RevealSection } from '@/components/ui/RevealSection';
import {
  stayIntro,
  stayLinks,
  communityLinks,
} from '@/data/practical';

export default function PracticalSection() {
  // Portopia (the partner hotel) leads the data and leads the layout —
  // photo-backed feature card; the other stays form the constellation.
  const [portopia, ...others] = stayLinks;
  const [chipText, ribbonText] = portopia.meta.split(' · ');

  return (
    <RevealSection id="practical" dataSection="practical" variant="reveal-track">
      <div className="section-label">On the Ground</div>

      <h2 className="display practical-headline">
        Landing is <em>handled</em>.
      </h2>

      {/* GROUP 1 — Stay */}
      <div className="practical-group">
        <h3 className="practical-group-title mono stagger">Stay</h3>
        <p className="practical-intro stagger">{stayIntro}</p>

        <div className="practical-stay-grid stagger">
          {/* Feature — keyed to Portopia's violet station color on the map */}
          <a
            className="practical-feature"
            href={portopia.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="practical-feature-photo">
              <img
                src="/images/map/portopia.jpg"
                alt={`${portopia.name} — night view over Kobe`}
                loading="lazy"
              />
              <span className="dot-photo-credit mono">© Kobe Tourism Bureau</span>
            </div>
            <div className="practical-feature-body">
              <span className="practical-feature-chip mono">{chipText}</span>
              <span className="practical-feature-name display">{portopia.name}</span>
              <span className="practical-feature-ribbon mono">{ribbonText}</span>
              <span className="practical-kanji" aria-hidden="true">泊</span>
              <span className="practical-arrow mono" aria-hidden="true">↗</span>
            </div>
          </a>

          {/* Constellation — the hacker houses + independent stays */}
          <div className="practical-constellation">
            {others.map((link, i) => (
              <a
                key={link.name}
                className="practical-row"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="practical-row-index mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="practical-row-name display">{link.name}</span>
                <span className="practical-row-meta mono">{link.meta}</span>
                <span className="practical-arrow mono" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* GROUP 2 — Community. Cards with placeholder '#' hrefs render as
          non-anchors (dashed, dimmed) until real URLs land in practical.ts —
          the strip upgrades itself with no design work. */}
      <div className="practical-group">
        <h3 className="practical-group-title mono stagger">Community</h3>

        <div className="practical-community stagger">
          {communityLinks.map((link) => {
            const pending = link.href === '#';
            const inner = (
              <>
                <span className="practical-community-name display">{link.name}</span>
                <span className="practical-community-desc">{link.description}</span>
                <span className="practical-community-dot" aria-hidden="true" />
              </>
            );
            return pending ? (
              <div
                key={link.name}
                className="practical-community-card is-pending"
                aria-disabled="true"
              >
                {inner}
              </div>
            ) : (
              <a
                key={link.name}
                className="practical-community-card"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
