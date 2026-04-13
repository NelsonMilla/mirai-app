'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'success' | 'not-found' | 'used' | 'error';

export default function InvitePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const isEmail = trimmed.includes('@');
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

      if (data.whitelisted) {
        setName(data.name || '');
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

          <form className="invite-form" onSubmit={handleSubmit}>
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
              {name ? `Welcome, ${name}!` : 'You\u2019re on the list!'} Redirecting...
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
