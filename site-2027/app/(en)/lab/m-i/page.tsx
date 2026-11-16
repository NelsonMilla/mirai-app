import type { Metadata } from 'next';
import { ProgramI } from '@/components/lab/ProgramI';

export const metadata: Metadata = { title: 'Lab · Mission I · Problem, then promise' };

export default function LabMissionI() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramI />
    </main>
  );
}
