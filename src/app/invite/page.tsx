'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'enter-code' | 'mini-form' | 'needs-email';
type Status = 'idle' | 'loading' | 'success' | 'not-found' | 'used' | 'expired' | 'exhausted' | 'inactive' | 'error';

const PROFILES = ['Entrepreneur', 'Academic', 'Artist', 'Investor', 'Operator', 'Student', 'Other'];

export default function InvitePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('enter-code');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [codeLabel, setCodeLabel] = useState('');
  const [welcomeName, setWelcomeName] = useState('');

  // Mini-form fields (shown only after multi-use code validates)
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelegram, setFormTelegram] = useState('');
  const [formProfile, setFormProfile] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Needs-email step (for whitelist codes added without an email)
  const [needsEmailValue, setNeedsEmailValue] = useState('');

  async function handleSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    const isEmail = trimmed.includes('@');

    try {
      // If it looks like a code (not an email), try multi-use invite codes first
      if (!isEmail) {
        const inviteRes = await fetch('/api/invite/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: trimmed }),
        });

        const inviteData = await inviteRes.json();

        if (inviteRes.ok && inviteData.valid) {
          setCodeLabel(inviteData.label ?? '');
          setStep('mini-form');
          setStatus('idle');
          return;
        }

        // Code recognised but invalid in some way — surface matching error
        if (inviteRes.ok && inviteData.reason === 'expired') {
          setStatus('expired');
          return;
        }
        if (inviteRes.ok && inviteData.reason === 'exhausted') {
          setStatus('exhausted');
          return;
        }
        if (inviteRes.ok && inviteData.reason === 'inactive') {
          setStatus('inactive');
          return;
        }
        // reason === 'not-found' → fall through to whitelist check
      }

      // Fall back to existing single-use whitelist (email lookup or legacy codes)
      const res = await fetch('/api/whitelist/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEmail ? { email: trimmed } : { code: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
        return;
      }

      if (data.whitelisted && data.needsEmail) {
        setWelcomeName(data.name || '');
        setStep('needs-email');
        setStatus('idle');
        return;
      }

      if (data.whitelisted) {
        setWelcomeName(data.name || '');
        setStatus('success');
        setTimeout(() => router.push(data.redirectUrl), 1500);
      } else if (data.reason?.includes('already been used')) {
        setStatus('used');
      } else {
        setStatus('not-found');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Connection error. Please try again.');
    }
  }

  async function handleSubmitMiniForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formTelegram.trim() || !formProfile) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/invite/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: input.trim(),
          name: formName.trim(),
          email: formEmail.trim(),
          telegram: formTelegram.trim(),
          profile: formProfile,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.paymentUrl;
    } catch {
      setErrorMsg('Connection error. Please try again.');
      setSubmitting(false);
    }
  }

  async function handleSubmitEmailOnly(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = needsEmailValue.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/whitelist/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: input.trim(), email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push(data.redirectUrl);
    } catch {
      setErrorMsg('Connection error. Please try again.');
      setSubmitting(false);
    }
  }

  // ---- Needs-email step (whitelist code had no email on file) ----
  if (step === 'needs-email') {
    return (
      <main className="invite-page">
        <div className="invite-container">
          <Link href="/" className="invite-back">&larr; Back to Mirai</Link>

          <div className="invite-card">
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>Invite Accepted</div>
            <h1 className="invite-title">
              {welcomeName ? `Welcome, ${welcomeName}.` : 'Welcome.'}
            </h1>
            <p className="invite-subtitle">
              We just need your email to send your ticket and receipt.
            </p>

            <form className="invite-form" onSubmit={handleSubmitEmailOnly} style={{ gap: '0.75rem' }}>
              <input
                type="email"
                className="whitelist-input invite-input"
                placeholder="your@email.com"
                value={needsEmailValue}
                onChange={(e) => setNeedsEmailValue(e.target.value)}
                disabled={submitting}
                autoFocus
                required
              />

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
                disabled={!needsEmailValue.trim() || submitting}
              >
                {submitting ? 'Continuing...' : 'Continue to checkout \u2192'}
              </button>

              <button
                type="button"
                className="btn"
                style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', border: '1px solid var(--charcoal)' }}
                onClick={() => {
                  setStep('enter-code');
                  setStatus('idle');
                  setErrorMsg('');
                  setNeedsEmailValue('');
                }}
                disabled={submitting}
              >
                Use a different code
              </button>
            </form>

            {errorMsg && (
              <div className="whitelist-msg whitelist-error">{errorMsg}</div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ---- Mini-form step ----
  if (step === 'mini-form') {
    return (
      <main className="invite-page">
        <div className="invite-container">
          <Link href="/" className="invite-back">&larr; Back to Mirai</Link>

          <div className="invite-card">
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>Invite Accepted</div>
            <h1 className="invite-title">Just a few details.</h1>
            <p className="invite-subtitle">
              {codeLabel
                ? `Welcome (${codeLabel}). `
                : 'Welcome. '}
              Fill these in and you&rsquo;ll go straight to checkout.
            </p>

            <form className="invite-form" onSubmit={handleSubmitMiniForm} style={{ gap: '0.75rem' }}>
              <input
                type="text"
                className="whitelist-input invite-input"
                placeholder="Full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                disabled={submitting}
                autoFocus
                required
              />
              <input
                type="email"
                className="whitelist-input invite-input"
                placeholder="Email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                disabled={submitting}
                required
              />
              <input
                type="text"
                className="whitelist-input invite-input"
                placeholder="Telegram handle (e.g. @yourname)"
                value={formTelegram}
                onChange={(e) => setFormTelegram(e.target.value)}
                disabled={submitting}
                required
              />
              <select
                className="whitelist-input invite-input"
                value={formProfile}
                onChange={(e) => setFormProfile(e.target.value)}
                disabled={submitting}
                required
              >
                <option value="">Profile / role...</option>
                {PROFILES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
                disabled={
                  !formName.trim() ||
                  !formEmail.trim() ||
                  !formTelegram.trim() ||
                  !formProfile ||
                  submitting
                }
              >
                {submitting ? 'Continuing...' : 'Continue to checkout \u2192'}
              </button>

              <button
                type="button"
                className="btn"
                style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', border: '1px solid var(--charcoal)' }}
                onClick={() => {
                  setStep('enter-code');
                  setStatus('idle');
                  setErrorMsg('');
                }}
                disabled={submitting}
              >
                Use a different code
              </button>
            </form>

            {errorMsg && (
              <div className="whitelist-msg whitelist-error">{errorMsg}</div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ---- Enter-code step ----
  return (
    <main className="invite-page">
      <div className="invite-container">
        <Link href="/" className="invite-back">&larr; Back to Mirai</Link>

        <div className="invite-card">
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>VIP Access</div>
          <h1 className="invite-title">You&rsquo;ve been invited.</h1>
          <p className="invite-subtitle">
            Enter your email address or invite code to skip the application and go straight to checkout.
          </p>

          <form className="invite-form" onSubmit={handleSubmitCode}>
            <input
              type="text"
              className="whitelist-input invite-input"
              placeholder="Email or invite code"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (status !== 'idle' && status !== 'loading') setStatus('idle');
              }}
              disabled={status === 'loading' || status === 'success'}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              disabled={!input.trim() || status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? 'Checking...' : 'Continue'}
            </button>
          </form>

          {status === 'success' && (
            <div className="whitelist-msg whitelist-success">
              {welcomeName ? `Welcome, ${welcomeName}!` : 'You\u2019re on the list!'} Redirecting...
            </div>
          )}

          {status === 'not-found' && (
            <div className="whitelist-msg whitelist-notfound">
              Not on the whitelist. <Link href="/apply">Apply here</Link> instead.
            </div>
          )}

          {status === 'used' && (
            <div className="whitelist-msg whitelist-notfound">
              This invite code has already been used.
            </div>
          )}

          {status === 'expired' && (
            <div className="whitelist-msg whitelist-notfound">
              This invite code has expired.
            </div>
          )}

          {status === 'exhausted' && (
            <div className="whitelist-msg whitelist-notfound">
              This invite code has reached its usage limit.
            </div>
          )}

          {status === 'inactive' && (
            <div className="whitelist-msg whitelist-notfound">
              This invite code is no longer active.
            </div>
          )}

          {status === 'error' && (
            <div className="whitelist-msg whitelist-error">{errorMsg}</div>
          )}
        </div>

        <p className="invite-footer">
          Don&rsquo;t have an invite? <Link href="/apply">Apply for Mirai</Link>
        </p>
      </div>
    </main>
  );
}
