/* Speakers from the public Google Sheet's Speakers tab (see docs/speakers-sheet-prd.md).
   Needs sheet.js loaded first. Pure core (buildModel, featured, others, groups,
   numberWords) runs in Node for tests; photoEl, fillCounts and load touch the
   DOM only when called. Each page renders the model itself, text via textContent. */
(function (window) {
  'use strict';

  const str = v => (v == null ? '' : String(v)).trim();
  const HIDDEN = ['false', 'no', '0', 'hidden'];
  const PAGES = ['landing', 'conferences', 'experience', 'startups', 'jp'];
  const SESSIONS = ['S1', 'S2', 'F', 'Online'];

  // "José Cordeiro" → "jose_cordeiro", "Aubrey de Grey" → "aubrey_de_grey".
  const slug = name => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  // '' → derived file; same-site '/path' as given; 'none' or anything else → no photo.
  function photoFor(cell, id) {
    if (!cell) return id ? '/img/speakers/' + id + '.jpeg' : '';
    return /^\/(?![/\\])/.test(cell) ? cell : '';
  }

  function initialsOf(first, last) {
    return (last ? first[0] + last[0] : first.slice(0, 2)).toUpperCase();
  }

  function buildModel(rows) {
    const speakers = [];
    (rows || []).forEach(r => {
      const first = str(r.firstname), last = str(r.lastname);
      if (!first || HIDDEN.includes(str(r.publish).toLowerCase())) return;
      const id = slug([first, last].filter(Boolean).join(' '));
      const tokens = str(r.sessions).toLowerCase().split(/[^a-z0-9]+/i);
      const sessions = SESSIONS.filter(t => tokens.includes(t.toLowerCase()));
      const showOn = str(r.showon).toLowerCase().split(/[^a-z]+/i).filter(t => PAGES.includes(t));
      speakers.push({
        id,
        name: str(r.displayname) || [first, last].filter(Boolean).join(' '),
        first, last,
        affiliation: str(r.affiliation),
        talk: str(r.talk),
        bio: str(r.bio),
        sessions,
        sessionsLabel: sessions.join(' · '),
        group: /^sci/i.test(str(r.group)) ? 'scientists' : 'founders',
        showOn,
        photo: photoFor(str(r.photo), id),
        initials: initialsOf(first, last),
        nameJp: str(r.namejp),
        roleJp: str(r.rolejp),
        focusJp: str(r.focusjp),
      });
    });
    return { speakers, count: speakers.length };
  }

  const featured = (model, page) => model.speakers.filter(s => s.showOn.includes(page));
  const others = (model, page) => model.speakers.filter(s => !s.showOn.includes(page));
  const groups = model => ({
    scientists: model.speakers.filter(s => s.group === 'scientists'),
    founders: model.speakers.filter(s => s.group === 'founders'),
  });

  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  // 0–99 in words ("twenty-eight"); anything else as digits.
  function numberWords(n) {
    if (!Number.isInteger(n) || n < 0 || n > 99) return String(n);
    if (n < 20) return ONES[n];
    return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  }

  /* ─── DOM ─── */
  function initialsEl(speaker) {
    const d = document.createElement('div');
    d.className = 'spk-initials';
    d.setAttribute('aria-hidden', 'true');
    d.textContent = speaker.initials;
    return d;
  }

  // Photo, or the initials tile when there is none or the file fails to load.
  // alt defaults to the name; pass '' where the caption already names the person.
  function photoEl(speaker, opts) {
    const { alt, width, height, sizes } = opts || {};
    if (!speaker.photo) return initialsEl(speaker);
    const img = document.createElement('img');
    img.onerror = () => { img.onerror = null; img.replaceWith(initialsEl(speaker)); };
    img.alt = alt == null ? speaker.name : alt;
    if (width) img.setAttribute('width', width);
    if (height) img.setAttribute('height', height);
    if (sizes) img.setAttribute('sizes', sizes);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.src = speaker.photo;
    return img;
  }

  function fillCounts(model, root) {
    (root || document).querySelectorAll('[data-speakers-count]').forEach(n => { n.textContent = String(model.count); });
  }

  // Snapshot now, sheet when it answers. Resolves 'sheet' or 'snapshot'; never throws.
  function load(opts) {
    const { url, snapshot, render } = opts || {};
    const warn = reason => { console.warn('[speakers] sheet unavailable, showing snapshot', reason); return 'snapshot'; };
    try { render(buildModel(snapshot)); } catch (e) { console.warn('[speakers] snapshot render failed', e); }
    if (typeof url !== 'string' || !url) return Promise.resolve('snapshot');
    return window.MiraiSheet.fetchCsv(url, { timeout: 6000 }).then(rows => {
      const model = buildModel(rows);
      if (!model.count) return warn('no published speakers');
      render(model);
      return 'sheet';
    }).catch(warn);
  }

  window.MiraiSpeakers = { buildModel, featured, others, groups, numberWords, fillCounts, photoEl, load };
})(window);
