'use client';

import { useScrollState } from '@/hooks/useScrollState';

/**
 * ScrollProgress - Fixed progress bar at top of viewport
 * Width driven by scroll progress (0-100%)
 */
export function ScrollProgress() {
  const { progress } = useScrollState();

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 origin-left" style={{ background: 'transparent' }}>
      <div
        className="h-full"
        id="progressFill"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(to right, var(--accent), var(--accent-bright))',
          transition: 'width 0.1s ease-out, background 0.4s',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
