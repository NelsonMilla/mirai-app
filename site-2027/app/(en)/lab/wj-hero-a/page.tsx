import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjHeroA } from '@/components/lab/WjHeroA';
export const metadata: Metadata = { title: 'Lab · Why Japan · Hero A' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan hero={<WjHeroA />} /><NotifyStrip /></main><SiteFooter /></>);
}
