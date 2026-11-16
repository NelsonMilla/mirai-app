import type { Metadata } from 'next';
import { ProgramG } from '@/components/lab/ProgramG';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission G · Read it into light (JA)' };

export default function LabMissionGJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      {/* Spacer so the block arrives from below, as on the homepage (same as lab/s-month). */}
      <div style={{ height: '60vh' }} />
      <div lang="ja"><ProgramG r={residencyJa} /></div>
    </main>
  );
}
