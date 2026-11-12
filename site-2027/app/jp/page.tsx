import { HomePage, homeMetadata } from '@/components/HomePage';
import { ja } from '@/content/site.ja';

export const metadata = homeMetadata(ja);

export default function HomeJa() {
  return <HomePage t={ja} skip="2026年の振り返りへ移動" />;
}
