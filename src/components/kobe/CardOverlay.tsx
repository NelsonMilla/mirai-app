'use client';

import React, { useEffect } from 'react';
import { LifestyleCard as LifestyleCardType } from '@/lib/constants';

interface CardOverlayProps {
  card: LifestyleCardType | null;
  isOpen: boolean;
  onClose: () => void;
}

const colorMap: Record<string, { rgb: string; accent: string }> = {
  onsen: { rgb: '232,201,125', accent: '#E8C97D' },
  food: { rgb: '255,107,146', accent: '#FF6B92' },
  fitness: { rgb: '184,227,255', accent: '#B8E3FF' },
  explore: { rgb: '212,184,255', accent: '#D4B8FF' },
};

export default function CardOverlay({ card, isOpen, onClose }: CardOverlayProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!card) return null;

  const colors = colorMap[card.id] || colorMap.onsen;

  return (
    <div
      className={`card-overlay ${isOpen ? 'active' : ''}`}
      onClick={onClose}
      style={{
        '--card-rgb': colors.rgb,
        '--card-accent': colors.accent,
      } as React.CSSProperties}
    >
      <div
        className="card-overlay-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="life-card-inner"
          style={{
            transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT FACE — TCG LAYOUT */}
          <div className="life-front">
            <div className="life-frame">
              <div className="life-type-badge mono">{card.tag}</div>
              <div className="life-hp"><span className="life-hp-label">HP</span>{card.hp}</div>
              <div className="life-art-window">
                <div className="life-kanji jp">{card.kanji}</div>
              </div>
              <div className="life-nameplate display">{card.title}</div>
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
              <p className="life-flavor display">{card.flavorText}</p>
              <div className="life-card-footer">
                <span className="life-set-code mono">{card.setCode}</span>
                <span className={`life-rarity life-rarity--${card.rarity}`}>
                  {card.rarity === 'ultra-rare' ? '★' : card.rarity === 'common' ? '●' : '◆'}
                </span>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="life-back">
            <div className="life-back-art">
              <img
                src={`/images/lifestyle/${card.id}_card.jpg`}
                alt={card.title}
              />
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
        <div className="life-shine" />
      </div>

      {/* HUD PANEL */}
      {isOpen && (
        <div className="card-hud">
          <div className="hud-shell">
            <div className="hud-corner hud-corner--tl" />
            <div className="hud-corner hud-corner--tr" />
            <div className="hud-corner hud-corner--bl" />
            <div className="hud-corner hud-corner--br" />

            <div className="hud-header">
              <div className="hud-blink" />
              <span className="hud-label mono">{card.id}_profile</span>
              <button
                className="hud-close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="hud-content">
              <h2 className="hud-title display">{card.hudTitle}</h2>
              <p className="hud-subtitle">{card.hudSubtitle}</p>
              <p className="hud-text">{card.hudText}</p>

              <div className="hud-stats">
                {card.stats.map((stat, i) => (
                  <div key={i} className="hud-stat">
                    <div className="hud-stat-value mono">{stat.value}</div>
                    <div className="hud-stat-label mono">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hud-scan" />
          </div>
        </div>
      )}
    </div>
  );
}
