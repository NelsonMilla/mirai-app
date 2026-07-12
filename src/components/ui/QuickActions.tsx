import React from 'react';
import { quickActions } from '@/data/quickActions';

type Variant = 'default' | 'stacked';

interface QuickActionsProps {
  variant?: Variant;
  heading?: string;
  subheading?: string;
  source?: string;
}

const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

/* Luma's mark is a four-pointed spark. */
const LumaIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c.6 5.5 4.5 9.4 10 10-5.5.6-9.4 4.5-10 10-.6-5.5-4.5-9.4-10-10 5.5-.6 9.4-4.5 10-10z" />
  </svg>
);

/* Simplified Discord blob with cut-out eyes (evenodd). */
const DiscordIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M4.9 6.6C6.9 5.4 9.3 4.8 12 4.8s5.1.6 7.1 1.8c1.4 2.6 2 5.4 1.9 8.5-1.5 1.4-3.2 2.4-5.1 3l-1-1.8c.6-.2 1.2-.5 1.7-.8-3 1.3-6.2 1.3-9.2 0 .5.3 1.1.6 1.7.8l-1 1.8c-1.9-.6-3.6-1.6-5.1-3-.1-3.1.5-5.9 1.9-8.5zm4.4 3.9a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2zm5.4 0a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2z"
    />
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  telegram: <TelegramIcon size={22} />,
  luma: <LumaIcon size={22} />,
  discord: <DiscordIcon size={22} />,
};

export function QuickActions({
  variant = 'default',
  heading = 'The city is already talking.',
  subheading = 'The first residents are already in — one group chat, one calendar, zero forms. Pick a door.',
  source = 'quick-actions',
}: QuickActionsProps) {
  return (
    <section
      className={`quick-actions quick-actions--${variant}`}
      aria-labelledby="quick-actions-heading"
    >
      <div className="quick-actions-head">
        <div className="section-label">Doors open</div>
        <h3 id="quick-actions-heading" className="quick-actions-title display">
          {heading}
        </h3>
        {subheading && <p className="quick-actions-sub">{subheading}</p>}
      </div>

      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className="qa-card"
            style={{ '--qa-tone': action.tone } as React.CSSProperties}
            data-source={source}
          >
            <div className="qa-icon" aria-hidden="true">
              {ICONS[action.id]}
            </div>
            <div className="qa-body">
              <div className="qa-card-label mono">{action.label}</div>
              <div className="qa-card-title">{action.title}</div>
              <div className="qa-card-desc">{action.desc}</div>
            </div>
            <div
              className={`qa-card-cta mono${action.primary ? ' qa-card-cta--primary' : ''}`}
              aria-hidden="true"
            >
              {action.cta}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
