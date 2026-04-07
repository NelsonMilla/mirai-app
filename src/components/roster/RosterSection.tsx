'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { fighters, rosterPartners, rosterQuote, Fighter } from '@/lib/constants';
import { useIntersection } from '@/hooks/useIntersection';

export default function RosterSection() {
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.05, triggerOnce: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [counted, setCounted] = useState(false);
  const [countValue, setCountValue] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);

  const selectedFighter = fighters[selectedIndex];

  const selectFighter = useCallback((idx: number, skipFlash?: boolean) => {
    setSelectedIndex(idx);
    if (!skipFlash) {
      setFlash(false);
      // Force reflow then trigger flash
      requestAnimationFrame(() => {
        setFlash(true);
      });
    }
  }, []);

  // Count-up animation
  useEffect(() => {
    if (!countRef.current || counted) return;
    const target = fighters.filter(f => !f.mystery).length + 2; // 6 confirmed + 2 mystery = 8
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !counted) {
            setCounted(true);
            let current = 0;
            const step = () => {
              current++;
              setCountValue(current);
              if (current < target) setTimeout(step, 80);
            };
            step();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [counted]);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section reveal roster-section ${isIntersecting ? 'in' : ''}`}
      id="proof"
    >
      {/* Header */}
      <div className="roster-header">
        <div className="roster-title">Select Your Fighter</div>
        <div className="roster-subtitle">Speakers &amp; Residents</div>
      </div>

      {/* Arena: left selector + right detail */}
      <div className="roster-arena">
        {/* LEFT: Character selector grid */}
        <div className="roster-selector">
          <div className="selector-label">Choose a fighter</div>
          <div className="roster-grid">
            {fighters.map((fighter, idx) => (
              <div
                key={idx}
                className={`roster-slot ${selectedIndex === idx ? 'selected' : ''} ${fighter.mystery ? 'mystery' : ''}`}
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
                  <span className="slot-tag">{fighter.tag}</span>
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
                <Image
                  src={selectedFighter.photo}
                  alt={selectedFighter.fullName}
                  fill
                  sizes="660px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority
                />
              )}
            </div>
            <div className="fighter-meta">
              <div className="fighter-name">{selectedFighter.fullName}</div>
              <div className="fighter-title">{selectedFighter.title}</div>
              <div className="fighter-bio">{selectedFighter.bio}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster count */}
      <div className="roster-count" ref={countRef}>
        <div className="roster-count-num">
          <span>{countValue}</span> / 24
        </div>
        <div className="roster-count-label">Fighters confirmed &middot; Full roster September 2026</div>
      </div>

      {/* Quote */}
      <div className="roster-quote">
        <blockquote>&ldquo;{rosterQuote.text}&rdquo;</blockquote>
        <cite>{rosterQuote.cite}</cite>
      </div>

      {/* Partners */}
      <div className="roster-partners">
        {rosterPartners.map((partner) => (
          <span key={partner} className="roster-partner">{partner}</span>
        ))}
      </div>
    </section>
  );
}
