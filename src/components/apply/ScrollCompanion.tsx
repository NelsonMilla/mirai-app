'use client';

import { useEffect, useState } from 'react';
import { useTrack } from '@/components/tracks/TrackContext';

export function ScrollCompanion() {
  const { selectedTrack, selectedColor, selectedName } = useTrack();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(!!selectedTrack);
  }, [selectedTrack]);

  const handleClick = () => {
    const applySection = document.getElementById('apply');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`scroll-companion ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      data-name={selectedName || ''}
      style={{
        backgroundColor: selectedColor ? `${selectedColor}20` : 'rgba(245, 160, 181, 0.1)',
        borderColor: selectedColor ? `${selectedColor}40` : 'rgba(245, 160, 181, 0.2)',
        cursor: 'pointer',
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        width: '56px',
        height: '56px',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px solid',
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
        transition: 'opacity 0.4s cubic-bezier(0.23,1,0.32,1), transform 0.4s cubic-bezier(0.23,1,0.32,1)',
        pointerEvents: isActive ? 'auto' : 'none',
        animation: isActive ? 'companion-bob 2.5s ease-in-out infinite' : 'none',
      }}
    >
      {/* Placeholder for pixel art mascot SVG */}
      <div
        style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-jetbrains), monospace',
          color: selectedColor || 'var(--pink)',
          fontWeight: 700,
        }}
      >
        ↑
      </div>
    </div>
  );
}
