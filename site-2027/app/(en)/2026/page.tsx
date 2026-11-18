import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LastYear } from '@/components/LastYear';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { site } from '@/content/site';

const t = site.lastYear;

export const metadata: Metadata = {
  title: `${t.seoTitle} · ${site.name}`,
  description: t.seoDescription,
  alternates: { canonical: '/2026' },
  openGraph: { siteName: site.name, title: t.seoTitle, description: t.seoDescription, url: '/2026', images: [site.ogImage] },
};

export default function LastYearPage() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader variant="solid" />
      <main id="main">
        <LastYear />
        <NotifyStrip />
      </main>
      <SiteFooter />
    </>
  );
}
