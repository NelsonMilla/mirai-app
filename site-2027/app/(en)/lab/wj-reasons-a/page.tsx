import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjReasonsA } from '@/components/lab/WjReasonsA';
export const metadata: Metadata = { title: 'Lab · Why Japan · Reasons A' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan reasons={<WjReasonsA />} /><NotifyStrip /></main><SiteFooter /></>);
}
