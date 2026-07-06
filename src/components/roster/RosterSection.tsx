'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { fighters, rosterPartners, tagColors, ROSTER_TOTAL } from '@/data/fighters';
import { RevealSection } from '@/components/ui/RevealSection';
import { PixelAvatar } from './PixelAvatar';

export default function RosterSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  const selectedFighter = fighters[selectedIndex];

  const selectFighter = useCallback((idx: number) => {
    setSelectedIndex(idx);
    setFlash(false);
    requestAnimationFrame(() => setFlash(true));
  }, []);

  return (
    <RevealSection id="proof" className="roster-section" threshold={0.05} once>
      {(inView) => (
        <>
      {/* Scoped styles for the interim pixel-avatar treatment (photo-pending
          confirmed fighters). Fold into landing.css when next touched. */}
      <style>{`
        .slot-avatar {
          position: absolute; inset: 12%; width: 76%; height: 76%;
          z-index: 1; opacity: 0.9;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5)) saturate(0.8) brightness(0.85);
          transition: filter 0.2s, opacity 0.2s;
        }
        .roster-slot:hover .slot-avatar,
        .roster-slot.selected .slot-avatar {
          opacity: 1; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.55)) saturate(1) brightness(1);
        }
        .fighter-avatar-wrap {
          position: absolute; inset: 0; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.9rem;
          padding-bottom: 22%;
        }
        .fighter-avatar {
          width: 42%; max-width: 220px; height: auto; aspect-ratio: 1;
          filter: drop-shadow(0 6px 18px rgba(0,0,0,0.5));
          animation: avatar-breathe 4s ease-in-out infinite;
        }
        @keyframes avatar-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.02); }
        }
        .fighter-avatar-caption {
          font-size: var(--fs-label); letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.12);
          padding: 0.3rem 0.7rem; border-radius: 2px;
          background: rgba(0,0,0,0.25);
        }
      `}</style>
      {/* Header */}
      <div className="roster-header">
        <div className="roster-title mono">Select Your Fighter</div>
        <div className="roster-subtitle display"><em>Speakers</em> &amp; Residents</div>
      </div>

      {/* Arena: left selector + right detail */}
      <div className="roster-arena">
        {/* LEFT: Character selector grid */}
        <div className="roster-selector">
          <div className="selector-label mono">Choose a fighter</div>
          <div className="roster-grid">
            {fighters.map((fighter, idx) => (
              <div
                key={idx}
                className={[
                  'roster-slot',
                  selectedIndex === idx ? 'selected' : '',
                  fighter.mystery ? 'mystery' : '',
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
                      sizes="150px"
                      style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                    />
                  ) : fighter.mystery ? (
                    <span className="slot-initial">?</span>
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
              {!selectedFighter.photo && !selectedFighter.mystery && (
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
                          style={{ width: flash || !selectedFighter.mystery ? `${s.value}%` : '0%' }}
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
