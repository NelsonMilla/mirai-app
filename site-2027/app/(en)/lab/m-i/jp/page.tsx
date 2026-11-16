import type { Metadata } from 'next';
import { ProgramI } from '@/components/lab/ProgramI';
import { residencyJa } from '@/content/residency.ja';

export const metadata: Metadata = { title: 'Lab · Mission I · Problem, then promise (JA)' };

export default function LabMissionIJa() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div lang="ja"><ProgramI r={residencyJa} /></div>
    </main>
  );
}
