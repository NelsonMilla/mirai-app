'use client';

import { useEffect, useState } from 'react';
import { useTrack } from '@/components/tracks/TrackContext';
import { useIntersection } from '@/hooks/useIntersection';
import { Volt, Helix, Ember } from '@/sprites';

const defaultSprites: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  devices: Volt,
  therapies: Helix,
  builder: Ember,
};

export function PostCredits() {
  const { selectedTrack } = useTrack();
  const { ref: sectionRef, isIntersecting: visible } = useIntersection({
    threshold: 0.15,
    triggerOnce: false,
  });
  const [countdown, setCountdown] = useState({ days: '---', hours: '--', mins: '--', secs: '--' });

  // Countdown to Oct 1 2026 JST
  useEffect(() => {
    function update() {
      const target = new Date('2026-10-01T00:00:00+09:00');
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: '000', hours: '00', mins: '00', secs: '00' });
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown({
        days: String(days).padStart(3, '0'),
        hours: String(hours).padStart(2, '0'),
        mins: String(mins).padStart(2, '0'),
        secs: String(secs).padStart(2, '0'),
      });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate stars on the client only — Math.random() in a useState initializer
  // runs on both server and client, producing different values and a hydration
  // mismatch. Render empty on the server, fill in after mount.
  const [stars, setStars] = useState<
    Array<{ id: number; left: string; top: string; delay: string; duration: string; size: string }>
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
        size: `${1 + Math.random() * 2}px`,
      }))
    );
  }, []);

  const SpriteComponent = selectedTrack
    ? defaultSprites[selectedTrack] ?? Volt
    : Volt;

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`post-credits ${visible ? 'visible' : ''}`}
    >
      {/* Twinkling stars */}
      <div className="post-credits-stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="post-credits-star"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              animationDuration: s.duration,
              width: s.size,
              height: s.size,
            }}
          />
        ))}
      </div>

      {/* Floating mascot */}
      <div className="post-credits-mascot">
        <SpriteComponent width={120} height={120} />
      </div>

      <div className="post-credits-text">See you on Port Island</div>
      <div className="post-credits-date">10 . 01 . 2026</div>

      {/* Countdown */}
      <div className="countdown">
        <div className="countdown-unit">
          <span className="countdown-val">{countdown.days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-val">{countdown.hours}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-val">{countdown.mins}</span>
          <span className="countdown-label">Min</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-val">{countdown.secs}</span>
          <span className="countdown-label">Sec</span>
        </div>
      </div>
    </section>
  );
}
