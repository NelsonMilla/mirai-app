// Site-wide basics shared by every page. The homepage copy lives in content/residency.ts
// (English) and content/residency.ja.ts (Japanese); the blog copy lives here.
import { residency } from './residency';

export const site = {
  name: 'Mirai Tech City',
  url: 'https://www.miraitech.city', // canonical URLs, sitemap and RSS are built from this
  ogImage: '/img/fuji/fuji-dawn.webp', // link-preview image when a page has none of its own
  x: '@MiraiTechCity', // X (Twitter) account, for twitter:site on link previews
  // Defaults for pages that don't set their own (the homepage and blog do).
  title: residency.seo.title,
  description: residency.seo.description,

  blog: {
    eyebrow: 'Blog',
    headline: 'Stories from Mirai',
    lead: 'The companies, scientists and builders behind Mirai Tech City, and what they are working on.',
    empty: 'The first posts are on their way.',
  },

  // The /2026 page: last year's speakers and agenda. Data: content/speakers-2026.json and
  // content/program-2026.json (npm run speakers:sync / program:sync).
  lastYear: {
    eyebrow: 'Last year · Kobe · October 2026',
    headline: 'Mirai Tech City 2026',
    lead: 'In October 2026 we held two summits and a Demo Day in Kobe. Here is everyone who spoke and the full agenda.',
    seoTitle: '2026 speakers and agenda',
    seoDescription: 'Every speaker and session from Mirai Tech City 2026 in Kobe: Summit I, Summit II and Demo Day, October 17–26.',
    speakersTitle: 'Speakers',
    speakersLead: 'Scientists, founders and investors from Japan and around the world, in alphabetical order.',
    agendaTitle: 'Agenda',
    agendaLead: 'The full program as it ran. Times are Japan time.',
    events: { S1: 'Summit I', S2: 'Summit II', F: 'Demo Day' } as Record<string, string>,
    online: 'Online',
    recorded: 'Recorded',
    winner: 'Winner',
  },
};
