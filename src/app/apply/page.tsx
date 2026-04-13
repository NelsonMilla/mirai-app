import { ApplyForm } from './ApplyForm';
import { MailingListForm } from './MailingListForm';
import { CursorGlow } from './CursorGlow';

export const metadata = {
  title: 'Apply — Builder Pass · Mirai Tech PopUp City',
  description: 'Apply for the Builder Pass at Mirai Tech PopUp City. Full access to Kobe\'s Port Island for one month of building, connecting, and exploring biotech.',
};

export default function ApplyPage() {
  return (
    <main className="apply-page">
      {/* Ambient layers */}
      <div className="apply-kanji-watermark jp" aria-hidden="true">応</div>
      <CursorGlow />

      <div className="apply-page-inner">
        {/* ── HEADER ── */}
        <header className="apply-page-header">
          <a href="/" className="apply-back mono">&larr; mirai.tech</a>
          <div className="apply-page-badge mono">Builder Pass &middot; Open Now</div>
          <h1 className="apply-page-title display">Apply as a Builder</h1>
          <p className="apply-page-sub">
            One month on Kobe&apos;s Port Island. Full access to programming, community events,
            the Frontier Human Fashion Show, and popup city life.
          </p>
          <p className="apply-page-upgrade mono">
            Applying as Builder? You can upgrade to Devices or Therapies track after acceptance.
          </p>
        </header>

        {/* ── APPLICATION FORM ── */}
        <ApplyForm />

        {/* ── DIVIDER ── */}
        <div className="apply-divider">
          <span className="apply-divider-line" />
          <span className="apply-divider-text mono">Not ready to apply?</span>
          <span className="apply-divider-line" />
        </div>

        {/* ── MAILING LIST ── */}
        <section className="mailing-list-section">
          <h3 className="display" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', marginBottom: '0.5rem' }}>
            Get notified when other tracks open
          </h3>
          <p style={{ color: 'var(--slate)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Devices and Therapies tracks opening soon. Join the list to be first in line.
          </p>
          <MailingListForm />
        </section>
      </div>
    </main>
  );
}
