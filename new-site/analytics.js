(() => {
  'use strict';

  const ENGAGED_VISIT_MS = 5000;
  const SECTION_DWELL_MS = 800;
  const LUMA_ORIGIN = 'https://luma.com';
  const experiment = () => window.MIRAI_ACTIVE_EXPERIMENT || null;

  // Section reach doubles as the "how far did they read" context attached to
  // every later event, so it is tracked at module scope.
  const viewedSections = new Set();
  let deepestSection = null;
  let deepestPosition = 0;

  const pageContext = () => ({
    seconds_on_page: Math.round(performance.now() / 1000),
    sections_viewed: viewedSections.size,
    deepest_section: deepestSection,
    deepest_section_position: deepestPosition,
  });

  // Two sinks, one taxonomy. Vercel Web Analytics Pro accepts two custom
  // properties per event, so `data` deliberately stays at or below that limit
  // and keeps the existing Vercel dashboards comparable. PostHog has no such
  // limit and additionally receives `extra` plus the page context above, which
  // is what makes the funnel diagnosable rather than merely countable.
  const capture = (name, properties) => window.MiraiPostHog?.capture(name, properties);

  const track = (name, data = {}, extra = {}) => {
    if (experiment()?.forced) return;
    if (typeof window.va === 'function') {
      window.va('event', { name, data });
    }
    capture(name, { ...data, ...extra, ...pageContext() });
  };

  const variant = () => experiment()?.variant || null;
  const offer = () => {
    const baseOffer = document.body.dataset.analyticsOffer || 'unknown';
    return variant() ? `${baseOffer}__${variant()}` : baseOffer;
  };

  const sectionData = (element) => {
    const data = { section: element.dataset.trackSection };
    if (variant()) data.variant = variant();
    else data.position = Number(element.dataset.trackPosition) || null;
    return data;
  };

  const initEngagementTracking = () => {
    let visibleMs = 0;
    let visibleSince = null;
    let timer = null;
    let tracked = false;

    const clearTimer = () => {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
    };

    const markEngaged = () => {
      if (tracked) return;
      tracked = true;
      clearTimer();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      track('5-Second Visit');
    };

    const pause = () => {
      if (visibleSince === null) return;
      visibleMs += performance.now() - visibleSince;
      visibleSince = null;
      clearTimer();
    };

    const resume = () => {
      if (tracked || document.visibilityState !== 'visible') return;
      visibleSince = performance.now();
      timer = window.setTimeout(markEngaged, Math.max(0, ENGAGED_VISIT_MS - visibleMs));
    };

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') resume();
      else pause();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    resume();
  };

  const trackSectionViewed = (element) => {
    const section = element.dataset.trackSection;
    const position = Number(element.dataset.trackPosition) || 0;
    viewedSections.add(section);
    if (position >= deepestPosition) {
      deepestPosition = position;
      deepestSection = section;
    }
    track('Section Viewed', sectionData(element), {
      section,
      position,
      seconds_to_view: Math.round(performance.now() / 1000),
    });
  };

  const initSectionTracking = () => {
    const sections = document.querySelectorAll('[data-track-section]');
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      trackSectionViewed(sections[0]);
      return;
    }

    const dwellTimers = new WeakMap();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const section = entry.target.dataset.trackSection;
        if (!section || viewedSections.has(section)) return;

        if (!entry.isIntersecting) {
          clearTimeout(dwellTimers.get(entry.target));
          dwellTimers.delete(entry.target);
          return;
        }

        if (dwellTimers.has(entry.target)) return;

        const timer = window.setTimeout(() => {
          trackSectionViewed(entry.target);
          observer.unobserve(entry.target);
          dwellTimers.delete(entry.target);
        }, SECTION_DWELL_MS);
        dwellTimers.set(entry.target, timer);
      });
    }, { rootMargin: '-20% 0px -20% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
  };

  const initActionTracking = () => {
    let checkoutTracked = false;
    document.addEventListener('click', (event) => {
      const action = event.target.closest?.('[data-analytics-action]');
      if (!action) return;

      const location = action.dataset.analyticsLocation || 'unknown';
      const target = action.dataset.analyticsTarget || 'unknown';
      switch (action.dataset.analyticsAction) {
        case 'checkout': {
          // Vercel counts first checkout intent only, so its funnel stays
          // comparable with page views. PostHog records every click, which is
          // how repeat attempts and abandoned returns become visible.
          const extra = { checkout_target: target, is_first_checkout: !checkoutTracked };
          if (checkoutTracked) {
            capture('Checkout Opened', {
              offer: offer(), location, ...extra, ...pageContext(),
            });
            return;
          }
          checkoutTracked = true;
          track('Checkout Opened', { offer: offer(), location }, extra);
          break;
        }
        case 'alternative_offer':
          track('Alternative Offer Clicked', { offer: target, location });
          break;
        case 'site_navigation':
          track('Site Navigation Clicked', { destination: target, location });
          break;
      }
    }, true);
  };

  const initFaqTracking = () => {
    const opened = new Set();
    document.querySelectorAll('details[data-track-faq]').forEach((details) => {
      details.addEventListener('toggle', () => {
        const question = details.dataset.trackFaq;
        if (!details.open || !question || opened.has(question)) return;
        opened.add(question);
        const position = Number(details.dataset.trackPosition) || null;
        track('FAQ Opened', variant()
          ? { question, variant: variant() }
          : { question, position }, { question, position });
      });
    });
  };

  const initPurchaseTracking = () => {
    let purchaseTracked = false;
    window.addEventListener('message', (event) => {
      if (purchaseTracked || event.origin !== LUMA_ORIGIN || event.data?.type !== 'luma:purchase') return;
      purchaseTracked = true;

      const purchaseValue = Number(event.data.value);
      track('Purchase Completed', {
        offer: offer(),
        value: Number.isFinite(purchaseValue) ? purchaseValue : null,
      });
    });
  };

  const init = () => {
    if (experiment()) {
      track('Experiment Assigned', {
        experiment: experiment().key,
        variant: variant(),
      });
    }
    initEngagementTracking();
    initSectionTracking();
    initActionTracking();
    initFaqTracking();
    initPurchaseTracking();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
