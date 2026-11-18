import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { site } from '@/content/site';
import { whyJapan as t } from '@/content/why-japan';

export const metadata: Metadata = {
  title: `${t.seoTitle} · ${site.name}`,
  description: t.seoDescription,
  alternates: { canonical: '/why-japan' },
  openGraph: { siteName: site.name, title: t.seoTitle, description: t.seoDescription, url: '/why-japan', images: [t.hero.src] },
};

export default function WhyJapanPage() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader variant="solid" />
      <main id="main">
        <WhyJapan />
        <NotifyStrip />
      </main>
      <SiteFooter />
    </>
  );
}
