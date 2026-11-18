import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjHeroB } from '@/components/lab/WjHeroB';
export const metadata: Metadata = { title: 'Lab · Why Japan · Hero B' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan hero={<WjHeroB />} /><NotifyStrip /></main><SiteFooter /></>);
}
