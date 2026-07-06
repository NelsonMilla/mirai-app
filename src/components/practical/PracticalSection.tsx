'use client';

import React from 'react';
import { RevealSection } from '@/components/ui/RevealSection';
import {
  stayIntro,
  stayLinks,
  communityLinks,
} from '@/data/practical';

export default function PracticalSection() {
  return (
    <RevealSection id="practical" dataSection="practical" variant="reveal-track">
      <div className="section-label">On the Ground</div>

      <h2
        className="display"
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          lineHeight: 1.05,
          marginBottom: '3rem',
        }}
      >
        Landing is <em>handled</em>.
      </h2>

      {/* GROUP 1 — Stay */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 'var(--fs-label)',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--white)',
            marginBottom: '0.75rem',
          }}
        >
          Stay
        </h3>
        <p
          style={{
            fontSize: 'var(--fs-secondary)',
            color: 'var(--slate)',
            maxWidth: '46ch',
            marginBottom: '1.5rem',
          }}
        >
          {stayIntro}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(100%, 15rem), 1fr))',
            gap: '0.75rem',
          }}
        >
          {stayLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="practical-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                padding: '1.1rem 1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(133, 133, 168, 0.25)',
                background: 'var(--ink-2)',
                textDecoration: 'none',
                transition: 'border-color 0.25s ease, transform 0.25s ease',
              }}
            >
              <span
                className="display"
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--white)',
                }}
              >
                {link.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 'var(--fs-label)',
                  letterSpacing: '0.06em',
                  color: 'var(--slate)',
                }}
              >
                {link.meta}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* GROUP 2 — Community */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 'var(--fs-label)',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--white)',
            marginBottom: '1.5rem',
          }}
        >
          Community
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
            gap: '0.75rem',
          }}
        >
          {communityLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="practical-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '1.5rem 1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(133, 133, 168, 0.25)',
                background: 'var(--ink-2)',
                textDecoration: 'none',
                transition: 'border-color 0.25s ease, transform 0.25s ease',
              }}
            >
              <span
                className="display"
                style={{ fontSize: '1.35rem', color: 'var(--white)' }}
              >
                {link.name}
              </span>
              <span
                style={{
                  fontSize: 'var(--fs-secondary)',
                  color: 'var(--slate)',
                  lineHeight: 1.5,
                }}
              >
                {link.description}
              </span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        #practical .practical-card:hover {
          border-color: var(--pink) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </RevealSection>
  );
}
