'use client';

import { useTrack } from '@/components/tracks/TrackContext';
import { useIntersection } from '@/hooks/useIntersection';
import { tracks } from '@/lib/constants';

const headlines: Record<string, { em: string; sub: string }> = {
  devices:   { em: 'wearable.',      sub: 'From prototype to patient — in one month.' },
  therapies: { em: 'regenerative.',  sub: 'From Phase 1b to conditional approval — in record time.' },
  builder:   { em: 'yours.',         sub: 'Full access. Zero barriers. One unforgettable month.' },
};

const defaultHeadline = { em: 'wearable.', sub: 'Pick your track. Apply. Join us on Port Island.' };

export function ApplySection() {
  const { selectedTrack, selectTrack } = useTrack();
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.05, triggerOnce: true });

  const { em, sub } = selectedTrack ? (headlines[selectedTrack] ?? defaultHeadline) : defaultHeadline;

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section reveal-track ${isIntersecting ? 'in' : ''}`}
      id="apply"
      data-section="apply"
    >
      <div className="apply-block">
        <div className="section-label">October 2026 · Only 200 curated residents</div>

        <h2 className="apply-h2">The future is <em>{em}</em></h2>
        <p>{sub}</p>

        {/* Mini track selector */}
        <div className="apply-track-selector">
          {tracks.map((track) => {
            const isActive = selectedTrack === track.id;
            return (
              <button
                key={track.id}
                className={`apply-track-pill ${isActive ? 'active' : ''}`}
                style={{
                  '--pill-color': track.color,
                  '--pill-rgb': track.colorRgb,
                } as React.CSSProperties}
                onClick={() => selectTrack(track.id)}
              >
                <span className="pill-dot" />
                {track.name}
              </button>
            );
          })}
        </div>

        <div className="apply-btns">
          <a className="btn btn-primary" style={{ fontSize: '14px', padding: '1rem 2rem' }} href="#">Reserve Your Spot</a>
          <a className="btn btn-outline" style={{ fontSize: '14px', padding: '1rem 2rem' }} href="#">Get the Info Pack</a>
        </div>
        <div className="apply-micro">5-min application · No commitment</div>
      </div>
    </section>
  );
}
