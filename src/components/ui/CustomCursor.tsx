'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor - Follows mouse position with hover state
 * Hidden on mobile/touch devices
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const isTouchCapable = () => {
      return (
        typeof window !== 'undefined' &&
        ((navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
          ('msMaxTouchPoints' in navigator && (navigator as any).msMaxTouchPoints > 2) ||
          'ontouchstart' in window)
      );
    };

    setIsTouchDevice(isTouchCapable());
  }, []);

  useEffect(() => {
    if (isTouchDevice) return; // Don't show on touch devices

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Interactive element selectors
    const interactiveSelectors = [
      'a',
      'button',
      '[role="button"]',
      '.track',
      '.life-card',
      'input',
      'select',
      'textarea',
    ].join(',');

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(interactiveSelectors);
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`cursor ${isHovering ? 'hover' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-hidden="true"
    />
  );
}
