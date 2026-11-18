import Link from 'next/link';

// Why Japan design rounds (Nov 18 2026). Each page renders the whole /why-japan page with one
// section swapped for a variant. The orchestrator fills in notes as rounds finish.
const ROUNDS = [
  { id: 'why-japan', name: 'Shipped · the assembled page', note: 'Hero C + Reasons B + Why now B (with A’s Today mark), then two revision rounds. Final gauntlet: founder 7, art director 8, truth 9, craft 9, all PASS.' },
  { id: 'final-hero', name: 'Round 1 synthesis · hero', note: 'C with fixes (logo-free photos, lab visit first). Later replaced by one large group photo in revision 2.' },
  { id: 'final-reasons', name: 'Round 1 synthesis · reasons', note: 'B with the iPS spread grafted in from C and the figures put on one size.' },
  { id: 'final-now', name: 'Round 1 synthesis · why now', note: 'B with A’s Today mark, computed from the visitor’s clock.' },
  { id: 'wj-hero-a', name: 'Hero A · Monument', note: 'The claim as viewport-scale type; the photo is secondary. Gauntlet: founder FAIL 5, AD FAIL 6, craft 8, truth 8.' },
  { id: 'wj-hero-b', name: 'Hero B · Film still', note: 'A full-bleed Kyoto autumn title card. Gauntlet: founder FAIL 6, AD FAIL 5 (“travel agency”), craft 7, truth 8.' },
  { id: 'wj-hero-c', name: 'Hero C · The people who came', note: 'Real 2026 people beside the claim. WINNER. Gauntlet: founder 8, AD 7, craft 8, truth FAIL 4 (logos, fixed in synthesis).' },
  { id: 'wj-reasons-a', name: 'Reasons A · Reel', note: 'Apple-style horizontal reel. Gauntlet: founder FAIL 5, AD FAIL 5 (“the 2026 pattern again”), craft 8, truth 7.' },
  { id: 'wj-reasons-b', name: 'Reasons B · Numbers wall', note: 'Numbers wall. WINNER. Gauntlet: founder 8, AD 8, craft 7, truth FAIL 5 (6–12 too loud, fixed in synthesis).' },
  { id: 'wj-reasons-c', name: 'Reasons C · Editorial spreads', note: 'Editorial spreads. Gauntlet: founder 7, AD FAIL 6, craft 7, truth 8. Its iPS spread was grafted into the winner.' },
  { id: 'wj-now-a', name: 'Why now A · The rail', note: 'Proportional time axis with Today. Gauntlet: founder 8, AD FAIL 6, craft 9, truth 7. Its Today mark was grafted into the winner.' },
  { id: 'wj-now-b', name: 'Why now B · Years as monuments', note: 'Giant sticky years. WINNER. Gauntlet: founder FAIL 5, AD 8, craft 8, truth 7.' },
  { id: 'wj-now-c', name: 'Why now C · Dossier', note: 'Filed approval records. Gauntlet: founder FAIL 6, AD FAIL 4, craft 8, truth 5.' },
];

export default function Lab() {
  return (
    <main style={{ padding: '120px 6vw', maxWidth: 1100, margin: '0 auto' }}>
      <p className="eyebrow">Why Japan · design rounds · Nov 18 2026</p>
      <h1 style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(40px,6vw,88px)', lineHeight: .95, margin: '18px 0 40px' }}>Why Japan lab</h1>
      <ol style={{ listStyle: 'none', borderTop: '1px solid var(--line)' }}>
        {ROUNDS.map(v => (
          <li key={v.id} style={{ borderBottom: '1px solid var(--line)' }}>
            <Link href={v.id === 'why-japan' ? '/why-japan' : `/lab/${v.id}`} style={{ display: 'block', padding: '26px 0', textDecoration: 'none' }}>
              <span style={{ fontWeight: 800, fontSize: 26, textTransform: 'uppercase' }}>{v.name}</span>
              <span className="lead" style={{ display: 'block' }}>{v.note}</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
