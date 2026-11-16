import type { Metadata } from 'next';
import { ProgramD } from '@/components/lab/ProgramD';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission D · 万 (JA)' };

export default function LabMissionDJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramD r={residencyJa} /></div>
    </main>
  );
}
