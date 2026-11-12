import { Nav } from '@/components/Nav';
import { HeroC } from '@/components/hero-variants/HeroC';

export default function HeroLabC() {
  return (
    <>
      <Nav />
      <main>
        <HeroC />
        <section id="2026" style={{ height: 300, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
          <p className="eyebrow">Recap continues below</p>
        </section>
      </main>
    </>
  );
}
