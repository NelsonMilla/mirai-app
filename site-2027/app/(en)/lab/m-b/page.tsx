import type { Metadata } from 'next';
import { ProgramB } from '@/components/lab/ProgramB';

export const metadata: Metadata = { title: 'Lab · Mission B · Scale, shown' };

export default function LabMissionB() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <ProgramB />
    </main>
  );
}
