import { Kobe } from '@/components/residency/KobeC';
import { residencyJa } from '@/content/residency.ja';

// Section lab: Kobe variant C ("Day to night"), English then Japanese.
export default function KobeCLab() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div style={{ height: '40vh' }} />
      <Kobe />
      <div style={{ height: 120 }} />
      <div lang="ja"><Kobe r={residencyJa} /></div>
      <div style={{ height: '40vh' }} />
    </main>
  );
}
