'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'redirecting' | 'error'>('redirecting');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    // The API route handles validation + Stripe redirect
    window.location.href = `/api/checkout?token=${encodeURIComponent(token)}`;
  }, [token]);

  if (status === 'error') {
    return (
      <main className="invite-page">
        <div className="invite-container">
          <div className="invite-card" style={{ textAlign: 'center' }}>
            <h1 className="invite-title">Invalid Payment Link</h1>
            <p className="invite-subtitle">
              This payment link is missing or malformed. If you were invited, check your email for the correct link.
            </p>
            <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Back to Mirai
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="invite-page">
      <div className="invite-container">
        <div className="invite-card" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>Secure Checkout</div>
          <h1 className="invite-title">Redirecting to payment...</h1>
          <p className="invite-subtitle">
            You&rsquo;ll be taken to Stripe&rsquo;s secure checkout page in a moment.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="checkout-spinner" />
          </div>
        </div>
      </div>
    </main>
  );
}
