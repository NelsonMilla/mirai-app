'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  const isExpired = error === 'expired';
  const isInvalid = error === 'invalid' || error === 'missing';

  return (
    <main className="invite-page">
      <div className="invite-container">
        <div className="invite-card" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>
            {isExpired ? 'Link Expired' : isInvalid ? 'Invalid Link' : 'Payment Not Completed'}
          </div>

          <h1 className="invite-title">
            {isExpired
              ? 'This link has expired.'
              : isInvalid
                ? 'Invalid payment link.'
                : 'Payment was not completed.'}
          </h1>

          <p className="invite-subtitle">
            {isExpired
              ? 'Your payment link has expired. Please contact the organizers to request a new one.'
              : isInvalid
                ? 'This payment link is invalid or has already been used. Check your email for the correct link.'
                : 'No worries — your spot is still reserved. You can try again whenever you\'re ready.'}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {token && !isExpired && !isInvalid && (
              <Link
                href={`/checkout?token=${encodeURIComponent(token)}`}
                className="btn btn-primary"
              >
                Try Again
              </Link>
            )}
            <Link href="/" className="btn" style={{ border: '1px solid var(--charcoal)' }}>
              Back to Mirai
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
