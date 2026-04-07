'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { chapters } from '@/lib/constants';
import { useIntersection } from '@/hooks/useIntersection';
import { useSound } from '@/components/audio/SoundContext';
// C major arpeggio — ascending glass chime across the 4 cards
const CHAPTER_TONES = [261.63, 329.63, 392.0, 523.25];

// Color map for the detail strip (which lives outside card divs)
const chColorMap: Record<string, { rgb: string; color: string }> = {
  'ch-arrival':   { rgb: '78, 205, 196',  color: '#4ECDC4' },
  'ch-longevity': { rgb: '245, 197, 66',  color: '#F5C542' },
  'ch-enhance':   { rgb: '91, 141, 239',  color: '#5B8DEF' },
  'ch-fashion':   { rgb: '255, 107, 146', color: '#FF6B92' },
};

export default function MonthTimeline() {
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.1, triggerOnce: true });
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(chapters.length).fill(false));
  const [enteredCards, setEnteredCards] = useState<boolean[]>(new Array(chapters.length).fill(false));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { playPing } = useSound();

  // Staggered entrance when grid scrolls into view
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            chapters.forEach((_, i) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
                setTimeout(() => {
                  setEnteredCards((prev) => {
                    const next = [...prev];
                    next[i] = true;
                    return next;
                  });
                }, 900);
              }, i * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback((idx: number) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  }, []);

  const activeChapter = activeIndex !== null ? chapters[activeIndex] : null;
  const activeColors = activeChapter ? chColorMap[activeChapter.colorClass] : null;

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section reveal ${isIntersecting ? 'in' : ''}`}
      id="month"
    >
      <div className="section-label stagger">The month</div>

      <div className="chapter-grid" id="chapterGrid" ref={gridRef}>
        {chapters.map((ch, idx) => (
          <ChapterCard
            key={ch.ep}
            chapter={ch}
            index={idx}
            isVisible={visibleCards[idx]}
            isEntered={enteredCards[idx]}
            isActive={activeIndex === idx}
            onClick={() => handleClick(idx)}
            playPing={playPing}
          />
        ))}
      </div>

      {/* Detail strip — shows section title by default, swaps to chapter detail on selection */}
      <div
        className={`ch-detail-strip strip-open ${activeIndex !== null ? 'has-selection' : ''}`}
        style={activeColors ? {
          '--ch-rgb': activeColors.rgb,
          '--ch-color': activeColors.color,
        } as React.CSSProperties : undefined}
      >
        {activeChapter ? (
          <div className="ch-detail-inner" key={activeChapter.ep}>
            <div className="ch-detail-number">{activeChapter.ep}</div>
            <div className="ch-detail-content">
              <div className="ch-detail-title">{activeChapter.title}</div>
              <div className="ch-detail-desc">{activeChapter.synopsis}</div>
              <div className="ch-detail-events">
                {activeChapter.events.map((evt, i) => (
                  <div key={i} className="ch-detail-event">{evt}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="ch-detail-inner ch-detail-header">
            <div className="month-kanji-header">全四章</div>
            <div className="ch-detail-content">
              <div className="ch-detail-title" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>Four chapters.</div>
              <div className="ch-detail-desc">Select a chapter to explore the arc.</div>
            </div>
          </div>
        )}
      </div>

      <div className="ch-connector">
        {chapters.map((_, idx) => (
          <div
            key={idx}
            className={`ch-dot ${activeIndex === idx ? 'dot-active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}

interface ChapterCardProps {
  chapter: (typeof chapters)[number];
  index: number;
  isVisible: boolean;
  isEntered: boolean;
  isActive: boolean;
  onClick: () => void;
  playPing?: (freq: number, vol?: number) => void;
}

function ChapterCard({ chapter, index, isVisible, isEntered, isActive, onClick, playPing }: ChapterCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !isEntered) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotY = (x - 0.5) * 24;
      const rotX = (0.5 - y) * 16;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;

      if (shineRef.current) {
        shineRef.current.style.setProperty('--shine-x', `${x * 100}%`);
        shineRef.current.style.setProperty('--shine-y', `${y * 100}%`);
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = '';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEntered]);

  const handleMouseEnter = useCallback(() => {
    if (playPing) playPing(CHAPTER_TONES[index], 0.04);
  }, [playPing, index]);

  const classes = [
    'chapter-card',
    chapter.colorClass,
    isVisible ? 'ch-visible' : '',
    isEntered ? 'ch-entered' : '',
    isActive ? 'ch-active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={cardRef}
      className={classes}
      style={{ '--ch-i': index } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* Background artwork */}
      <div className="ch-art">
        <img src={chapter.imageSrc} alt="" loading="lazy" />
      </div>
      {/* Floating particles */}
      <div className="ch-particles">
        <span /><span /><span />
      </div>
      <div className="ch-kanji">{chapter.kanji}</div>
      <div className="ch-scanlines" />
      <div className="ch-shine" ref={shineRef} />
      <div className="ch-ep">{chapter.ep}</div>
      <div className="ch-title">{chapter.title}</div>
      <div className="ch-dates">{chapter.dates}</div>
      <div className="ch-synopsis">{chapter.synopsis}</div>
    </div>
  );
}
