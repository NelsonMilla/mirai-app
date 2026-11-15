import type { Metadata } from 'next';
import OpeningD from '@/components/lab/OpeningD';

export const metadata: Metadata = { title: 'Lab D · Atmosphere' };

export default function LabD() {
  return (
    <main>
      <OpeningD />
      <section
        style={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: '1px solid var(--line)',
        }}
      >
        <p className="mono">Program continues below</p>
      </section>
    </main>
  );
}
