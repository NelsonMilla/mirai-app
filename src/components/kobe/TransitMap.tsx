'use client';

import React, { useState } from 'react';
import { RevealSection } from '@/components/ui/RevealSection';

interface Location {
  id: string;
  title: string;
  subtitle: string;
  cat: string;
  text: string;
  stats: { value: string; label: string }[];
  /** Station position in map viewBox units (0-1000 x, 0-625 y). */
  vx: number;
  vy: number;
  /** Which side of the station the label sits on. */
  labelPos: 'top' | 'bottom' | 'left' | 'right';
  /** Mobile override — flips the label side below 640px to dodge collisions. */
  mobileLabelPos?: 'left';
  color: string;
  rgb: string;
  /** Interchange stations render a larger double ring. */
  hub?: boolean;
  /** Detail-panel photo — Kobe Tourism Bureau library (feel-photo.info), cleared for the event. */
  imageSrc: string;
}

const locations: Location[] = [
  {
    id: 'kbic',
    title: 'KBIC',
    subtitle: 'Biomedical Innovation Cluster',
    cat: 'Venue',
    text: 'The largest biomedical cluster in Japan. 370+ companies, RIKEN, and your co-working lab.',
    stats: [{ value: '370+', label: 'Companies' }, { value: '#1', label: 'Cluster in JP' }, { value: '2 min', label: 'Walk to lab' }],
    vx: 610, vy: 460, labelPos: 'right',
    color: '#FF6B92', rgb: '255,107,146',
    imageSrc: '/images/map/kbic.jpg',
    hub: true,
  },
  {
    id: 'portopia',
    title: 'Portopia Hotel',
    subtitle: 'Your base on Port Island',
    cat: 'Stay',
    text: 'Full-service hotel on Port Island. Rooftop pool, onsen bath, 5-minute walk to KBIC.',
    stats: [{ value: '5 min', label: 'To KBIC' }, { value: '746', label: 'Rooms' }, { value: 'Rooftop', label: 'Pool + Onsen' }],
    vx: 520, vy: 370, labelPos: 'right', mobileLabelPos: 'left',
    color: '#D4B8FF', rgb: '212,184,255',
    imageSrc: '/images/map/portopia.jpg',
  },
  {
    id: 'sannomiya',
    title: 'Sannomiya',
    subtitle: 'Downtown Kobe — 18 min',
    cat: 'Transit',
    text: 'The heart of Kobe. Main transit hub to Osaka (20 min), Kyoto (50 min), and Shinkansen.',
    stats: [{ value: '18 min', label: 'Port Liner' }, { value: '20 min', label: 'To Osaka' }, { value: '50 min', label: 'To Kyoto' }],
    vx: 350, vy: 200, labelPos: 'top',
    color: '#B8E3FF', rgb: '184,227,255',
    imageSrc: '/images/map/sannomiya.jpg',
    hub: true,
  },
  {
    id: 'airport',
    title: 'Kobe Airport',
    subtitle: '18 min by Port Liner',
    cat: 'Transit',
    text: 'Domestic airport connected by monorail. Tokyo Haneda in 65 min. Lab in under 30 min from landing.',
    stats: [{ value: '18 min', label: 'To KBIC' }, { value: '65 min', label: 'From Tokyo' }, { value: 'Direct', label: 'Port Liner' }],
    vx: 610, vy: 570, labelPos: 'right',
    color: '#B8E3FF', rgb: '184,227,255',
    imageSrc: '/images/map/airport.jpg',
  },
  {
    id: 'arima',
    title: 'Arima Onsen',
    subtitle: '1,300-year-old hot springs',
    cat: 'Lifestyle',
    text: 'Japan\'s oldest hot spring. Gold and silver springs, 30 minutes from Port Island by bus.',
    stats: [{ value: '1,300', label: 'Years old' }, { value: '30 min', label: 'From KBIC' }, { value: '2', label: 'Spring types' }],
    vx: 230, vy: 80, labelPos: 'top',
    color: '#E8C97D', rgb: '232,201,125',
    imageSrc: '/images/map/arima.jpg',
  },
  {
    id: 'beef',
    title: 'Kobe Beef',
    subtitle: 'The city that invented wagyu',
    cat: 'Food',
    text: 'Authentic A5 Kobe beef from Tajima cattle, served at teppanyaki restaurants in Sannomiya.',
    stats: [{ value: 'A5', label: 'Grade' }, { value: '¥8K+', label: 'Per course' }, { value: 'Since', label: '1868' }],
    vx: 190, vy: 200, labelPos: 'bottom',
    color: '#FF8C69', rgb: '255,140,105',
    imageSrc: '/images/map/beef.jpg',
  },
  {
    id: 'rokko',
    title: 'Rokko Island',
    subtitle: 'Waterfront fitness & trails',
    cat: 'Active',
    text: 'Man-made island with running paths, parks, and cable car to Mt. Rokko (931m).',
    stats: [{ value: '5 km', label: 'Loop' }, { value: '931m', label: 'Summit' }, { value: '10 min', label: 'By liner' }],
    vx: 760, vy: 310, labelPos: 'bottom',
    color: '#82DCBE', rgb: '130,220,190',
    imageSrc: '/images/map/rokko.jpg',
  },
];

