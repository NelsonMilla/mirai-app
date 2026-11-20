'use client';
// PostHog, same project and settings as new-site/posthog.js. The project token is publishable
// by design (event ingest only). Never loads on localhost, so dev traffic stays off the funnel.
// Page views come from the SDK (`defaults` also captures client-side navigation); the one custom
// event is `Apply Clicked` on any link to the Typeform application, with the section it was in.
// It also goes to Vercel Web Analytics (page views there come from <Analytics /> in app/shell.tsx),
// same two-sink pattern as new-site/analytics.js; Vercel records the path itself.
import { useEffect } from 'react';
import { track } from '@vercel/analytics';

const TOKEN = 'phc_zLkJimThxemsd9r6RsEdfrPspU8TkfgNJfoSteH5uQjJ';

type PH = { init(t: string, o: object): void; capture(e: string, p?: object): void };
declare global { interface Window { posthog?: PH } }

export default function PostHog() {
  useEffect(() => {
    if (['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)) return;

    const s = document.createElement('script');
    s.src = 'https://us-assets.i.posthog.com/static/array.js';
    s.async = true;
    s.onload = () => window.posthog?.init(TOKEN, {
      api_host: 'https://us.i.posthog.com',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      capture_exceptions: true,
      enable_heatmaps: true,
      session_recording: { maskAllInputs: true },
    });
    document.head.appendChild(s);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="typeform.com"]');
      if (!a) return;
      const where = a.closest('[id]')?.id || a.closest('header, nav, footer, aside')?.tagName.toLowerCase() || 'page';
      window.posthog?.capture('Apply Clicked', { location: where, path: window.location.pathname });
      track('Apply Clicked', { location: where });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
