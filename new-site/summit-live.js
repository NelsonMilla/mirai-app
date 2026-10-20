/* The wall of faces and the programme on /summit-i/ and /summit-ii/, from the Speakers and
   Program tabs of the sheet. Needs sheet.js, speakers.js and program.js, plus the two snapshot
   data files. The snapshots paint at once; each sheet repaints when it answers, so an edit in
   the sheet shows on the next page load. Sheet text goes in escaped; nothing is HTML.

   The page says which summit it is on <body>: data-summit="1|2", data-days="17,18",
   data-first="slug,slug" (the big tiles, in order), data-last="slug" (kept at the end). */
(function () {
  'use strict';
  var S = window.MiraiSpeakers, G = window.MiraiProgram, Sh = window.MiraiSheet;
  var grid = document.getElementById('grid');
  if (!S || !G || !Sh || !grid) return;
  var body = document.body;
  var SUMMIT = body.getAttribute('data-summit') || '1';
  var DAYS = (body.getAttribute('data-days') || '').split(',').map(Number).filter(Boolean);
  var FIRST = (body.getAttribute('data-first') || '').split(',').filter(Boolean);
  var LAST = (body.getAttribute('data-last') || '').split(',').filter(Boolean);
  var TOKENS = SUMMIT === '2' ? ['S2', 'F'] : ['S1'];

  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var DOW = { 17: 'SAT', 18: 'SUN', 24: 'SAT', 25: 'SUN', 26: 'MON' };
  var SIZES_BIG = '(max-width:699px) 50vw, (max-width:999px) 50vw, (max-width:1279px) 34vw, 25vw';
  var SIZES_SMALL = '(max-width:699px) 50vw, (max-width:999px) 25vw, (max-width:1279px) 17vw, 13vw';
  var SEAL = '<svg class="tile-seal" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><polygon fill="#D0442C" points="96.0,50.0 95.7,57.2 92.3,63.7 90.1,70.4 87.0,76.9 82.5,82.5 76.0,85.9 71.6,92.3 64.3,94.1 57.1,95.1 50.0,95.1 42.6,96.5 35.6,94.3 29.9,89.5 23.0,87.2 18.2,81.8 12.2,77.4 10.2,70.3 6.0,64.3 4.6,57.2 5.3,50.0 6.3,43.1 4.6,35.2 7.3,28.3 14.0,23.9 17.6,17.6 21.9,11.3 29.7,10.1 35.9,6.6 42.8,4.4 50.0,3.3 57.1,5.4 63.8,7.5 71.8,7.3 76.9,13.0 81.8,18.2 87.4,22.9 90.4,29.4 92.4,36.2 96.5,42.6"/><text x="50" y="44.2" font-family="\'Dela Gothic One\',sans-serif" font-size="34" fill="#F4F3F0" text-anchor="middle">講</text><text x="50" y="80.2" font-family="\'Dela Gothic One\',sans-serif" font-size="34" fill="#F4F3F0" text-anchor="middle">演</text></svg>';

  // Short organisation lines for the name strips (the Program tab's parentheticals run long in English).
  var ORG_SHORT = {
    'Kobe University Graduate School of Medicine': 'Kobe University',
    'LEV Foundation / Human Longevity Inc.': 'LEV Foundation',
    'University of Yamanashi / Institute of Science Tokyo': 'Univ. of Yamanashi · Science Tokyo',
    'Eightsix Science / Synconetics Organisation': 'Eightsix Science',
    'Cornerstone / Granite Bio Innovation': 'Granite Bio Innovation',
    'Vitalism Foundation / Vitalist Bay': 'Vitalism Foundation',
    'Longevity advocate and documentary producer': 'Longevity advocate',
    'Researcher and bioinformatician': 'Bioinformatician',
    'Transhumanist AI / BCI artist': 'AI and BCI artist',
    'International Longevity Summit': 'Intl. Longevity Summit',
    'Healthspan Capital / Cambrian': 'Healthspan Capital',
  };

  function dayNum(label) { var m = /\b(\d{1,2})\b/.exec(label || ''); return m ? +m[1] : 0; }
  function summitDays(prog) { return prog.days.filter(function (d) { return DAYS.indexOf(dayNum(d.label)) !== -1; }); }

  /* the roster: the sheet's speakers with this summit's session token, with their slots from the programme */
  function roster(spk, prog) {
    var days = summitDays(prog), out = [];
    spk.speakers.forEach(function (s) {
      if (!s.sessions.some(function (t) { return TOKENS.indexOf(t) !== -1; })) return;
      var talks = [], org = '';
      days.forEach(function (d) {
        d.slots.forEach(function (sl) {
          if (sl.kind === 'pitch') return;
          var own = null;
          sl.speakers.forEach(function (p) { if (!own && p.id === s.id) own = p; });
          if (!own) return;
          if (!org && own.affiliation) org = own.affiliation.replace(/,\s*(online|moderator)\s*$/i, '');
          talks.push({ day: dayNum(d.label), start: sl.start, end: sl.end, title: sl.title, panel: sl.kind === 'panel',
            online: /online/i.test(sl.block) || /online/i.test(own.affiliation) });
        });
      });
      if (!org) org = (s.affiliation.split(';')[0].split(',').pop() || s.affiliation).trim();
      var std = '/img/speakers/' + s.id + '.jpeg', photo = s.photo || '';
      out.push({
        slug: s.id, name: s.name, short: (s.first + ' ' + s.last).trim(), org: ORG_SHORT[org] || org, aff: s.affiliation, bio: s.bio,
        online: s.sessions.indexOf('Online') !== -1, photo: photo,
        thumb: photo === std ? '/img/speakers/thumb/' + s.id + '.jpeg' : photo,
        variants: photo === std, talks: talks, sheet_talk: s.talk,
      });
    });
    var by = {}; out.forEach(function (s) { by[s.slug] = s; });
    var head = FIRST.filter(function (k) { return by[k]; }).map(function (k) { return by[k]; });
    var tail = LAST.filter(function (k) { return by[k]; }).map(function (k) { return by[k]; });
    var mid = out.filter(function (s) { return FIRST.indexOf(s.slug) === -1 && LAST.indexOf(s.slug) === -1; });
    return head.concat(mid, tail);
  }

  function mainTalk(s) {
    var t = s.talks.filter(function (t) { return !t.panel && t.title.toLowerCase().indexOf('to be confirmed') < 0; });
    if (t[0]) return t[0].title;
    if (s.sheet_talk) return s.sheet_talk;
    return s.talks[0] ? s.talks[0].title : '';
  }

  function tile(s, i) {
    var big = i < 5, eager = i < 2;
    var cls = 'tile' + (big ? ' big' : '') + (i === 0 ? ' t1' : '') + (i === 1 ? ' t2' : '') + (i === 3 ? ' xl' : '');
    var w = s.short.split(/\s+/), ini = (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
    var img = s.photo
      ? '<img src="' + esc(big ? s.photo : s.thumb) + '" alt="" ' + (big ? 'width="800" height="1000"' : 'width="256" height="256"') + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">'
      : '<span class="ini" aria-hidden="true">' + esc(ini) + '</span>';
    if (s.photo && s.variants) {
      var set = big ? '/img/speakers/480/' + s.slug + '.webp 480w, /img/speakers/800/' + s.slug + '.webp 800w'
                    : '/img/speakers/thumb/' + s.slug + '.webp 256w, /img/speakers/480/' + s.slug + '.webp 480w';
      img = '<picture><source type="image/webp" srcset="' + set + '" sizes="' + (big ? SIZES_BIG : SIZES_SMALL) + '">' + img + '</picture>';
    }
    img = '<div class="pic">' + img + '</div>';
    var talks = s.talks.map(function (t) {
      return '<li><span class="mono">10.' + t.day + ' ' + (DOW[t.day] || '') + ' ' + esc(t.start) + '–' + esc(t.end) + (t.online ? ' · ONLINE' : '') + '</span>' +
        '<span class="te">' + esc(t.title) + '</span></li>';
    }).join('');
    var ph = s.thumb ? '<img src="' + esc(s.thumb) + '" alt="" width="56" height="56" loading="lazy" decoding="async">' : '<span class="ph">' + SEAL + '</span>';
    return '<div class="' + cls + '" data-slug="' + esc(s.slug) + '">' +
      '<button class="tile-btn" type="button" aria-expanded="false" aria-controls="d-' + esc(s.slug) + '">' + img +
        '<span class="strip"><span class="nm">' + esc(s.short) + '</span><span class="org">' + esc(s.org) + '</span>' + (s.online ? '<span class="on">Online</span>' : '') + (big && mainTalk(s) ? '<span class="tk">' + esc(mainTalk(s)) + '</span>' : '') + '</span>' +
      '</button>' +
      '<div class="disc" id="d-' + esc(s.slug) + '" hidden>' +
        '<div class="disc-top">' + ph + '<div><span class="disc-nm">' + esc(s.name) + '</span><span class="disc-org">' + esc(s.aff) + (s.online ? ' (online)' : '') + '</span></div>' +
        '<button class="disc-x" type="button">Close</button></div>' +
        (talks ? '<ul class="talks">' + talks + '</ul>' : '') +
        (s.bio ? '<p class="desc">' + esc(s.bio) + '</p>' : '') +
      '</div></div>';
  }

  function renderWall(list) {
    var head = grid.querySelector('.head'), obi = grid.querySelector('.obi');
    Array.prototype.forEach.call(grid.querySelectorAll('.tile'), function (n) { n.remove(); });
    var html = list.map(tile);
    head.insertAdjacentHTML('beforebegin', html.slice(0, 2).join(''));
    obi.insertAdjacentHTML('afterend', html.slice(2).join(''));
    openTile = null;
  }

  /* the programme: one column per summit day, blocks as headings, breaks dimmed */
  function renderProgramme(prog) {
    var box = document.getElementById('days');
    if (!box) return 0;
    var sessions = 0, html = '';
    summitDays(prog).forEach(function (d) {
      var slots = d.slots.filter(function (s) { return s.kind !== 'pitch'; });
      var pitches = d.slots.filter(function (s) { return s.kind === 'pitch'; }).map(function (s) { return s.title; });
      var starts = slots.map(function (s) { return s.start; }).filter(Boolean).sort();
      var ends = slots.map(function (s) { return s.end; }).filter(Boolean).sort();
      var items = '', blk = null;
      slots.forEach(function (s) {
        if (s.kind !== 'break') sessions++;
        if (s.tbc && !s.speakers.length) return;
        if (s.block !== blk && s.kind !== 'break') { blk = s.block; items += '<li class="blk"><span>' + esc(blk) + '</span></li>'; }
        var who = s.speakers.map(function (p) { return p.name + (p.affiliation ? ' (' + p.affiliation.replace(/,\s*(online|moderator)\s*$/i, '') + ')' : ''); }).join('; ');
        var time = s.start || s.end ? esc(s.start) + '–' + esc(s.end) : '';
        items += '<li class="' + (s.kind === 'break' ? 'row brk' : 'row') + '"><span class="mono tm">' + time + '</span><div class="rb">' +
          '<span class="te">' + esc(s.title || 'Title to be confirmed') + '</span>' + (who ? '<span class="who">' + esc(who) + '</span>' : '') +
          (!who && s.notes ? '<span class="who">' + esc(s.notes) + '</span>' : '') + '</div></li>';
      });
      if (pitches.length) items += '<li class="row"><span class="mono tm">Pitching</span><div class="rb"><span class="who">' + esc(pitches.join(', ')) + '</span></div></li>';
      var venue = (d.venue || '').split(',')[0];
      html += '<div class="day"><h3 class="dayh"><span class="sub">' + esc(d.label) + '</span><span class="mono">' + esc(venue) +
        (starts.length ? ' · ' + esc(starts[0]) + '–' + esc(ends[ends.length - 1]) : '') + '</span></h3><ol class="plist">' + items + '</ol></div>';
    });
    box.innerHTML = html;
    return sessions;
  }

  function renderCounts(n, sessions) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-live="speakers"]'), function (el) {
      el.textContent = el.textContent.replace(/\d+/, String(n));
    });
    var wall = document.getElementById('speakers');
    if (wall) wall.setAttribute('aria-label', n + ' speakers');
    var m = document.querySelector('[data-live="sessions"]');
    if (m) m.textContent = m.textContent.replace(/\d+ Sessions/, sessions + ' Sessions');
  }

  function render(spk, prog) {
    var list = roster(spk, prog);
    if (!list.length) return false;
    renderWall(list);
    renderCounts(list.length, renderProgramme(prog));
    return true;
  }

  /* open/close a face */
  var openTile = null;
  function close(focusBack) {
    if (!openTile) return;
    var t = openTile; openTile = null;
    t.classList.remove('open', 'flip');
    t.querySelector('.disc').hidden = true;
    var b = t.querySelector('.tile-btn'); b.setAttribute('aria-expanded', 'false');
    if (focusBack) b.focus();
  }
  function open(t) {
    close(false);
    openTile = t;
    if (!t.classList.contains('big') && t.offsetLeft + t.offsetWidth * 2 + 1 > grid.clientWidth) t.classList.add('flip');
    t.classList.add('open');
    t.querySelector('.disc').hidden = false;
    t.querySelector('.tile-btn').setAttribute('aria-expanded', 'true');
    t.querySelector('.disc-x').focus({ preventScroll: true });
  }
  grid.addEventListener('click', function (e) {
    var x = e.target.closest('.disc-x');
    if (x) { close(true); return; }
    var b = e.target.closest('.tile-btn');
    if (!b) return;
    var t = b.closest('.tile');
    if (t === openTile) close(true); else open(t);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });

  /* snapshots now, then each sheet as it answers (a failed fetch keeps what is on screen) */
  var speakers = S.buildModel(window.MIRAI_SPEAKERS_SNAPSHOT);
  var program = G.buildModel(window.MIRAI_PROGRAM_SNAPSHOT, speakers);
  render(speakers, program);

  var fetchRows = function (url) {
    return typeof url === 'string' && url ? Sh.fetchCsv(url, { timeout: 6000 }).catch(function (e) { console.warn('[summit] sheet unavailable', url, e); return null; }) : Promise.resolve(null);
  };
  Promise.all([fetchRows(window.MIRAI_SPEAKERS_SHEET_CSV), fetchRows(window.MIRAI_PROGRAM_SHEET_CSV)]).then(function (res) {
    var spkRows = res[0], prgRows = res[1];
    var spk = spkRows && S.buildModel(spkRows);
    if (spk && spk.count) speakers = spk;
    var prg = prgRows && G.buildModel(prgRows, speakers);
    if (prg && prg.days.length) program = prg; else if (spk && spk.count) program = G.buildModel(window.MIRAI_PROGRAM_SNAPSHOT, speakers);
    if ((spk && spk.count) || (prg && prg.days.length)) render(speakers, program);
  });
})();
