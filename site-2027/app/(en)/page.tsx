import { HomePage, homeMetadata } from '@/components/HomePage';
import { residency } from '@/content/residency';

export const metadata = homeMetadata(residency, 'en');

export default function Home() {
  return <HomePage r={residency} lang="en" skip="See the program" />;
}
