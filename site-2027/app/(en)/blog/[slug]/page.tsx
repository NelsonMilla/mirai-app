import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CopyLink } from '@/components/blog/CopyLink';
import { ReadingRail } from '@/components/blog/ReadingRail';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { PostCard } from '@/components/blog/PostCard';
import { CATEGORIES, formatDate, getNeighbours, getPost, getPosts, issue } from '@/lib/posts';
import { site } from '@/content/site';

// Every post is generated at build time; unknown slugs 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

// Post dates are calendar days in Kobe; give search engines a full ISO 8601 time with the zone.
const jst = (d: string) => `${d}T00:00:00+09:00`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const image = post.shareImage
    ? { url: post.shareImage, width: 1200, height: 630, alt: post.coverAlt ?? post.title }
    : post.cover ?? site.ogImage;
  const headline = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.summary;
  return {
    title: post.seoTitle ?? `${post.title} · ${site.name}`,
    description,
    authors: post.author ? [{ name: post.author }] : undefined,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.draft ? { index: false } : undefined,
    openGraph: { type: 'article', siteName: site.name, url: `/blog/${post.slug}`, title: headline, description,
      publishedTime: jst(post.date), modifiedTime: post.updated && jst(post.updated), authors: post.author ? [post.author] : undefined, tags: post.tags,
      section: post.category, images: [image] },
    twitter: { card: 'summary_large_image', site: site.x, title: headline, description, images: [image] },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { next, related } = getNeighbours(post.slug);

  // Article structured data for search engines (schema.org BlogPosting).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary,
    articleSection: post.category,
    wordCount: post.minutes * 220,
    datePublished: jst(post.date),
    dateModified: jst(post.updated ?? post.date),
    image: [post.shareImage, post.cover ?? site.ogImage].filter(Boolean).map(src => `${site.url}${src}`),
    url: `${site.url}/blog/${post.slug}`,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    author: { '@type': post.author && post.author !== site.name ? 'Person' : 'Organization', name: post.author ?? site.name },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    keywords: post.tags.join(', ') || undefined,
    about: post.company ? { '@type': 'Organization', name: post.company.name, url: post.company.url } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader variant="solid" />
      <main className="blog" id="main">
        <header className={`postHero${post.cover ? ' hasCover' : ''}`}>
          {post.cover && (
            <>
              <Image className="heroImg" src={post.cover} alt={post.coverAlt ?? ''} fill priority sizes="100vw"
                style={post.coverPosition ? { objectPosition: post.coverPosition } : undefined} />
              <span className="heroVeil" />
            </>
          )}
          <span className="heroKanji" aria-hidden="true">{CATEGORIES[post.category]}</span>
          <div className="heroTxt">
            <nav className="crumbs mono" aria-label="Breadcrumb">
              <Link href="/blog">Stories</Link><span>→</span>
              <Link href={`/blog#${encodeURIComponent(post.category)}`}>{post.category}</Link>
              {post.draft && <span className="draftChip">Draft</span>}
            </nav>
            <h1>{post.title}</h1>
            <p className="dek">{post.summary}</p>
            <div className="byline">
              <span className="no">{issue(post.number)}</span>
              {post.author && <span>By <b>{post.author}</b>{post.authorRole && `, ${post.authorRole}`}</span>}
              <span>{formatDate(post.date)}</span>
              <span>{post.minutes} min read</span>
              {post.company && <span>{post.company.url
                ? <a href={post.company.url} target="_blank" rel="noopener">{post.company.name} ↗<span className="sr-only"> (opens in a new tab)</span></a>
                : post.company.name}</span>}
              <CopyLink />
            </div>
          </div>
          {post.coverCredit && <p className="heroCredit mono">{post.coverCredit}</p>}
        </header>

        <div className="postBody">
          <ReadingRail toc={post.toc} />
          <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          <div className="postEnd">
            <p className="signoff">
              <span aria-hidden="true">—</span> Published {formatDate(post.date)} · Kobe
              {post.updated && <> · Updated {formatDate(post.updated)}</>}
            </p>
            {post.tags.length > 0 && <ul className="tags">{post.tags.map(t => <li key={t}>{t}</li>)}</ul>}
            {(post.author || post.company) && (
              <div className="postCredits">
                {post.author && (
                  <div><p className="mono">Written by</p><p className="cName">{post.author}</p>{post.authorRole && <p className="cLine">{post.authorRole}</p>}</div>
                )}
                {post.company && (
                  <div>
                    <p className="mono">About the company</p>
                    <p className="cName">{post.company.url
                      ? <a href={post.company.url} target="_blank" rel="noopener">{post.company.name} ↗<span className="sr-only"> (opens in a new tab)</span></a>
                      : post.company.name}</p>
                    {post.company.line && <p className="cLine">{post.company.line}</p>}
                  </div>
                )}
              </div>
            )}
            <CopyLink className="big" />
          </div>
        </div>

        {next && (
          <Link className="nextStory" href={`/blog/${next.slug}`}>
            {next.cover && <Image className="nsImg" src={next.cover} alt="" fill sizes="100vw" />}
            <span className="nsVeil" />
            <span className="nsTxt">
              <span className="eyebrow">Next story · {issue(next.number)}</span>
              <span className="nsTitle">{next.title}</span>
              <span className="nsArr" aria-hidden="true">→</span>
            </span>
          </Link>
        )}
        {related.length > 0 && (
          <section className="related">
            <p className="mono">More stories</p>
            <div className="cardGrid two">{related.map(p => <PostCard key={p.slug} p={p} />)}</div>
          </section>
        )}
        <NotifyStrip />
      </main>
      <SiteFooter />
    </>
  );
}
