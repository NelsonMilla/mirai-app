// RSS feed at /blog/rss.xml, built once at build time.
import { site } from '@/content/site';
import { getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const posts = getPosts().filter(p => !p.draft);
  const items = posts.map(p => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}/blog/${p.slug}</link>
      <guid>${site.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(`${site.blog.headline} · ${site.name}`)}</title>
    <link>${site.url}/blog</link>
    <description>${esc(site.blog.lead)}</description>
    <language>en</language>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
