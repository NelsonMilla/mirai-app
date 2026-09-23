/* Shared site nav — the single source of truth for the top bar on every
   English site page (/, /experience/, /conferences/, /pricing/, /startups/).
   The last link points Japanese readers to /jp/ (Japan-resident ticket on Peatix).
   The default CTA goes to /pricing/, where each ticket has its own Stripe link.
   Use it like this, at the top of <body>, with /nav.css linked in <head>:
     <script src="/nav.js"></script>
   The script is synchronous and inserts the nav right where it sits, so
   there is no flash. A page can swap the CTA with attributes on the tag:
     data-cta-label, data-cta-href, data-cta-target (analytics target). */
(function () {
  var script = document.currentScript;
  if (!script) return;
  var path = location.pathname;
  var links = [
    { href: '/experience/', label: 'The Experience', target: 'experience' },
    { href: '/conferences/', label: 'Summits', target: 'conferences' },
    { href: '/pricing/', label: 'Pricing', target: 'pricing' },
    { href: '/startups/', label: 'For Startups', target: 'startups' },
    { href: '/jp/', label: '日本語', target: 'japan', lang: 'ja' }
  ];
  var cta = {
    label: script.getAttribute('data-cta-label') || 'Get Tickets',
    href: script.getAttribute('data-cta-href') || '/pricing/',
    target: script.getAttribute('data-cta-target') || 'pricing'
  };
  // An external CTA is a checkout (Stripe); an internal one is navigation.
  var external = /^https?:/.test(cta.href);
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  var onHome = path === '/' || path === '/index.html';
  var html =
    '<div class="topbar"><nav class="nd-nav" aria-label="Primary">' +
    '<a class="nd-logo" href="' + (onHome ? '#top' : '/') + '">Mirai<span class="nd-logoTech">Tech</span></a>' +
    '<div class="nd-pill"><div class="nd-links">' +
    links.map(function (l) {
      var current = path.indexOf(l.href) === 0 ? ' aria-current="page"' : '';
      var lang = l.lang ? ' lang="' + l.lang + '" hreflang="' + l.lang + '"' : '';
      return '<a class="nd-link" href="' + l.href + '" data-analytics-action="site_navigation" ' +
        'data-analytics-location="nav" data-analytics-target="' + l.target + '"' + current + lang + '>' +
        '<span class="nd-lbl">' + esc(l.label) + '</span></a>';
    }).join('') +
    '</div>' +
    '<a class="nd-cta" href="' + esc(cta.href) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + ' ' +
    'data-analytics-action="' + (external ? 'checkout' : 'site_navigation') + '" data-analytics-location="nav" data-analytics-target="' + esc(cta.target) + '">' +
    esc(cta.label) + '</a>' +
    '</div></nav></div>';
  script.insertAdjacentHTML('afterend', html);

  var nav = script.nextElementSibling.querySelector('.nd-nav'), on = false;
  function sync() {
    var s = window.scrollY > 24;
    if (s !== on) { on = s; nav.classList.toggle('nd-scrolled', s); }
  }
  window.addEventListener('scroll', sync, { passive: true });
  sync();
})();
