'use client';

import React, { useState } from 'react';
import { RevealSection } from '@/components/ui/RevealSection';
import LifestyleCard from './LifestyleCard';
import CardOverlay from './CardOverlay';
import TransitMap from './TransitMap';
import { lifestyleCards, LifestyleCard as LifestyleCardType } from '@/lib/constants';

const marketReceipts = [
  { value: '$88B', label: '3rd-largest pharma market · ¥12.4T' },
  { value: '4', label: 'Accelerated regulatory pathways' },
  { value: '2/3', label: 'AMED subsidy · matches 1:2 vs VC' },
  { value: '370', label: 'KBIC member organisations' },
  { value: '32', label: 'Nobel prizes · 4 biotech clusters' },
];

export default function KobeSection() {
  const [selectedCard, setSelectedCard] = useState<LifestyleCardType | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleOpenOverlay = (card: LifestyleCardType) => {
    setSelectedCard(card);
    setIsOverlayOpen(true);
    window.dispatchEvent(new CustomEvent('lifestyle-card-open', { detail: { cardId: card.id } }));
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  return (
    <>
      <RevealSection id="kobe" dataSection="kobe" variant="reveal-track" threshold={0.05}>
        {/* BEAT 1: Regulatory argument */}
        <div className="kobe-beat-1">
          <div className="section-label stagger">Why Kobe</div>

          <h2 className="kobe-h2 display">
            What takes <em>years</em> elsewhere<br />
            takes <em>months</em> here.
          </h2>

          <p className="kobe-lead">
            Japan's regulatory framework for regenerative medicine and medical devices is the fastest legal path from clinical evidence to patients — where it matters most, and where it's actually achievable.
          </p>

          <div className="kobe-receipts stagger">
            {marketReceipts.map((stat) => (
              <div key={stat.label} className="kobe-receipt">
                <span className="kobe-receipt-value display">{stat.value}</span>
                <span className="kobe-receipt-label mono">{stat.label}</span>
              </div>
            ))}
          </div>

          <style>{`
            .kobe-receipts {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 1px;
              margin-bottom: 2.5rem;
              max-width: 720px;
              border: 1px solid rgba(133, 133, 168, 0.18);
              background: rgba(133, 133, 168, 0.18);
              border-radius: 0.5rem;
              overflow: hidden;
            }
            .kobe-receipt {
              display: flex;
              flex-direction: column;
              gap: 0.4rem;
              padding: 1rem 1.1rem;
              background: var(--ink-2);
            }
            .kobe-receipt-value {
              font-family: var(--font-fraunces), serif;
              font-variation-settings: 'SOFT' 80, 'opsz' 40;
              font-size: clamp(1.5rem, 2.6vw, 2rem);
              font-weight: 300;
              line-height: 1;
              letter-spacing: -0.02em;
              color: var(--white);
            }
            .kobe-receipt-label {
              font-family: var(--font-jetbrains), monospace;
              font-size: var(--fs-label);
              line-height: 1.35;
              letter-spacing: 0.04em;
              color: var(--slate);
            }

            @media (max-width: 900px) {
              .kobe-receipts {
                grid-template-columns: repeat(3, 1fr);
              }
              .kobe-receipt:last-child {
                grid-column: span 2;
              }
            }
            @media (max-width: 560px) {
              .kobe-receipts {
                grid-template-columns: repeat(2, 1fr);
              }
            }
          `}</style>
        </div>

        {/* BEAT 2: Lifestyle cards */}
        <div className="kobe-beat-2 lifestyle-beat">
          <h3 className="kobe-h3 display" style={{ marginBottom: '2rem' }}>
            Life on Port Island
          </h3>
          <div className="life-cards-grid">
            {lifestyleCards.map((card, idx) => (
              <LifestyleCard
                key={card.id}
                card={card}
                index={idx}
                onOpenOverlay={handleOpenOverlay}
              />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* MOMENT 5B: Playground Map */}
      <TransitMap />

      <CardOverlay
        card={selectedCard}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  );
}
