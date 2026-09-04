'use client';

import { useState } from 'react';
import { faqItems } from '@/lib/constants';
import posthog from 'posthog-js';

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {faqItems.map((item, idx) => (
        <div
          key={idx}
          className={`faq-item ${openIndex === idx ? 'open' : ''}`}
        >
          <button
            className="faq-q"
            onClick={() => {
              const opening = openIndex !== idx;
              setOpenIndex(opening ? idx : null);
              if (opening) posthog.capture('faq_opened', { question: item.question, index: idx });
            }}
          >
            <span>{item.question}</span>
            <span className="arrow">+</span>
          </button>
          <div className="faq-a">{item.answer}</div>
        </div>
      ))}
    </div>
  );
}
