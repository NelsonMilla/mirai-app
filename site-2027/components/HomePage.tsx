import type { Metadata } from 'next';
import type { Copy } from '@/content/site';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Recap } from './Recap';
import { Moments } from './Moments';
import { Speakers } from './Speakers';
import { Photos } from './Photos';
import { Next2027 } from './Next2027';
import { Footer } from './Footer';
import { Reveal } from './Reveal';
import { Life } from './Life';
import { Voices } from './Voices';
import { BuiltHere } from './BuiltHere';
import { LatestPosts } from './LatestPosts';
import { StructuredData } from './StructuredData';

// The homepage in one language. app/page.tsx (English) and app/jp/page.tsx (Japanese)
// both render this with their copy, so the two stay structurally identical.
export function HomePage({ t, skip }: { t: Copy; skip: string }) {
  return (
    <div lang={t.lang}>
      <StructuredData lang={t.lang} />
      <a className="skip" href="#2026">{skip}</a>
      <Nav t={t} />
      <main>
        <Hero t={t} />
        <Recap t={t} />
        <hr className="rule" />
        <Life t={t} />
        <hr className="rule" />
        <Moments t={t} />
        <Voices t={t} />
        <hr className="rule" />
        <Speakers t={t} />
        <hr className="rule" />
        <BuiltHere t={t} />
        <Photos t={t} />
        <LatestPosts t={t} />
        <Next2027 t={t} />
      </main>
      <Footer t={t} />
      <Reveal />
    </div>
  );
}

// hreflang pair: each homepage names itself canonical and points at the other.
export function homeMetadata(t: Copy): Metadata {
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: t.home,
      languages: { en: '/', ja: '/jp', 'x-default': '/' },
      types: { 'application/rss+xml': '/blog/rss.xml' },
    },
    openGraph: { siteName: t.name, title: t.title, description: t.description, type: 'website', url: t.home,
      locale: t.lang === 'ja' ? 'ja_JP' : 'en_US', alternateLocale: t.lang === 'ja' ? ['en_US'] : ['ja_JP'], images: [t.ogImage] },
    twitter: { card: 'summary_large_image', title: t.title, description: t.description, images: [t.ogImage] },
  };
}
