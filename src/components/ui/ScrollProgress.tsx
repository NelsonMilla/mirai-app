'use client';

import { useScrollState } from '@/hooks/useScrollState';

/**
 * ScrollProgress - Fixed progress bar at top of viewport
 * Width driven by scroll progress (0-100%)
 */
export function ScrollProgress() {
  const { progress } = useScrollState();

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-pink to-pink-bright z-50 origin-left">
      <div
        className="h-full bg-gradient-to-r from-pink to-pink-bright"
        id="progressFill"
        style={{
          width: `${progress * 100}%`,
          transition: 'width 0.1s ease-out',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
