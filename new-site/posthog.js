(() => {
  'use strict';

  // PostHog for the standalone new-site deployment. Loaded (deferred) ahead of
  // analytics.js, which dual-dispatches the shared event taxonomy here as well
  // as to Vercel Web Analytics.
  //
  // The project token is publishable by design; it only permits event ingest.
  const PROJECT_TOKEN = 'phc_zLkJimThxemsd9r6RsEdfrPspU8TkfgNJfoSteH5uQjJ';
  const API_HOST = 'https://us.i.posthog.com';
  const ASSET_HOST = 'https://us-assets.i.posthog.com';

  // Page context is recomputed per event rather than registered as a super
  // property, so a visitor moving between offer pages never carries a stale
  // experiment assignment forward.
  const pageProperties = () => {
    const properties = { offer: document.body?.dataset.analyticsOffer || 'unknown' };
    const experiment = window.MIRAI_ACTIVE_EXPERIMENT;
    if (experiment) {
      properties.experiment = experiment.key;
      properties.variant = experiment.variant;
      properties.qa = Boolean(experiment.forced);
    }
    return properties;
  };

  // analytics.js can fire before the library finishes downloading, so events
  // queue until init completes.
  const queued = [];
  let ready = false;

  window.MiraiPostHog = {
    capture(name, properties) {
      if (ready) window.posthog.capture(name, properties);
      else queued.push([name, properties]);
    },
  };

  const start = () => {
    window.posthog.init(PROJECT_TOKEN, {
      api_host: API_HOST,
      ui_host: 'https://us.posthog.com',
      defaults: '2026-01-30',
      // No page on this site collects a name, an email address, or a payment;
      // checkout happens on Luma. Anonymous events keep the funnel intact
      // without creating person profiles.
      person_profiles: 'identified_only',
      capture_exceptions: true,
      enable_heatmaps: true,
      session_recording: { maskAllInputs: true },
      before_send: (event) => {
        if (event?.properties) Object.assign(event.properties, pageProperties());
        return event;
      },
    });

    ready = true;
    queued.splice(0).forEach(([name, properties]) => window.posthog.capture(name, properties));
  };

  const script = document.createElement('script');
  script.src = `${ASSET_HOST}/static/array.js`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.addEventListener('load', start, { once: true });
  document.head.appendChild(script);
})();
