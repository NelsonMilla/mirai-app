import type { Metadata } from 'next';
import { ProgramB } from '@/components/lab/ProgramB';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission B · Scale, shown (JA)' };

export default function LabMissionBJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramB r={residencyJa} /></div>
    </main>
  );
}
