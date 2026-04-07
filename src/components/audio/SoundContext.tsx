'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playPing: (freq: number, vol?: number) => void;
  playThud: (vol?: number) => void;
  playSelect: () => void;
  playFlip: () => void;
  playHover: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function useSound(): SoundContextType {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

export { SoundContext };
