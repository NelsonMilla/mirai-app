'use client';

import { ReactNode } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

export interface ScrollRevealProps {
  children: ReactNode;
  variant?: 'default' | 'clip' | 'scale';
  className?: string;
  triggerOnce?: boolean;
}

/**
 * ScrollReveal - Client wrapper that uses IntersectionObserver
 * Adds reveal animations when element enters viewport
 */
export function ScrollReveal({
  children,
  variant = 'default',
  className = '',
  triggerOnce = true,
}: ScrollRevealProps) {
  const { ref, isIntersecting } = useIntersection({
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px',
    triggerOnce,
  });

  const variantClass = {
    default: 'reveal',
    clip: 'reveal-clip',
    scale: 'reveal-scale',
  }[variant];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${variantClass} ${isIntersecting ? 'in' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
