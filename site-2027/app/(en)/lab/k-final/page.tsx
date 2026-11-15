import { Kobe } from '@/components/residency/Kobe';
import { residencyJa } from '@/content/residency.ja';

// Section lab: the production Kobe section (from variant B), English then Japanese.
export default function KobeFinalLab() {
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
