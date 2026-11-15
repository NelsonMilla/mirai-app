import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { Opening } from '@/components/residency/Opening';

export const metadata: Metadata = { title: 'Lab A · Monument' };

// Production opening + site header preview. The lab-round original stays in
// components/lab/OpeningA.tsx for comparison.
export default function LabA() {
  return (
    <>
      <SiteHeader />
      <main>
        <Opening />
        <section
          id="program"
          style={{ height: 400, maxWidth: 'none', display: 'grid', placeItems: 'center', background: 'var(--night)' }}
        >
          <p className="mono">Program continues below</p>
        </section>
      </main>
    </>
  );
}
