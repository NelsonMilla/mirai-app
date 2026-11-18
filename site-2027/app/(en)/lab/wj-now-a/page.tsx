import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjNowA } from '@/components/lab/WjNowA';
export const metadata: Metadata = { title: 'Lab · Why Japan · Now A' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan now={<WjNowA />} /><NotifyStrip /></main><SiteFooter /></>);
}
