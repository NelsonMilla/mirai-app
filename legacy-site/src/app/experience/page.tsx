import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ExperienceGuide } from '@/components/experience/ExperienceGuide';
import {
  EXPERIENCE_LAST_CHECKED,
  EXPERIENCE_QUICK_PATHS,
  EXPERIENCE_ROUTE_FACTS,
} from '@/content/experience';
import { LUMA_EVENT_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'The Experience — Mirai Tech City’s Kobe & Kansai Guide',
  description:
    'Plan your month at Mirai Tech City from Port Island: arrival, stays, Kobe, food, onsen, work, nightlife, Osaka, Kyoto, Nara, and day trips.',
  alternates: { canonical: '/experience' },
  openGraph: {
    title: 'The Experience — Live Kobe. Explore Kansai.',
    description:
      'A navigation-first field guide for Mirai Tech City attendees, built around Port Island and the wider Kansai region.',
    url: '/experience',
  },
};

export default function ExperiencePage() {
  return (
    <main className="experience-page">
      <a className="experience-skip" href="#guide-content">
        Skip to the guide
      </a>

      <nav className="experience-topbar" aria-label="Experience page">
        <Link className="experience-brand" href="/" aria-label="Mirai Tech home">
          <span aria-hidden="true">未</span>
          <span>Mirai Tech</span>
        </Link>
        <div className="experience-topbar-links">
          <Link href="/">Event</Link>
          <a href="#guide-content">Guide</a>
          <a href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">
            Apply
          </a>
        </div>
      </nav>

      <header className="experience-hero">
        <Image
          src="/images/japan/harbor-golden-hour.jpg"
          alt="Kobe harbor and Port Tower seen across the water at golden hour"
          fill
          priority
          sizes="100vw"
        />
        <div className="experience-hero-veil" aria-hidden="true" />
        <div className="experience-hero-content">
          <p className="experience-eyebrow">The experience · Kobe / Kansai</p>
          <h1>Live the region.</h1>
          <p className="experience-hero-lede">
            A month based here is a month based in a region. Every route in this guide
            starts from Port Island, because that is where you will be standing.
          </p>
          <div className="experience-hero-meta">
            <span>October 1–31, 2026</span>
            <span>Port Island · Kobe</span>
          </div>
        </div>
        <p className="experience-image-credit">Photo: JohnnyLCY · CC BY</p>
      </header>

      <section className="experience-start" aria-labelledby="experience-start-title">
        <div className="experience-start-heading">
          <p className="experience-eyebrow">Choose your next move</p>
          <h2 id="experience-start-title">What do you need right now?</h2>
        </div>
        <div className="experience-quick-paths">
          {EXPERIENCE_QUICK_PATHS.map((path, index) => (
            <a href={path.href} key={path.label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{path.label}</strong>
              <small>{path.detail}</small>
              <b aria-hidden="true">↘</b>
            </a>
          ))}
        </div>
      </section>

      <section className="experience-radius" aria-labelledby="experience-radius-title">
        <div className="experience-radius-copy">
          <p className="experience-eyebrow">Your radius</p>
          <h2 id="experience-radius-title">Kansai is your neighbourhood.</h2>
          <p>
            Port Island is the origin, not the edge. These figures name the station they
            start from so the route never promises a train time as a door-to-door time.
          </p>
        </div>
        <dl>
          {EXPERIENCE_ROUTE_FACTS.map((fact) => (
            <div key={fact.place}>
              <dt>{fact.place}</dt>
              <dd>{fact.time}</dd>
              <span>{fact.detail}</span>
            </div>
          ))}
        </dl>
      </section>

      <ExperienceGuide />

      <section className="experience-finale" aria-labelledby="experience-finale-title">
        <p className="experience-eyebrow">October 2026</p>
        <h2 id="experience-finale-title">Live the future now.</h2>
        <p>
          Arrive before opening day. Learn the last train. Book one table before you know
          who will fill it. Then let the month get larger than the event.
        </p>
        <div>
          <a className="experience-cta" href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">
            Join Mirai Tech City
          </a>
          <Link href="/">Back to the event</Link>
        </div>
        <small>
          Source guide dated {EXPERIENCE_LAST_CHECKED}. Fares, timetables, entry rules,
          and seasonal closures can change; confirm practical details with the operator.
        </small>
      </section>
    </main>
  );
}
