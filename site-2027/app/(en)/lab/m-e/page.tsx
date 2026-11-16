import type { Metadata } from 'next';
import { ProgramE } from '@/components/lab/ProgramE';

export const metadata: Metadata = { title: 'Lab · Mission E · Still frame' };

export default function LabMissionE() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramE />
    </main>
  );
}
