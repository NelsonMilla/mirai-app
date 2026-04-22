'use client';

import Link from 'next/link';
import { QuickActions } from '@/components/ui/QuickActions';

export default function CheckoutSuccessPage() {
  return (
    <main className="invite-page">
      <div className="invite-container">
        <div className="invite-card" style={{ textAlign: 'center' }}>
          <div
            className="section-label"
            style={{ marginBottom: '0.5rem', color: 'var(--pink-bright)' }}
          >
            Payment Confirmed
          </div>
          <h1 className="invite-title">You&rsquo;re going to Mirai!</h1>
          <p className="invite-subtitle">
            Your spot is secured. Kobe&rsquo;s Port Island, October 1&ndash;31, 2026.
          </p>
          <p className="invite-subtitle" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            You&rsquo;ll receive a confirmation email shortly with next steps.
          </p>
          <Link
            href="/"
            className="btn btn-primary"
            style={{ display: 'inline-flex', marginTop: '1.5rem' }}
          >
            Back to Mirai
          </Link>
        </div>

        <QuickActions
          variant="stacked"
          source="checkout-success"
          heading="Your next steps"
          subheading="Join the community, stay in the loop, and set up your platform access."
        />
      </div>
    </main>
  );
}
