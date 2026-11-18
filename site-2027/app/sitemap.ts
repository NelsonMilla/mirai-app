import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { getPosts } from '@/lib/posts';

// Served at /sitemap.xml. Drafts never appear: production builds drop them in getPosts().
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().filter(p => !p.draft);
  const latest = posts[0]?.date;
  return [
    // Home URLs match the canonical tags exactly (no trailing slash on the root).
    { url: site.url, changeFrequency: 'weekly', priority: 1,
      alternates: { languages: { en: site.url, ja: `${site.url}/jp` } } },
    { url: `${site.url}/jp`, changeFrequency: 'weekly', priority: 0.9,
      alternates: { languages: { en: site.url, ja: `${site.url}/jp` } } },
    { url: `${site.url}/2026`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${site.url}/why-japan`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: latest, changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map(p => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updated ?? p.date, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
