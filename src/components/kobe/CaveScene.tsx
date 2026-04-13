'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

const STATS = [
  { label: 'PATHWAY', value: 'SAKIGAKE Conditional Approval', ok: true },
  { label: 'FIH TRIAL', value: '6 months', ok: true },
  { label: 'APPROVAL', value: '14 months', ok: true },
  { label: 'ACCESS', value: 'During review', ok: true },
];

export default function CaveScene() {
  const { ref: sceneRef, isIntersecting } = useIntersection({ threshold: 0.25, triggerOnce: true });
  const labRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [visibleStats, setVisibleStats] = useState(0); // 0-5: how many stat rows are visible
  const [fdaGlitch, setFdaGlitch] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const LINE1 = "IT'S SLOW TO SHIP THERAPIES IN OTHER COUNTRIES.";
  const LINE2 = 'TAKE THIS.';

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  const typeText = useCallback((
    text: string,
    setter: (val: string) => void,
    charDelay: number,
    onComplete: () => void
  ) => {
    let i = 0;
    const tick = () => {
      if (i <= text.length) {
        setter(text.slice(0, i));
        i++;
        timeoutsRef.current.push(setTimeout(tick, charDelay));
      } else {
        onComplete();
      }
    };
    tick();
  }, []);

  // Mouse parallax on the lab scene (desktop), gentle idle sway (mobile)
  useEffect(() => {
    const lab = labRef.current;
    if (!lab) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) {
      // Gentle idle sway animation via CSS custom properties
      let frame: number;
      const start = performance.now();
      const animate = (now: number) => {
        const t = (now - start) / 1000;
        lab.style.setProperty('--px', `${Math.sin(t * 0.5) * 3}px`);
        lab.style.setProperty('--py', `${Math.cos(t * 0.7) * 2}px`);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = lab.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      lab.style.setProperty('--px', `${x * 8}px`);
      lab.style.setProperty('--py', `${y * 4}px`);
    };

    const handleMouseLeave = () => {
      lab.style.setProperty('--px', '0px');
      lab.style.setProperty('--py', '0px');
    };

    lab.addEventListener('mousemove', handleMouseMove);
    lab.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      lab.removeEventListener('mousemove', handleMouseMove);
      lab.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation sequence
  useEffect(() => {
    if (!isIntersecting) return;
    const s = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(setTimeout(fn, delay));
    };

    s(() => setPhase(1), 0);
    s(() => setPhase(2), 300);
    s(() => setPhase(3), 600);
    s(() => setPhase(4), 1000);
    s(() => {
      setPhase(5);
      setShowCursor(true);
      typeText(LINE1, setTypedLine1, 45, () => {
        s(() => {
          setPhase(6);
          typeText(LINE2, setTypedLine2, 50, () => {
            s(() => {
              setShowCursor(false);
              setPhase(7);
              // Animate stats in one by one
              STATS.forEach((_, i) => {
                s(() => setVisibleStats(i + 1), i * 200);
              });
              // FDA row: glitch then settle
              s(() => {
                setFdaGlitch(true);
                s(() => {
                  setFdaGlitch(false);
                  setVisibleStats(5); // show FDA row
                }, 400);
              }, STATS.length * 200 + 200);
            }, 400);
          });
        }, 500);
      });
    }, 1500);
  }, [isIntersecting, typeText]);

  return (
    <div
      ref={sceneRef as React.RefObject<HTMLDivElement>}
      className={`cave-container ${phase >= 1 ? 'cave-visible' : ''}`}
    >
      {/* ── THE LAB CHAMBER ── */}
      <div className="cave-scene" ref={labRef}>
        {/* Scanline overlay */}
        <div className="lab-scanlines" />

        {/* Grid walls */}
        <div className="cave-wall cave-wall-left" />
        <div className="cave-wall cave-wall-right" />
        <div className="cave-floor" />

        {/* LED indicator strips */}
        <div className={`lab-led lab-led-left ${phase >= 2 ? 'lit' : ''}`} />
        <div className={`lab-led lab-led-right ${phase >= 2 ? 'lit' : ''}`} />

        {/* Light pool */}
        <div className={`cave-light ${phase >= 2 ? 'lit' : ''}`} />

        {/* Floating particles */}
        <div className={`lab-particles ${phase >= 2 ? 'active' : ''}`}>
          <span /><span /><span /><span /><span />
          <span /><span /><span />
        </div>

        {/* Scientist figure */}
        <div className={`cave-figure ${phase >= 3 ? 'visible' : ''}`}>
          <ScientistSprite />
        </div>

        {/* Glowing vial */}
        <div className={`cave-item ${phase >= 4 ? 'visible' : ''}`}>
          <div className="lab-vial">
            <div className="lab-vial-liquid" />
          </div>
          <div className="cave-item-label mono">JP FAST-TRACK</div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Dialog + Stats ── */}
      <div className="cave-right-col">
        {/* Dialog box */}
        <div className={`cave-dialog ${phase >= 5 ? 'visible' : ''}`}>
          <div className="cave-dialog-inner">
            <span className="cave-dialog-text mono">
              {typedLine1}
              {phase === 5 && showCursor && <span className="cave-cursor" />}
            </span>
            {phase >= 6 && (
              <span className="cave-dialog-text cave-dialog-line2 mono">
                {typedLine2}
                {phase === 6 && showCursor && <span className="cave-cursor" />}
              </span>
            )}
          </div>
        </div>

        {/* Stats card */}
        <div className={`cave-stats ${phase >= 7 ? 'visible' : ''}`}>
          <div className="cave-stats-inner">
            <div className="cave-stats-header mono">
              <span className="cave-stats-acquired">PATHWAY UNLOCKED</span>
              <span className="lab-blink" />
            </div>
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`cave-stat-row ${i < visibleStats ? 'stat-visible' : ''}`}
              >
                <span className="cave-stat-label mono">{stat.label}</span>
                <span className="cave-stat-arrow">→</span>
                <span className="cave-stat-value mono">
                  {stat.value}
                  {stat.ok && <span className={`cave-stat-ok ${i < visibleStats ? 'flash' : ''}`}>✓</span>}
                </span>
              </div>
            ))}
            <div className="cave-stat-divider" />
            <div className={`cave-stat-row cave-stat-fda ${visibleStats >= 5 ? 'stat-visible' : ''} ${fdaGlitch ? 'glitching' : ''}`}>
              <span className="cave-stat-label mono">FDA ROUTE</span>
              <span className="cave-stat-arrow">→</span>
              <span className="cave-stat-value mono"><s>5–7 years</s></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p className={`cave-tagline ${visibleStats >= 5 ? 'visible' : ''}`}>
        Japan&apos;s regulatory framework is the fastest legal path from lab to patient.
      </p>
    </div>
  );
}

