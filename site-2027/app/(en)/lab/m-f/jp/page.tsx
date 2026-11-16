import type { Metadata } from 'next';
import { ProgramF } from '@/components/lab/ProgramF';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission F · First light (JA)' };

export default function LabMissionFJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramF r={residencyJa} /></div>
    </main>
  );
}
