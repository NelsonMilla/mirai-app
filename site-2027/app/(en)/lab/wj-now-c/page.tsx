import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjNowC } from '@/components/lab/WjNowC';
export const metadata: Metadata = { title: 'Lab · Why Japan · Why now C' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan now={<WjNowC />} /><NotifyStrip /></main><SiteFooter /></>);
}