/* ── Scientist in Lab Coat — 32×32 pixel art ── */
function ScientistSprite() {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair */}
      <g fill="#1a1a2e">
        <rect x="13" y="4" width="6" height="1" />
        <rect x="12" y="5" width="8" height="1" />
        <rect x="12" y="6" width="1" height="1" />
        <rect x="19" y="6" width="1" height="1" />
      </g>
      {/* Face */}
      <g fill="#e8c97d">
        <rect x="13" y="6" width="6" height="3" />
      </g>
      {/* Eyes */}
      <g fill="#1a1a2e">
        <rect x="14" y="7" width="1" height="1" />
        <rect x="17" y="7" width="1" height="1" />
      </g>
      {/* Glasses */}
      <g fill="#6DB5F5">
        <rect x="13" y="7" width="1" height="1" />
        <rect x="15" y="7" width="1" height="1" />
        <rect x="16" y="7" width="1" height="1" />
        <rect x="18" y="7" width="1" height="1" />
      </g>
      {/* Lab coat — white body */}
      <g fill="#e8e8f0">
        <rect x="12" y="9" width="8" height="1" />
        <rect x="11" y="10" width="10" height="1" />
        <rect x="10" y="11" width="12" height="1" />
        <rect x="10" y="12" width="12" height="1" />
        <rect x="10" y="13" width="12" height="1" />
        <rect x="10" y="14" width="12" height="1" />
        <rect x="10" y="15" width="12" height="1" />
        <rect x="10" y="16" width="12" height="1" />
        <rect x="11" y="17" width="10" height="1" />
        <rect x="11" y="18" width="10" height="1" />
        <rect x="11" y="19" width="4" height="1" />
        <rect x="17" y="19" width="4" height="1" />
        <rect x="11" y="20" width="4" height="1" />
        <rect x="17" y="20" width="4" height="1" />
      </g>
      {/* Coat shadow/lapel */}
      <g fill="#c8c8d4">
        <rect x="15" y="10" width="2" height="1" />
        <rect x="15" y="11" width="2" height="9" />
      </g>
      {/* Coat pocket */}
      <g fill="#c8c8d4">
        <rect x="11" y="14" width="3" height="2" />
      </g>
      {/* Pocket detail — pen */}
      <g fill="#FF6B92">
        <rect x="12" y="13" width="1" height="1" />
      </g>
      {/* Arms extended */}
      <g fill="#e8e8f0">
        <rect x="7" y="12" width="3" height="1" />
        <rect x="22" y="12" width="3" height="1" />
        <rect x="7" y="13" width="3" height="1" />
        <rect x="22" y="13" width="3" height="1" />
      </g>
      {/* Hands */}
      <g fill="#e8c97d">
        <rect x="6" y="12" width="1" height="2" />
        <rect x="25" y="12" width="1" height="2" />
      </g>
      {/* Pants */}
      <g fill="#2a2a3e">
        <rect x="12" y="21" width="3" height="1" />
        <rect x="17" y="21" width="3" height="1" />
      </g>
      {/* Shoes */}
      <g fill="#1a1a28">
        <rect x="12" y="22" width="3" height="1" />
        <rect x="17" y="22" width="3" height="1" />
      </g>
    </svg>
  );
}
