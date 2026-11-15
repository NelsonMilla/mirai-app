import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = { title: 'Lab · Site header (solid)' };

// The header's 'solid' variant (blog pages) over a tall plain page.
export default function LabHeader() {
  return (
    <>
      <SiteHeader variant="solid" />
      <main style={{ padding: '140px 6vw 40vh', maxWidth: 760, margin: '0 auto', minHeight: '300vh' }}>
        <p className="eyebrow">Lab · header</p>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 64px)', fontWeight: 800, lineHeight: 1, margin: '18px 0 24px' }}>
          Site header, solid variant
        </h1>
        {Array.from({ length: 14 }, (_, i) => (
          <p key={i} className="lead" style={{ marginTop: 22 }}>
            Placeholder paragraph {i + 1}. The header keeps its night backdrop and hairline from the first frame, so it
            never collides with the text scrolling under it.
          </p>
        ))}
      </main>
    </>
  );
}
