'use client';

import React, { useState } from 'react';
import { RevealSection } from '@/components/ui/RevealSection';
import CaveScene from './CaveScene';
import Terminal from './Terminal';
import LifestyleCard from './LifestyleCard';
import CardOverlay from './CardOverlay';
import IsometricMap from './IsometricMap';
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
  const [kobeView, setKobeView] = useState<'story' | 'terminal'>('story');

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
        {/* BEAT 1: Regulatory argument + Terminal */}
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

          <div className="kobe-view-toggle" role="group" aria-label="Choose how to explore the regulatory argument">
            <button
              type="button"
              className={`kobe-view-btn mono ${kobeView === 'story' ? 'is-active' : ''}`}
              aria-pressed={kobeView === 'story'}
              onClick={() => setKobeView('story')}
            >
              [ STORY ]
            </button>
            <button
              type="button"
              className={`kobe-view-btn mono ${kobeView === 'terminal' ? 'is-active' : ''}`}
              aria-pressed={kobeView === 'terminal'}
              onClick={() => setKobeView('terminal')}
            >
              [ TERMINAL ]
            </button>
          </div>

          <div className="kobe-view-slot">
            {kobeView === 'story' ? <CaveScene /> : <Terminal />}
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

            /* ── VIEW TOGGLE (segmented control) ── */
            .kobe-view-toggle {
              display: inline-flex;
              gap: 2px;
              padding: 3px;
              margin-bottom: 1.25rem;
              border: 1px solid rgba(133, 133, 168, 0.22);
              border-radius: 0.5rem;
              background: rgba(20, 20, 32, 0.6);
            }
            .kobe-view-btn {
              font-family: var(--font-jetbrains), monospace;
              font-size: var(--fs-label);
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--slate);
              background: transparent;
              border: 0;
              border-radius: 0.35rem;
              padding: 0.5rem 0.9rem;
              cursor: pointer;
              transition: color 0.2s ease, background 0.2s ease;
            }
            .kobe-view-btn:hover {
              color: var(--white);
            }
            .kobe-view-btn.is-active {
              color: var(--ink);
              background: var(--pink);
            }
            .kobe-view-btn:focus-visible {
              outline: 2px solid var(--pink-bright);
              outline-offset: 2px;
            }

            /* Shared slot so STORY and TERMINAL occupy a similar height */
            .kobe-view-slot {
              min-height: 340px;
            }

            /* ── TERMINAL (macOS-dark CLI) ── */
            .term-layout {
              display: grid;
              grid-template-columns: 1.7fr 1fr;
              gap: 1.5rem;
              align-items: start;
            }
            .term-window {
              border: 1px solid rgba(133, 133, 168, 0.2);
              border-radius: 10px;
              background: #0b0b14;
              overflow: hidden;
              font-family: var(--font-jetbrains), monospace;
              box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.6);
            }
            .term-bar {
              display: flex;
              align-items: center;
              gap: 0.4rem;
              padding: 0.55rem 0.85rem;
              background: var(--ink-2);
              border-bottom: 1px solid rgba(133, 133, 168, 0.16);
            }
            .term-dot {
              width: 11px;
              height: 11px;
              border-radius: 50%;
              display: inline-block;
            }
            .term-dot--r { background: #ff5f57; }
            .term-dot--y { background: #febc2e; }
            .term-dot--g { background: #28c840; }
            .term-bar-title {
              margin-left: 0.6rem;
              font-size: var(--fs-label);
              letter-spacing: 0.04em;
              color: var(--slate);
            }
            .term-body {
              padding: 1.1rem 1.35rem;
              font-size: var(--fs-caption);
              line-height: 1.7;
              color: #cfd2e6;
              max-height: 360px;
              overflow-y: auto;
            }
            .term-line {
              white-space: pre-wrap;
              opacity: 0;
              transform: translateY(2px);
              transition: opacity 0.18s ease, transform 0.18s ease;
            }
            .term-line.tl-vis {
              opacity: 1;
              transform: translateY(0);
            }
            .term-line.tl-blank {
              height: 0.7em;
            }
            .term-prompt { color: var(--pink); }
            .term-cmd { color: var(--white); font-weight: 600; }
            .term-flag { color: #9aa0c4; }
            .term-dim { color: var(--slate); }
            .term-time { color: #7fd6c2; }
            .term-ok { color: #4ecdc4; }
            .term-pending { color: #febc2e; }
            .term-err { color: #ff5f57; font-weight: 600; }
            .term-comment { color: var(--slate); font-style: italic; }
            .term-sep { color: rgba(133, 133, 168, 0.4); }
            .term-status-ok {
              color: #0b0b14;
              background: #4ecdc4;
              padding: 0.05rem 0.4rem;
              border-radius: 3px;
              font-weight: 600;
            }
            .term-status-err {
              color: #ff5f57;
              font-weight: 600;
            }
            .term-progress {
              display: inline-block;
              width: 90px;
              height: 6px;
              border-radius: 3px;
              background: rgba(133, 133, 168, 0.22);
              overflow: hidden;
              vertical-align: middle;
            }
            .term-progress-fill {
              display: block;
              height: 100%;
              width: 100%;
              border-radius: 3px;
            }
            .term-progress-fill--ok { background: #4ecdc4; }
            .term-progress-fill--warn { background: #febc2e; width: 55%; }

            /* Terminal sidebar (JP vs US) */
            .term-sidebar {
              display: flex;
              flex-direction: column;
              gap: 0.9rem;
              font-family: var(--font-jetbrains), monospace;
            }
            .term-aside {
              display: flex;
              flex-direction: column;
              gap: 0.35rem;
              padding: 1rem 1.1rem;
              border: 1px solid rgba(133, 133, 168, 0.2);
              border-radius: 10px;
              background: var(--ink-2);
            }
            .term-aside--jp { border-color: rgba(78, 205, 196, 0.4); }
            .term-aside--us { border-color: rgba(255, 95, 87, 0.3); }
            .term-aside-flag { font-size: 1.4rem; line-height: 1; }
            .term-aside-big {
              font-family: var(--font-fraunces), serif;
              font-weight: 300;
              font-size: clamp(1.6rem, 3vw, 2.1rem);
              line-height: 1;
              color: var(--white);
            }
            .term-aside--jp .term-aside-big { color: #4ecdc4; }
            .term-aside--us .term-aside-big { color: #ff8a80; }
            .term-aside-sub {
              font-size: var(--fs-label);
              line-height: 1.5;
              color: var(--slate);
            }
            .term-aside-vs {
              text-align: center;
              font-size: var(--fs-label);
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: var(--slate);
            }
            .term-aside-bottom {
              margin-top: 0.25rem;
              padding-top: 0.9rem;
              border-top: 1px solid rgba(133, 133, 168, 0.16);
              font-size: var(--fs-label);
              line-height: 1.5;
              color: var(--slate);
            }
            .term-aside-bottom em { color: var(--pink); font-style: normal; }

            @media (max-width: 820px) {
              .term-layout {
                grid-template-columns: 1fr;
              }
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
      <IsometricMap />

      <CardOverlay
        card={selectedCard}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  );
}
