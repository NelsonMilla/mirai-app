'use client';

import React from 'react';
import Image from 'next/image';
import { pastEvents, trackRecordNext } from '@/data/pastEvents';
import { RevealSection } from '@/components/ui/RevealSection';

export default function PastEventsSection() {
  return (
    <RevealSection id="past-events" threshold={0.05} once>
      {(inView) => (
        <>
          <div className="section-label">Track Record</div>

          <h2 className="past-events-title display">
            Other events we have <em>supported</em>
          </h2>

          <p className="past-events-intro">
            Four times at scale, on three coasts.
          </p>

          <div className="past-events-band">
            {pastEvents.map((event, idx) => (
              <article
                key={event.name}
                className={`pe-trophy ${inView ? 'card-in' : ''}`}
                style={{ '--card-i': idx } as React.CSSProperties}
              >
                <div className="pe-figure display">
                  {event.figure}
                  {event.figureSuffix && (
                    <span className="pe-suffix">{event.figureSuffix}</span>
                  )}
                  {/* Evidence stamp — renders once a photo is supplied */}
                  {event.photos && event.photos.length > 0 && (
                    <span className="pe-stamp">
                      <Image
                        src={event.photos[0]}
                        alt=""
                        fill
                        sizes="72px"
                        style={{ objectFit: 'cover' }}
                      />
                    </span>
                  )}
                </div>
                <div className="pe-eyebrow mono">{event.period}</div>
                <h3 className="pe-name display">{event.name}</h3>
                <p className="pe-support">{event.support}</p>
              </article>
            ))}
          </div>

          {/* Coda: the record points forward */}
          <div
            className={`pe-coda mono ${inView ? 'card-in' : ''}`}
            style={{ '--card-i': pastEvents.length } as React.CSSProperties}
          >
            <span className="pe-coda-pin" aria-hidden="true">◆</span>
            {trackRecordNext}
            <span className="pe-coda-here"> · You are here</span>
          </div>
        </>
      )}
    </RevealSection>
  );
}
