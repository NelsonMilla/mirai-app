import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjReasonsB } from '@/components/lab/WjReasonsB';
export const metadata: Metadata = { title: 'Lab · Why Japan · Reasons B' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan reasons={<WjReasonsB />} /><NotifyStrip /></main><SiteFooter /></>);
}
