'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { joinMailingList } from '@/app/apply/actions';

type Variant = 'default' | 'compact' | 'stacked';

interface QuickActionsProps {
  variant?: Variant;
  heading?: string;
  subheading?: string;
  source?: string;
}

const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_INVITE_URL || 'https://t.me/+miraitech';

const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

const MailIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const KeyIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M10.5 12.5 21 2l-3 3 2 2-2 2-2-2-2 2" />
  </svg>
);

export function QuickActions({
  variant = 'default',
  heading = 'Stay in the loop',
  subheading = 'Three quick ways to plug in — no application required.',
  source = 'quick-actions',
}: QuickActionsProps) {
  const [state, formAction, isPending] = useActionState(joinMailingList, null);

  return (
    <section
      className={`quick-actions quick-actions--${variant}`}
      aria-labelledby="quick-actions-heading"
    >
      <div className="quick-actions-head">
        <div className="section-label">Quick actions</div>
        <h3 id="quick-actions-heading" className="quick-actions-title display">
          {heading}
        </h3>
        {subheading && <p className="quick-actions-sub">{subheading}</p>}
      </div>

      <div className="quick-actions-grid">
        {/* Telegram */}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="qa-card qa-card--telegram"
          data-source={source}
        >
          <div className="qa-icon" aria-hidden="true">
            <TelegramIcon size={22} />
          </div>
          <div className="qa-body">
            <div className="qa-card-label mono">01 · Community</div>
            <div className="qa-card-title">Join the Telegram</div>
            <div className="qa-card-desc">
              Live chat with residents, organizers, and biotech builders.
            </div>
          </div>
          <div className="qa-card-cta mono" aria-hidden="true">Open →</div>
        </a>

        {/* Mailing list */}
        <div className="qa-card qa-card--mailing">
          <div className="qa-icon" aria-hidden="true">
            <MailIcon size={22} />
          </div>
          <div className="qa-body">
            <div className="qa-card-label mono">02 · Mailing list</div>
            <div className="qa-card-title">Join our mailing list</div>
            {state?.success ? (
              <div className="qa-mailing-success mono">
                ✓ You&rsquo;re on the list.
              </div>
            ) : (
              <form action={formAction} className="qa-mailing-form">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@domain.com"
                  className="qa-mailing-input"
                  aria-label="Email address"
                />
                <input type="hidden" name="track" value="General" />
                <input type="hidden" name="source" value={source} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="qa-mailing-btn"
                >
                  {isPending ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
            {state && !state.success && (
              <div className="qa-mailing-err mono">{state.message}</div>
            )}
          </div>
        </div>

        {/* Login */}
        <Link
          href="/console"
          className="qa-card qa-card--login"
          data-source={source}
        >
          <div className="qa-icon" aria-hidden="true">
            <KeyIcon size={22} />
          </div>
          <div className="qa-body">
            <div className="qa-card-label mono">03 · Platform</div>
            <div className="qa-card-title">Login to the platform</div>
            <div className="qa-card-desc">
              Residents & applicants: access your dashboard and event console.
            </div>
          </div>
          <div className="qa-card-cta mono" aria-hidden="true">Sign in →</div>
        </Link>
      </div>
    </section>
  );
}
