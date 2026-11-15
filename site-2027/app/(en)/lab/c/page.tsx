import type { Metadata } from 'next';
import { OpeningC } from '@/components/lab/OpeningC';

export const metadata: Metadata = { title: 'Lab C · Restraint · Mirai Tech City Residency' };

export default function LabC() {
  return (
    <OpeningC>
      <section
        style={{
          height: 400, maxWidth: 'none', margin: 0, padding: '0 6vw',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#ebe5d9', color: '#3e3a34', borderTop: '1px solid rgba(27,26,23,.14)',
          fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase',
        }}
      >
        Program continues below
      </section>
    </OpeningC>
  );
}
