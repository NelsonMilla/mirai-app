'use client';

import React from 'react';
import { useIntersection } from '@/hooks/useIntersection';

interface RevealSectionProps {
  id: string;
  /** Reveal family. 'reveal-track' follows the selected starter's animation. */
  variant?: 'reveal' | 'reveal-track';
  /** Latch visible after the first reveal instead of re-hiding on scroll-out. */
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  /** Base layout class — the FAQ section uses 'faq-section' instead. */
  base?: string;
  /** Extra classes appended after base/variant. */
  className?: string;
  /** Emit a data-section attribute (some scroll systems key off it). */
  dataSection?: string;
  /** Pass a function to also style children by in-view state. */
  children: React.ReactNode | ((inView: boolean) => React.ReactNode);
}

/**
 * The one way landing-page sections reveal on scroll. Wraps the section
 * element, owns the IntersectionObserver, and applies `in` when visible.
 * Don't hand-roll useIntersection + reveal classes in section components —
 * per-section drift in thresholds/latching is how reveal bugs shipped.
 */
export function RevealSection({
  id,
  variant = 'reveal',
  once = false,
  threshold = 0.1,
  rootMargin,
  base = 'section',
  className = '',
  dataSection,
  children,
}: RevealSectionProps) {
  const { ref, isIntersecting } = useIntersection({ threshold, rootMargin, triggerOnce: once });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      data-section={dataSection}
      className={[base, variant, className, isIntersecting ? 'in' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {typeof children === 'function' ? children(isIntersecting) : children}
    </section>
  );
}
