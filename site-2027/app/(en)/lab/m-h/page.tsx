import type { Metadata } from 'next';
import { ProgramH } from '@/components/lab/ProgramH';

export const metadata: Metadata = { title: 'Lab · Mission H · Answer with the people' };

export default function LabMissionH() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramH />
    </main>
  );
}
