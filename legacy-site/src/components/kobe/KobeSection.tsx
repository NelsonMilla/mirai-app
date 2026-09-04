'use client';

import React from 'react';
import { RevealSection } from '@/components/ui/RevealSection';
import LifestyleCard from './LifestyleCard';
import TransitMap from './TransitMap';
import KobeEveningBand from './KobeEveningBand';
import { lifestyleCards } from '@/lib/constants';

const marketReceipts = [
  { value: '$88B', label: '3rd-largest pharma market · ¥12.4T' },
  { value: '4', label: 'Accelerated regulatory pathways' },
  { value: '2/3', label: 'AMED subsidy · matches 1:2 vs VC' },
  { value: '370', label: 'KBIC member organisations' },
  { value: '32', label: 'Nobel prizes · 4 biotech clusters' },
];

export default function KobeSection() {
  return (
    <>
      <RevealSection id="kobe" dataSection="kobe" variant="reveal-track" threshold={0.05}>
        {/* BEAT 1: Regulatory argument — placard spread: copy left, evidence ledger right */}
        <div className="kobe-beat-1 kobe-placard">
          <div className="kobe-argument">
            <div className="section-label stagger">Why Kobe</div>

            <h2 className="kobe-h2 display">
              What takes <em>years</em> elsewhere<br />
              takes <em>months</em> here.
            </h2>

            <p className="kobe-lead">
              Japan's regulatory framework for regenerative medicine and medical devices is the fastest legal path from clinical evidence to patients. KBIC is its front door.
            </p>
          </div>

          <aside className="kobe-ledger" aria-label="Japan market indicators">
            <ol className="kobe-ledger-rows">
              {marketReceipts.map((stat, idx) => (
                <li
                  key={stat.label}
                  className="kobe-ledger-row"
                  style={{ '--row-i': idx } as React.CSSProperties}
                >
                  <span className="kobe-ledger-index mono">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="kobe-ledger-value display">{stat.value}</span>
                  <span className="kobe-ledger-label mono">{stat.label}</span>
                </li>
              ))}
            </ol>
            <span className="kobe-ledger-spine" aria-hidden="true" />
            {/* 先駆 = "forerunner", nodding to the SAKIGAKE (先駆け) PMDA fast-track
                designation. TODO(Nelson): have a native speaker confirm 先駆 reads
                naturally standing alone; fallback is 神戸 (Kobe). */}
            <div className="kobe-ledger-kanji" aria-hidden="true">
              <span className="kobe-ledger-kanji-glyph">先駆</span>
              <span className="kobe-ledger-kanji-caption mono">Sakigake · 先駆け</span>
            </div>
          </aside>
        </div>

        {/* BEAT 2: Lifestyle cards */}
        <div className="kobe-beat-2 lifestyle-beat">
          <h3 className="kobe-h3 display" style={{ marginBottom: '2rem' }}>
            Life on Port Island
          </h3>
          <div className="life-cards-grid">
            {lifestyleCards.map((card, idx) => (
              <LifestyleCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* BEAT 3: One evening — real-photo postcard rack */}
      <KobeEveningBand />

      {/* MOMENT 5B: Playground Map */}
      <TransitMap />
    </>
  );
}
