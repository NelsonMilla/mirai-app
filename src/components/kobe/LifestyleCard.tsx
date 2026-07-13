'use client';

import React, { useRef, useEffect, useState } from 'react';
import { LifestyleCard as LifestyleCardType } from '@/lib/constants';

interface LifestyleCardProps {
  card: LifestyleCardType;
  index: number;
}

export default function LifestyleCard({ card, index }: LifestyleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const isFlippedRef = useRef(false);
  isFlippedRef.current = isFlipped;

  // 3D tilt effect
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const applyTilt = (x: number, y: number, rect: DOMRect) => {
      // Dampen tilt on the fact-file back so the text stays readable
      const range = isFlippedRef.current ? 6 : 15;
      const rotateX = ((y - rect.height / 2) / rect.height) * range;
      const rotateY = ((x - rect.width / 2) / rect.width) * -range;

      cardElement.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      if (shineRef.current) {
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        shineRef.current.style.setProperty('--shine-x', `${shineX}%`);
        shineRef.current.style.setProperty('--shine-y', `${shineY}%`);
      }
    };

    const resetTilt = () => {
      cardElement.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
      if (shineRef.current) {
        shineRef.current.style.setProperty('--shine-x', '50%');
        shineRef.current.style.setProperty('--shine-y', '-20%');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardElement.getBoundingClientRect();
      applyTilt(e.clientX - rect.left, e.clientY - rect.top, rect);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = cardElement.getBoundingClientRect();
      applyTilt(touch.clientX - rect.left, touch.clientY - rect.top, rect);
    };

    cardElement.addEventListener('mousemove', handleMouseMove);
    cardElement.addEventListener('mouseleave', resetTilt);
    cardElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    cardElement.addEventListener('touchend', resetTilt);

    return () => {
      cardElement.removeEventListener('mousemove', handleMouseMove);
      cardElement.removeEventListener('mouseleave', resetTilt);
      cardElement.removeEventListener('touchmove', handleTouchMove);
      cardElement.removeEventListener('touchend', resetTilt);
    };
  }, []);

  // Intersection observer for entrance animation. Observe the grid, not the
  // card: the deal-in start state parks later cards fully off-viewport
  // (and section overflow clips them), so the card itself never intersects
  // on narrow layouts. Same pattern as MonthTimeline's chapter grid.
  useEffect(() => {
    const target = cardRef.current?.closest('.life-cards-grid') ?? cardRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // One-time peek tease: after the deal-in settles, card 1 tips open a few
  // degrees to flash the photo behind it — the entire "these flip" tutorial.
  useEffect(() => {
    if (!isVisible || index !== 0) return;
    const startTimer = setTimeout(() => {
      if (isFlippedRef.current) return;
      setIsPeeking(true);
    }, 1400);
    return () => clearTimeout(startTimer);
  }, [isVisible, index]);

  // Escape flips the card back
  useEffect(() => {
    if (!isFlipped) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFlipped(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFlipped]);

  const handleClick = () => {
    setIsPeeking(false);
    const next = !isFlipped;
    setIsFlipped(next);
    if (next) {
      window.dispatchEvent(
        new CustomEvent('lifestyle-card-open', { detail: { cardId: card.id } })
      );
    }
  };

  const colorMap: Record<string, { rgb: string; accent: string }> = {
    onsen: { rgb: '232,201,125', accent: '#E8C97D' },
    food: { rgb: '255,107,146', accent: '#FF6B92' },
    fitness: { rgb: '184,227,255', accent: '#B8E3FF' },
    explore: { rgb: '212,184,255', accent: '#D4B8FF' },
  };

  const colors = colorMap[card.id] || colorMap.onsen;

  const raritySymbol: Record<string, string> = {
    'common': '●',
    'uncommon': '◆',
    'rare': '◆',
    'ultra-rare': '★',
  };

  const flipHint = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 1H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-1 8H4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );

  return (
    <div
      ref={cardRef}
      className={`life-card ${card.id} ${isVisible ? 'card-visible' : ''} ${isFlipped ? 'flipped' : ''} ${isPeeking ? 'peek' : ''}`}
      style={{
        '--card-rgb': colors.rgb,
        '--card-accent': colors.accent,
        '--card-i': index,
      } as React.CSSProperties}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${card.title} — flip card`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div
        className="life-card-inner"
        onAnimationEnd={() => setIsPeeking(false)}
      >
        {/* FRONT FACE — TCG LAYOUT */}
        <div className="life-front" aria-hidden={isFlipped}>
          <div className="life-frame">
            {/* Type badge top-left */}
            <div className="life-type-badge mono">{card.tag}</div>
            {/* HP badge top-right */}
            <div className="life-hp"><span className="life-hp-label">HP</span>{card.hp}</div>

            {/* Art window */}
            <div className="life-art-window">
              <div className="life-kanji jp">{card.kanji}</div>
            </div>

            {/* Card name plate */}
            <div className="life-nameplate display">{card.title}</div>

            {/* Abilities */}
            <div className="life-abilities">
              {card.abilities.map((ability, i) => (
                <div key={i} className="life-ability">
                  <div className="life-ability-header">
                    <span className="life-ability-cost jp">{ability.cost}</span>
                    <span className="life-ability-name display">{ability.name}</span>
                  </div>
                  <p className="life-ability-effect">{ability.effect}</p>
                </div>
              ))}
            </div>

            {/* Stat strip — the real numbers, visible without flipping */}
            <div className="life-stats-strip">
              {card.stats.map((stat, i) => (
                <div key={i} className="life-stat">
                  <span className="life-stat-value mono">{stat.value}</span>
                  <span className="life-stat-label mono">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Footer — flip hint rides in flow between set code and rarity */}
            <div className="life-card-footer">
              <span className="life-set-code mono">{card.setCode}</span>
              <span className="life-flip-hint mono">
                Flip
                {flipHint}
              </span>
              <span className={`life-rarity life-rarity--${card.rarity}`}>
                {raritySymbol[card.rarity]}
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE — FACT FILE */}
        <div className="life-back" aria-hidden={!isFlipped}>
          <div className="life-back-art">
            <img src={`/images/lifestyle/${card.id}_card.jpg`} alt={card.title} />
          </div>
          <div className="life-back-frame" />
          <div className="life-back-content">
            <div className="life-back-eyebrow mono">{card.hudSubtitle}</div>
            <h4 className="life-back-title display">{card.hudTitle}</h4>
            <p className="life-back-text">{card.hudText}</p>
            <p className="life-back-flavor display">{card.flavorText}</p>
          </div>
          <div className="life-flip-hint life-flip-hint--back mono">
            Flip
            {flipHint}
          </div>
        </div>
      </div>

      {/* SHINE LAYER */}
      <div ref={shineRef} className="life-shine" />
    </div>
  );
}
