import type { Metadata } from 'next';
import { ProgramG } from '@/components/lab/ProgramG';

export const metadata: Metadata = { title: 'Lab · Mission G · Read it into light' };

export default function LabMissionG() {
  return (
    <main style={{ background: 'var(--night)' }}>
      {/* Spacer so the block arrives from below, as on the homepage (same as lab/s-month). */}
      <div style={{ height: '60vh' }} />
      <ProgramG />
    </main>
  );
}
