import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { Reasons } from '@/components/why-japan/Reasons';
export const metadata: Metadata = { title: 'Lab · Why Japan · Final reasons' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan reasons={<Reasons />} /><NotifyStrip /></main><SiteFooter /></>);
}
