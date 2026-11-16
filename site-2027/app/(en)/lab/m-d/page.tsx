import type { Metadata } from 'next';
import { ProgramD } from '@/components/lab/ProgramD';

export const metadata: Metadata = { title: 'Lab · Mission D · 万' };

export default function LabMissionD() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramD />
    </main>
  );
}
