import type { Metadata } from 'next';
import { ProgramC } from '@/components/lab/ProgramC';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission C · A page of paper (JA)' };

export default function LabMissionCJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramC r={residencyJa} /></div>
    </main>
  );
}
