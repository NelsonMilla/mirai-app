import { HomePage, homeMetadata } from '@/components/HomePage';
import { residencyJa } from '@/content/residency.ja';

export const metadata = homeMetadata(residencyJa, 'ja');

export default function HomeJa() {
  return <HomePage r={residencyJa} lang="ja" skip="プログラムを見る" />;
}
