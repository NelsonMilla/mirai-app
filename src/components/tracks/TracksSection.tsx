'use client';

import { tracks } from '@/lib/constants';
import { TrackCard } from './TrackCard';
import { useTrack } from './TrackContext';
import { useRef } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

export function TracksSection() {
  const { selectedTrack, selectedName, selectedColor } = useTrack();
  const { ref, isIntersecting } = useIntersection({ threshold: 0.1, triggerOnce: false });

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`section reveal ${isIntersecting ? 'in' : ''}`}
      id="tracks"
      data-section="tracks"
    >
      <div className="section-label">Choose Your Starter</div>
      <p className="starter-intro">Every great journey starts with a choice.</p>

      <div id="tracksGrid" className={`tracks-grid ${selectedTrack ? 'has-selection' : ''}`}>
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>

      {/* Chosen banner */}
      {selectedTrack && selectedName && (
        <div className="track-chosen-banner">
          <div className="track-chosen-text">You chose</div>
          <div className="track-chosen-name" style={{ color: selectedColor || undefined }}>
            {selectedName}
          </div>
        </div>
      )}
    </section>
  );
}
