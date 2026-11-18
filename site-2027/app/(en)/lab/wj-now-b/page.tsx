import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjNowB } from '@/components/lab/WjNowB';
export const metadata: Metadata = { title: 'Lab · Why Japan · Why now B' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan now={<WjNowB />} /><NotifyStrip /></main><SiteFooter /></>);
}
