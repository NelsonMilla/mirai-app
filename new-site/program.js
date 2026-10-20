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

  // The last top-level "( … )" of an entry, nesting allowed: "A (B (C) / D)" → ['A', 'B (C) / D'].
  function splitAffiliation(entry) {
    let depth = 0, open = -1, last = null;
    for (let i = 0; i < entry.length; i++) {
      const c = entry[i];
      if (c === '(') { if (depth === 0) open = i; depth++; }
      else if (c === ')' && depth > 0) { depth--; if (depth === 0) last = [open, i]; }
    }
    if (!last) return [entry, ''];
    return [entry.slice(0, last[0]) + ' ' + entry.slice(last[1] + 1), entry.slice(last[0] + 1, last[1])];
  }

  // "A (X); B ; C (Y) (Z);" → [{A, X}, {B, ''}, {C (Y), Z}]; the last parenthesised group is the affiliation.
  // "Moderator: A", "moderated by A" and a trailing ", online" are read as the name alone.
  function parseSpeakers(cell, index) {
    return str(cell).split(';').map(str).filter(Boolean).map(entry => {
      const [rawName, rawAff] = splitAffiliation(entry);
      const name = rawName.replace(/^\s*(moderator|moderated by|chair|host)\s*:?\s+/i, '')
        .replace(/[,\s]+(online|moderator)\s*$/i, '').replace(/\s+/g, ' ').trim();
      const affiliation = rawAff.replace(/\s+/g, ' ').trim();
      const k = speakerKey(name);
      return { name, affiliation, id: (k && index.get(k)) || null };
    });
  }

  /* The Program tab can also be kept in the agenda layout (Block, Date, Block title, Title, Subtitle,
     Link, Publish): Date carries the day and the time range ("Oct 17 (Sat) 11:00–11:10"), Block
     title is the session block, Subtitle is the speakers cell, or a note on breaks. These rows are
     turned into timetable rows; the kind is read from the block title. */
  const WEEKDAYS = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };
  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const YEAR = 2026;
  const DATE = /^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:\s*\(([A-Za-z]{3})[A-Za-z]*\))?(?:\s+(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2}))?/;

  function inferKind(block, title) {
    const b = block.toLowerCase(), t = title.toLowerCase();
    if (/^(break|networking|registration|lunch|coffee)/.test(b) || /^(break|networking|lunch)\b/.test(t)) return 'break';
    if (/keynote/.test(b)) return 'keynote';
    if (/\b(panel|fireside)\b/.test(b) || /^panel\b/.test(t)) return 'panel';
    if (/^(opening|close|closing)$/.test(b)) return 'open';
    return '';
  }

  function fromAgendaRow(r, index) {
    const m = str(r.date).match(DATE);
    if (!m) return null;
    const mo = MONTHS.findIndex(x => x.startsWith(m[1].toLowerCase().slice(0, 3)));
    if (mo < 0) return null;
    const dayNum = +m[2];
    const wd = m[3] ? WEEKDAYS[m[3].toLowerCase()] : Object.values(WEEKDAYS)[new Date(Date.UTC(YEAR, mo, dayNum)).getUTCDay()];
    if (!wd) return null;
    const block = str(r.blocktitle), title = str(r.title), sub = str(r.subtitle);
    const kind = inferKind(block, title);
    // Subtitle is the speakers cell when at least one entry is a known speaker or carries an affiliation.
    const people = kind === 'break' ? [] : parseSpeakers(sub, index);
    const named = people.some(p => p.id || p.affiliation);
    return {
      day: wd + ' ' + dayNum + ' ' + MONTHS[mo][0].toUpperCase() + MONTHS[mo].slice(1),
      venue: str(r.venue), venuelink: str(r.venuelink),
      start: m[4] || '', end: m[5] || '', kind, block, title,
      speakers: named ? sub : '', notes: named ? '' : sub, publish: r.publish,
    };
  }

  // Where each day is held, for a Program tab without Venue columns.
  const KUIRC = ['Kobe University Integrated Research Center (KUIRC) Convention Hall, Port Island', 'https://maps.app.goo.gl/mXhV3fUvzCiEUmVL7'];
  const DEFAULT_VENUES = {
    'Saturday 17 October': KUIRC, 'Sunday 18 October': KUIRC, 'Saturday 24 October': KUIRC,
    'Sunday 25 October': ['Kobe Portopia Hotel, Port Island', 'https://www.google.com/maps/search/?api=1&query=Kobe+Portopia+Hotel'],
    'Monday 26 October': ['Orbis Hall, Kobe Fashion Museum 5F, Rokko Island', 'https://www.google.com/maps/search/?api=1&query=Kobe+Fashion+Museum+Orbis+Hall'],
  };

  function buildModel(rows, speakersModel) {
    const index = speakerIndex(speakersModel);
    const days = [], byLabel = new Map();
    let count = 0;
    (rows || []).forEach(r => {
      if (r && !str(r.day) && str(r.date)) { r = fromAgendaRow(r, index); if (!r) return; }
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
    days.forEach(d => {
      delete d.linkSeen;
      const v = DEFAULT_VENUES[d.label];
      if (v && !d.venue) { d.venue = v[0]; if (!d.venueLink) d.venueLink = v[1]; }
    });
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
