'use client';

import { useEffect, useRef } from 'react';

export interface UseTiltEffectOptions {
  intensity?: number; // How much to rotate (degrees)
  scale?: number; // Scale on hover
  duration?: number; // Transition duration (ms)
}

export interface UseTiltEffectReturn {
  ref: React.RefObject<HTMLElement | null>;
}

/**
 * Hook for 3D mouse-follow tilt effect on cards.
 * Calculates rotateX/Y based on cursor position relative to element center.
 * Also updates CSS variables for shine position.
 *
 * @param options - Configuration for tilt effect
 * @returns Object with ref to attach to the element
 */
export function useTiltEffect(options?: UseTiltEffectOptions): UseTiltEffectReturn {
  const ref = useRef<HTMLElement | null>(null);
  const intensity = options?.intensity ?? 15;
  const scale = options?.scale ?? 1.05;
  const duration = options?.duration ?? 300;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set perspective on element
    element.style.perspective = '1000px';
    element.style.transition = `transform ${duration}ms ease-out`;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize coordinates to -1...1 range
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      // Calculate rotation
      const rotateX = clamp(-y * intensity, -intensity, intensity);
      const rotateY = clamp(x * intensity, -intensity, intensity);

      // Update transform
      element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${scale})
      `.trim();

      // Update shine position CSS variables
      const shineX = e.clientX - rect.left;
      const shineY = e.clientY - rect.top;
      element.style.setProperty('--shine-x', `${shineX}px`);
      element.style.setProperty('--shine-y', `${shineY}px`);
    };

    const handleMouseLeave = () => {
      // Reset transform with transition
      element.style.transition = `transform ${duration}ms ease-out`;
      element.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `.trim();
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, scale, duration]);

  return { ref };
}

// Utility function to clamp values
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
