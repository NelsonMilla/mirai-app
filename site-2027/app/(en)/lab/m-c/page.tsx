import type { Metadata } from 'next';
import { ProgramC } from '@/components/lab/ProgramC';

export const metadata: Metadata = { title: 'Lab · Mission C · A page of paper' };

export default function LabMissionC() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramC />
    </main>
  );
}
