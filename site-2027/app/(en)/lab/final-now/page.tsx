import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { Now } from '@/components/why-japan/Now';
export const metadata: Metadata = { title: 'Lab · Why Japan · Why now final' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan now={<Now />} /><NotifyStrip /></main><SiteFooter /></>);
}