/* Transit lines, metro-diagram style: 45° angles only. `stations` drives
   the dim/light logic when a station is selected. Dashed lines fade in
   instead of drawing (dash pattern and draw animation share dasharray). */
interface TransitLine {
  id: string;
  path: string;
  color: string;
  rgb: string;
  width: number;
  dash?: string;
  stations: string[];
  draw?: boolean;
}

const lines: TransitLine[] = [
  // Port Liner — the hero spine: Sannomiya → Portopia → KBIC → Airport
  { id: 'port', path: 'M350 200 L520 370 L610 460 L610 570', color: '#FF6B92', rgb: '255,107,146', width: 5, stations: ['sannomiya', 'portopia', 'kbic', 'airport'], draw: true },
  // JR eastbound: Sannomiya → Rokko transfer (solid), then ghost continuation to Osaka/Kyoto
  { id: 'jr', path: 'M350 200 L640 200', color: '#8585A8', rgb: '133,133,168', width: 3, stations: ['sannomiya', 'rokko'], draw: true },
  { id: 'jr-ghost', path: 'M640 200 L905 200', color: '#8585A8', rgb: '133,133,168', width: 2, dash: '3 7', stations: ['sannomiya', 'rokko'] },
  // Rokko Liner branch off JR
  { id: 'rokko', path: 'M640 200 L750 310 L760 310', color: '#82DCBE', rgb: '130,220,190', width: 4, stations: ['rokko'], draw: true },
  // Bus to Arima — dashed = road, not rail
  { id: 'arima', path: 'M350 200 L230 80', color: '#E8C97D', rgb: '232,201,125', width: 3, dash: '7 6', stations: ['sannomiya', 'arima'] },
  // Short walk stub to the beef district
  { id: 'beef', path: 'M350 200 L190 200', color: '#FF8C69', rgb: '255,140,105', width: 3, dash: '2 7', stations: ['sannomiya', 'beef'] },
];

const VB_W = 1000;
const VB_H = 625;

