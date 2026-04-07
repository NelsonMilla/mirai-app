'use client';

import { useTrack } from '@/components/tracks/TrackContext';
import { useIntersection } from '@/hooks/useIntersection';
import { EvolutionShowcase } from './EvolutionShowcase';
import FaqAccordion from './FaqAccordion';

export function ApplySection() {
  const { selectedTrack, selectedColor, selectedName } = useTrack();
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.05, triggerOnce: true });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section reveal reveal-scale ${isIntersecting ? 'in' : ''}`}
      id="apply"
      data-section="apply"
    >
      <div className="apply-block">
        <div className="section-label">October 2026 · Limited spots</div>

        <h2 className="apply-h2">The future is <em>wearable.</em></h2>
        <p>Pick your track. Apply. Join us on Port Island.</p>

        <div className={`apply-track-indicator ${selectedTrack ? 'visible' : ''}`}>
          <span className="ati-dot" style={{ background: selectedColor || 'var(--pink)' }} />
          <span className="ati-label">Applying as:</span>
          <span className="ati-name">{selectedName || ''}</span>
        </div>

        <div className="apply-steps">
          <div className="apply-step"><div className="num">1</div>Pick your track</div>
          <div className="apply-step"><div className="num">2</div>Apply</div>
          <div className="apply-step"><div className="num">3</div>Get accepted</div>
        </div>

        <EvolutionShowcase />
        <div className="evo-showcase-divider" />

        <div className="apply-btns">
          <a className="btn btn-primary" style={{ fontSize: '14px', padding: '1rem 2rem' }} href="#">Apply Now</a>
          <a className="btn btn-outline" style={{ fontSize: '14px', padding: '1rem 2rem' }} href="mailto:nelson@frontierhumans.com">Contact Us</a>
        </div>

        <div className="apply-faq">
          <div className="faq-item" onClick={(e) => {
            const item = (e.currentTarget as HTMLElement);
            item.classList.toggle('open');
          }}>
            <div className="faq-q">What are the three tracks?<span className="arrow">+</span></div>
            <div className="faq-a"><strong>Devices Residency</strong> — prototype to first-in-human with KBIC labs. <strong>Therapies Residency</strong> — post Phase 1b with direct PMDA access. <strong>Builder Pass</strong> — full event access for entrepreneurs, operators, and the broader community.</div>
          </div>
          <div className="faq-item" onClick={(e) => {
            const item = (e.currentTarget as HTMLElement);
            item.classList.toggle('open');
          }}>
            <div className="faq-q">What stage should my company be at?<span className="arrow">+</span></div>
            <div className="faq-a">Devices: working prototype ready for human-interface testing. Therapies: Phase 1b complete with clinical data. Builder Pass: any stage — come for the community and the month.</div>
          </div>
          <div className="faq-item" onClick={(e) => {
            const item = (e.currentTarget as HTMLElement);
            item.classList.toggle('open');
          }}>
            <div className="faq-q">Do I need to speak Japanese?<span className="arrow">+</span></div>
            <div className="faq-a">No. All programming is in English. Translation provided for KBIC lab visits, PMDA meetings, and JETRO briefings.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
