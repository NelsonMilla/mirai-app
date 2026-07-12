'use client';

import FaqAccordion from './FaqAccordion';
import { RevealSection } from '@/components/ui/RevealSection';

export function FaqSection() {
  return (
    <RevealSection id="faq" base="faq-section" rootMargin="0px 0px -60px 0px">
      <div className="faq-section-title stagger">Frequently asked questions</div>
      <div className="stagger">
        <FaqAccordion />
      </div>
    </RevealSection>
  );
}
