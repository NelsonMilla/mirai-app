/* Citizens nav — the shared header of every citizens screen: a title row and five fixed tab buttons.
   Use it like this, at the top of <body>, with /citizens/nav.css linked in <head>:
     <script src="/citizens/nav.js" data-screen="map" data-title="Interactive Map"></script>
   data-screen: map | quests | links | today | directory — the current slot (aria-current="page").
   data-title (optional): the screen's name in the title row; defaults to the slot's label.
   data-base (optional, demo only): link to base + "map.html" etc. instead of the real routes.
   The script is synchronous and inserts the strip where it sits, so there is no flash.
   Keys: 1–5 jump to a slot, [ and ] cycle through the built screens (like a game's shoulder buttons).
   The strip hides while #big or #dates carries class "open" (the links address card, the map's Dates drawer).
   Screen change (variant "iris from the tab"): a cyan disc grows out of the tab you pressed until it covers the
   viewport, the browser loads the next screen, and the disc shrinks back into that same tab on the new page.
   sessionStorage (mtc_nav_iris) carries the slot across the load. Styles: nav.css in this folder.
   Not the public site nav (/nav.js). */
(function () {
  var script = document.currentScript;
  if (!script) return;
  var screen = script.getAttribute('data-screen') || '';
  var title = script.getAttribute('data-title');
  var base = script.getAttribute('data-base');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slots = [
    { id: 'map', n: '01', label: 'Map', href: base ? base + 'map.html' : '/citizens/' },
    { id: 'quests', n: '02', label: 'Quests', href: base ? base + 'quests.html' : '/citizens/quests/' },
    { id: 'links', n: '03', label: 'Links', href: base ? base + 'links.html' : '/citizens/links/' },
    { id: 'today', n: '04', label: 'Today' },
    { id: 'directory', n: '05', label: 'Directory' }
  ];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var cur = slotOf(screen);
  var html = '<header class="mtc-nav">' +
    '<div class="mtc-title"><a class="mtc-logo" href="/">Mirai<span>Tech</span></a><span class="mtc-tag">Citizens</span>' +
    '<h1 class="mtc-h1">' + esc(title || (cur ? cur.label : 'Citizens')) + '<i aria-hidden="true">.</i></h1>' +
    '<span class="mtc-eyebrow">Kobe · October 1–31, 2026</span></div>' +
    '<nav class="mtc-tabs" aria-label="Citizens screens"><span class="mtc-br" aria-hidden="true">[</span>';
  slots.forEach(function (s, i) {
    var n = '0' + (i + 1);
    if (s.href) {
      html += '<a class="mtc-tab" href="' + s.href + '" data-slot="' + s.id + '"' + (s.id === screen ? ' aria-current="page"' : '') +
        ' data-analytics-action="site_navigation" data-analytics-location="citizens_nav" data-analytics-target="' + s.id + '">' +
        '<span class="mtc-n">' + n + '</span><span class="mtc-l">' + s.label + '</span></a>';
    } else {
      html += '<span class="mtc-tab mtc-soon" data-slot="' + s.id + '" aria-disabled="true">' +
        '<span class="mtc-n">' + n + '</span><span class="mtc-l">' + s.label + '</span><span class="mtc-s">Soon</span></span>';
    }
  });
  html += '<span class="mtc-br" aria-hidden="true">]</span></nav></header>';
  script.insertAdjacentHTML('afterend', html);
  document.body.classList.add('has-mtc-nav');
  var nav = script.nextElementSibling;

  // ---- the iris: a cyan disc grows out of the pressed tab on this screen and shrinks back into the same tab on the
  //      next one. sessionStorage carries the slot across the load. Each half ≤240ms; the overlay never blocks input
  //      (pointer-events: none) and always removes itself (animationend AND a timeout).
  var KEY = 'mtc_nav_iris';
  function tabOf(id) { return nav.querySelector('.mtc-tab[data-slot="' + id + '"]'); }
  function centreOf(el) { // the tab's centre in viewport px; the header's centre if the tab is not there
    var r = (el || nav).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function iris(cls, slot, c) {
    var W = window.innerWidth, H = window.innerHeight;
    var R = Math.ceil(Math.sqrt(Math.pow(Math.max(c.x, W - c.x), 2) + Math.pow(Math.max(c.y, H - c.y), 2))) + 2;
    var el = document.createElement('div');
    el.className = 'mtc-iris ' + cls;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="mtc-iris-disc" style="left:' + (c.x - R) + 'px;top:' + (c.y - R) + 'px;width:' + (R * 2) + 'px;height:' + (R * 2) + 'px"></div>' +
      '<div class="mtc-iris-label"><span class="mtc-iris-n">' + esc(slot.n) + '</span> ' + esc(slot.label) + '</div>';
    document.body.appendChild(el);
    return el;
  }
  var arriving = null;
  try { arriving = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
  if (arriving && !reduce) {
    // Synchronous, at the top of <body>: the header is already in the DOM and position: fixed, so its tab
    // rectangles are final before the first paint; the disc is placed before anything is drawn.
    var inSlot = slotOf(arriving) || cur;
    var inEl = iris('mtc-iris-in', inSlot || { n: '', label: '' }, centreOf(inSlot && tabOf(inSlot.id)));
    function gone() { if (inEl.parentNode) inEl.parentNode.removeChild(inEl); }
    inEl.querySelector('.mtc-iris-disc').addEventListener('animationend', gone);
    setTimeout(gone, 400); // never leave the disc over the page if the first frame is slow
  }
  var leaving = false;
  function go(slot) {
    if (!slot.href || leaving) return;
    if (reduce) { location.href = slot.href; return; }
    leaving = true;
    var tab = tabOf(slot.id);
    if (tab) tab.classList.add('mtc-pressed'); // the tab fills cyan at once; the disc grows out of it
    try { sessionStorage.setItem(KEY, slot.id); } catch (e) {}
    var el = iris('mtc-iris-out', slot, centreOf(tab)), done = false;
    function nav_() { if (done) return; done = true; location.href = slot.href; }
    el.querySelector('.mtc-iris-disc').addEventListener('animationend', nav_);
    setTimeout(nav_, 300); // in case animations are off for any other reason
  }
  // back/forward cache: if this page is restored mid-transition, clear the disc and the pressed tab
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    leaving = false;
    var els = document.querySelectorAll('.mtc-iris, .mtc-pressed');
    for (var i = 0; i < els.length; i++) { if (els[i].classList.contains('mtc-iris')) els[i].parentNode.removeChild(els[i]); else els[i].classList.remove('mtc-pressed'); }
  });
  function indexOf(id) { for (var i = 0; i < slots.length; i++) if (slots[i].id === id) return i; return -1; }
  function slotOf(id) { var i = indexOf(id); return i >= 0 ? slots[i] : null; }

  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a.mtc-tab');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var slot = slotOf(a.getAttribute('data-slot'));
    if (!slot) return;
    if (slot.id === screen) { e.preventDefault(); return; } // already here
    e.preventDefault();
    go(slot);
  });

  // ---- keys: 1–5 jump, [ ] cycle through the built screens. Ignored while typing or while the strip is hidden.
  function cycle(dir) {
    var i = indexOf(screen), n = slots.length;
    for (var k = 1; k <= n; k++) {
      var s = slots[((i + dir * k) % n + n) % n];
      if (s.href && s.id !== screen) return s;
    }
    return null;
  }
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    if (nav.classList.contains('mtc-hidden')) return;
    var k = e.key, slot = null;
    if (k >= '1' && k <= '5') slot = slots[+k - 1];
    else if (k === '[') slot = cycle(-1);
    else if (k === ']') slot = cycle(1);
    else return;
    if (!slot || !slot.href || slot.id === screen) return;
    e.preventDefault();
    go(slot);
  });

  // ---- step aside for a full-screen modal: #big (links) or #dates (map) with class "open"
  function watchModals() {
    var ids = ['big', 'dates'], els = [];
    ids.forEach(function (id) { var el = document.getElementById(id); if (el) els.push(el); });
    if (!els.length) return;
    function sync() {
      var open = false;
      for (var i = 0; i < els.length; i++) if (els[i].classList.contains('open')) open = true;
      nav.classList.toggle('mtc-hidden', open);
    }
    var mo = new MutationObserver(sync);
    els.forEach(function (el) { mo.observe(el, { attributes: true, attributeFilter: ['class'] }); });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchModals, { once: true });
  else watchModals();
})();
