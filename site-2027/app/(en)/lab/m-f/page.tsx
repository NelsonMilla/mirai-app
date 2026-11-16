import type { Metadata } from 'next';
import { ProgramF } from '@/components/lab/ProgramF';

export const metadata: Metadata = { title: 'Lab · Mission F · First light' };

export default function LabMissionF() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramF />
    </main>
  );
}
