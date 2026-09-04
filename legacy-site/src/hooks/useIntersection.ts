'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface UseIntersectionReturn {
  ref: React.RefObject<HTMLElement | null>;
  isIntersecting: boolean;
}

/**
 * Hook that uses IntersectionObserver to detect when an element enters the viewport.
 * Returns a ref to attach to the element and a boolean indicating if it's intersecting.
 *
 * @param options - Configuration for the IntersectionObserver
 * @returns Object with ref and isIntersecting state
 */
export function useIntersection(
  options?: UseIntersectionOptions
): UseIntersectionReturn {
  const ref = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          hasTriggered.current = true;

          // Unobserve if triggerOnce is true
          if (options?.triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!options?.triggerOnce) {
          // Only set to false if triggerOnce is false
          setIsIntersecting(false);
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? '0px',
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options?.threshold, options?.rootMargin, options?.triggerOnce]);

  return { ref, isIntersecting };
}
