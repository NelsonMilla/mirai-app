import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjHeroC } from '@/components/lab/WjHeroC';
export const metadata: Metadata = { title: 'Lab · Why Japan · Hero C' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan hero={<WjHeroC />} /><NotifyStrip /></main><SiteFooter /></>);
}
