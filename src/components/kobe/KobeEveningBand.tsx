'use client';

import React from 'react';
import Image from 'next/image';
import { RevealSection } from '@/components/ui/RevealSection';

/* Transit figures reuse the audited numbers from TransitMap — don't tweak
   one without the other. Credits are license-required (CC BY / CC BY-SA);
   sources in public/images/japan/CREDITS.md. The izakaya/lantern frames
   were shot elsewhere in Kansai/Tokyo, so their captions claim a mood,
   never a Kobe location. */
const frames = [
  {
    src: '/images/japan/harbor-golden-hour.jpg',
    w: 1024,
    h: 683,
    time: '17:58',
    note: 'Kobe Harbor · 18 min from the lab',
    credit: 'JohnnyLCY · CC BY',
    rot: -2.4,
    alt: 'Kobe Port Tower and the Maritime Museum glowing at golden hour',
  },
  {
    src: '/images/japan/izakaya-counter.jpg',
    w: 1024,
    h: 639,
    time: '19:47',
    note: 'Dinner is a counter seat',
    credit: 'Ari Helminen · CC BY',
    rot: 1.6,
    alt: 'Warm izakaya counter lined with handwritten menu boards',
  },
  {
    src: '/images/japan/lanterns.jpg',
    w: 1024,
    h: 683,
    time: '21:15',
    note: 'Lantern night',
    credit: 'G.A.I.N · CC BY',
    rot: -1.2,
    alt: 'Pink and blue paper lanterns strung through trees at night',
  },
  {
    src: '/images/japan/izakaya-alley.jpg',
    w: 682,
    h: 1024,
    time: '22:30',
    note: 'One more street',
    credit: 'G.A.I.N · CC BY',
    rot: 2.1,
    tall: true,
    alt: 'Narrow alley of glowing izakaya signs and late diners',
  },
  {
    src: '/images/japan/rokko-night.jpg',
    w: 1024,
    h: 683,
    time: '23:41',
    note: 'Mt. Rokko · the ten-million-dollar view',
    credit: 'halfrain · CC BY-SA',
    rot: -1.8,
    alt: 'Kobe city lights stretching to the bay, seen from Mt. Rokko at night',
  },
];

export default function KobeEveningBand() {
  return (
    <RevealSection id="kobe-evening" base="jp-band" threshold={0.2} once>
      <div className="jp-band-head">
        <div className="section-label">One Evening · October 2026</div>
        <h3 className="jp-band-title display">
          You live here for a <em>month</em>.
        </h3>
      </div>

      <div className="jp-rack">
        {frames.map((f, i) => (
          <figure
            key={f.src}
            className={`jp-frame${f.tall ? ' jp-frame-tall' : ''}`}
            style={{ '--rot': `${f.rot}deg`, '--i': i } as React.CSSProperties}
          >
            <Image
              src={f.src}
              alt={f.alt}
              width={f.w}
              height={f.h}
              sizes="(max-width: 640px) 76vw, 340px"
            />
            <figcaption className="jp-caption mono">
              <span className="jp-caption-note">
                <strong>{f.time}</strong> {f.note}
              </span>
              <span className="jp-caption-credit">{f.credit}</span>
            </figcaption>
          </figure>
        ))}

        {/* Arima stamp — small enough that the 375px source stays sharp */}
        <figure
          className="jp-frame jp-stamp"
          style={{ '--rot': '3.2deg', '--i': frames.length } as React.CSSProperties}
        >
          <Image
            src="/images/japan/arima-steam.jpg"
            alt="Steam rising from the Tenjin spring source in Arima Onsen"
            width={375}
            height={500}
            sizes="160px"
          />
          <figcaption className="jp-caption mono">
            <span className="jp-caption-note">有馬温泉 · 30 min</span>
            <span className="jp-caption-credit">kudumomo · CC BY</span>
          </figcaption>
        </figure>
      </div>
    </RevealSection>
  );
}
