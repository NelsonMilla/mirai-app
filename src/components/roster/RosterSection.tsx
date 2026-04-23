'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { fighters, rosterPartners, rosterQuote } from '@/lib/constants';
import { useIntersection } from '@/hooks/useIntersection';

export default function RosterSection() {
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.05, triggerOnce: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [slotsRevealed, setSlotsRevealed] = useState(false);

  const selectedFighter = fighters[selectedIndex];

  // Stagger slot reveals when section enters view
  React.useEffect(() => {
    if (isIntersecting && !slotsRevealed) {
      setSlotsRevealed(true);
    }
  }, [isIntersecting, slotsRevealed]);

  const selectFighter = useCallback((idx: number) => {
    setSelectedIndex(idx);
    setFlash(false);
    requestAnimationFrame(() => setFlash(true));
  }, []);

  const tagColor: Record<string, string> = {
    Devices: '#6DB5F5',
    Therapies: '#F5C542',
    Builder: '#FF6B92',
    Incoming: '#8585A8',
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section reveal roster-section ${isIntersecting ? 'in' : ''}`}
      id="proof"
    >
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
                  slotsRevealed ? 'slot-revealed' : '',
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
                  ) : (
                    <span className="slot-initial">?</span>
                  )}
                </div>
                <div className="slot-nameplate">
                  <span className="slot-name">{fighter.name}</span>
                  <span className="slot-tag" style={{ color: tagColor[fighter.tag] || '#8585A8' }}>{fighter.tag}</span>
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
                <div className="fighter-bio">{selectedFighter.bio}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: count + partners */}
      <div className="roster-bottom">
        <div className="roster-count-inline">
          <span className="roster-count-num display">{fighters.filter(f => !f.mystery).length + 2}</span>
          <span className="roster-count-sep">/</span>
          <span className="roster-count-total">24</span>
          <span className="roster-count-label mono">Fighters confirmed</span>
        </div>
        <div className="roster-partners">
          {rosterPartners.map((partner) => (
            <span key={partner} className="roster-partner mono">{partner}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
