'use client';

import { useActionState } from 'react';
import { submitShowcase } from './actions';

const STAGES = ['Idea', 'Prototype', 'Clinical', 'Revenue', 'Funded'];

const GO_TO_MARKET = [
  { value: 'Yes', label: 'Yes' },
  { value: 'Exploring', label: 'Exploring' },
  { value: 'Not yet', label: 'Not yet' },
];

const TICKET_STATUS = [
  { value: 'I have a ticket', label: 'I have a ticket' },
  { value: 'Buying soon', label: 'Buying soon' },
];

export function ShowcaseForm() {
  const [state, formAction, isPending] = useActionState(submitShowcase, null);

  if (state?.success) {
    return (
      <div className="apply-form-success">
        <div className="success-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="rgba(245,107,107,0.12)" />
            <circle cx="28" cy="28" r="20" fill="rgba(245,107,107,0.08)" />
            <path d="M18 28l7 7 13-13" stroke="#F56B6B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="display success-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '0.75rem' }}>
          Showcase application received
        </h3>
        <p className="success-sub" style={{ color: 'var(--slate)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
          We review showcase applications on a rolling basis and curate a limited number of slots for
          Demo Day and the Frontier Human Fashion Show. If it&apos;s a fit, we&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="apply-form">
      <fieldset className="form-fieldset">
        <legend className="form-legend mono">Your company</legend>

        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="company" className="form-label">Company name <span className="req">*</span></label>
            <input type="text" id="company" name="company" placeholder="Acme Bio" className="form-input" />
          </div>
          <div className="form-field">
            <label htmlFor="contactName" className="form-label">Contact name <span className="req">*</span></label>
            <input type="text" id="contactName" name="contactName" placeholder="Satoshi Nakamoto" className="form-input" />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="email" className="form-label">Email <span className="req">*</span></label>
            <input type="email" id="email" name="email" placeholder="you@company.com" className="form-input" />
          </div>
          <div className="form-field">
            <label htmlFor="role" className="form-label">Role at company <span className="req">*</span></label>
            <input type="text" id="role" name="role" placeholder="Founder / Head of Product" className="form-input" />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend className="form-legend mono">What you&apos;d showcase</legend>

        <div className="form-field">
          <label htmlFor="showcase" className="form-label">What would you showcase? <span className="req">*</span></label>
          <textarea
            id="showcase"
            name="showcase"
            rows={3}
            placeholder="The device, therapy, or demo you'd present at Demo Day or on the runway..."
            className="form-input form-textarea"
          />
          <span className="form-hint">A device, a therapy, a live demo — tell us what walks or runs.</span>
        </div>

        <div className="form-field">
          <label className="form-label">Company stage <span className="req">*</span></label>
          <div className="form-radio-group form-radio-row">
            {STAGES.map((s) => (
              <label key={s} className="form-radio-label">
                <input type="radio" name="stage" value={s} className="form-radio" />
                <span className="form-radio-custom" />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="regulatory" className="form-label">Regulatory status</label>
            <input type="text" id="regulatory" name="regulatory" placeholder="e.g. Phase 1b complete" className="form-input" />
          </div>
          <div className="form-field">
            <label htmlFor="link" className="form-label">Link (website or deck)</label>
            <input type="url" id="link" name="link" placeholder="https://" className="form-input" />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend className="form-legend mono">Go-to-market</legend>

        <div className="form-field">
          <label className="form-label">Interested in going to market in Japan? <span className="req">*</span></label>
          <div className="form-radio-group form-radio-row">
            {GO_TO_MARKET.map((o) => (
              <label key={o.value} className="form-radio-label">
                <input type="radio" name="goToMarketJapan" value={o.value} className="form-radio" />
                <span className="form-radio-custom" />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Ticket status <span className="req">*</span></label>
          <div className="form-radio-group form-radio-row">
            {TICKET_STATUS.map((o) => (
              <label key={o.value} className="form-radio-label">
                <input type="radio" name="ticketStatus" value={o.value} className="form-radio" />
                <span className="form-radio-custom" />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          <span className="form-hint">Showcase slots are for teams attending Mirai — a ticket is required.</span>
        </div>
      </fieldset>

      {state && !state.success && (
        <div className="form-error">{state.message}</div>
      )}

      <button type="submit" disabled={isPending} className="btn btn-primary step-submit-btn">
        {isPending ? (
          <>
            <span className="spinner" />
            Submitting...
          </>
        ) : (
          'Submit showcase application'
        )}
      </button>
    </form>
  );
}
