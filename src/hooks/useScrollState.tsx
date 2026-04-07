'use client';

import { createContext, useContext, useRef, useEffect, useState } from 'react';

// Utility functions
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

// Scroll state interface
export interface ScrollState {
  scroll: number; // Smooth interpolated scroll position
  scrollTarget: number; // Actual window.scrollY
  velocity: number; // Frame-to-frame delta
  progress: number; // 0-1 normalized scroll position
  isScrolling: boolean; // velocity > threshold
}

// Context
const ScrollContext = createContext<ScrollState | null>(null);

// Singleton scroll state (shared across all instances)
let sharedScrollState: ScrollState = {
  scroll: 0,
  scrollTarget: 0,
  velocity: 0,
  progress: 0,
  isScrolling: false,
};

let rafId: number | null = null;
const VELOCITY_THRESHOLD = 0.5;

// Start the global scroll loop (only once)
function initScrollLoop() {
  if (rafId !== null) return; // Already running

  const tick = () => {
    const prev = sharedScrollState.scroll;
    sharedScrollState.scrollTarget = window.scrollY;

    // Smooth lerp
    sharedScrollState.scroll = lerp(
      sharedScrollState.scroll,
      sharedScrollState.scrollTarget,
      0.1
    );

    // Calculate velocity
    sharedScrollState.velocity = sharedScrollState.scroll - prev;

    // Is scrolling?
    sharedScrollState.isScrolling = Math.abs(sharedScrollState.velocity) > VELOCITY_THRESHOLD;

    // Calculate progress (0-1)
    const h = document.documentElement.scrollHeight - window.innerHeight;
    sharedScrollState.progress = h > 0 ? clamp(sharedScrollState.scroll / h, 0, 1) : 0;

    // Notify all listeners via context
    // (Context subscribers will re-render)

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

// Context provider component
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollState, setScrollState] = useState<ScrollState>(sharedScrollState);

  useEffect(() => {
    initScrollLoop();

    // Update state on every scroll frame
    const updateInterval = setInterval(() => {
      setScrollState({ ...sharedScrollState });
    }, 16); // ~60fps

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollState}>
      {children}
    </ScrollContext.Provider>
  );
}

// Hook to use scroll state
export function useScrollState(): ScrollState {
  const state = useContext(ScrollContext);
  if (!state) {
    throw new Error('useScrollState must be used within ScrollProvider');
  }
  return state;
}
