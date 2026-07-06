'use client';

import React from 'react';
import Image from 'next/image';
import { pastEvents } from '@/data/pastEvents';
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
            Bringing long-term value across the world&apos;s frontier communities.
          </p>

          <div className="past-events-grid">
            {pastEvents.map((event, idx) => (
              <article
                key={event.name}
                className={`past-event-card ${inView ? 'card-in' : ''}`}
                style={{ '--card-i': idx } as React.CSSProperties}
              >
                <div className="past-event-period mono">{event.period}</div>
                <h3 className="past-event-name display">{event.name}</h3>
                <p className="past-event-stat">{event.stat}</p>
                <p className="past-event-detail">{event.detail}</p>

                {/* Photo strip — rendered only when photos are provided (added later) */}
                {event.photos && event.photos.length > 0 && (
                  <div className="past-event-photos">
                    {event.photos.map((photo) => (
                      <div key={photo} className="past-event-photo">
                        <Image
                          src={photo}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 30vw, 120px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </RevealSection>
  );
}
