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
  // 10,000 cures (mission) round (Nov 16 2026): the old block felt dizzy (three display sizes at once).
  { id: 'm-a', name: 'Mission A · Quiet monument', note: 'One calm “10,000 cures” line, lots of space, the four paragraphs as one editorial text block.' },
  { id: 'm-b', name: 'Mission B · Scale, shown', note: 'A still field of 10,000 marks carries the size of the number; modest headline, ruled text beside it.' },
  { id: 'm-c', name: 'Mission C · A page of paper', note: 'The block turns to warm paper between two dark sections: an editorial page, ASRM as a margin note.' },
  // Round two (Nov 16 2026): A was calm but "still boring". Calm and moving.
  { id: 'm-d', name: 'Mission D · 万', note: 'One large, quiet Mincho 万 (ten thousand) as the block’s single visual, the statement composed with it.' },
  { id: 'm-e', name: 'Mission E · Still frame', note: 'A real Cohort 0 community photograph carries the feeling; the statement set calmly with it.' },
  { id: 'm-f', name: 'Mission F · First light', note: 'One slow gesture of dawn light on “10,000 cures” as it comes into view, then everything is still.' },
  // Round three (Nov 16 2026): F was "still not feeling it". References + reviewer gauntlet.
  { id: 'm-g', name: 'Mission G · Read it into light', note: 'The four paragraphs become the display text; words come up from dim as you read; only “10,000 cures” lands in gold.' },
  { id: 'm-h', name: 'Mission H · Answer with the people', note: '“10,000 cures” at sentence size; real people from Cohort 0 answer “who we are”.' },
  { id: 'm-i', name: 'Mission I · Problem, then promise', note: '“More than 10,000 rare diseases” in slate, “10,000 cures” in gold, same size (reorders copy: needs OK).' },
  { id: 's-program', name: 'Mission · Shipped (G, revision 3)', note: 'Round three: G passed all four gauntlet reviewers after two revisions (founder 7, art director 8, craft 8, truth 8.5). Stakes first (order pending approval), lines light at reading height.' },
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
