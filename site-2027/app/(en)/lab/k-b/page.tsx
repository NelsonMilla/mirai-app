import { Kobe } from '@/components/residency/KobeB';
import { residencyJa } from '@/content/residency.ja';

// Section lab: Kobe variant B ("Transit diagram"), English then Japanese.
export default function KobeBLab() {
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
