'use client';

import { Track } from '@/lib/constants';
import { useTrack } from './TrackContext';
import { useIntersection } from '@/hooks/useIntersection';
import { useRef } from 'react';
import { Volt, Voltaic, Helix, Helion, Ember, Kindling } from '@/sprites';
import posthog from 'posthog-js';

const spriteMapStage1 = {
  devices: Volt,
  therapies: Helix,
  builder: Ember,
} as const;

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  const { selectedTrack, selectTrack } = useTrack();
  const isSelected = selectedTrack === track.id;
  const { ref, isIntersecting } = useIntersection({ threshold: 0.1 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`track ${track.id} ${isSelected ? 'selected' : ''} ${isIntersecting ? 'card-visible' : ''}`}
      style={
        {
          '--tk': track.color,
          '--tk-rgb': track.colorRgb,
          '--tk-dark': track.darkBg,
        } as React.CSSProperties
      }
      onClick={() => {
        selectTrack(track.id);
        posthog.capture('track_selected', { track_id: track.id, track_name: track.name });
      }}
    >
      {/* Face Down */}
      <div className="track-facedown">
        <div className="track-mascot">
          {(() => {
            const SpriteComponent = spriteMapStage1[track.id as keyof typeof spriteMapStage1];
            return <SpriteComponent className="w-full h-full" />;
          })()}
        </div>
        <div className="track-face-type">{track.type}</div>
        <div className="track-face-name">{track.name}</div>
        <div className="track-face-hint">{track.hint}</div>
      </div>

      {/* Face Up */}
      <div className="track-faceup">
        <div className="track-up-header">
          <div className="track-up-mascot">
            {(() => {
              const SpriteComponent = spriteMapStage1[track.id as keyof typeof spriteMapStage1];
              return <SpriteComponent className="w-full h-full" />;
            })()}
          </div>
          <div className="track-up-badge">{track.type} · Residency</div>
        </div>
        <div className="track-up-title">{track.name}</div>
        <div className="track-up-desc">{track.description}</div>
        <div className="track-stats">
          {track.stats.map((stat, idx) => (
            <div key={idx} className="track-stat">
              <span className="track-stat-label">{stat.label}</span>
              <div className="track-stat-bar">
                <div className="track-stat-fill" style={{ '--fill': stat.fill } as React.CSSProperties}></div>
              </div>
              <span className="track-stat-val">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
