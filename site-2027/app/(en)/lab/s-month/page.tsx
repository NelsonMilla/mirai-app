import { Month } from '@/components/residency/Month';

// Section lab: the month on its own, with spacers so the scroll behaviour can be judged.
export default function MonthLab() {
  return (
    <main style={{ background: 'var(--night)' }}>
      <div style={{ height: '60vh' }} />
      <Month />
      <div style={{ height: '80vh' }} />
    </main>
  );
}
