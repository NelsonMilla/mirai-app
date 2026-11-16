import type { Metadata } from 'next';
import { ProgramH } from '@/components/lab/ProgramH';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission H · Answer with the people (JA)' };

export default function LabMissionHJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramH r={residencyJa} /></div>
    </main>
  );
}
