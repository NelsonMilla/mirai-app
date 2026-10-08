/* Program timetable from the public Google Sheet's Program tab (see docs/program-page-prd.md).
   Needs sheet.js loaded first. Pure core (buildModel, speakerKey) runs in Node for tests;
   load touches fetch only when called. The page renders the model itself, text via textContent. */
(function (window) {
  'use strict';

  const str = v => (v == null ? '' : String(v)).trim();
  const HIDDEN = ['false', 'no', '0', 'hidden'];
  const KINDS = ['open', 'keynote', 'panel', 'break', 'pitch'];
  const HONORIFICS = ['prof', 'assoc', 'dr', 'phd', 'md', 'jd', 'frse', 'bagr', 'jr'];

  // Same rule as speakers.js: "Saturday 17 October" → "saturday_17_october".
  const slug = name => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  // "Saturday 17 October" → "Sat 17 Oct"; anything else as typed.
  function shortLabel(label) {
    const m = label.match(/^(\w+)\s+(\d{1,2})\s+(\w+)$/);
    return m ? m[1].slice(0, 3) + ' ' + m[2] + ' ' + m[3].slice(0, 3) : label;
  }

  // Lenient name key: "Prof. Takahiro Yasuda FRSE" → "takahiro_yasuda", "José de Cordeiro" → "jose_cordeiro".
  function speakerKey(name) {
    const tokens = str(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/\./g, '').split(/[^a-z0-9]+/).filter(t => t && !HONORIFICS.includes(t));
    if (!tokens.length) return '';
    return tokens.length === 1 ? tokens[0] : tokens[0] + '_' + tokens[tokens.length - 1];
  }

  // Key → speaker id; the first speaker to claim a key keeps it.
  function speakerIndex(speakersModel) {
    const index = new Map();
    ((speakersModel && speakersModel.speakers) || []).forEach(s => {
      [s.name, [s.first, s.last].filter(Boolean).join(' ')].forEach(n => {
        const k = speakerKey(n);
        if (k && !index.has(k)) index.set(k, s.id);
      });
    });
    return index;
  }

  // "A (X); B ; C (Y) (Z);" → [{A, X}, {B, ''}, {C (Y), Z}]; the last parenthesised group is the affiliation.
  function parseSpeakers(cell, index) {
    return str(cell).split(';').map(str).filter(Boolean).map(entry => {
      const m = entry.match(/^(.*)\(([^()]*)\)(.*)$/);
      const name = (m ? m[1] + ' ' + m[3] : entry).replace(/\s+/g, ' ').trim();
      const affiliation = m ? m[2].replace(/\s+/g, ' ').trim() : '';
      const k = speakerKey(name);
      return { name, affiliation, id: (k && index.get(k)) || null };
    });
  }

  function buildModel(rows, speakersModel) {
    const index = speakerIndex(speakersModel);
    const days = [], byLabel = new Map();
    let count = 0;
    (rows || []).forEach(r => {
      const label = str(r.day);
      if (!label || HIDDEN.includes(str(r.publish).toLowerCase())) return;
      let day = byLabel.get(label);
      if (!day) {
        day = { id: slug(label), label, short: shortLabel(label), venue: '', venueLink: '', slots: [], linkSeen: false };
        byLabel.set(label, day);
        days.push(day);
      }
      if (!day.venue) day.venue = str(r.venue);
      const link = str(r.venuelink);
      if (link && !day.linkSeen) { day.linkSeen = true; day.venueLink = /^https:\/\//i.test(link) ? link : ''; }
      const kind = str(r.kind).toLowerCase();
      const title = str(r.title);
      day.slots.push({
        start: str(r.start),
        end: str(r.end),
        kind: KINDS.includes(kind) ? kind : 'talk',
        block: str(r.block),
        title,
        tbc: !title || /to be confirmed/i.test(title),
        notes: str(r.notes),
        speakers: parseSpeakers(r.speakers, index),
      });
      count++;
    });
    days.forEach(d => { delete d.linkSeen; });
    return { days, count, speakerCount: speakersModel ? speakersModel.count : 0 };
  }

  // Snapshot now, sheet when it answers. Resolves 'sheet' or 'snapshot'; never throws.
  function load(opts) {
    const { url, snapshot, speakersModel, render } = opts || {};
    const warn = reason => { console.warn('[program] sheet unavailable, showing snapshot', reason); return 'snapshot'; };
    try { render(buildModel(snapshot, speakersModel)); } catch (e) { console.warn('[program] snapshot render failed', e); }
    if (typeof url !== 'string' || !url) return Promise.resolve('snapshot');
    return window.MiraiSheet.fetchCsv(url, { timeout: 6000 }).then(rows => {
      const model = buildModel(rows, speakersModel);
      if (!model.days.length) return warn('no published slots');
      render(model);
      return 'sheet';
    }).catch(warn);
  }

  window.MiraiProgram = { buildModel, speakerKey, load };
})(window);
