'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { tracks } from '@/lib/constants';

interface TrackState {
  selectedTrack: string | null; // 'devices' | 'therapies' | 'builder' | null
  selectedColor: string | null;
  selectedColorRgb: string | null;
  selectedName: string | null;
  selectTrack: (trackId: string) => void;
  deselectTrack: () => void;
}

const TrackContext = createContext<TrackState | undefined>(undefined);

export function TrackProvider({ children }: { children: ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  // Derive color, colorRgb, and name from constants based on selectedTrack
  const track = selectedTrack ? tracks.find((t) => t.id === selectedTrack) : null;

  const value: TrackState = {
    selectedTrack,
    selectedColor: track?.color ?? null,
    selectedColorRgb: track?.colorRgb ?? null,
    selectedName: track?.name ?? null,
    selectTrack: (trackId: string) => {
      if (selectedTrack === trackId) {
        // Toggle: deselect if clicking same track
        setSelectedTrack(null);
      } else {
        setSelectedTrack(trackId);
      }
    },
    deselectTrack: () => {
      setSelectedTrack(null);
    },
  };

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error('useTrack must be used within a TrackProvider');
  }
  return context;
}
