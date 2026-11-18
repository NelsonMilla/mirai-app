'use client';
// The reel's only client code: prev/next buttons, a scroll-position indicator and Left/Right,
// Home/End on the track. The track itself is a native overflow-x scroller with scroll-snap, so
// trackpad, touch and shift-wheel work without this file. Vertical wheel is never captured.
// Without JS the controls stay `hidden` and the native scrollbar shows (CSS keys off data-ready).
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import s from './WjReasonsA.module.css';

export function Reel({ labelledBy, children }: { labelledBy: string; children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    setReady(true);
    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      const ratio = el.scrollWidth ? el.clientWidth / el.scrollWidth : 1;
      const p = max > 0 ? el.scrollLeft / max : 0;
      if (thumb.current) {
        thumb.current.style.width = `${ratio * 100}%`;
        thumb.current.style.transform = `translateX(${(p * (1 - ratio) / ratio) * 100}%)`;
      }
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= max - 2);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    el.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    return () => {
      el.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Step one card: the next card whose left edge is past the column edge, or the previous one before it.
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const edge = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft);
    const lefts = Array.from(el.children).map(c => c.getBoundingClientRect().left - edge);
    const target = dir > 0 ? lefts.find(x => x > 4) : [...lefts].reverse().find(x => x < -4);
    if (target !== undefined) el.scrollBy({ left: target, behavior: motion() });
  };
  const jump = (to: 'start' | 'end') => {
    const el = track.current;
    if (el) el.scrollTo({ left: to === 'start' ? 0 : el.scrollWidth, behavior: motion() });
  };
  const onKey = (e: KeyboardEvent) => {
    const act = ({ ArrowRight: () => step(1), ArrowLeft: () => step(-1), Home: () => jump('start'), End: () => jump('end') } as Record<string, () => void>)[e.key];
    if (act) { e.preventDefault(); act(); }
  };

  return (
    <div className={s.reel} data-ready={ready || undefined}>
      <ul ref={track} className={s.track} tabIndex={0} aria-labelledby={labelledBy} onKeyDown={onKey}>
        {children}
      </ul>
      <div className={s.controls} hidden={!ready}>
        <span className={s.rail} aria-hidden="true"><span ref={thumb} className={s.thumb} /></span>
        <div className={s.buttons}>
          <button type="button" className={s.btn} onClick={() => step(-1)} disabled={atStart} aria-label="Previous">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button type="button" className={s.btn} onClick={() => step(1)} disabled={atEnd} aria-label="Next">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const motion = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
