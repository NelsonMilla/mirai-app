import type { Metadata } from 'next';
import { Life, Voices } from '@/components/residency/Life';

export const metadata: Metadata = { title: 'Lab · Life section' };

export default function LabLife() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <Life />
      <Voices />
    </main>
  );
}
