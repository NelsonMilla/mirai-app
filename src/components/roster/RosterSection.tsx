'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { fighters, rosterPartners, tagColors, ROSTER_TOTAL } from '@/data/fighters';
import { RevealSection } from '@/components/ui/RevealSection';
import { PixelAvatar } from './PixelAvatar';

// TODO(Nelson): confirm the real URL of the TCG full-roster page. /roster is a placeholder.
const FULL_ROSTER_URL = '/roster';

export default function RosterSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  const headliners = fighters.filter((f) => f.headliner);
  const supporting = fighters.filter((f) => !f.headliner && !f.mystery);
  const challengers = fighters.filter((f) => f.mystery);

  const selectedFighter = headliners[selectedIndex];

  const selectFighter = useCallback((idx: number) => {
    setSelectedIndex(idx);
    setFlash(false);
    requestAnimationFrame(() => setFlash(true));
  }, []);

  return (
    <RevealSection id="proof" className="roster-section" threshold={0.05} once>
      {(inView) => (
        <>
      {/* Header */}
      <div className="roster-header">
        <div className="roster-title mono">Select Your Fighter</div>
        <div className="roster-subtitle display"><em>Speakers</em> &amp; Residents</div>
      </div>

      {/* Main card: headliner selector + detail panel */}
      <div className="roster-arena">
        {/* LEFT: Top-billing selector */}
        <div className="roster-selector">
          <div className="selector-label mono">★ Top Billing ★</div>
          <div className="roster-grid">
            {headliners.map((fighter, idx) => (
              <div
                key={fighter.fullName}
                className={[
                  'roster-slot',
                  selectedIndex === idx ? 'selected' : '',
                  inView ? 'slot-revealed' : '',
                ].filter(Boolean).join(' ')}
                style={{ '--slot-i': idx } as React.CSSProperties}
                onClick={() => selectFighter(idx)}
              >
                <div className="slot-portrait">
                  {fighter.photo ? (
                    <Image
                      src={fighter.photo}
                      alt={fighter.name}
                      fill
                      sizes="200px"
                      style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                    />
                  ) : (
                    <PixelAvatar
                      seed={fighter.fullName}
                      color={tagColors[fighter.tag]}
                      className="slot-avatar"
                    />
                  )}
                </div>
                <div className="slot-nameplate">
                  <span className="slot-name">{fighter.name}</span>
                  <span className="slot-tag" style={{ color: tagColors[fighter.tag] }}>{fighter.tag}</span>
                  {fighter.hook && <span className="slot-hook">{fighter.hook}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Fighter detail panel */}
        <div className="fighter-panel has-fighter">
          <div className="fighter-detail">
            <div className={`fighter-portrait ${flash ? 'flash' : ''}`} onAnimationEnd={() => setFlash(false)}>
              {selectedFighter.photo && (
                <>
                  <Image
                    src={selectedFighter.photo}
                    alt=""
                    fill
                    sizes="660px"
                    className="fighter-portrait-blur"
                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                    aria-hidden="true"
                  />
                  <Image
                    src={selectedFighter.photo}
                    alt={selectedFighter.fullName}
                    fill
                    sizes="660px"
                    className="fighter-portrait-main"
                    style={{ objectFit: 'contain', objectPosition: 'center top' }}
                    priority
                  />
                </>
              )}
              {!selectedFighter.photo && (
                <div className="fighter-avatar-wrap">
                  <PixelAvatar
                    seed={selectedFighter.fullName}
                    color={tagColors[selectedFighter.tag]}
                    className="fighter-avatar"
                  />
                  <span className="fighter-avatar-caption mono">PORTRAIT INCOMING</span>
                </div>
              )}
            </div>
            <div className="fighter-meta">
              <div className="fighter-name display">{selectedFighter.fullName}</div>
              <div className="fighter-title mono">{selectedFighter.title}</div>
              {selectedFighter.special && (
                <div className="fighter-special mono">
                  <span className="special-label">SPECIAL</span>
                  <span className="special-name">{selectedFighter.special}</span>
                </div>
              )}
              {selectedFighter.stats && (
                <div className="fighter-stats">
                  {selectedFighter.stats.map((s, i) => (
                    <div key={i} className="fighter-stat">
                      <span className="fighter-stat-label mono">{s.label}</span>
                      <div className="fighter-stat-bar">
                        <div
                          className="fighter-stat-fill"
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                      <span className="fighter-stat-val mono">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {!selectedFighter.stats && (
                <div className="fighter-bio">
                  {selectedFighter.bio?.trim() || 'Bio coming soon...'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supporting bill: every other confirmed speaker, poster lower-third style */}
      <div className="roster-bill">
        <div className="bill-label mono">Also in the arena</div>
        <div className="bill-names">
          {supporting.map((fighter) => (
            <span key={fighter.fullName} className="bill-name mono">
              <span className="bill-dot" style={{ background: tagColors[fighter.tag] }} />
              {fighter.fullName}
            </span>
          ))}
        </div>
        {challengers.length > 0 && (
          <div className="bill-challengers mono" style={{ color: tagColors.Incoming }}>
            + {challengers.length} challengers approaching · September 2026
          </div>
        )}
      </div>

      {/* CTA to the full TCG roster page */}
      <div className="roster-cta">
        <a href={FULL_ROSTER_URL} className="roster-cta-link mono">View Full Roster →</a>
      </div>

      {/* Bottom row: count + partners */}
      <div className="roster-bottom">
        <div className="roster-count-inline">
          <span className="roster-count-num display">{fighters.filter(f => !f.mystery).length}</span>
          <span className="roster-count-sep">/</span>
          <span className="roster-count-total">{ROSTER_TOTAL}</span>
          <span className="roster-count-label mono">Fighters confirmed</span>
        </div>
        <div className="roster-partners">
          {rosterPartners.map((partner) => (
            <span key={partner} className="roster-partner mono">{partner}</span>
          ))}
        </div>
      </div>
        </>
      )}
    </RevealSection>
  );
}
