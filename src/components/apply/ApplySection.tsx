'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTrack } from '@/components/tracks/TrackContext';
import { RevealSection } from '@/components/ui/RevealSection';
import { tracks, LUMA_EVENT_URL } from '@/lib/constants';

const headlines: Record<string, { em: string; sub: string }> = {
  devices:   { em: 'wearable.',      sub: 'From prototype onto the PMDA device pathway — in one month.' },
  therapies: { em: 'regenerative.',  sub: 'From Phase 1b onto Japan’s accelerated pathways.' },
  builder:   { em: 'yours.',         sub: 'Full access. Zero barriers. One unforgettable month.' },
};

const defaultHeadline = { em: 'built here.', sub: 'Pick your track. Apply. Join us on Port Island.' };

type WhitelistStatus = 'idle' | 'loading' | 'success' | 'not-found' | 'used' | 'error';

export function ApplySection() {
  const { selectedTrack, selectTrack } = useTrack();
  const router = useRouter();

  const [whitelistInput, setWhitelistInput] = useState('');
  const [whitelistStatus, setWhitelistStatus] = useState<WhitelistStatus>('idle');
  const [whitelistName, setWhitelistName] = useState('');
  const [whitelistError, setWhitelistError] = useState('');

  const { em, sub } = selectedTrack ? (headlines[selectedTrack] ?? defaultHeadline) : defaultHeadline;

  async function handleWhitelistCheck(e: React.FormEvent) {
    e.preventDefault();
    const input = whitelistInput.trim();
    if (!input) return;

    setWhitelistStatus('loading');
    setWhitelistError('');

    try {
      const isEmail = input.includes('@');
      const res = await fetch('/api/whitelist/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEmail ? { email: input } : { code: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setWhitelistStatus('error');
        setWhitelistError(data.error || 'Something went wrong.');
        return;
      }

      if (data.whitelisted) {
        setWhitelistName(data.name || '');
        setWhitelistStatus('success');
        // Brief success state, then redirect
        setTimeout(() => router.push(data.redirectUrl), 1500);
      } else if (data.reason?.includes('already been used')) {
        setWhitelistStatus('used');
      } else {
        setWhitelistStatus('not-found');
      }
    } catch {
      setWhitelistStatus('error');
      setWhitelistError('Connection error. Please try again.');
    }
  }

  return (
    <RevealSection id="apply" dataSection="apply" variant="reveal-track" threshold={0.05}>
      <div className="apply-block">
        <div className="section-label">October 2026 · 300 curated residents</div>

        <h2 className="apply-h2">The future is <em>{em}</em></h2>
        <p>{sub}</p>

        {/* Mini track selector */}
        <div className="apply-track-selector">
          {tracks.map((track) => {
            const isActive = selectedTrack === track.id;
            return (
              <button
                key={track.id}
                className={`apply-track-pill ${isActive ? 'active' : ''}`}
                style={{
                  '--pill-color': track.color,
                  '--pill-rgb': track.colorRgb,
                } as React.CSSProperties}
                onClick={() => selectTrack(track.id)}
              >
                <span className="pill-dot" />
                {track.name}
              </button>
            );
          })}
        </div>

        <div className="apply-btns">
          <a className="btn btn-primary" style={{ fontSize: 'var(--fs-secondary)', padding: '1rem 2rem' }} href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">Apply Now</a>
        </div>
        <div className="apply-micro">5-min application · No commitment</div>

        {/* Quiet secondary paths — subordinate to the primary Apply CTA */}
        <div className="apply-paths mono" style={{ marginTop: '1rem', fontSize: 'var(--fs-label)', color: 'var(--slate)', letterSpacing: '0.04em' }}>
          <a href="#tracks" style={{ color: 'inherit', textDecoration: 'none' }}>Residency</a>
          <span aria-hidden="true" style={{ opacity: 0.4, margin: '0 0.5rem' }}>·</span>
          <a href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Builder</a>
          <span aria-hidden="true" style={{ opacity: 0.4, margin: '0 0.5rem' }}>·</span>
          <a href="mailto:team@miraitech.city?subject=Mirai%20Partnership" style={{ color: 'inherit', textDecoration: 'none' }}>Partner</a>
        </div>
        <div className="apply-paths-secondary" style={{ marginTop: '0.5rem', fontSize: 'var(--fs-label)' }}>
          <a href="/showcase" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Showcasing a company? →</a>
          <span aria-hidden="true" style={{ opacity: 0.4, margin: '0 0.5rem', color: 'var(--slate)' }}>·</span>
          {/* TODO: replace mailto with public sponsorship deck URL when available */}
          <a href="mailto:team@miraitech.city?subject=Mirai%20Sponsorship%20Deck%20Request" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Get the sponsorship deck →</a>
        </div>

        {/* Whitelist bypass */}
        <div className="whitelist-section">
          <div className="whitelist-divider">
            <span>Already invited?</span>
          </div>

          <form className="whitelist-form" onSubmit={handleWhitelistCheck}>
            <input
              type="text"
              className="whitelist-input"
              placeholder="Enter your email or invite code"
              value={whitelistInput}
              onChange={(e) => {
                setWhitelistInput(e.target.value);
                if (whitelistStatus !== 'idle' && whitelistStatus !== 'loading') {
                  setWhitelistStatus('idle');
                }
              }}
              disabled={whitelistStatus === 'loading' || whitelistStatus === 'success'}
            />
            <button
              type="submit"
              className="btn btn-primary whitelist-btn"
              disabled={!whitelistInput.trim() || whitelistStatus === 'loading' || whitelistStatus === 'success'}
            >
              {whitelistStatus === 'loading' ? 'Checking...' : 'Check'}
            </button>
          </form>

          {whitelistStatus === 'success' && (
            <div className="whitelist-msg whitelist-success">
              {whitelistName ? `Welcome back, ${whitelistName}!` : 'You\u2019re on the list!'} Redirecting to checkout...
            </div>
          )}

          {whitelistStatus === 'not-found' && (
            <div className="whitelist-msg whitelist-notfound">
              Not found \u2014 <a href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">apply here</a> instead.
            </div>
          )}

          {whitelistStatus === 'used' && (
            <div className="whitelist-msg whitelist-notfound">
              This invite code has already been used.
            </div>
          )}

          {whitelistStatus === 'error' && (
            <div className="whitelist-msg whitelist-error">
              {whitelistError}
            </div>
          )}
        </div>
      </div>
    </RevealSection>
  );
}
