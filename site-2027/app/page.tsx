import { HomePage, homeMetadata } from '@/components/HomePage';
import { site } from '@/content/site';

export const metadata = homeMetadata(site);

export default function Home() {
  return <HomePage t={site} skip="Skip to the 2026 recap" />;
}
