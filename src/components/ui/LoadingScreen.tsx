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
  const dismissedRef = useRef(false);

  const updateCounter = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const duration = 1500;
    const t = Math.min(1, elapsed / duration);
    const eased = t < 0.8 ? t * 1.15 : 0.92 + (t - 0.8) * 0.4;
    const value = Math.min(100, Math.floor(eased * 100));
    setCounter(value);
    if (t < 1) {
      rafRef.current = requestAnimationFrame(updateCounter);
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    if (pathname !== '/') {
      setVisible(false);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      return;
    }

    // Mark html so CSS can suppress smooth-scroll during load
    document.documentElement.classList.add('loading');

    const dismiss = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;

      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);

      setCounter(100);
      setPhase(4);

      // Slats take ~940ms (8 × 55ms delay + 500ms duration)
      setTimeout(() => {
        document.documentElement.classList.remove('loading');
        requestAnimationFrame(() =>
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        );
        setVisible(false);
      }, 1000);
    };

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

    const t3 = setTimeout(() => setPhase(4), 2600);

    const t4 = setTimeout(() => {
      document.documentElement.classList.remove('loading');
      requestAnimationFrame(() =>
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      );
      setVisible(false);
    }, 3600);

    // Scroll or swipe skips the preloader
    const onScroll = () => dismiss();
    window.addEventListener('wheel', onScroll, { passive: true, once: true });
    window.addEventListener('touchmove', onScroll, { passive: true, once: true });

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove('loading');
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, [updateCounter]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || !visible) return null;

  return (
    <div className="loading-screen" data-phase={phase}>
      {phase < 4 ? (
        <div className={`loader-content ${phase === 3 ? 'loader-pulse' : ''}`}>
          {phase === 1 && <div className="loader-line" />}

          {phase >= 2 && (
            <>
              <div className="loader-title">MIRAI TECH</div>
              <div className="loader-counter">{String(counter).padStart(3, '0')}</div>
              <div className={`loader-status ${phase === 3 ? 'loader-status-ready' : ''}`}>
                {phase < 3 ? 'INITIALIZING SYSTEMS...' : 'SYSTEM READY'}
              </div>
            </>
          )}

          {phase >= 2 && <div className="loader-kanji">未来</div>}
        </div>
      ) : (
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
