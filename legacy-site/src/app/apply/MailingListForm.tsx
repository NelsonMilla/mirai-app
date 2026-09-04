'use client';

import { useActionState } from 'react';
import { joinMailingList } from './actions';

const TRACKS = [
  { id: 'devices', label: 'Devices', color: '#6DB5F5' },
  { id: 'therapies', label: 'Therapies', color: '#F5D34E' },
  { id: 'builder', label: 'Builder', color: '#F56B6B' },
];

export function MailingListForm() {
  const [state, formAction, isPending] = useActionState(joinMailingList, null);

  if (state?.success) {
    return (
      <div className="mailing-list-success">
        <p className="mono" style={{ color: 'var(--accent)', fontSize: '12px' }}>
          You&apos;re on the list. We&apos;ll reach out when applications open.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mailing-list-form">
      <div className="mailing-list-row">
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="form-input mailing-input"
        />
        <select name="track" className="form-input form-select mailing-select" defaultValue="General">
          <option value="General">All tracks</option>
          {TRACKS.map((t) => (
            <option key={t.id} value={t.label}>{t.label}</option>
          ))}
        </select>
        <button type="submit" disabled={isPending} className="btn btn-outline mailing-btn">
          {isPending ? '...' : 'Notify me'}
        </button>
      </div>
      {state && !state.success && (
        <p className="form-error-inline">{state.message}</p>
      )}
    </form>
  );
}
