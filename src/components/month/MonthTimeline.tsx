'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { chapters, weeklyPrograms } from '@/lib/constants';
import { RevealSection } from '@/components/ui/RevealSection';

export default function MonthTimeline() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(chapters.length).fill(false));
  const [enteredCards, setEnteredCards] = useState<boolean[]>(new Array(chapters.length).fill(false));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  return (
    <RevealSection id="month" variant="reveal-track" once>
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
          />
        ))}
      </div>

      {/* Console — spine (episode dots), chapter detail deck, and weekly
          rhythm rail fused into one unit. The spine sits on the console's
          top border; a stem drops from the selected card to its dot. */}
      <div
        className={`month-console ${activeIndex !== null ? 'has-selection' : ''}`}
        style={{
          ...(activeChapter
            ? { '--ch-rgb': activeChapter.colorRgb, '--ch-color': activeChapter.color }
            : {}),
          ...(activeIndex !== null
            ? { '--dot-x': `calc(12.5% + ${activeIndex} * 25%)` }
            : {}),
        } as React.CSSProperties}
      >
        <div className="console-spine">
          {chapters.map((ch, idx) => (
            <button
              key={ch.ep}
              type="button"
              className={`ch-dot ${activeIndex === idx ? 'dot-active' : ''}`}
              style={{ '--dot-rgb': ch.colorRgb, '--dot-color': ch.color } as React.CSSProperties}
              aria-label={`${ch.ep} — ${ch.title}`}
              onClick={() => handleClick(idx)}
            />
          ))}
          {activeIndex !== null && <div className="console-stem" key={activeIndex} />}
        </div>

        <div className="console-detail">
          {activeChapter ? (
            <div className="ch-detail-inner" key={activeChapter.ep}>
              <div className="ch-detail-figure">
                <div className="ch-detail-kanji">{activeChapter.kanji}</div>
                <div className="ch-detail-ep mono">{activeChapter.ep}</div>
              </div>
              <div className="ch-detail-content">
                <div className="ch-detail-title">{activeChapter.title}</div>
                <div className="ch-detail-desc">{activeChapter.synopsis}</div>
                <div className="ch-detail-events">
                  {activeChapter.events.map((evt, i) => (
                    <div key={i} className="ch-detail-event">{evt}</div>
                  ))}
                </div>
                {activeChapter.themes && (
                  <div className="ch-detail-themes">
                    {activeChapter.themes.map((theme) => (
                      <span key={theme} className="ch-theme-chip">{theme}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ch-detail-inner ch-detail-header">
              <div className="month-kanji-header">全四章</div>
              <div className="ch-detail-content">
                <div className="ch-detail-title">Four chapters.</div>
                <div className="ch-detail-desc ch-detail-prompt">Select a chapter to explore the arc.</div>
              </div>
            </div>
          )}
        </div>

        {/* Recurring programming — the weekly rhythm between marquee moments */}
        <div className="console-rhythm">
          <div className="rhythm-intro mono">
            Every week on Port Island — the daily rhythm between the marquee moments, running all month.
          </div>
          <div className="rhythm-rail">
            {weeklyPrograms.map((program) => (
              <div
                key={program.label}
                className="rhythm-item"
                style={{ '--wk-rgb': program.colorRgb, '--wk-color': program.color } as React.CSSProperties}
              >
                <div className="rhythm-glyph">{program.kanji}</div>
                <div className="rhythm-label mono">{program.label}</div>
                <div className="rhythm-detail">{program.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

interface ChapterCardProps {
  chapter: (typeof chapters)[number];
  index: number;
  isVisible: boolean;
  isEntered: boolean;
  isActive: boolean;
  onClick: () => void;
}

function ChapterCard({ chapter, index, isVisible, isEntered, isActive, onClick }: ChapterCardProps) {
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
    >
      {/* Background artwork */}
      <div className="ch-art">
        <img src={chapter.imageSrc} alt={`${chapter.ep} — ${chapter.title}`} loading="lazy" />
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