export default function TransitMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeLocation = locations.find(l => l.id === activeId) || null;

  return (
    <RevealSection id="playground" dataSection="playground" threshold={0.05} once>
      <div className="section-label stagger">Port Island</div>
      <h2 className="kobe-h2 stagger" style={{ marginBottom: '1rem' }}>
        Meet the playground.
      </h2>

      <div className="dot-map-layout">
        {/* Transit diagram */}
        <div className="tm-map">
          <svg className="tm-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* Lines: glow pass + core pass */}
            {lines.map((ln) => (
              <g
                key={ln.id}
                className={`tm-line-group ${activeId && !ln.stations.includes(activeId) ? 'tm-dim' : ''}`}
              >
                <path d={ln.path} className="tm-glow" stroke={`rgba(${ln.rgb}, 0.16)`} strokeWidth={ln.width * 2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d={ln.path}
                  className={`tm-line ${ln.draw ? 'tm-drawn' : 'tm-faded'}`}
                  stroke={ln.color}
                  strokeWidth={ln.width}
                  strokeDasharray={ln.dash}
                  pathLength={ln.draw ? 1 : undefined}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}

            {/* Beyond-the-map: JR continuation arrow + destinations */}
            <path d="M898 193 L908 200 L898 207" className="tm-faded" stroke="#8585A8" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="905" y="172" className="tm-ghost-text" textAnchor="end">OSAKA · 20 MIN</text>
            <text x="905" y="188" className="tm-ghost-text" textAnchor="end">KYOTO · 50 MIN</text>
            {/* Airport onward connection */}
            <text x="632" y="592" className="tm-ghost-text">TOKYO HND · 65 MIN</text>

            {/* Segment annotations — times from the location stats.
                Anchors sit ~25 viewBox units below their 45° lines so the
                rotated text runs parallel to the line, not across it. */}
            <text x="392" y="278" className="tm-seg-label" transform="rotate(45 392 278)" fill="rgba(255,107,146,0.55)">PORT LINER · 18 MIN</text>
            <text x="664" y="249" className="tm-seg-label" transform="rotate(45 664 249)" fill="rgba(130,220,190,0.6)">ROKKO LINER · 10 MIN</text>
            <text x="270" y="128" className="tm-seg-label" transform="rotate(-45 270 128)" fill="rgba(232,201,125,0.6)">BUS</text>
            <text x="250" y="186" className="tm-seg-label" fill="rgba(255,140,105,0.55)">TEPPANYAKI</text>

            {/* Compass — diagram is roughly true-north */}
            <g className="tm-compass">
              <line x1="952" y1="66" x2="952" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <path d="M947 46 L952 38 L957 46" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <text x="952" y="84" className="tm-ghost-text" textAnchor="middle">N</text>
            </g>

            {/* Train — loops the Port Liner; dims with its line */}
            <g className={`tm-train ${activeId && !lines[0].stations.includes(activeId) ? 'tm-dim' : ''}`}>
              <circle r="9" fill="rgba(255,107,146,0.18)">
                <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0" keyTimes="0;0.5;1" path="M350 200 L520 370 L610 460 L610 570" />
              </circle>
              <circle r="3.5" fill="#FF6B92">
                <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0" keyTimes="0;0.5;1" path="M350 200 L520 370 L610 460 L610 570" />
              </circle>
            </g>
          </svg>

          {/* Stations — HTML buttons so labels stay readable at every size */}
          {locations.map((loc, i) => (
            <button
              key={loc.id}
              className={`tm-station tm-label-${loc.labelPos} ${loc.mobileLabelPos ? `tm-mlabel-${loc.mobileLabelPos}` : ''} ${loc.hub ? 'tm-hub' : ''} ${activeId === loc.id ? 'active' : ''}`}
              style={{
                left: `${(loc.vx / VB_W) * 100}%`,
                top: `${(loc.vy / VB_H) * 100}%`,
                '--dot-color': loc.color,
                '--dot-rgb': loc.rgb,
                '--st-i': i,
              } as React.CSSProperties}
              onClick={() => setActiveId(activeId === loc.id ? null : loc.id)}
              aria-label={`${loc.title} — ${loc.subtitle}`}
            >
              <span className="dot-ping" />
              <span className="tm-ring" />
              <span className="tm-station-label mono">{loc.title}</span>
            </button>
          ))}
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
              <div className="dot-photo" key={activeLocation.id}>
                <img src={activeLocation.imageSrc} alt={activeLocation.title} loading="lazy" />
                <span className="dot-photo-credit mono">© Kobe Tourism Bureau</span>
              </div>
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
    </RevealSection>
  );
}
