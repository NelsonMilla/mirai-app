import type { Metadata } from 'next';
import { Program } from '@/components/residency/Program';

export const metadata: Metadata = { title: 'Lab · Program section' };

export default function LabProgram() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <Program />
    </main>
  );
}
