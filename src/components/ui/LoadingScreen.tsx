'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function LoadingScreen() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [counter, setCounter] = useState(0);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Non-linear counter easing
  const updateCounter = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const duration = 1500; // 1.5s to count from 0→100
    const t = Math.min(1, elapsed / duration);
    // Fast start, slow around 80%, snap to 100
    const eased = t < 0.8
      ? t * 1.15
      : 0.92 + (t - 0.8) * 0.4;
    const value = Math.min(100, Math.floor(eased * 100));
    setCounter(value);
    if (t < 1) {
      rafRef.current = requestAnimationFrame(updateCounter);
    }
  }, []);

  useEffect(() => {
    // SSR guard
    setMounted(true);

    // Only show on root page
    if (pathname !== '/') {
      setVisible(false);
      return;
    }

    // Reduced motion: skip entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      return;
    }

    // Lock scroll
    document.body.classList.add('loading');
    document.documentElement.classList.add('loading');

    // Phase sequence
    const t1 = setTimeout(() => {
      setPhase(2);
      startTimeRef.current = Date.now();
      rafRef.current = requestAnimationFrame(updateCounter);
    }, 500);

    const t2 = setTimeout(() => {
      setPhase(3);
      setCounter(100);
      cancelAnimationFrame(rafRef.current);
    }, 2000);

    const t3 = setTimeout(() => {
      setPhase(4);
    }, 2600);

    const t4 = setTimeout(() => {
      document.body.classList.remove('loading');
      document.documentElement.classList.remove('loading');
      // Force scroll to top after snap re-enables
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      });
      setVisible(false);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('loading');
      document.documentElement.classList.remove('loading');
    };
  }, [updateCounter]);

  if (!mounted || !visible) return null;

  return (
    <div className="loading-screen" data-phase={phase}>
      {phase < 4 ? (
        <div className={`loader-content ${phase === 3 ? 'loader-pulse' : ''}`}>
          {/* CRT line — phase 1 */}
          {phase === 1 && <div className="loader-line" />}

          {/* Boot content — phases 2 & 3 */}
          {phase >= 2 && (
            <>
              <div className="loader-title">MIRAI TECH</div>
              <div className="loader-counter">
                {String(counter).padStart(3, '0')}
              </div>
              <div className={`loader-status ${phase === 3 ? 'loader-status-ready' : ''}`}>
                {phase < 3 ? 'INITIALIZING SYSTEMS...' : 'SYSTEM READY'}
              </div>
            </>
          )}

          {/* Ghost kanji — phases 2 & 3 */}
          {phase >= 2 && <div className="loader-kanji">未来</div>}
        </div>
      ) : (
        /* Exit slats — phase 4 */
        <div className="loader-slats">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="loader-slat"
              style={{ '--slat-i': i } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}
