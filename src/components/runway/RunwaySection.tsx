'use client';

import { useEffect, useRef } from 'react';
import { runwayDevices } from '@/lib/constants';
import { useIntersection } from '@/hooks/useIntersection';

export default function RunwaySection() {
  const blockRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isIntersecting } = useIntersection({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    const handleScroll = () => {
      if (blockRef.current) {
        const rect = blockRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
        const parallaxOffset = scrollProgress * 30;
        blockRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className={`section reveal-track ${isIntersecting ? 'in' : ''}`} id="runway">
      <div className="section-label">The Runway</div>

      <div className="runway-block" ref={blockRef}>
        <h2 className="runway-title display">
          The Frontier Human<br />
          <em>Fashion Show</em>
        </h2>

        <p className="runway-desc">
          A live demo day reimagined as a runway show. Device residents showcase their medical technology prototypes on models, blending cutting-edge science with high fashion. Think CES meets Tokyo Fashion Week — but everyone's wearing exoskeletons and neural interfaces.
        </p>

        <div className="runway-devices">
          {runwayDevices.map((device) => (
            <span key={device} className="rd">
              {device}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
