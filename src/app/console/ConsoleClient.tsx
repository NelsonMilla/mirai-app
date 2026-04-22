'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InitialState {
  loggedIn: boolean;
  email: string;
  isAdmin: boolean;
}

interface MiraiEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  link?: string;
}

interface Application {
  id: string;
  name: string;
  email: string;
  profile: string;
  about: string;
  track: string;
  status: string;
  createdAt: string;
  link: string | null;
  telegram: string;
  country: string;
  goals: string[];
}

interface WhitelistEntry {
  id: string;
  name: string;
  email: string;
  code: string;
  used: boolean;
  paymentStatus: string;
}

interface InviteCode {
  id: string;
  code: string;
  maxUses: number | null;
  usesCount: number;
  expiresAt: string | null;
  active: boolean;
  label: string;
  usedBy: string;
  createdAt: string;
}

type AdminTab = 'events' | 'applications' | 'whitelist' | 'invite-codes';

// ---------------------------------------------------------------------------
// Console Client
// ---------------------------------------------------------------------------

export function ConsoleClient({ initial }: { initial: InitialState }) {
  const [loggedIn, setLoggedIn] = useState(initial.loggedIn);
  const [email, setEmail] = useState(initial.email);
  const [admin, setAdmin] = useState(initial.isAdmin);
  const [tab, setTab] = useState<AdminTab>('events');
  const [appCount, setAppCount] = useState(0);
  const [wlCount, setWlCount] = useState(0);
  const [icCount, setIcCount] = useState(0);

  if (!loggedIn) {
    return (
      <ConsoleShell>
        <LoginForm
          onLogin={(e, isAdmin) => {
            setEmail(e);
            setAdmin(isAdmin);
            setLoggedIn(true);
          }}
        />
      </ConsoleShell>
    );
  }

  // Non-admin: simple events view
  if (!admin) {
    return (
      <ConsoleShell>
        <ConsoleHeader email={email} onLogout={() => setLoggedIn(false)} />
        <EventsList />
      </ConsoleShell>
    );
  }

  // Admin: sidebar layout
  return (
    <ConsoleShell>
      <ConsoleHeader email={email} onLogout={() => setLoggedIn(false)} />
      <div className="console-layout">
        <nav className="console-sidebar">
          <button
            className={`console-nav-item ${tab === 'events' ? 'active' : ''}`}
            onClick={() => setTab('events')}
          >
            Events
          </button>
          <button
            className={`console-nav-item ${tab === 'applications' ? 'active' : ''}`}
            onClick={() => setTab('applications')}
          >
            Applications
            {appCount > 0 && <span className="console-nav-count">{appCount}</span>}
          </button>
          <button
            className={`console-nav-item ${tab === 'whitelist' ? 'active' : ''}`}
            onClick={() => setTab('whitelist')}
          >
            Whitelist
            {wlCount > 0 && <span className="console-nav-count">{wlCount}</span>}
          </button>
          <button
            className={`console-nav-item ${tab === 'invite-codes' ? 'active' : ''}`}
            onClick={() => setTab('invite-codes')}
          >
            Invite Codes
            {icCount > 0 && <span className="console-nav-count">{icCount}</span>}
          </button>
        </nav>
        <div className="console-content">
          {tab === 'events' && <EventsList />}
          {tab === 'applications' && <AdminPanel onCountChange={setAppCount} />}
          {tab === 'whitelist' && <WhitelistPanel onCountChange={setWlCount} />}
          {tab === 'invite-codes' && <InviteCodesPanel onCountChange={setIcCount} />}
        </div>
      </div>
    </ConsoleShell>
  );
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

function ConsoleShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;

    // Disable scroll snap and restore normal cursor
    html.style.scrollSnapType = 'none';
    html.style.overflow = 'auto';
    document.body.style.cursor = 'auto';
    window.scrollTo(0, 0);

    // Hide all landing-page chrome (progress bar, cursor, grain, particles, loading screen)
    const selectors =
      '.scroll-progress, .custom-cursor, .grain-overlay, .bg-particles, .loading-screen, #progressFill, #scrollCompanion';
    const hidden: HTMLElement[] = [];
    document.querySelectorAll(selectors).forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.display = 'none';
      hidden.push(htmlEl);
    });

    // Also hide any siblings of <main> that are decorative wrappers
    const main = document.querySelector('main.console-page');
    if (main?.parentElement) {
      Array.from(main.parentElement.children).forEach((sibling) => {
        if (sibling !== main && sibling.tagName !== 'SCRIPT') {
          const s = sibling as HTMLElement;
          if (s.dataset.consoleHidden !== 'true') {
            s.dataset.consoleHidden = 'true';
            s.style.display = 'none';
            hidden.push(s);
          }
        }
      });
    }

    return () => {
      html.style.scrollSnapType = '';
      html.style.overflow = '';
      document.body.style.cursor = '';
      hidden.forEach((el) => {
        el.style.display = '';
        delete el.dataset.consoleHidden;
      });
    };
  }, []);

  return (
    <main className="console-page">
      <div className="console-container">
        <Link href="/" className="invite-back">
          &larr; Back to Mirai
        </Link>
        {children}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function ConsoleHeader({
  email,
  onLogout,
}: {
  email: string;
  onLogout: () => void;
}) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    onLogout();
  }

  return (
    <div className="console-header">
      <div>
        <div className="section-label" style={{ marginBottom: '0.25rem' }}>
          Event Console
        </div>
        <span className="console-email">{email}</span>
      </div>
      <button onClick={handleLogout} className="btn btn-outline console-logout-btn">
        Log out
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login Form (two-step: email → code)
// ---------------------------------------------------------------------------

function LoginForm({
  onLogin,
}: {
  onLogin: (email: string, isAdmin: boolean) => void;
}) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [emailVal, setEmailVal] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!emailVal.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send code');
        return;
      }
      setStep('code');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal.trim(), code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }
      onLogin(emailVal.trim(), data.isAdmin);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="invite-card">
      <div className="section-label" style={{ marginBottom: '0.5rem' }}>
        Event Console
      </div>
      <h1 className="invite-title">Sign in</h1>
      <p className="invite-subtitle">
        {step === 'email'
          ? 'Enter your email to receive a login code.'
          : `We sent a 6-digit code to ${emailVal}`}
      </p>

      {step === 'email' ? (
        <form className="invite-form" onSubmit={sendCode}>
          <input
            type="email"
            className="whitelist-input invite-input"
            placeholder="your@email.com"
            value={emailVal}
            onChange={(e) => {
              setEmailVal(e.target.value);
              setError('');
            }}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
            disabled={!emailVal.trim() || loading}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form className="invite-form" onSubmit={verifyCode}>
          <input
            type="text"
            className="whitelist-input invite-input"
            placeholder="000000"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError('');
            }}
            disabled={loading}
            autoFocus
            inputMode="numeric"
            maxLength={6}
            style={{ letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--font-mono)' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
            disabled={code.length !== 6 || loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            className="console-link-btn"
            onClick={() => {
              setStep('email');
              setCode('');
              setError('');
            }}
          >
            Use a different email
          </button>
        </form>
      )}

      {error && <div className="whitelist-msg whitelist-error">{error}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Events List
// ---------------------------------------------------------------------------

function EventsList() {
  const [events, setEvents] = useState<MiraiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="console-section">
      <h2 className="console-section-title">Upcoming Events</h2>
      {loading ? (
        <p className="console-muted">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="console-muted">No upcoming events yet &mdash; check back soon.</p>
      ) : (
        <div className="console-events-grid">
          {events.map((ev) => (
            <div key={ev.id} className="console-event-card">
              <div className="console-event-date">
                {formatDate(ev.date)} &middot; {ev.time}
              </div>
              <h3 className="console-event-title">{ev.title}</h3>
              <p className="console-event-desc">{ev.description}</p>
              <div className="console-event-location">
                {ev.link ? (
                  <a href={ev.link} target="_blank" rel="noopener noreferrer">
                    {ev.location} &rarr;
                  </a>
                ) : (
                  ev.location
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Admin Panel
// ---------------------------------------------------------------------------

function AdminPanel({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchApplications = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/applications')
      .then((r) => r.json())
      .then((d) => {
        const apps = d.applications ?? [];
        setApplications(apps);
        onCountChange?.(apps.filter((a: Application) => a.status === 'New').length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [onCountChange]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filtered =
    filter === 'all'
      ? applications
      : applications.filter((a) => a.status === filter);

  const counts = {
    all: applications.length,
    New: applications.filter((a) => a.status === 'New').length,
    Approved: applications.filter((a) => a.status === 'Approved').length,
    Paid: applications.filter((a) => a.status === 'Paid').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <section className="console-section">
      <h2 className="console-section-title">Applications</h2>

      <div className="console-filters">
        {(['all', 'New', 'Approved', 'Paid', 'Rejected'] as const).map((f) => (
          <button
            key={f}
            className={`console-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f}{' '}
            <span className="console-filter-count">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="console-muted">Loading applications...</p>
      ) : filtered.length === 0 ? (
        <p className="console-muted">No applications match this filter.</p>
      ) : (
        <div className="console-apps-list">
          {filtered.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onUpdate={fetchApplications}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ApplicationRow({
  app,
  onUpdate,
}: {
  app: Application;
  onUpdate: () => void;
}) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  async function handleAction(action: 'approve' | 'reject') {
    setActionLoading(action);
    setFeedback('');

    try {
      const url = `/api/admin/${action}`;
      const body =
        action === 'approve'
          ? { applicationId: app.id, email: app.email, name: app.name }
          : { applicationId: app.id };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback(data.error || 'Action failed');
        return;
      }

      if (action === 'approve' && data.emailSent === false) {
        setFeedback('Approved but email failed to send');
      }

      onUpdate();
    } catch {
      setFeedback('Connection error');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="console-app-row">
      <div className="console-app-main">
        <div className="console-app-name-row">
          <span className="console-app-name">{app.name}</span>
          <StatusBadge status={app.status} />
        </div>
        <div className="console-app-meta">
          {app.email} &middot; {app.profile} &middot; {app.country}
          {app.telegram && <> &middot; {app.telegram}</>}
        </div>
        <p className="console-app-about">{app.about}</p>
        {app.goals.length > 0 && (
          <div className="console-app-goals">
            {app.goals.map((g) => (
              <span key={g} className="console-goal-tag">
                {g}
              </span>
            ))}
          </div>
        )}
        {app.link && (
          <a
            href={app.link}
            className="console-app-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio &rarr;
          </a>
        )}
      </div>

      {app.status === 'New' && (
        <div className="console-app-actions">
          <button
            className="btn btn-primary console-action-btn"
            onClick={() => handleAction('approve')}
            disabled={actionLoading !== null}
          >
            {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
          </button>
          <button
            className="btn btn-outline console-action-btn"
            onClick={() => handleAction('reject')}
            disabled={actionLoading !== null}
          >
            {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      )}

      {app.status === 'Approved' && (
        <div className="console-app-status-note">
          Payment link sent {timeAgo(app.createdAt)}
        </div>
      )}

      {feedback && <div className="console-app-feedback">{feedback}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    New: '#8585A8',
    Approved: '#F5D34E',
    Paid: '#4ADE80',
    Rejected: '#F56B6B',
  };
  return (
    <span
      className="console-status-badge"
      style={{ color: colors[status] ?? '#8585A8', borderColor: colors[status] ?? '#8585A8' }}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Whitelist Panel
// ---------------------------------------------------------------------------

function WhitelistPanel({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [code, setCode] = useState('');
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const fetchEntries = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/whitelist')
      .then((r) => r.json())
      .then((d) => {
        const list = d.entries ?? [];
        setEntries(list);
        onCountChange?.(list.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [onCountChange]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !emailVal.trim()) return;
    setAdding(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: emailVal.trim(),
          code: code.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({ ok: false, msg: data.error || 'Failed to add' });
        return;
      }

      setFeedback({ ok: true, msg: `Added ${name.trim()} to whitelist` });
      setName('');
      setEmailVal('');
      setCode('');
      fetchEntries();
    } catch {
      setFeedback({ ok: false, msg: 'Connection error' });
    } finally {
      setAdding(false);
    }
  }

  return (
    <section className="console-section">
      <h2 className="console-section-title">Whitelist</h2>

      <form className="wl-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          className="whitelist-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={adding}
        />
        <input
          type="email"
          className="whitelist-input"
          placeholder="Email"
          value={emailVal}
          onChange={(e) => setEmailVal(e.target.value)}
          disabled={adding}
        />
        <input
          type="text"
          className="whitelist-input"
          placeholder="Code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={adding}
          style={{ maxWidth: '140px' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!name.trim() || !emailVal.trim() || adding}
          style={{ padding: '0.65rem 1.25rem' }}
        >
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {feedback && (
        <div className={`wl-feedback ${feedback.ok ? 'wl-feedback-ok' : 'wl-feedback-err'}`}>
          {feedback.msg}
        </div>
      )}

      {loading ? (
        <p className="console-muted">Loading whitelist...</p>
      ) : entries.length === 0 ? (
        <p className="wl-empty">No whitelist entries yet.</p>
      ) : (
        <table className="wl-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Code</th>
              <th>Used</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.name}</td>
                <td>{entry.email}</td>
                <td><span className="wl-code">{entry.code || '—'}</span></td>
                <td>
                  <span className={`wl-used ${entry.used ? 'wl-used-yes' : 'wl-used-no'}`}>
                    {entry.used ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span className="wl-payment">
                    {entry.paymentStatus || '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Invite Codes Panel
// ---------------------------------------------------------------------------

function InviteCodesPanel({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const fetchCodes = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/invite-codes')
      .then((r) => r.json())
      .then((d) => {
        const list = d.codes ?? [];
        setCodes(list);
        onCountChange?.(list.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [onCountChange]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setAdding(true);
    setFeedback(null);

    try {
      const body: Record<string, unknown> = {
        code: code.trim(),
        label: label.trim() || undefined,
        active: true,
      };
      if (maxUses.trim()) body.maxUses = Number(maxUses);
      if (expiresAt.trim()) body.expiresAt = expiresAt;

      const res = await fetch('/api/admin/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({ ok: false, msg: data.error || 'Failed to add' });
        return;
      }

      setFeedback({ ok: true, msg: `Created code ${code.trim()}` });
      setCode('');
      setLabel('');
      setMaxUses('');
      setExpiresAt('');
      fetchCodes();
    } catch {
      setFeedback({ ok: false, msg: 'Connection error' });
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(entry: InviteCode) {
    try {
      const res = await fetch(`/api/admin/invite-codes/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !entry.active }),
      });
      if (!res.ok) return;
      fetchCodes();
    } catch {}
  }

  async function handleDelete(entry: InviteCode) {
    if (!confirm(`Delete code "${entry.code}"? Past redemptions stay in Applications.`)) return;
    try {
      const res = await fetch(`/api/admin/invite-codes/${entry.id}`, { method: 'DELETE' });
      if (!res.ok) return;
      fetchCodes();
    } catch {}
  }

  return (
    <section className="console-section">
      <h2 className="console-section-title">Invite Codes</h2>
      <p className="console-muted" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
        Shareable codes that skip the application. Expiration and max uses are optional.
      </p>

      <form className="wl-add-form" onSubmit={handleAdd} style={{ flexWrap: 'wrap' }}>
        <input
          type="text"
          className="whitelist-input"
          placeholder="Code (e.g. EARLY2026)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={adding}
        />
        <input
          type="text"
          className="whitelist-input"
          placeholder="Label (internal note)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={adding}
        />
        <input
          type="number"
          className="whitelist-input"
          placeholder="Max uses"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          disabled={adding}
          min="1"
          style={{ maxWidth: '120px' }}
        />
        <input
          type="date"
          className="whitelist-input"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          disabled={adding}
          style={{ maxWidth: '170px' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!code.trim() || adding}
          style={{ padding: '0.65rem 1.25rem' }}
        >
          {adding ? 'Creating...' : 'Create'}
        </button>
      </form>

      {feedback && (
        <div className={`wl-feedback ${feedback.ok ? 'wl-feedback-ok' : 'wl-feedback-err'}`}>
          {feedback.msg}
        </div>
      )}

      {loading ? (
        <p className="console-muted">Loading invite codes...</p>
      ) : codes.length === 0 ? (
        <p className="wl-empty">No invite codes yet.</p>
      ) : (
        <table className="wl-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Label</th>
              <th>Uses</th>
              <th>Expires</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((entry) => {
              const isExpanded = expanded[entry.id];
              const usesStr = entry.maxUses !== null ? `${entry.usesCount} / ${entry.maxUses}` : `${entry.usesCount}`;
              return (
                <Fragment key={entry.id}>
                  <tr>
                    <td><span className="wl-code">{entry.code}</span></td>
                    <td>{entry.label || '—'}</td>
                    <td>{usesStr}</td>
                    <td>{entry.expiresAt || '—'}</td>
                    <td>
                      <span className={`wl-used ${entry.active ? 'wl-used-no' : 'wl-used-yes'}`}>
                        {entry.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {entry.usesCount > 0 && (
                        <button
                          className="btn"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', marginRight: '0.4rem', border: '1px solid var(--charcoal)' }}
                          onClick={() => setExpanded((prev) => ({ ...prev, [entry.id]: !prev[entry.id] }))}
                        >
                          {isExpanded ? 'Hide' : 'Redeemers'}
                        </button>
                      )}
                      <button
                        className="btn"
                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', marginRight: '0.4rem', border: '1px solid var(--charcoal)' }}
                        onClick={() => toggleActive(entry)}
                      >
                        {entry.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        className="btn"
                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid var(--charcoal)', color: '#F56B6B' }}
                        onClick={() => handleDelete(entry)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {isExpanded && entry.usedBy && (
                    <tr>
                      <td colSpan={6} style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.85rem' }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--slate)' }}>
                          {entry.usedBy}
                        </pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
