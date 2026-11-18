import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WhyJapan } from '@/components/WhyJapan';
import { NotifyStrip } from '@/components/blog/NotifyStrip';
import { WjReasonsC } from '@/components/lab/WjReasonsC';
export const metadata: Metadata = { title: 'Lab · Why Japan · Reasons C' };
export default function Page() {
  return (<><SiteHeader variant="solid" /><main id="main"><WhyJapan reasons={<WjReasonsC />} /><NotifyStrip /></main><SiteFooter /></>);
}
