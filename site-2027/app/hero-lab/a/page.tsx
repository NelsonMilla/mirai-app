import { Nav } from '@/components/Nav';
import { HeroA } from '@/components/hero-variants/HeroA';

export default function HeroLabA() {
  return (
    <>
      <Nav />
      <main>
        <HeroA />
        <section id="2026" style={{ height: 300, display: 'grid', placeItems: 'center', borderTop: '1px solid var(--line)' }}>
          <p className="mono">Recap continues below</p>
        </section>
      </main>
    </>
  );
}
