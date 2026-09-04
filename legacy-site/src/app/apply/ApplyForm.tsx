'use client';

import { useActionState, useState, useCallback, useMemo } from 'react';
import { submitApplication } from './actions';
import posthog from 'posthog-js';

/* ── PROFILE ICONS (20×20, stroke currentColor) ── */

function IconRocket() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      <path d="M5.5 14.5l-2 2M6 11l-3.5 1.5L5 15l1.5-3.5" />
      <path d="M14 6C14 6 16.5 3 17 3c0 .5-3 3-3 3Z" />
      <path d="M9 11s-2.5 0-4 1.5C6.5 10 9 11 9 11Zm0 0s0 2.5-1.5 4C10 13.5 9 11 9 11Zm0 0l2-2" />
      <path d="M11 9c1.5-1.5 4-4 6-4.5-.5 2-3 4.5-4.5 6" />
    </svg>
  );
}

function IconFlask() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2h6M8 2v5.5L4 16a1 1 0 0 0 .86 1.5h10.28A1 1 0 0 0 16 16l-4-8.5V2" />
      <path d="M5.5 13h9" />
    </svg>
  );
}

function IconBrush() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3c-1 0-6 4.5-8 7-.5.7-.8 1.5-.5 2.2.3.7-.2 1.3-.8 1.6-.9.5-2.2.7-2.7.2s-.3-1.8.2-2.7c.3-.6.9-1.1 1.6-.8.7.3 1.5 0 2.2-.5C11.5 8 16 3 16 2c0-.5-.5 0 0 0" />
      <path d="M5 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  );
}

function IconTrending() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 15l4-4 3 2 7-8" />
      <path d="M13 5h4v4" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2.5v2M10 15.5v2M3.5 6l1.7 1M14.8 13l1.7 1M2.5 10h2M15.5 10h2M3.5 14l1.7-1M14.8 7l1.7-1" />
    </svg>
  );
}

function IconCap() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9l8-4 8 4-8 4-8-4Z" />
      <path d="M15 11v4c0 1-2.2 2-5 2s-5-1-5-2v-4" />
      <path d="M18 9v5" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l1.5 5L17 8.5l-5 2L10 16l-2-5.5-5-2L8.5 7 10 2Z" />
    </svg>
  );
}

const PROFILE_ICONS: Record<string, () => React.ReactElement> = {
  entrepreneur: IconRocket,
  academic: IconFlask,
  artist: IconBrush,
  investor: IconTrending,
  operator: IconGear,
  student: IconCap,
  other: IconSparkle,
};

/* ── DATA ── */

const PROFILES = [
  { id: 'entrepreneur', label: 'Entrepreneur / Founder' },
  { id: 'academic', label: 'Academic / Researcher' },
  { id: 'artist', label: 'Artist / Creative' },
  { id: 'investor', label: 'Investor' },
  { id: 'operator', label: 'Operator / Professional' },
  { id: 'student', label: 'Student' },
  { id: 'other', label: 'Other' },
] as const;

type ProfileId = typeof PROFILES[number]['id'];

const PROFILE_CONFIG: Record<ProfileId, {
  question: string;
  placeholder: string;
  hint: string;
  showStage: boolean;
}> = {
  entrepreneur: {
    question: 'What are you building?',
    placeholder: '2-3 sentences about your startup or project...',
    hint: 'Stage, traction, what you\'re working on right now.',
    showStage: true,
  },
  academic: {
    question: 'What are you researching?',
    placeholder: 'Your research area, lab, and what excites you about biotech in Kobe...',
    hint: 'Include your institution if you\'d like.',
    showStage: false,
  },
  artist: {
    question: 'What do you create?',
    placeholder: 'Your medium, recent work, and what draws you to the intersection of art and biotech...',
    hint: 'Portfolio links welcome in the field above.',
    showStage: false,
  },
  investor: {
    question: 'What\'s your focus?',
    placeholder: 'Your thesis, fund or angel, and what you\'re looking for in Kobe...',
    hint: 'Stage, sector, check size — whatever helps us understand your lens.',
    showStage: false,
  },
  operator: {
    question: 'What do you do?',
    placeholder: 'Your role, company, and what you\'re hoping to get out of the month...',
    hint: 'We love ops people. Tell us what you\'re great at.',
    showStage: false,
  },
  student: {
    question: 'What are you studying?',
    placeholder: 'Your program, interests, and why Mirai caught your eye...',
    hint: 'Include your university if you\'d like.',
    showStage: false,
  },
  other: {
    question: 'Tell us about yourself',
    placeholder: 'What you do, what you\'re into, and why you want to spend a month in Kobe...',
    hint: 'There\'s no wrong answer here.',
    showStage: false,
  },
};

