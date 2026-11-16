import type { Metadata } from 'next';
import { ProgramE } from '@/components/lab/ProgramE';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission E · Still frame (JA)' };

export default function LabMissionEJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramE r={residencyJa} /></div>
    </main>
  );
}
