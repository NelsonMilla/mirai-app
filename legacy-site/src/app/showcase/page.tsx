import { ShowcaseForm } from './ShowcaseForm';
import { CursorGlow } from '../apply/CursorGlow';

export const metadata = {
  title: 'Showcase Your Company — Demo Day & Fashion Show · Mirai Tech PopUp City',
  description:
    'Attending Mirai? Apply to present your technology at Demo Day or walk the Frontier Human Fashion Show on Oct 26. Showcase slots are curated.',
};

export default function ShowcasePage() {
  return (
    <main className="apply-page">
      {/* Ambient layers */}
      <div className="apply-kanji-watermark jp" aria-hidden="true">展</div>
      <CursorGlow />

      <div className="apply-page-inner">
        {/* ── HEADER ── */}
        <header className="apply-page-header">
          <a href="/" className="apply-back mono">&larr; miraitech.city</a>
          <div className="apply-page-badge mono">Fashion Show &amp; Demo Day &middot; Oct 26</div>
          <h1 className="apply-page-title display">Showcase your company</h1>
          <p className="apply-page-sub">
            For teams attending Mirai (ticket required) who want to present their technology at
            Demo Day or walk the Frontier Human Fashion Show. Tell us what you&apos;re building and
            where you want to take it.
          </p>
          <p className="apply-page-upgrade mono">
            Showcase slots are curated. We review applications on a rolling basis.
          </p>
        </header>

        {/* ── SHOWCASE FORM ── */}
        <ShowcaseForm />
      </div>
    </main>
  );
}
