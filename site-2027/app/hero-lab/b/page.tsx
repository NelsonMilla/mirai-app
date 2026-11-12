import { Nav } from '@/components/Nav';
import { HeroB } from '@/components/hero-variants/HeroB';

export default function HeroLabB() {
  return (
    <main>
      <Nav />
      <HeroB />
      <section id="2026" style={{ height: 300, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
        <p className="eyebrow">Recap continues below</p>
      </section>
    </main>
  );
}
