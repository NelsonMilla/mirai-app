'use client';

import { useEffect, useState, useRef, useCallback, ComponentType } from 'react';
import { useTrack } from '@/components/tracks/TrackContext';
import { Volt, Helix, Ember } from '@/sprites';

const spriteMap: Record<string, ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  devices: Volt,
  therapies: Helix,
  builder: Ember,
};

const animationMap: Record<string, string> = {
  devices: 'companion-volt',
  therapies: 'companion-helix',
  builder: 'companion-ember',
};

// Dialogue lines per track per section — each mascot reacts in character
const dialogue: Record<string, Record<string, string>> = {
  devices: {
    month:   'Scanning schedule... optimal.',
    runway:  'Exoskeletons on a runway?!',
    kobe:    'Lab access: confirmed.',
    apply:   'Submit your specs!',
  },
  therapies: {
    month:   'Four weeks... nice and easy~',
    runway:  'Fashion heals the soul...',
    kobe:    'Onsen after lab hours? Yes.',
    apply:   'Go with the flow~',
  },
  builder: {
    month:   'SO MANY THINGS TO BUILD!!',
    runway:  'Can I wear my own project?!',
    kobe:    'Wagyu! WAGYU!!!',
    apply:   'LET\'S GOOO!!',
  },
};

// Lifestyle card reactions — mascot reacts when a Kobe card is opened
const cardReactions: Record<string, Record<string, string>> = {
  devices: {
    onsen:   'Thermal sensors... calibrating...',
    food:    'Analyzing protein structure...',
    fitness: 'Elevation data: impressive.',
    explore: 'Scanning transit routes...',
  },
  therapies: {
    onsen:   'Ahh~ healing waters~',
    food:    'Nourishment for the soul~',
    fitness: 'Balance is everything~',
    explore: 'Flowing to new places~',
  },
  builder: {
    onsen:   'HOT SPRINGS LET\'S GO!!',
    food:    'WAGYU A5 INCOMING!!!',
    fitness: 'RACE YOU TO THE TOP!!',
    explore: 'THREE CITIES ONE DAY!!',
  },
};

const SECTIONS = ['month', 'runway', 'kobe', 'apply'] as const;

export function ScrollCompanion() {
  const { selectedTrack, selectedColor, selectedName } = useTrack();
  const [isActive, setIsActive] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const lastSection = useRef<string | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsActive(!!selectedTrack);
  }, [selectedTrack]);

  // Observe which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentSection(id);
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Show bubble when entering a new section
  const showBubble = useCallback((text: string) => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setBubbleText(text);
    setBubbleVisible(true);
    bubbleTimer.current = setTimeout(() => {
      setBubbleVisible(false);
    }, 3500);
  }, []);

  useEffect(() => {
    if (!selectedTrack || !currentSection) return;
    if (currentSection === lastSection.current) return;

    lastSection.current = currentSection;
    const line = dialogue[selectedTrack]?.[currentSection];
    if (line) {
      showBubble(line);
    } else {
      setBubbleVisible(false);
    }
  }, [currentSection, selectedTrack, showBubble]);

  // Reset when track changes
  useEffect(() => {
    lastSection.current = null;
    setBubbleVisible(false);
  }, [selectedTrack]);

  // Listen for lifestyle card open events
  useEffect(() => {
    const handleCardOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ cardId: string }>).detail;
      if (!selectedTrack) return;
      const reaction = cardReactions[selectedTrack]?.[detail.cardId];
      if (reaction) showBubble(reaction);
    };
    window.addEventListener('lifestyle-card-open', handleCardOpen);
    return () => window.removeEventListener('lifestyle-card-open', handleCardOpen);
  }, [selectedTrack, showBubble]);

  const SpriteComponent = selectedTrack ? spriteMap[selectedTrack] : null;
  const animName = selectedTrack ? animationMap[selectedTrack] : 'companion-bob';

  return (
    <div
      className={`scroll-companion ${isActive ? 'active' : ''}`}
      onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
      data-name={selectedName || ''}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'none',
        position: 'fixed',
        bottom: '20px',
        right: '24px',
        width: '56px',
        height: '56px',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
        transition: 'opacity 0.4s cubic-bezier(0.23,1,0.32,1), transform 0.4s cubic-bezier(0.23,1,0.32,1)',
        pointerEvents: isActive ? 'auto' : 'none',
        animation: isActive ? `${animName} ${selectedTrack === 'therapies' ? '4s' : selectedTrack === 'builder' ? '1.2s' : '2s'} ease-in-out infinite` : 'none',
      }}
    >
      {/* Speech bubble */}
      <div
        className="companion-bubble"
        style={{
          opacity: bubbleVisible ? 1 : 0,
          transform: bubbleVisible
            ? 'translateY(-50%) scale(1)'
            : 'translateY(-50%) translateX(6px) scale(0.9)',
          borderColor: selectedColor ? `${selectedColor}30` : 'rgba(255,255,255,0.1)',
        }}
      >
        {bubbleText}
      </div>

      {SpriteComponent && (
        <SpriteComponent style={{ width: '40px', height: '40px' }} />
      )}
    </div>
  );
}
