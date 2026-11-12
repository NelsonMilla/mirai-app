import { Nav } from '@/components/Nav';
import { HeroD } from '@/components/hero-variants/HeroD';

export default function HeroLabD() {
  return (
    <>
      <Nav />
      <main>
        <HeroD />
        <section id="2026" style={{ height: 300, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="mono">Recap continues below</p>
        </section>
      </main>
    </>
  );
}
