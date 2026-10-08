/* The speaker panel shared by /conferences/ and /program/ (docs/program-page-prd.md).
   Needs speakers.js loaded first (for photoEl). Each page keeps the panel's CSS.

     var p = MiraiSpeakerPanel.attach({ root, panel, speakersById });
     p.open(id, openerEl); p.close(); p.refresh(speakersById);

   Openers are any elements inside root carrying data-speaker="<id>": a click,
   Enter or Space opens that speaker in the one panel; opening the open speaker
   again closes it. refresh() re-reads the openers after a repaint, keeps an open
   speaker open (or closes one that vanished). Escape closes the panel holding
   focus, or every open panel. Sheet text goes in as text nodes only. */
(function (window, document) {
  'use strict';
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var instances = [];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function body(panel, sp) {
    var ph = el('div', 'spk-ph'), tx = el('div', 'spk-tx'), h = el('h3', null, sp.name);
    ph.appendChild(window.MiraiSpeakers.photoEl(sp, { alt: '' }));
    h.id = panel.id + '-h';
    h.tabIndex = -1;
    tx.appendChild(h);
    if (sp.affiliation) tx.appendChild(el('p', 'spk-aff', sp.affiliation));
    tx.appendChild(el('p', 'spk-ses' + (sp.sessionsLabel ? '' : ' is-tba'), sp.sessionsLabel || 'Session to be announced'));
    if (sp.talk) {
      var t = el('div', 'spk-talk');
      t.appendChild(el('span', 'lbl lbl--cyan', 'Talk'));
      t.appendChild(el('p', null, sp.talk));
      tx.appendChild(t);
    }
    if (sp.bio) tx.appendChild(el('p', 'spk-bio', sp.bio));
    var x = el('button', 'spk-x', 'Close');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close ' + sp.name);
    return [ph, tx, x];
  }

  /* the fixed chrome height is the page's own scroll padding */
  function topInset() {
    return parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  }

  function attach(opts) {
    var root = opts.root, panel = opts.panel, byId = opts.speakersById || {};
    var openId = null, opener = null;

    function openers() { return root.querySelectorAll('[data-speaker]'); }
    function openerFor(id) { return id ? root.querySelector('[data-speaker="' + id + '"]') : null; }

    function decorate() {
      [].forEach.call(openers(), function (n) {
        if (n.tagName !== 'BUTTON' && !n.hasAttribute('role')) { n.setAttribute('role', 'button'); n.tabIndex = 0; }
        n.setAttribute('aria-controls', panel.id);
      });
      mark();
    }

    function mark() {
      [].forEach.call(openers(), function (n) {
        var on = openId != null && n.getAttribute('data-speaker') === openId;
        n.classList.toggle('is-open', on);
        n.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    }

    function fill(nodes) { panel.textContent = ''; nodes.forEach(function (n) { panel.appendChild(n); }); }

    /* one open speaker per panel; opening another swaps the content */
    function show(id, user) {
      var sp = byId[id];
      if (!sp) return;
      openId = sp.id;
      mark();
      fill(body(panel, sp));
      if (!user) return;
      var enter = panel.hidden && !(mq && mq.matches);
      if (enter) panel.classList.add('is-enter');
      panel.hidden = false;
      if (enter) { void panel.offsetWidth; panel.classList.remove('is-enter'); }
      panel.querySelector('h3').focus({ preventScroll: true });
      var r = panel.getBoundingClientRect(), vh = window.innerHeight, bar = topInset();
      if (r.top < bar || r.bottom > vh) {
        panel.scrollIntoView({ block: r.height > vh - bar ? 'start' : 'nearest', behavior: mq && mq.matches ? 'auto' : 'smooth' });
      }
    }

    function open(id, openerEl) {
      opener = openerEl || openerFor(id);
      show(id, true);
    }

    function close() {
      var o = opener && opener.isConnected ? opener : openerFor(openId), had = panel.contains(document.activeElement);
      openId = null;
      opener = null;
      mark();
      panel.hidden = true;
      panel.textContent = '';
      /* focus goes back to the opener only when it was inside the closed panel */
      if (had && o && o.offsetParent) o.focus();
    }

    /* after a repaint: re-read the openers, keep an open speaker open or close a vanished one */
    function refresh(speakersById) {
      if (speakersById) byId = speakersById;
      decorate();
      if (openId == null) return;
      if (byId[openId] && openerFor(openId)) show(openId, false); else close();
    }

    root.addEventListener('click', function (e) {
      if (e.target.closest('.spk-x')) { close(); return; }
      var o = e.target.closest('[data-speaker]');
      if (!o || !root.contains(o)) return;
      var id = o.getAttribute('data-speaker');
      if (id === openId) close(); else open(id, o);
    });
    root.addEventListener('keydown', function (e) {
      var o = e.target;
      if (o.tagName === 'BUTTON') return; /* native buttons click on their own */
      if ((e.key === 'Enter' || e.key === ' ') && o.hasAttribute && o.hasAttribute('data-speaker')) {
        e.preventDefault();
        o.click();
      }
    });

    var api = { open: open, close: close, refresh: refresh, root: root, isOpen: function () { return openId != null; } };
    instances.push(api);
    decorate();
    return { open: open, close: close, refresh: refresh };
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = instances.filter(function (p) { return p.isOpen(); });
    var here = open.filter(function (p) { return p.root.contains(document.activeElement); });
    (here.length ? here : open).forEach(function (p) { p.close(); });
  });

  window.MiraiSpeakerPanel = { attach: attach };
})(window, document);
