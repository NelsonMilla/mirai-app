'use client';

import React, { useState } from 'react';
import { useIntersection } from '@/hooks/useIntersection';

interface Location {
  id: string;
  title: string;
  subtitle: string;
  cat: string;
  text: string;
  stats: { value: string; label: string }[];
  x: number; // percentage
  y: number; // percentage
  color: string;
  rgb: string;
}

const locations: Location[] = [
  {
    id: 'kbic',
    title: 'KBIC',
    subtitle: 'Biomedical Innovation Cluster',
    cat: 'Venue',
    text: 'The largest biomedical cluster in Japan. 370+ companies, RIKEN, and your co-working lab.',
    stats: [{ value: '370+', label: 'Companies' }, { value: '#1', label: 'Cluster in JP' }, { value: '2 min', label: 'Walk to lab' }],
    x: 50, y: 50,
    color: '#FF6B92', rgb: '255,107,146',
  },
  {
    id: 'portopia',
    title: 'Portopia Hotel',
    subtitle: 'Your base on Port Island',
    cat: 'Stay',
    text: 'Full-service hotel on Port Island. Rooftop pool, onsen bath, 5-minute walk to KBIC.',
    stats: [{ value: '5 min', label: 'To KBIC' }, { value: '746', label: 'Rooms' }, { value: 'Rooftop', label: 'Pool + Onsen' }],
    x: 42, y: 32,
    color: '#D4B8FF', rgb: '212,184,255',
  },
  {
    id: 'sannomiya',
    title: 'Sannomiya',
    subtitle: 'Downtown Kobe — 18 min',
    cat: 'Transit',
    text: 'The heart of Kobe. Main transit hub to Osaka (20 min), Kyoto (50 min), and Shinkansen.',
    stats: [{ value: '18 min', label: 'Port Liner' }, { value: '20 min', label: 'To Osaka' }, { value: '50 min', label: 'To Kyoto' }],
    x: 22, y: 18,
    color: '#B8E3FF', rgb: '184,227,255',
  },
  {
    id: 'airport',
    title: 'Kobe Airport',
    subtitle: '18 min by Port Liner',
    cat: 'Transit',
    text: 'Domestic airport connected by monorail. Tokyo Haneda in 65 min. Lab in under 30 min from landing.',
    stats: [{ value: '18 min', label: 'To KBIC' }, { value: '65 min', label: 'From Tokyo' }, { value: 'Direct', label: 'Port Liner' }],
    x: 58, y: 82,
    color: '#B8E3FF', rgb: '184,227,255',
  },
  {
    id: 'arima',
    title: 'Arima Onsen',
    subtitle: '1,300-year-old hot springs',
    cat: 'Lifestyle',
    text: 'Japan\'s oldest hot spring. Gold and silver springs, 30 minutes from Port Island by bus.',
    stats: [{ value: '1,300', label: 'Years old' }, { value: '30 min', label: 'From KBIC' }, { value: '2', label: 'Spring types' }],
    x: 8, y: 8,
    color: '#E8C97D', rgb: '232,201,125',
  },
  {
    id: 'beef',
    title: 'Kobe Beef',
    subtitle: 'The city that invented wagyu',
    cat: 'Food',
    text: 'Authentic A5 Kobe beef from Tajima cattle, served at teppanyaki restaurants in Sannomiya.',
    stats: [{ value: 'A5', label: 'Grade' }, { value: '¥8K+', label: 'Per course' }, { value: 'Since', label: '1868' }],
    x: 32, y: 10,
    color: '#FF8C69', rgb: '255,140,105',
  },
  {
    id: 'rokko',
    title: 'Rokko Island',
    subtitle: 'Waterfront fitness & trails',
    cat: 'Active',
    text: 'Man-made island with running paths, parks, and cable car to Mt. Rokko (931m).',
    stats: [{ value: '5 km', label: 'Loop' }, { value: '931m', label: 'Summit' }, { value: '10 min', label: 'By liner' }],
    x: 85, y: 25,
    color: '#82DCBE', rgb: '130,220,190',
  },
];

// Connections between locations (transit lines)
const connections: [string, string][] = [
  ['sannomiya', 'portopia'],
  ['portopia', 'kbic'],
  ['kbic', 'airport'],
  ['sannomiya', 'beef'],
  ['sannomiya', 'arima'],
  ['sannomiya', 'rokko'],
];

export default function IsometricMap() {
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.05, triggerOnce: true });
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeLocation = locations.find(l => l.id === activeId) || null;

  const getPos = (id: string) => {
    const loc = locations.find(l => l.id === id);
    return loc ? { x: loc.x, y: loc.y } : { x: 0, y: 0 };
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`section reveal ${isIntersecting ? 'in' : ''}`}
      id="playground"
      data-section="playground"
    >
      <div className="section-label stagger">Port Island</div>
      <h2 className="kobe-h2 stagger" style={{ marginBottom: '1rem' }}>
        Meet the playground.
      </h2>

      <div className="dot-map-layout">
        {/* Map area */}
        <div className="dot-map">
          {/* Connection lines */}
          <svg className="dot-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map(([from, to], i) => {
              const a = getPos(from);
              const b = getPos(to);
              return (
                <line
                  key={i}
                  x1={a.x} y1={a.y}
                  x2={b.x} y2={b.y}
                  stroke="rgba(245,160,181,0.08)"
                  strokeWidth="0.3"
                  strokeDasharray="1 1"
                />
              );
            })}
          </svg>

          {/* Location dots */}
          {locations.map((loc) => (
            <button
              key={loc.id}
              className={`dot-node ${activeId === loc.id ? 'active' : ''}`}
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                '--dot-color': loc.color,
                '--dot-rgb': loc.rgb,
              } as React.CSSProperties}
              onClick={() => setActiveId(activeId === loc.id ? null : loc.id)}
            >
              <span className="dot-ping" />
              <span className="dot-core" />
              <span className="dot-label mono">{loc.title}</span>
            </button>
          ))}

          {/* Port Island outline — subtle */}
          <div className="dot-island-outline" />
        </div>

        {/* Detail panel */}
        <div
          className={`dot-detail ${activeLocation ? 'open' : ''}`}
          style={activeLocation ? {
            '--dot-color': activeLocation.color,
            '--dot-rgb': activeLocation.rgb,
          } as React.CSSProperties : undefined}
        >
          {activeLocation ? (
            <>
              <div className="dot-detail-header">
                <div>
                  <div className="dot-detail-title">{activeLocation.title}</div>
                  <div className="dot-detail-subtitle mono">{activeLocation.subtitle}</div>
                </div>
                <div className="dot-detail-cat mono" style={{ color: activeLocation.color }}>
                  {activeLocation.cat}
                </div>
              </div>
              <p className="dot-detail-text">{activeLocation.text}</p>
              <div className="dot-detail-stats">
                {activeLocation.stats.map((s, i) => (
                  <div key={i} className="dot-detail-stat">
                    <div className="dot-stat-value mono" style={{ color: activeLocation.color }}>{s.value}</div>
                    <div className="dot-stat-label mono">{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="dot-detail-empty">
              <div className="dot-detail-title" style={{ opacity: 0.3, fontSize: '1rem' }}>Select a location</div>
              <p className="dot-detail-text" style={{ opacity: 0.2 }}>Click any point on the map to explore the area.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
