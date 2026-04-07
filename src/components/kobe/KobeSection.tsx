'use client';

import React, { useState } from 'react';
import { useIntersection } from '@/hooks/useIntersection';
import Terminal from './Terminal';
import LifestyleCard from './LifestyleCard';
import CardOverlay from './CardOverlay';
import IsometricMap from './IsometricMap';
import { lifestyleCards, LifestyleCard as LifestyleCardType } from '@/lib/constants';

export default function KobeSection() {
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.05, triggerOnce: true });
  const [selectedCard, setSelectedCard] = useState<LifestyleCardType | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleOpenOverlay = (card: LifestyleCardType) => {
    setSelectedCard(card);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  return (
    <>
      <section ref={sectionRef as React.RefObject<HTMLElement>} className={`section reveal ${isIntersecting ? 'in' : ''}`} id="kobe" data-section="kobe">
        {/* BEAT 1: Regulatory argument + Terminal */}
        <div className="kobe-beat-1">
          <div className="section-label stagger">Why Kobe</div>

          <h2 className="kobe-h2 display">
            What takes <em>years</em> elsewhere<br />
            takes <em>months</em> here.
          </h2>

          <p className="kobe-lead">
            Japan's regulatory framework for regenerative medicine and medical devices is the fastest legal path from clinical evidence to patients.
          </p>

          <Terminal />
        </div>

        {/* BEAT 2: Lifestyle cards */}
        <div className="kobe-beat-2 lifestyle-beat">
          <h3 className="kobe-h3 display" style={{ marginBottom: '2rem' }}>
            Life on Port Island
          </h3>
          <div className="life-cards-grid">
            {lifestyleCards.map((card) => (
              <LifestyleCard
                key={card.id}
                card={card}
                onOpenOverlay={handleOpenOverlay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MOMENT 5B: Playground Map */}
      <IsometricMap />

      <CardOverlay
        card={selectedCard}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  );
}
