import type { Metadata } from 'next';
import { Cohort0 } from '@/components/residency/Cohort0';

export const metadata: Metadata = { title: 'Lab · Cohort 0 section' };

export default function LabCohort0() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <Cohort0 />
    </main>
  );
}
