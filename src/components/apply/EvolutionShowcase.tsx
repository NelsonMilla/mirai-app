'use client';

import { useEffect, useState } from 'react';
import { useTrack } from '@/components/tracks/TrackContext';
import { evolutions } from '@/lib/constants';
import { Volt, Voltaic, Voltron, Helix, Helion, Helios, Ember, Kindling, Inferno } from '@/sprites';

const spriteMap: Record<string, Record<number, React.ComponentType<React.SVGProps<SVGSVGElement>>>> = {
  devices: { 1: Volt, 2: Voltaic, 3: Voltron },
  therapies: { 1: Helix, 2: Helion, 3: Helios },
  builder: { 1: Ember, 2: Kindling, 3: Inferno },
};

const trackLabels: Record<string, string> = {
  devices: 'Devices Residency',
  therapies: 'Therapies Residency',
  builder: 'Builder Pass',
};

export function EvolutionShowcase() {
  const { selectedTrack } = useTrack();
  const [visibleStages, setVisibleStages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedTrack) {
      setVisibleStages(new Set());
      return;
    }

    // Reset then stagger
    setVisibleStages(new Set());
    const line = evolutions[selectedTrack as keyof typeof evolutions];
    if (!line) return;

    const timers = line.map((_, idx) =>
      setTimeout(() => {
        setVisibleStages((prev) => new Set([...prev, `${selectedTrack}-${idx}`, `arrow-${selectedTrack}-${idx}`]));
      }, idx * 500)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [selectedTrack]);

  const hasSelection = !!selectedTrack;

  return (
    <div className={`evo-showcase ${hasSelection ? 'has-selection' : ''}`}>
      <div className="evo-title">Your journey across the program</div>
      <div className="evo-empty">
        Choose your path above to see your evolution ↑<br />
        <a href="#tracks">Pick a track</a>
      </div>

      {(['devices', 'therapies', 'builder'] as const).map((trackId) => {
        const line = evolutions[trackId];
        const isActive = selectedTrack === trackId;
        return (
          <div key={trackId} className={`evo-line ${trackId} ${isActive ? 'active' : ''}`}>
            {line.map((stage, idx) => {
              const SpriteComponent = spriteMap[trackId]?.[stage.stage];
              const stageKey = `${trackId}-${idx}`;
              const arrowKey = `arrow-${trackId}-${idx}`;
              const isVisible = visibleStages.has(stageKey);
              const arrowVisible = visibleStages.has(arrowKey) && idx > 0;

              return (
                <span key={idx} style={{ display: 'contents' }}>
                  {idx > 0 && (
                    <div className={`evo-arrow ${arrowVisible ? 'visible' : ''}`}>→</div>
                  )}
                  <div className={`evo-stage ${isVisible ? 'visible' : ''}`}>
                    <div className="evo-sprite">
                      {SpriteComponent && <SpriteComponent />}
                    </div>
                    <div className="evo-name">{stage.name}</div>
                    <div className="evo-desc">{stage.desc}</div>
                  </div>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
