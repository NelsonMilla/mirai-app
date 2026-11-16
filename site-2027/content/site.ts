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
};
