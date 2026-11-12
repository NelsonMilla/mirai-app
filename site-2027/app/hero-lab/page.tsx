import Link from 'next/link';

const VARIANTS = [
  { id: 'a', name: 'A · Maximal type', note: 'Viewport-scale kinetic typography; 2026 → 2027 told by the letters themselves.' },
  { id: 'b', name: 'B · Faces', note: 'Edge-to-edge wall of the 2026 speakers and people; the crowd is the hero.' },
  { id: 'c', name: 'C · Trailer', note: 'Cinematic film-trailer sequence: title cards over moving Kobe footage.' },
  { id: 'd', name: 'D · Object', note: 'One interactive object: the daruma that gets its second eye in 2027.' },
];

export default function HeroLab() {
  return (
    <main style={{ padding: '140px 6vw', maxWidth: 1100, margin: '0 auto' }}>
      <p className="eyebrow">Design round · hero · Nov 4 2026 · round 2 on top</p>
      <h1 className="big" style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(40px,6vw,88px)', lineHeight: .95, margin: '18px 0 40px' }}>Hero lab</h1>
      <ol style={{ listStyle: 'none', borderTop: '1px solid var(--line)' }}>
        {VARIANTS.map(v => (
          <li key={v.id} style={{ borderBottom: '1px solid var(--line)' }}>
            <Link href={`/hero-lab/${v.id}`} style={{ display: 'block', padding: '26px 0', textDecoration: 'none' }}>
              <span style={{ fontWeight: 800, fontSize: 26, textTransform: 'uppercase' }}>{v.name}</span>
              <span className="lead" style={{ display: 'block' }}>{v.note}</span>
            </Link>
          </li>
        ))}
        <li style={{ borderBottom: '1px solid var(--line)' }}>
          <Link href="/" style={{ display: 'block', padding: '26px 0', textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: 26, textTransform: 'uppercase' }}>Shipped: E · Combination</span>
            <span className="lead" style={{ display: 'block' }}>Round 2 winner, now the homepage hero: trailer + 2026 → 2027 digit roll + speakers faces. 2027 says Japan, never Kobe.</span>
          </Link>
        </li>
      </ol>
    </main>
  );
}