const STAGES = ['Idea', 'Prototype', 'Revenue', 'Funded'];

/* ── GOAL ICONS (14×14, stroke currentColor) ── */

function GoalIconPeople() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="4" r="2" />
      <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      <circle cx="10" cy="4.5" r="1.5" />
      <path d="M10.5 8c1.4.4 2.5 1.7 2.5 3.2" />
    </svg>
  );
}

function GoalIconBuild() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 2.5l3 3M2 12l7-7M10 4l1.5-1.5a1 1 0 0 0-1.5-1.5L8.5 2.5" />
      <path d="M5 9l-3 3" />
    </svg>
  );
}

function GoalIconLearn() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 5l6-3 6 3-6 3-6-3Z" />
      <path d="M10 7v3c0 .7-1.6 1.5-3 1.5S4 10.7 4 10V7" />
      <path d="M13 5v3.5" />
    </svg>
  );
}

function GoalIconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="4" />
      <path d="M12.5 12.5l-3-3" />
    </svg>
  );
}

function GoalIconExplore() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5" />
      <path d="M5 5l5 1.5L8.5 12 5 5Z" />
    </svg>
  );
}

function GoalIconInvestors() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13l1-4 3 2 4-9" />
      <path d="M8 2h3v3" />
    </svg>
  );
}

function GoalIconVibe() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1l1 3.5L12 5.5l-3.5 1.5L7 11l-1.5-4L2 5.5l3.5-1L7 1Z" />
    </svg>
  );
}

const GOAL_ICONS: Record<string, () => React.ReactElement> = {
  'Meet interesting people': GoalIconPeople,
  'Build something': GoalIconBuild,
  'Learn from experts': GoalIconLearn,
  'Find collaborators': GoalIconSearch,
  'Explore Kobe & Japan': GoalIconExplore,
  'Connect with investors': GoalIconInvestors,
  'Just vibe': GoalIconVibe,
};

const GOALS = [
  'Meet interesting people',
  'Build something',
  'Learn from experts',
  'Find collaborators',
  'Explore Kobe & Japan',
  'Connect with investors',
  'Just vibe',
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Japan', 'Germany', 'France', 'Canada',
  'Australia', 'Singapore', 'South Korea', 'India', 'China', 'Brazil',
  'Netherlands', 'Switzerland', 'Sweden', 'Israel', 'Spain', 'Italy',
  'Portugal', 'Denmark', 'Norway', 'Finland', 'Belgium', 'Austria',
  'Ireland', 'New Zealand', 'Taiwan', 'Hong Kong', 'Thailand', 'Mexico',
  'Argentina', 'Chile', 'Colombia', 'UAE', 'Saudi Arabia', 'Turkey',
  'Poland', 'Czech Republic', 'Romania', 'Hungary', 'Greece',
  'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco',
  'Indonesia', 'Malaysia', 'Philippines', 'Vietnam',
  'Other',
];

const STEPS = [
  { label: 'Profile', num: 1 },
  { label: 'About', num: 2 },
  { label: 'Logistics', num: 3 },
  { label: 'Submit', num: 4 },
];

