import type { Metadata } from 'next';
import type { Residency } from '@/content/residency';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { StructuredData } from './StructuredData';
import { Opening } from './residency/Opening';
import { Program } from './residency/Program';
import { Month } from './residency/Month';
import { Kobe } from './residency/Kobe';
import { Cohort0 } from './residency/Cohort0';
import { Life, Voices } from './residency/Life';
import { Apply } from './residency/Apply';

// The Residency 2027 landing page in one language. app/page.tsx (English) and
// app/jp/page.tsx (Japanese) both render this with their copy, so the two stay
// structurally identical. Section system: components/residency/README.md.
export function HomePage({ r, lang, skip }: { r: Residency; lang: 'en' | 'ja'; skip: string }) {
  return (
    <div lang={lang} className="residency">
      <StructuredData lang={lang} />
      <a className="skip" href="#program">{skip}</a>
      <SiteHeader r={r} />
      <main>
        <Opening r={r} />
        <Program r={r} />
        <Month r={r} />
        <Kobe r={r} />
        <Cohort0 r={r} />
        <Life r={r} />
        <Voices r={r} />
        <Apply r={r} />
      </main>
      <SiteFooter r={r} />
    </div>
  );
}

// hreflang pair: each homepage names itself canonical and points at the other.
export function homeMetadata(r: Residency, lang: 'en' | 'ja'): Metadata {
  const image = '/img/fuji/fuji-dawn.webp';
  return {
    title: r.seo.title,
    description: r.seo.description,
    alternates: {
      canonical: r.home,
      languages: { en: '/', ja: '/jp', 'x-default': '/' },
      types: { 'application/rss+xml': '/blog/rss.xml' },
    },
    openGraph: {
      siteName: 'Mirai Tech City', title: r.seo.title, description: r.seo.description, type: 'website', url: r.home,
      locale: lang === 'ja' ? 'ja_JP' : 'en_US', alternateLocale: lang === 'ja' ? ['en_US'] : ['ja_JP'],
      images: [{ url: image, width: 1600, height: 1063, alt: 'Mount Fuji and Lake Shoji at sunrise' }],
    },
    twitter: { card: 'summary_large_image', title: r.seo.title, description: r.seo.description, images: [image] },
  };
}
