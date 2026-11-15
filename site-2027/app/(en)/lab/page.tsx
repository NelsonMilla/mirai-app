import Link from 'next/link';

const ROUNDS = [
  { id: 'a', name: 'A · Monument', note: 'Monumental type at cinematic scale (NOT A HOTEL, Hyer).' },
  { id: 'b', name: 'B · Sculpture', note: 'Fuji as a generated, living object in an immersive landscape (Igloo).' },
  { id: 'c', name: 'C · Restraint', note: 'Quiet editorial, light, pearl and ink, vertical Japanese type (Shishi-Iwa, Unseen).' },
  { id: 'd', name: 'D · Atmosphere', note: 'Optical dawn sky, grain and a lens that reveals 不死 (monopo).' },
  // Kobe week + Demo Day round (Nov 15 2026): the UFO building on Rokko Island.
  { id: 'k-a', name: 'Kobe A · Saucer', note: 'The UFO building as a monument: daylight meetings, then the saucer at night as a title card.' },
  { id: 'k-b', name: 'Kobe B · Transit diagram', note: 'A two-island transit diagram; the gold route draws from Port Island to the saucer on Rokko Island.' },
  { id: 'k-final', name: 'Kobe · Shipped (B + grafts)', note: 'Judge winner B (28/35) with A’s full-bleed saucer video, C’s daylight print, Tim Draper line, 舞台 mark.' },
  { id: 'k-c', name: 'Kobe C · Day to night', note: 'A diptych: meetings by day on Port Island, the saucer by night; a divider sweeps day into night.' },
];

export default function Lab() {
  return (
    <main style={{ padding: '120px 6vw', maxWidth: 1100, margin: '0 auto' }}>
      <p className="eyebrow">Residency 2027 · opening round · Nov 12 2026</p>
      <h1 style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(40px,6vw,88px)', lineHeight: .95, margin: '18px 0 40px' }}>Opening lab</h1>
      <ol style={{ listStyle: 'none', borderTop: '1px solid var(--line)' }}>
        {ROUNDS.map(v => (
          <li key={v.id} style={{ borderBottom: '1px solid var(--line)' }}>
            <Link href={`/lab/${v.id}`} style={{ display: 'block', padding: '26px 0', textDecoration: 'none' }}>
              <span style={{ fontWeight: 800, fontSize: 26, textTransform: 'uppercase' }}>{v.name}</span>
              <span className="lead" style={{ display: 'block' }}>{v.note}</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
