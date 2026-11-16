import type { Metadata } from 'next';
import { ProgramA } from '@/components/lab/ProgramA';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission A · Quiet monument (JA)' };

export default function LabMissionAJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramA r={residencyJa} /></div>
    </main>
  );
}
