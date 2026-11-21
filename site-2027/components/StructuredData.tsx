import { site } from '@/content/site';
import { residency } from '@/content/residency';
import { residencyJa } from '@/content/residency.ja';

// schema.org data for the homepage: who we are (Organization), the site (WebSite,
// both languages), and the 2026 edition as an EventSeries with its parts.
// The 2027 residency is listed with month precision (March 2027) until exact dates are set.
const place = {
  '@type': 'Place',
  name: 'Kobe, Japan',
  address: { '@type': 'PostalAddress', addressLocality: 'Kobe', addressRegion: 'Hyogo', addressCountry: 'JP' },
};
const org = { '@type': 'Organization', '@id': `${site.url}/#org`, name: site.name, url: site.url, email: 'team@miraitech.city', sameAs: site.sameAs };
const ev = (name: string, startDate: string, endDate: string, description?: string) => ({
  '@type': 'Event', name, startDate, endDate, description,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: place, organizer: { '@id': `${site.url}/#org` },
});

export function StructuredData({ lang = 'en' }: { lang?: 'en' | 'ja' }) {
  const r = lang === 'ja' ? residencyJa : residency;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      { '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: site.url, inLanguage: ['en', 'ja'], publisher: { '@id': `${site.url}/#org` } },
      {
        '@type': 'EventSeries',
        '@id': `${site.url}/#series`,
        name: site.name,
        url: lang === 'ja' ? `${site.url}/jp` : site.url,
        description: site.description,
        organizer: { '@id': `${site.url}/#org` },
        location: place,
        subEvent: [
          {
            '@type': 'EducationEvent',
            name: r.seo.title,
            description: r.seo.description,
            inLanguage: lang,
            // Month precision until exact dates are set (March 2027).
            startDate: '2027-03',
            endDate: '2027-03',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: [
              { '@type': 'Place', name: 'Mount Fuji', address: { '@type': 'PostalAddress', addressCountry: 'JP' } },
              place,
            ],
            organizer: { '@id': `${site.url}/#org` },
          },
          {
            ...ev('Mirai Tech City 2026', '2026-10-01', '2026-10-31', 'A month-long longevity and biomedical popup city on Port Island, Kobe.'),
            subEvent: [
              ev('Mirai Tech City Summit I', '2026-10-17', '2026-10-18'),
              ev('Mirai Tech City Summit II', '2026-10-24', '2026-10-25'),
              ev('Mirai Tech City Demo Day', '2026-10-26', '2026-10-26'),
            ],
          },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
