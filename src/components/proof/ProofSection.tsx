'use client';

import React from 'react';
import { partners } from '@/lib/constants';
import { useIntersection } from '@/hooks/useIntersection';

export default function ProofSection() {
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className={`section reveal ${isIntersecting ? 'in' : ''}`} id="proof">
      <div className="section-label">Proof</div>

      <h2 className="display" style={{ marginBottom: '2rem', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300 }}>
        Built by the community
      </h2>

      <div className="proof-grid">
        {partners.map((partner) => (
          <div key={partner.name} className="proof-card stagger">
            <div className="proof-name">{partner.name}</div>
            <div className="proof-role">{partner.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
