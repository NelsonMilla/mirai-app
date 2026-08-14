(() => {
  'use strict';

  const SECTION_DWELL_MS = 800;
  const LUMA_ORIGIN = 'https://luma.com';
  const experiment = () => window.MIRAI_ACTIVE_EXPERIMENT || null;

  // Keep event payloads anonymous and flat. Vercel Web Analytics Pro accepts
  // two custom properties per event, so the taxonomy deliberately stays at
  // or below that limit.
  const track = (name, data = {}) => {
    if (experiment()?.forced) return;
    if (typeof window.va === 'function') {
      window.va('event', { name, data });
    }
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

  const initSectionTracking = () => {
    const sections = document.querySelectorAll('[data-track-section]');
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      const firstSection = sections[0];
      track('Section Viewed', sectionData(firstSection));
      return;
    }

    const viewed = new Set();
    const dwellTimers = new WeakMap();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const section = entry.target.dataset.trackSection;
        if (!section || viewed.has(section)) return;

        if (!entry.isIntersecting) {
          clearTimeout(dwellTimers.get(entry.target));
          dwellTimers.delete(entry.target);
          return;
        }

        if (dwellTimers.has(entry.target)) return;

        const timer = window.setTimeout(() => {
          viewed.add(section);
          track('Section Viewed', sectionData(entry.target));
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
      switch (action.dataset.analyticsAction) {
        case 'checkout':
          if (checkoutTracked) return;
          checkoutTracked = true;
          track('Checkout Opened', { offer: offer(), location });
          break;
        case 'alternative_offer':
          track('Alternative Offer Clicked', {
            offer: action.dataset.analyticsTarget || 'unknown',
            location,
          });
          break;
        case 'site_navigation':
          track('Site Navigation Clicked', {
            destination: action.dataset.analyticsTarget || 'unknown',
            location,
          });
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
        track('FAQ Opened', variant()
          ? { question, variant: variant() }
          : { question, position: Number(details.dataset.trackPosition) || null });
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
