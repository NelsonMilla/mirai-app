import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { CATEGORIES, getPosts, type PostMeta } from '@/lib/posts';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: `${site.blog.headline} · ${site.name}`,
  description: site.blog.lead,
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
  openGraph: { siteName: site.name, title: site.blog.headline, description: site.blog.lead, url: '/blog', images: [site.ogImage] },
};

export default function BlogPage() {
  // Only metadata goes to the client component; bodies stay on the server.
  const posts: PostMeta[] = getPosts().map(({ html: _h, toc: _t, ...meta }) => meta);
  const categories = (Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).filter(c => posts.some(p => p.category === c));
  return (
    <>
      <Nav />
      <main className="blog">
        <header className="masthead">
          <span className="mastKanji" aria-hidden="true">物語</span>
          <p className="eyebrow">{site.blog.eyebrow} · 物語</p>
          <h1>{site.blog.headline}</h1>
          <div className="mastRow">
            <p className="lead">{site.blog.lead}</p>
            <p className="mono mastCount">
              {String(posts.length).padStart(2, '0')} {posts.length === 1 ? 'story' : 'stories'} · <a href="/blog/rss.xml">RSS</a>
            </p>
          </div>
        </header>
        {posts.length === 0
          ? <p className="lead blogEmpty">{site.blog.empty}</p>
          : <BlogIndex posts={posts} categories={categories} />}
        <NotifyStrip />
      </main>
      <Footer />
    </>
  );
}
