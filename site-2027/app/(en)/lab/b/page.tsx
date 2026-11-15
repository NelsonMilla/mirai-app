import type { Metadata } from 'next';
import { OpeningB } from '@/components/lab/OpeningB';

export const metadata: Metadata = { title: 'Lab B · Sculpture · Mirai Tech City Residency' };

export default function LabB() {
  return (
    <main>
      <OpeningB />
      <section style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid var(--line)' }}>
        <p className="mono">Program continues below</p>
      </section>
    </main>
  );
}
