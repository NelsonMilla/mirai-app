'use client';

import React, { useRef, useEffect, useState } from 'react';
import { LifestyleCard as LifestyleCardType } from '@/lib/constants';

interface LifestyleCardProps {
  card: LifestyleCardType;
  index: number;
  onOpenOverlay: (card: LifestyleCardType) => void;
}

export default function LifestyleCard({ card, index, onOpenOverlay }: LifestyleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 3D tilt effect
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const applyTilt = (x: number, y: number, rect: DOMRect) => {
      const rotateX = ((y - rect.height / 2) / rect.height) * 15;
      const rotateY = ((x - rect.width / 2) / rect.width) * -15;

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

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cleanup flip timeout on unmount
  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (isFlipped) return; // prevent double-click
    setIsFlipped(true);
    flipTimeoutRef.current = setTimeout(() => {
      onOpenOverlay(card);
      // Reset flip after overlay transition takes over
      setTimeout(() => setIsFlipped(false), 400);
    }, 800);
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

  return (
    <div
      ref={cardRef}
      className={`life-card ${card.id} ${isVisible ? 'card-visible' : ''}`}
      style={{
        '--card-rgb': colors.rgb,
        '--card-accent': colors.accent,
        '--card-i': index,
      } as React.CSSProperties}
      onClick={handleClick}
    >
      <div
        className="life-card-inner"
        style={isFlipped ? { transform: 'rotateY(180deg)' } : undefined}
      >
        {/* FRONT FACE — TCG LAYOUT */}
        <div className="life-front">
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

            {/* Flavor text */}
            <p className="life-flavor display">{card.flavorText}</p>

            {/* Footer */}
            <div className="life-card-footer">
              <span className="life-set-code mono">{card.setCode}</span>
              <span className={`life-rarity life-rarity--${card.rarity}`}>
                {raritySymbol[card.rarity]}
              </span>
            </div>
          </div>

          {/* Flip hint */}
          <div className="life-flip-hint mono">
            Flip
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 1H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-1 8H4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="life-back">
          <div className="life-back-art">
            <img src={`/images/lifestyle/${card.id}_card.jpg`} alt={card.title} />
          </div>
          <div className="life-back-frame" />
          <div className="life-back-mandala" />
          <div className="life-back-kanji jp">{card.kanji}</div>
          <div className="life-back-particles">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      {/* SHINE LAYER */}
      <div ref={shineRef} className="life-shine" />
    </div>
  );
}
