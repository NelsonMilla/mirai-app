import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { Hero } from '@/components/why-japan/Hero';
export const metadata: Metadata = { title: 'Lab · Why Japan · Final hero' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan hero={<Hero />} /><NotifyStrip /></main><SiteFooter /></>);
}
