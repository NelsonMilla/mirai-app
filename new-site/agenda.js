/* Agenda rail from a public Google Sheet (see docs/agenda-sheet-prd.md).
   Needs sheet.js loaded first (CSV parser and fetch). Pure core (buildModel)
   runs in Node for tests; render and load touch the DOM only when called. Sheet text never goes
   in as HTML: every string lands via textContent. */
(function (window) {
  'use strict';

  const { parseCsv, rowsFromCsv } = window.MiraiSheet;

  const str = v => (v == null ? '' : String(v)).trim();
  const HIDDEN = ['false', 'no', '0', 'hidden'];
  const safeLink = l => (/^(\/|#|https:\/\/)/i.test(l) ? l : '');
  const pad = n => String(n).padStart(2, '0');

  function buildModel(rows) {
    const blocks = [], byName = {};
    (rows || []).forEach(r => {
      const block = str(r.block), title = str(r.title);
      if (!block || !title) return;
      let b = byName[block];
      if (!b) { b = byName[block] = { name: block, date: '', title: '', sessions: [] }; blocks.push(b); }
      if (!b.date) b.date = str(r.date);
      if (!b.title) b.title = str(r.blocktitle);
      if (HIDDEN.includes(str(r.publish).toLowerCase())) return;
      b.sessions.push({ title, subtitle: str(r.subtitle), link: safeLink(str(r.link)) });
    });
    const stops = blocks.filter(b => b.sessions.length).map((b, i) => ({
      code: 'STN·' + pad(i + 1),
      date: b.date,
      tag: b.name,
      title: b.title,
      finale: b.name.toLowerCase() === 'finale',
      sessions: b.sessions.map((s, j) => ({ num: pad(j + 1), ...s })),
    }));
    return { stops };
  }

  /* ─── DOM ─── */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  // Text, then " " + link when present (mirrors the old copy-registry anchor).
  function withLink(node, text, link) {
    node.appendChild(document.createTextNode(text));
    if (!link) return node;
    const fashion = link === '#fashion';
    const a = el('a', '', fashion ? 'See the show ↑' : 'Details');
    a.href = link;
    a.style.color = 'var(--accent)';
    a.style.textDecoration = 'none';
    a.setAttribute('data-analytics-action', 'site_navigation');
    a.setAttribute('data-analytics-location', 'agenda');
    a.setAttribute('data-analytics-target', fashion ? 'fashion' : 'agenda_link');
    if (fashion) a.setAttribute('data-fashion', ''); // hidden by html.fashion-hidden
    node.appendChild(document.createTextNode(' '));
    node.appendChild(a);
    return node;
  }

  // The page's reveal observer only sees .rv present when it first runs, so
  // stops built later reveal through this one (same threshold), or at once
  // when the rail was already revealed.
  let revealer = null;
  function reveal(stop, now) {
    if (now || !('IntersectionObserver' in window)) { stop.classList.add('in'); return; }
    revealer = revealer || new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
    }), { threshold: .12 });
    revealer.observe(stop);
  }

  function render(model, rail) {
    const shown = !!rail.querySelector('.rv.in');
    rail.textContent = '';
    model.stops.forEach(s => {
      const stop = el('div', 'ag-stop' + (s.finale ? ' ag-stop--finale' : '') + ' rv');
      const date = el('div', 'ag-date mono');
      date.appendChild(el('span', 'ag-code', s.code));
      date.appendChild(document.createTextNode(s.date));
      stop.appendChild(date);
      if (s.finale) {
        const f = s.sessions[0], box = el('div', 'ag-finale');
        box.appendChild(el('div', 'ag-tag mono', s.tag));
        box.appendChild(el('div', 'ag-finale-title', f.title));
        box.appendChild(withLink(el('div', 'ag-finale-sub mono'), f.subtitle, f.link));
        stop.appendChild(box);
      } else {
        stop.appendChild(el('div', 'ag-tag mono', s.tag));
        stop.appendChild(el('div', 'ag-title', s.title));
        const ul = el('ul', 'ag-sessions');
        s.sessions.forEach(x => {
          const li = el('li'), t = el('span', 'ag-t');
          li.appendChild(el('span', 'ag-num mono', x.num));
          if (x.subtitle) {
            t.appendChild(el('span', '', x.title));
            t.appendChild(withLink(el('span', 'ag-sub'), x.subtitle, x.link));
          } else withLink(t, x.title, x.link);
          li.appendChild(t);
          ul.appendChild(li);
        });
        stop.appendChild(ul);
      }
      rail.appendChild(stop);
      reveal(stop, shown);
    });
  }

  // Snapshot now, sheet when it answers. Resolves 'sheet' or 'snapshot'; never throws.
  function load(opts) {
    const { url, snapshot, rail } = opts || {};
    const warn = reason => { console.warn('[agenda] sheet unavailable, showing snapshot', reason); return 'snapshot'; };
    try { render(buildModel(snapshot), rail); } catch (e) { console.warn('[agenda] snapshot render failed', e); }
    if (typeof url !== 'string' || !url) return Promise.resolve('snapshot');
    return window.MiraiSheet.fetchCsv(url, { timeout: 6000 }).then(rows => {
      const model = buildModel(rows);
      if (!model.stops.length) return warn('no published sessions');
      render(model, rail);
      return 'sheet';
    }).catch(warn);
  }

  window.MiraiAgenda = { parseCsv, rowsFromCsv, buildModel, render, load };
})(window);
