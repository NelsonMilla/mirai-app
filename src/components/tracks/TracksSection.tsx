'use client';

import { tracks } from '@/lib/constants';
import { TrackCard } from './TrackCard';
import { useTrack } from './TrackContext';
import { RevealSection } from '@/components/ui/RevealSection';

export function TracksSection() {
  const { selectedTrack, selectedName, selectedColor } = useTrack();

  return (
    <RevealSection id="tracks" dataSection="tracks">
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
    </RevealSection>
  );
}
