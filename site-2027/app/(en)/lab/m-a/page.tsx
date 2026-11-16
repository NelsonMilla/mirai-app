import type { Metadata } from 'next';
import { ProgramA } from '@/components/lab/ProgramA';

export const metadata: Metadata = { title: 'Lab · Mission A · Quiet monument' };

export default function LabMissionA() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramA />
    </main>
  );
}
