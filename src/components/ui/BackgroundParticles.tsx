'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTrack } from '@/components/tracks/TrackContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  phase: number; // for sine/flicker
}

const PARTICLE_COUNTS: Record<string, number> = {
  devices: 18,
  therapies: 22,
  builder: 28,
};

const COLORS: Record<string, [number, number, number]> = {
  devices: [109, 181, 245],
  therapies: [245, 211, 78],
  builder: [245, 107, 107],
};

function createParticles(track: string, w: number, h: number): Particle[] {
  const count = PARTICLE_COUNTS[track] || 18;
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: track === 'devices'
      ? (Math.random() - 0.5) * 0.2
      : track === 'therapies'
        ? -(Math.random() * 0.3 + 0.15)
        : -(Math.random() * 0.5 + 0.2),
    r: track === 'devices'
      ? Math.random() * 1.5 + 1.5
      : track === 'therapies'
        ? Math.random() * 5 + 3
        : Math.random() * 2 + 1,
    opacity: track === 'builder'
      ? Math.random() * 0.5 + 0.3
      : track === 'therapies'
        ? Math.random() * 0.2 + 0.1
        : Math.random() * 0.3 + 0.3,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedTrack } = useTrack();
  const particlesRef = useRef<Particle[]>([]);
  const fadeRef = useRef(0); // 0 = invisible, 1 = fully visible
  const trackRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const track = trackRef.current;

    // Fade logic
    if (track && fadeRef.current < 1) {
      fadeRef.current = Math.min(1, fadeRef.current + 0.02);
    } else if (!track && fadeRef.current > 0) {
      fadeRef.current = Math.max(0, fadeRef.current - 0.03);
    }

    ctx.clearRect(0, 0, w, h);

    if (fadeRef.current <= 0 && !track) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    const particles = particlesRef.current;
    const color = COLORS[track || 'devices'];
    const globalAlpha = fadeRef.current;

    particles.forEach((p) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.015;

      // Wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      let alpha = p.opacity * globalAlpha;

      if (track === 'therapies') {
        // Gentle sine sway
        p.x += Math.sin(p.phase) * 0.3;
      } else if (track === 'builder') {
        // Flicker
        alpha *= 0.5 + Math.sin(p.phase * 3) * 0.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
      ctx.fill();
    });

    // Volt: draw connecting lines between nearby particles
    if (track === 'devices') {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.12 * globalAlpha;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  // Handle track changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (selectedTrack) {
      trackRef.current = selectedTrack;
      particlesRef.current = createParticles(selectedTrack, canvas.width, canvas.height);
    } else {
      trackRef.current = null;
    }
  }, [selectedTrack]);

  // Canvas setup + animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (trackRef.current) {
        particlesRef.current = createParticles(trackRef.current, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Pause when tab hidden
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
