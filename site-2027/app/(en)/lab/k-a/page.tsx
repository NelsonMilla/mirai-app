import { Kobe } from '@/components/residency/KobeA';
import { residencyJa } from '@/content/residency.ja';

// Section lab: Kobe variant A ("Saucer"), English then Japanese.
export default function KobeALab() {
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
