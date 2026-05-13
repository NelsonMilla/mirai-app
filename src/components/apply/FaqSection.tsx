'use client';

import FaqAccordion from './FaqAccordion';
import { useIntersection } from '@/hooks/useIntersection';

export function FaqSection() {
  const { ref, isIntersecting } = useIntersection({
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
    triggerOnce: false,
  });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`faq-section reveal ${isIntersecting ? 'in' : ''}`}
      id="faq"
    >
      <div className="faq-section-title stagger">Frequently asked questions</div>
      <div className="stagger">
        <FaqAccordion />
      </div>
    </section>
  );
}
