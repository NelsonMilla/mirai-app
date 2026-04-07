'use client';

import FaqAccordion from './FaqAccordion';

export function FaqSection() {
  return (
    <section className="faq-section" id="faq">
      <div className="faq-section-title">Frequently asked questions</div>
      <FaqAccordion />
    </section>
  );
}