const CONFETTI_COLORS = ['#FFB8CC', '#B8E3FF', '#D4B8FF', '#F56B6B', '#F5D34E', '#6DB5F5'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.8}s`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 6,
      })),
    []
  );

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-10px',
            animationDelay: p.delay,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

/* ── COMPONENT ── */

export function ApplyForm() {
  const [state, formAction, isPending] = useActionState(submitApplication, null);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ProfileId | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());

  const config = profile ? PROFILE_CONFIG[profile] : null;

  const toggleGoal = useCallback((goal: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(goal)) next.delete(goal);
      else next.add(goal);
      return next;
    });
  }, []);

  const validate = useCallback((targetStep: number): string | null => {
    if (targetStep === 1) {
      const form = document.querySelector<HTMLFormElement>('.apply-form');
      if (!form) return null;
      const fd = new FormData(form);
      if (!fd.get('profile')) return 'Pick a profile to continue.';
      if (!fd.get('name')) return 'Name is required.';
      if (!fd.get('email')) return 'Email is required.';
      if (!fd.get('telegram')) return 'Telegram is required.';
      if (!fd.get('country')) return 'Country is required.';
    }
    if (targetStep === 2) {
      const form = document.querySelector<HTMLFormElement>('.apply-form');
      if (!form) return null;
      const fd = new FormData(form);
      if (!fd.get('about')) return 'Please fill in the about field.';
      if (selectedGoals.size === 0) return 'Select at least one goal.';
      if (config?.showStage && !fd.get('stage')) return 'Select your current stage.';
    }
    if (targetStep === 3) {
      const form = document.querySelector<HTMLFormElement>('.apply-form');
      if (!form) return null;
      const fd = new FormData(form);
      if (!fd.get('commitment')) return 'Select your availability.';
    }
    return null;
  }, [config, selectedGoals]);

  const goTo = useCallback((target: number) => {
    if (target < step) {
      setDirection('back');
      setStepError(null);
      setStep(target);
      return;
    }
    for (let s = step; s < target; s++) {
      const err = validate(s);
      if (err) {
        setStepError(err);
        return;
      }
    }
    setDirection('forward');
    setStepError(null);
    setStep(target);
    posthog.capture('application_step_advanced', { from_step: step, to_step: target, profile });
  }, [step, validate, profile]);

  /* ── Gather form summary for step 4 ── */
  const getSummary = useCallback(() => {
    const form = document.querySelector<HTMLFormElement>('.apply-form');
    if (!form) return null;
    const fd = new FormData(form);
    return {
      name: fd.get('name') as string || '',
      email: fd.get('email') as string || '',
      profile: profile ?? '',
      profileLabel: PROFILES.find((p) => p.id === profile)?.label || '',
      country: fd.get('country') as string || '',
      goals: Array.from(selectedGoals),
      commitment: fd.get('commitment') as string || '',
    };
  }, [profile, selectedGoals]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const name = fd.get('name') as string;
    const country = fd.get('country') as string;
    if (email) {
      posthog.identify(email, { name, profile: profile ?? undefined, country });
    }
  }, [profile]);

  if (state?.success) {
    return (
      <div className="apply-form-success">
        <Confetti />
        <div className="success-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="rgba(245,107,107,0.12)" />
            <circle cx="28" cy="28" r="20" fill="rgba(245,107,107,0.08)" />
            <path d="M18 28l7 7 13-13" stroke="#F56B6B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="display success-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '0.75rem' }}>
          Application received
        </h3>
        <p className="success-sub" style={{ color: 'var(--slate)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
          We&apos;ll review your application and get back to you within a few days.
        </p>
        <div className="success-next-steps">
          <div className="success-step">
            <div className="success-step-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="14" height="12" rx="2" />
                <path d="M2 7h14M6 3v-1M12 3v-1" />
              </svg>
            </div>
            <span className="success-step-label">Check email</span>
          </div>
          <div className="success-step">
            <div className="success-step-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 11.3A7.5 7.5 0 1 0 6.7 15L3 16l1-3.7Z" />
              </svg>
            </div>
            <span className="success-step-label">Join Telegram</span>
          </div>
          <div className="success-step">
            <div className="success-step-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12V9a5 5 0 0 1 10 0v3" />
                <path d="M2 12h14v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3Z" />
                <circle cx="9" cy="14" r="1" />
              </svg>
            </div>
            <span className="success-step-label">Share with a friend</span>
          </div>
        </div>
      </div>
    );
  }

  const summary = step === 4 ? getSummary() : null;

  // Block implicit Enter-key submission on inputs — submission is intent-only
  // via the Submit Application button. Allow Enter inside textareas (newlines)
  // and on the submit button itself (keyboard activation).
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'Enter') return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'TEXTAREA') return;
    if (target.tagName === 'BUTTON' && (target as HTMLButtonElement).type === 'submit') return;
    e.preventDefault();
  }, []);

  return (
    <form action={formAction} className="apply-form" onKeyDown={handleKeyDown} onSubmit={handleSubmit}>
      {/* ── STEP COUNTER ── */}
      <div className="step-counter">
        {STEPS.map((s, i) => (
          <div key={s.num} className="step-counter-item">
            {i > 0 && (
              <div className={`step-line ${step > s.num - 1 ? 'done' : ''}`} />
            )}
            <button
              type="button"
              className={`step-dot ${step === s.num ? 'current' : ''} ${step > s.num ? 'done' : ''}`}
              onClick={() => step > s.num ? goTo(s.num) : undefined}
              tabIndex={step > s.num ? 0 : -1}
            >
              {step > s.num ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              ) : (
                s.num
              )}
            </button>
            <span className={`step-label mono ${step >= s.num ? 'active' : ''}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="step-viewport">
        {/* STEP 1: PROFILE */}
        <div className={`step-pane ${step === 1 ? 'active' : ''} ${step > 1 ? 'exit-left' : 'exit-right'} ${direction}`}>
          <fieldset className="form-fieldset">
            <legend className="form-legend mono">What describes you best?</legend>

            <div className="profile-grid">
              {PROFILES.map((p) => {
                const Icon = PROFILE_ICONS[p.id];
                return (
                  <label
                    key={p.id}
                    className={`profile-card ${profile === p.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="profile"
                      value={p.id}
                      className="form-radio"
                      onChange={() => setProfile(p.id)}
                    />
                    <span className="profile-icon"><Icon /></span>
                    <span className="profile-label">{p.label}</span>
                  </label>
                );
              })}
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="name" className="form-label">Full name <span className="req">*</span></label>
                <input type="text" id="name" name="name" placeholder="Satoshi Nakamoto" className="form-input" />
              </div>
              <div className="form-field">
                <label htmlFor="email" className="form-label">Email <span className="req">*</span></label>
                <input type="email" id="email" name="email" placeholder="you@example.com" className="form-input" />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="telegram" className="form-label">Telegram <span className="req">*</span></label>
                <input type="text" id="telegram" name="telegram" placeholder="@username" className="form-input" />
              </div>
              <div className="form-field">
                <label htmlFor="country" className="form-label">Country <span className="req">*</span></label>
                <select id="country" name="country" className="form-input form-select" defaultValue="">
                  <option value="" disabled>Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="link" className="form-label">LinkedIn, X, or personal site</label>
              <input type="url" id="link" name="link" placeholder="https://" className="form-input" />
            </div>
          </fieldset>
        </div>

        {/* STEP 2: ABOUT */}
        <div className={`step-pane ${step === 2 ? 'active' : ''} ${step > 2 ? 'exit-left' : 'exit-right'} ${direction}`}>
          <fieldset className="form-fieldset">
            <legend className="form-legend mono">About you</legend>

            {config ? (
              <>
                <div className="form-field">
                  <label htmlFor="about" className="form-label">
                    {config.question} <span className="req">*</span>
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    placeholder={config.placeholder}
                    className="form-input form-textarea"
                  />
                  <span className="form-hint">{config.hint}</span>
                </div>

                {config.showStage && (
                  <div className="form-field">
                    <label className="form-label">Current stage <span className="req">*</span></label>
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
                )}

                <div className="form-field">
                  <label className="form-label">What do you want from the month? <span className="req">*</span></label>
                  <div className="chip-grid">
                    {GOALS.map((g) => {
                      const GoalIcon = GOAL_ICONS[g];
                      return (
                        <label
                          key={g}
                          className={`chip-label ${selectedGoals.has(g) ? 'checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            name="goals"
                            value={g}
                            className="form-checkbox"
                            checked={selectedGoals.has(g)}
                            onChange={() => toggleGoal(g)}
                          />
                          <span className="chip-icon">{GoalIcon && <GoalIcon />}</span>
                          <span>{g}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="fieldset-placeholder">
                <p>Go back and select a profile first.</p>
              </div>
            )}
          </fieldset>
        </div>

        {/* STEP 3: LOGISTICS */}
        <div className={`step-pane ${step === 3 ? 'active' : ''} ${step > 3 ? 'exit-left' : 'exit-right'} ${direction}`}>
          <fieldset className="form-fieldset">
            <legend className="form-legend mono">Logistics</legend>

            <div className="form-field">
              <label className="form-label">Can you commit to Oct 1-31? <span className="req">*</span></label>
              <div className="form-radio-group form-radio-row">
                <label className="form-radio-label">
                  <input type="radio" name="commitment" value="Full month" className="form-radio" />
                  <span className="form-radio-custom" />
                  <span>Full month</span>
                </label>
                <label className="form-radio-label">
                  <input type="radio" name="commitment" value="Partial" className="form-radio" />
                  <span className="form-radio-custom" />
                  <span>Partial</span>
                </label>
                <label className="form-radio-label">
                  <input type="radio" name="commitment" value="Not sure yet" className="form-radio" />
                  <span className="form-radio-custom" />
                  <span>Not sure yet</span>
                </label>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="commitmentDates" className="form-label">If partial, which dates?</label>
              <input type="text" id="commitmentDates" name="commitmentDates" placeholder="e.g. Oct 8-21" className="form-input" />
            </div>
          </fieldset>
        </div>

        {/* STEP 4: FINAL */}
        <div className={`step-pane ${step === 4 ? 'active' : ''} ${step > 4 ? 'exit-left' : 'exit-right'} ${direction}`}>
          <fieldset className="form-fieldset">
            <legend className="form-legend mono">Almost there</legend>

            {/* Summary card */}
            {summary && (
              <div className="summary-card">
                <div className="summary-card-title">Your application</div>
                <div className="summary-row">
                  <span className="summary-label">Name</span>
                  <span className="summary-value">{summary.name || '—'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Profile</span>
                  <span className="summary-value">
                    {profile && (
                      <span className="summary-profile-badge">
                        {(() => { const Icon = PROFILE_ICONS[profile]; return <Icon />; })()}
                        <span>{summary.profileLabel}</span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Country</span>
                  <span className="summary-value">{summary.country || '—'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Commitment</span>
                  <span className="summary-value">{summary.commitment || '—'}</span>
                </div>
                {summary.goals.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Goals</span>
                    <div className="summary-chips">
                      {summary.goals.map((g) => (
                        <span key={g} className="summary-chip">{g}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="promoCode" className="form-label">Promo code</label>
              <input type="text" id="promoCode" name="promoCode" placeholder="Enter code for discount + express review" className="form-input" />
            </div>

            <div className="form-field">
              <label htmlFor="referral" className="form-label">Who told you about Mirai?</label>
              <input type="text" id="referral" name="referral" placeholder="Name, event, or link" className="form-input" />
            </div>

            <div className="form-field">
              <label htmlFor="anything" className="form-label">Anything else?</label>
              <textarea
                id="anything"
                name="anything"
                rows={2}
                placeholder="Dietary needs, travel questions, anything..."
                className="form-input form-textarea"
              />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── NAVIGATION ── */}
      {stepError && (
        <div className="form-error">{stepError}</div>
      )}
      {state && !state.success && step === 4 && (
        <div className="form-error">{state.message}</div>
      )}

      <div className="step-nav">
        {step > 1 && (
          <button type="button" className="btn btn-outline step-nav-btn" onClick={() => goTo(step - 1)}>
            Back
          </button>
        )}
        <div className="step-nav-spacer" />
        {step < 4 ? (
          <button type="button" className="btn btn-primary step-nav-btn" onClick={() => goTo(step + 1)}>
            Continue
          </button>
        ) : (
          <button type="submit" disabled={isPending} className="btn btn-primary step-nav-btn step-submit-btn">
            {isPending ? (
              <>
                <span className="spinner" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        )}
      </div>

      <p className="form-submit-hint mono" style={{ textAlign: 'center' }}>
        {step < 4
          ? `Step ${step} of 4`
          : 'Apply as Builder now — upgrade to Devices or Therapies later'}
      </p>
    </form>
  );
}
