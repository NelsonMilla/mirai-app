#!/usr/bin/env python3
"""Build /summit-i/ and /summit-ii/ (the English summit landing pages) from the sheet snapshots.

Run from anywhere:  python3 new-site/scripts/summit-pages.py
Reads speakers-data.js and program-data.js (regenerate those first with `npm run speakers:snapshot`
and `npm run program:snapshot`), borrows the stylesheet from /jp/summit-i/index.html, and rewrites
summit-i/index.html and summit-ii/index.html. Copy lives in this file (P1 and P2 at the bottom).
"""
import json, re, os, html, unicodedata, sys

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JP = open(os.path.join(SITE, 'jp', 'summit-i', 'index.html')).read()
OUT_I = os.path.join(SITE, 'summit-i', 'index.html')
OUT_II = os.path.join(SITE, 'summit-ii', 'index.html')

def load(path):
    s = open(path).read()
    return json.loads(s[s.index('['):s.rindex(']')+1])

SPK = load(os.path.join(SITE, 'speakers-data.js'))
PRG = load(os.path.join(SITE, 'program-data.js'))

def fold(s):
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c)).lower()

def esc(s): return html.escape(str(s), quote=True)

def slug_of(sp):
    return fold(sp['firstname'] + '_' + sp['lastname']).replace(' ', '_').replace('-', '_').replace('.', '')

def day_num(d): return int(d.split()[1])
DOW = {17: 'SAT', 18: 'SUN', 24: 'SAT', 25: 'SUN', 26: 'MON'}

def rows_for(days):
    return [r for r in PRG if r['publish'] != 'FALSE' and day_num(r['day']) in days]

def speaker_rows(sp, rows):
    fn, ln = fold(sp['firstname']), fold(sp['lastname'])
    out = []
    for r in rows:
        s = fold(r['speakers'])
        if ln in s and fn in s: out.append(r)
    return out

# Short organisation lines for the name strips (the Program tab's parentheticals run long in English).
ORG_SHORT = {
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
}

def short_org(sp, rows):
    org = _short_org(sp, rows)
    return ORG_SHORT.get(org, org)

def _short_org(sp, rows):
    fn, ln = fold(sp['firstname']), fold(sp['lastname'])
    for r in rows:
        for tok in re.split(r';', r['speakers']):
            if ln in fold(tok) and fn in fold(tok):
                m = re.search(r'\(([^)]*)\)', tok)
                if m:
                    return re.sub(r',\s*(online|moderator)$', '', m.group(1).strip())
    aff = sp['affiliation']
    return aff.split(';')[0].split(',')[-1].strip() or aff

SEAL = ('<svg class="tile-seal" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><polygon fill="#D0442C" points="96.0,50.0 95.7,57.2 92.3,63.7 90.1,70.4 87.0,76.9 82.5,82.5 76.0,85.9 71.6,92.3 64.3,94.1 57.1,95.1 50.0,95.1 42.6,96.5 35.6,94.3 29.9,89.5 23.0,87.2 18.2,81.8 12.2,77.4 10.2,70.3 6.0,64.3 4.6,57.2 5.3,50.0 6.3,43.1 4.6,35.2 7.3,28.3 14.0,23.9 17.6,17.6 21.9,11.3 29.7,10.1 35.9,6.6 42.8,4.4 50.0,3.3 57.1,5.4 63.8,7.5 71.8,7.3 76.9,13.0 81.8,18.2 87.4,22.9 90.4,29.4 92.4,36.2 96.5,42.6"/>'
        '<text x="50" y="44.2" font-family="\'Dela Gothic One\',sans-serif" font-size="34" fill="#F4F3F0" text-anchor="middle">講</text>'
        '<text x="50" y="80.2" font-family="\'Dela Gothic One\',sans-serif" font-size="34" fill="#F4F3F0" text-anchor="middle">演</text></svg>')
WALL_SEAL = SEAL.replace('class="tile-seal"', 'class="wall-seal"')

def build_roster(tokens, days, first):
    rows = rows_for(days)
    out = []
    for sp in SPK:
        if sp['publish'] == 'FALSE': continue
        toks = [t.strip() for t in sp['sessions'].split(',')]
        if not any(t in tokens for t in toks): continue
        slug = slug_of(sp)
        photo = sp['photo']
        full = f'/img/speakers/{slug}.jpeg'
        thumb = f'/img/speakers/thumb/{slug}.jpeg'
        has = photo != 'none' and os.path.exists(os.path.join(SITE, full.lstrip('/')))
        if not has and photo and photo != 'none' and os.path.exists(os.path.join(SITE, photo.lstrip('/'))):
            full = thumb = photo; has = True
        talks = []
        fn, ln = fold(sp['firstname']), fold(sp['lastname'])
        for r in speaker_rows(sp, rows):
            own = next((t for t in r['speakers'].split(';') if ln in fold(t) and fn in fold(t)), '')
            online = 'online' in fold(r['block']) or 'online' in fold(own)
            talks.append({'day': day_num(r['day']), 'start': r['start'], 'end': r['end'], 'block': r['block'],
                          'title': r['title'], 'panel': r['kind'] == 'panel', 'online': online})
        name = sp['displayname'] or f"{sp['firstname']} {sp['lastname']}"
        out.append({'slug': slug, 'name': name, 'short': f"{sp['firstname']} {sp['lastname']}",
                    'org': short_org(sp, rows), 'aff': sp['affiliation'], 'bio': sp['bio'],
                    'online': 'Online' in sp['sessions'], 'photo': full if has else '', 'thumb': thumb if has else '',
                    'talks': talks, 'sheet_talk': sp['talk']})
    by = {s['slug']: s for s in out}
    ordered = [by[s] for s in first if s in by] + [s for s in out if s['slug'] not in first]
    return ordered

def main_talk(s):
    t = [x for x in s['talks'] if not x['panel'] and 'to be confirmed' not in x['title'].lower()]
    if t: return t[0]['title']
    if s['sheet_talk']: return s['sheet_talk']
    return s['talks'][0]['title'] if s['talks'] else ''

def tile(s, i):
    big, eager = i < 5, i < 2
    cls = 'tile' + (' big' if big else '') + (' t1' if i == 0 else '') + (' t2' if i == 1 else '') + (' xl' if i == 3 else '')
    if s['photo']:
        img = f'<img src="{s["photo"] if big else s["thumb"]}" alt="" {"width=\"800\" height=\"1000\"" if big else "width=\"256\" height=\"256\""}{" fetchpriority=\"high\"" if eager else " loading=\"lazy\""} decoding="async">'
    else:
        img = f'<span class="ini" aria-hidden="true">{esc(initials(s))}</span>'
    tk = f'<span class="tk">{esc(main_talk(s))}</span>' if big and main_talk(s) else ''
    on = '<span class="on">Online</span>' if s['online'] else ''
    return (f'<div class="{cls}" data-slug="{s["slug"]}"><div class="tile-btn"><div class="pic">{img}</div>'
            f'<span class="strip"><span class="nm">{esc(s["short"])}</span><span class="org">{esc(s["org"])}</span>{on}{tk}</span></div></div>')

def initials(s):
    w = s['short'].split()
    return (w[0][0] + w[-1][0]).upper() if len(w) > 1 else w[0][0].upper()

def programme(days, blocks_title):
    out = []
    for d in days:
        rows = [r for r in rows_for([d]) if r['kind'] != 'pitch']
        pitches = [r['title'] for r in rows_for([d]) if r['kind'] == 'pitch']
        starts = [r['start'] for r in rows if r['start'] and r['start'] != '-']
        ends = [r['end'] for r in rows if r['end'] and r['end'] != '-']
        label = rows[0]['day'] if rows else ''
        venue = next((r['venue'] for r in rows if r['venue']), '')
        items, blk = [], None
        for r in rows:
            if r['title'].lower().startswith('title to be confirmed') and not r['speakers']: continue
            if r['block'] != blk and r['kind'] != 'break':
                blk = r['block']
                items.append(f'<li class="blk"><span>{esc(blk)}</span></li>')
            who = re.sub(r'\s*\((online|moderator)\)', '', r['speakers'])
            who = f'<span class="who">{esc(who)}</span>' if who else ''
            cls = 'row brk' if r['kind'] == 'break' else 'row'
            items.append(f'<li class="{cls}"><span class="mono tm">{esc(r["start"])}–{esc(r["end"])}</span><div class="rb"><span class="te">{esc(r["title"])}</span>{who}</div></li>')
        if pitches:
            items.append(f'<li class="row"><span class="mono tm">Pitching</span><div class="rb"><span class="who">{esc(", ".join(pitches))}</span></div></li>')
        wk = label.split()[0]
        out.append(f'''      <div class="day">
        <h3 class="dayh"><span class="sub">{esc(wk)} {d} October</span><span class="mono">{esc(venue.split(",")[0]) if venue else ""} · {min(starts)}–{max(ends)}</span></h3>
        <ol class="plist">{"".join(items)}</ol>
      </div>''')
    return '\n'.join(out)

def session_count(days):
    return len([r for r in rows_for(days) if r['kind'] not in ('break', 'pitch')])

CSS = JP[JP.index('<style>'):JP.index('</style>') + 8]
CSS = CSS.replace('</style>', '''
/* english pages */
/* English runs longer than Japanese: the headline panel may grow past two tile rows, and the
   name strips wrap to two lines instead of cutting mid-word. */
.grid{grid-template-rows:minmax(var(--t),auto) minmax(var(--t),auto) 40px}
@media(max-width:1279px){.grid{grid-template-rows:minmax(var(--t),auto) minmax(var(--t),auto) 36px}}
@media(max-width:999px){.grid{grid-template-rows:minmax(var(--t),auto) minmax(var(--t),auto) auto 32px}}
@media(max-width:699px){.grid{grid-template-rows:minmax(var(--t),auto) auto 28px}}
.strip .org,.big .strip .tk{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
/* Cards: the portrait is a square on top and the name sits under it on ink, never over the face.
   Rows size to content, so the grid no longer forces the tile height. */
.grid{grid-template-rows:auto auto 40px;grid-auto-rows:auto;align-items:stretch}
@media(max-width:1279px){.grid{grid-template-rows:auto auto 36px}}
@media(max-width:999px){.grid{grid-template-rows:auto auto auto 32px}}
@media(max-width:699px){.grid{grid-template-rows:auto auto 28px}}
@media(min-width:1000px){.tile.xl{grid-column:span 2;grid-row:span 2}}
.tile{display:flex;flex-direction:column}
.tile-btn{display:flex;flex-direction:column;height:auto;flex:1}
.tile .pic{position:relative;width:100%;aspect-ratio:1;flex:none;overflow:hidden;background:#141416}
.tile .pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 18%}
.tile .pic .ini{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--dela);font-size:clamp(28px,8cqw,56px);line-height:1;letter-spacing:-.02em;color:rgba(244,243,240,.5)}
.big .pic .ini{font-size:clamp(48px,14cqw,112px)}
.strip{position:static;flex:1;padding:8px 8px 10px;background:var(--sumi)}
.big .strip{padding:12px 14px 14px}
.strip .nm{white-space:normal}
@media(max-width:699px){.t1 .strip,.t2 .strip{padding:8px 8px 10px}}
/* phones: every face the same size, two per row; the talk line waits for the disclosure */
@media(max-width:699px){.tile.big{grid-column:span 1;grid-row:span 1}.big .strip{padding:8px 8px 10px}.big .nm{font-size:13px}.big .org{font-size:11px}.big .strip .tk{display:none}}
@media(max-width:699px){.t1 .strip .tk,.t2 .strip .tk{display:none}}
.h1 .ln{white-space:nowrap}
@media(max-width:699px){.h1{font-size:clamp(28px,9cqw,56px)}}
.note .lnk{margin-left:0}
.days.three{gap:40px var(--g)}
@media(min-width:900px){.days.three{grid-template-columns:1fr 1fr}}
@media(min-width:1200px){.days.three{grid-template-columns:1fr 1fr 1fr}}
.note{font-size:17px;font-weight:700;line-height:1.4}
.note .lnk{font-weight:500;margin-left:.5em;padding:6px 0}
.koma.main .price{margin-top:4px}
.koma.main .lead2{font-size:19px;line-height:1.5;font-weight:700;max-width:30em}
.koma.side .price2 small{display:block;font-weight:500;font-size:15px;line-height:1.4;margin-top:6px}
.vlist{list-style:none;display:flex;flex-direction:column;gap:14px}
.vlist li{border-top:1px solid rgba(5,5,6,.25);padding-top:12px;display:flex;flex-direction:column;gap:4px}
.vlist .vname{font-size:19px}
</style>''')

JS = r'''<script>
(function(){
  var grid = document.getElementById('grid');
  if (!grid) return;
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var SEAL = %(seal)s;
  var DOW = {17:'SAT', 18:'SUN', 24:'SAT', 25:'SUN', 26:'MON'};
  function mainTalk(s){ var t = s.talks.filter(function(t){ return !t.panel && t.title.toLowerCase().indexOf('to be confirmed') < 0; }); if (t[0]) return t[0].title; if (s.sheet_talk) return s.sheet_talk; return s.talks[0] ? s.talks[0].title : ''; }
  function tile(s, i){
    var big = i < 5, eager = i < 2;
    var cls = 'tile' + (big ? ' big' : '') + (i === 0 ? ' t1' : '') + (i === 1 ? ' t2' : '') + (i === 3 ? ' xl' : '');
    var w = s.short.split(/\s+/), ini = (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
    var img = '<div class="pic">' + (s.photo
      ? '<img src="' + (big ? s.photo : s.thumb) + '" alt="" ' + (big ? 'width="800" height="1000"' : 'width="256" height="256"') + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">'
      : '<span class="ini" aria-hidden="true">' + esc(ini) + '</span>') + '</div>';
    var talks = s.talks.map(function(t){
      return '<li><span class="mono">10.' + t.day + ' ' + DOW[t.day] + ' ' + t.start + '–' + t.end + (t.online ? ' · ONLINE' : '') + '</span>' +
        '<span class="te">' + esc(t.title) + '</span></li>';
    }).join('');
    var ph = s.thumb ? '<img src="' + s.thumb + '" alt="" width="56" height="56" loading="lazy" decoding="async">' : '<span class="ph">' + SEAL + '</span>';
    return '<div class="' + cls + '" data-slug="' + s.slug + '">' +
      '<button class="tile-btn" type="button" aria-expanded="false" aria-controls="d-' + s.slug + '">' + img +
        '<span class="strip"><span class="nm">' + esc(s.short) + '</span><span class="org">' + esc(s.org) + '</span>' + (s.online ? '<span class="on">Online</span>' : '') + (big && mainTalk(s) ? '<span class="tk">' + esc(mainTalk(s)) + '</span>' : '') + '</span>' +
      '</button>' +
      '<div class="disc" id="d-' + s.slug + '" hidden>' +
        '<div class="disc-top">' + ph + '<div><span class="disc-nm">' + esc(s.name) + '</span><span class="disc-org">' + esc(s.aff) + (s.online ? ' (online)' : '') + '</span></div>' +
        '<button class="disc-x" type="button">Close</button></div>' +
        (talks ? '<ul class="talks">' + talks + '</ul>' : '') +
        (s.bio ? '<p class="desc">' + esc(s.bio) + '</p>' : '') +
      '</div></div>';
  }
  var head = grid.querySelector('.head'), obi = grid.querySelector('.obi');
  Array.prototype.forEach.call(grid.querySelectorAll('.tile'), function(n){ n.remove(); });
  var html = SPEAKERS.map(tile);
  head.insertAdjacentHTML('beforebegin', html[0] + html[1]);
  obi.insertAdjacentHTML('afterend', html.slice(2).join(''));

  var openTile = null;
  function close(focusBack){
    if (!openTile) return;
    var t = openTile; openTile = null;
    t.classList.remove('open', 'flip');
    t.querySelector('.disc').hidden = true;
    var b = t.querySelector('.tile-btn'); b.setAttribute('aria-expanded', 'false');
    if (focusBack) b.focus();
  }
  function open(t){
    close(false);
    openTile = t;
    if (!t.classList.contains('big') && t.offsetLeft + t.offsetWidth * 2 + 1 > grid.clientWidth) t.classList.add('flip');
    t.classList.add('open');
    t.querySelector('.disc').hidden = false;
    t.querySelector('.tile-btn').setAttribute('aria-expanded', 'true');
    t.querySelector('.disc-x').focus({preventScroll:true});
  }
  grid.addEventListener('click', function(e){
    var x = e.target.closest('.disc-x');
    if (x) { close(true); return; }
    var b = e.target.closest('.tile-btn');
    if (!b) return;
    var t = b.closest('.tile');
    if (t === openTile) close(true); else open(t);
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(true); });
})();
</script>''' % {'seal': json.dumps(SEAL)}

PARTNERS = '''<!-- PARTNERS: the same set as /jp/summit-i/. Kobe University and MIC logos are used verbatim under an
     approval that runs to Dec 15 2026 ([data-kobe-permit] self-hides after that). KBIC is never listed as host. -->
<section class="partners" id="partners" data-track-section="partners" data-track-position="3">
  <div class="wrap">
    <h2 class="sub">Partners</h2>
    <p class="intro">%(intro)s</p>
    <div class="ptier">
      <h3>Summit partners</h3>
      <div class="pgrid">
        <a class="ptile" href="https://alv.vc/" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="partners" data-analytics-target="asagi_labs_ventures">
          <span class="plate"><img class="stamp fill" src="/img/partners/asagi-labs-ventures.png" alt="" loading="lazy" decoding="async"></span>
          <span class="pmeta"><span class="pnm">ASAGI Labs Ventures</span><span class="pln">Venture capital for longevity science.</span></span>
        </a>
        <span class="ptile">
          <span class="plate"><img class="gray" src="/img/partners/unchain-biomedical.png" alt="" loading="lazy" decoding="async" style="max-width:60%%"></span>
          <span class="pmeta"><span class="pnm">Unchain Biomedical</span><span class="pln">Regenerative medicine for patients in Japan, through licensed clinics.</span></span>
        </span>
        <a class="ptile" href="https://bizgate.nikkei.com/projects/BSH14014/" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="partners" data-analytics-target="nikkei_longevity_project">
          <span class="plate"><img class="stamp" src="/img/partners/nikkei-longevity-project.png" alt="" loading="lazy" decoding="async"></span>
          <span class="pmeta"><span class="pnm">Nikkei Longevity Project</span><span class="pln">Media partner. Nikkei's project on a society of healthy long lives.</span></span>
        </a>
      </div>
    </div>
    <div class="ptier">
      <h3>With the support of</h3>
      <div class="pgrid five">
        <a class="ptile" href="https://www.hosp.kobe-u.ac.jp/ikoujiso/" target="_blank" rel="noopener" data-kobe-permit data-analytics-action="site_navigation" data-analytics-location="partners" data-analytics-target="kobe_university">
          <span class="plate"><img src="/img/partners/kobe-university.png" alt="" loading="lazy" decoding="async"></span>
          <span class="pmeta"><span class="pnm">Kobe University</span><span class="pln">%(kobe)s</span></span>
        </a>
        <a class="ptile" href="https://www.med.kobe-u.ac.jp/mic/" target="_blank" rel="noopener" data-kobe-permit data-analytics-action="site_navigation" data-analytics-location="partners" data-analytics-target="mic_kobe_university">
          <span class="plate"><img class="screen" src="/img/partners/mic-kobe-university.png" alt="" loading="lazy" decoding="async"></span>
          <span class="pmeta"><span class="pnm">Kobe University MedTech Innovation Center (MIC)</span><span class="pln">Medical device development on Port Island.</span></span>
        </a>
        <a class="ptile" href="https://www.fbri-kobe.org/kbic/" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="partners" data-analytics-target="kbic">
          <span class="plate"><img class="stamp" src="/img/partners/kbic.svg" alt="" loading="lazy" decoding="async"></span>
          <span class="pmeta"><span class="pnm">Kobe Biomedical Innovation Cluster (KBIC)</span><span class="pln">Japan's largest biomedical cluster. More than 370 companies and institutions.</span></span>
        </a>
        <a class="ptile" href="https://www.heka.bio/" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="partners" data-analytics-target="hekabio">
          <span class="plate"><img class="stamp" src="/img/partners/hekabio.png" alt="" loading="lazy" decoding="async"></span>
          <span class="pmeta"><span class="pnm">HekaBio</span><span class="pln">Brings overseas biopharma and medical devices to Japan and Asia-Pacific.</span></span>
        </a>
        <span class="ptile">
          <span class="plate"><img class="stamp" src="/img/partners/cic-japan.png" alt="" loading="lazy" decoding="async"></span>
          <span class="pmeta"><span class="pnm">CIC Japan</span><span class="pln">Startup campuses in Tokyo, Osaka and Fukuoka.</span></span>
        </span>
      </div>
    </div>
  </div>
</section>'''

def page(P):
    roster = P['roster']
    n = len(roster)
    tiles = ''.join(tile(s, i) for i, s in enumerate(roster[:2]))
    rest = ''.join(tile(s, i + 2) for i, s in enumerate(roster[2:14]))
    buy = lambda loc, label: (f'<a class="btn mizu" href="{P["stripe"]}" target="_blank" rel="noopener" data-analytics-action="checkout" '
                              f'data-analytics-target="{P["offer"]}" data-analytics-location="{loc}">{label}</a>')
    data = [{k: s[k] for k in ('slug', 'name', 'short', 'org', 'aff', 'bio', 'online', 'photo', 'thumb', 'talks', 'sheet_talk')} for s in roster]
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(P["title"])}</title>
<meta name="description" content="{esc(P["desc"])}">
<meta property="og:title" content="{esc(P["og_title"])}">
<meta property="og:description" content="{esc(P["desc"])}">
<meta property="og:image" content="https://www.miraitech.city{P["og_image"]}">
<meta property="og:url" content="https://www.miraitech.city{P["path"]}">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#050506">
<link rel="canonical" href="https://www.miraitech.city{P["path"]}">
{P["alt_link"]}<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23050506'/%3E%3Ctext x='50' y='72' font-size='62' font-family='Georgia' font-weight='bold' fill='%239be8f0' text-anchor='middle'%3E未%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Murecho:wght@400;500;700;900&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<script>window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};</script>
<script defer src="/_vercel/insights/script.js"></script>
<script defer src="/posthog.js"></script>
<script defer src="/analytics.js"></script>
<script>if (Date.now() >= new Date('2026-12-15T00:00:00+09:00').getTime()) document.documentElement.classList.add('kobe-permit-over');</script>
{CSS}
</head>
<body data-analytics-offer="{P["offer"]}">

<header class="nav">
  <a class="wm" href="/" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="full_city">Mirai Tech City<img src="/img/brand/seal-mirai-solid.png" alt="" width="240" height="240"><span class="sr"> home</span></a>
  <nav class="nav-links" aria-label="Site">
    <a class="mono" href="/program/" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="program">Program</a>
    <a class="mono" href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="pricing">Pricing</a>
    <a class="mono" href="{P["jp_href"]}" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="japan">日本語</a>
  </nav>
  <a class="btn mizu" href="{P["stripe"]}" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-target="{P["offer"]}" data-analytics-location="nav"><span class="full">Get my ticket · </span>$900</a>
</header>

<main>
<!-- THE WALL: {n} faces, headline panel, obi, seal. The script below replaces the static tiles with the full roster. -->
<section class="wall" id="speakers" data-track-section="offer" data-track-position="1" aria-label="{n} speakers">
  <div class="grid" id="grid">
    {WALL_SEAL}
    {tiles}
    <div class="head">
      <h1 class="h1">{P["h1"]}</h1>
      <p class="lead">{P["lead"]}</p>
      <div class="cta">
        {buy("hero", "Get my ticket · $900")}
        <span class="mono">{P["when_mono"]}</span>
      </div>
      <p class="note">{P["note"]}</p>
    </div>
    <div class="obi" aria-hidden="true"><span class="mono long">{P["obi_long"]}</span><span class="mono short">{P["obi_short"]}</span></div>
    {rest}
  </div>
</section>

<!-- TICKET -->
<section class="ticket" id="ticket" data-track-section="ticket" data-track-position="2">
  <div class="wrap koma-grid">
    <div class="koma main">
      <h2 class="sub">{P["ticket_h"]}</h2>
      <p class="price">$900</p>
      <p class="lead2">{P["ticket_lead"]}</p>
      <ul class="facts">
{P["ticket_facts"]}
      </ul>
      <div class="cta">
        {buy("ticket", "Get my ticket")}
        <span class="mono">Stripe · USD · {P["dates_mono"]}</span>
      </div>
    </div>
    <div class="koma side">
      <h3 class="sub">The whole month</h3>
      <p class="price2">$1,200 <small>The PopUp: both summits, Demo Day and the month on Port Island, October 1–31.</small></p>
      <ul class="facts">
        <li>Arrive any day. Everything through October 31.</li>
        <li>Accommodation is booked separately.</li>
      </ul>
      <a class="btn shu" href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="ticket" data-analytics-target="pricing">See all tickets</a>
    </div>
    <div class="rows">
      <p>{P["resident_row"]}</p>
      <p>Teams at KBIC and Kobe University have free seats. Write to <a class="lnk" href="mailto:team@miraitech.city" data-analytics-action="alternative_offer" data-analytics-target="{P["offer"]}_access_email">team@miraitech.city</a> to check if you qualify.</p>
    </div>
  </div>
</section>

{PARTNERS % P}

<!-- PROGRAMME: from program-data.js (the Program tab of the sheet). Full timetable on /program/. -->
<section class="prog" id="program" data-track-section="program" data-track-position="4">
  <div class="wrap">
    <div class="top"><h2 class="sub">Programme</h2><span class="mono">{len(P["days"])} Days · {session_count(P["days"])} Sessions · JST</span><a class="lnk" href="/program/" data-analytics-action="site_navigation" data-analytics-location="program" data-analytics-target="program">Full programme</a></div>
    <div class="days{" three" if len(P["days"]) == 3 else ""}">
{programme(P["days"], None)}
    </div>
  </div>
</section>

<!-- VENUE -->
<section class="venue" id="venue" data-track-section="venue" data-track-position="5">
  <div class="wrap venue-grid">
    <div class="vtext">
      <h2 class="sub">{P["venue_h"]}</h2>
{P["venue_body"]}
    </div>
    <figure class="tape-fig">
      <div class="fr"><img src="{P["venue_img"]}" alt="{esc(P["venue_alt"])}" width="{P["venue_w"]}" height="{P["venue_h_px"]}" loading="lazy" decoding="async"></div>
      <span class="tape" aria-hidden="true"></span>
      <figcaption class="mono">{P["venue_cap"]}</figcaption>
    </figure>
  </div>
</section>

<!-- FINAL -->
<section class="final" data-track-section="final_offer" data-track-position="6">
  <span class="wmk" aria-hidden="true">未来</span>
  <div class="wrap final-grid">
    <div class="ftext">
      <h2 class="sub">Get your ticket.</h2>
      <p>{P["final_p"]}</p>
      {buy("final_offer", "Get my ticket · $900")}
      <span class="mono">Stripe · $900 · {P["dates_mono"]}</span>
    </div>
    <figure class="tape-fig">
      <div class="fr"><img src="{P["final_img"]}" alt="{esc(P["final_alt"])}" width="{P["final_w"]}" height="{P["final_h_px"]}" loading="lazy" decoding="async"></div>
      <span class="tape" aria-hidden="true"></span>
      <figcaption class="mono">{P["final_cap"]}</figcaption>
    </figure>
  </div>
</section>
</main>

<footer class="foot">
  <div class="wrap cols">
    <ul>
      <li><a href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="pricing">Pricing</a></li>
      <li><a href="/program/" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="program">Program</a></li>
      <li><a href="{P["sibling_href"]}" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="{P["sibling_target"]}">{P["sibling_label"]}</a></li>
      <li><a href="{P["jp_href"]}" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="japan">日本語</a></li>
      <li><a href="mailto:team@miraitech.city">team@miraitech.city</a></li>
      <li><a href="/" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="full_city">miraitech.city</a></li>
    </ul>
    <p>Organised by the Mirai Tech City committee.</p>
    <p>Held with Kobe University Hospital and the Kobe University Graduate School of Medicine, the MedTech Innovation Center (MIC), ASAGI Labs / ASAGI Labs Ventures, Antler Japan, Nucleate Japan and JETRO.</p>
    <span class="mono">{P["photo_credits"]}</span>
  </div>
</footer>

<div class="sticky" aria-label="Ticket">
  <span class="lbl">$900 · {P["sticky_dates"]}</span>
  {buy("sticky", "Get my ticket")}
</div>

<script>
const SPEAKERS = {json.dumps(data, ensure_ascii=False, indent=1)};
</script>
{JS}
</body>
</html>
'''

# ---------- Summit I ----------
R1 = build_roster({'S1'}, [17, 18], ['motoshi_hayano', 'takashi_aoi', 'eleanor_sheekey', 'walter_patterson', 'yoshihiro_muragaki'])
n1 = len(R1)
P1 = dict(
    roster=R1, path='/summit-i/', offer='summit_1', stripe='https://buy.stripe.com/dRmdRb1Kc9bn7Dx80C3Nm05',
    title=f'Mirai Tech City Summit I · 17–18 October 2026 · Kobe · {n1} speakers',
    og_title='Mirai Tech City Summit I · Oct 17–18 · Kobe',
    desc=f'Summit I: The Science and Tech Augmenting Life. Saturday 17 and Sunday 18 October 2026 at Kobe University Integrated Research Center, Port Island. {n1} speakers. Tickets $900 on Stripe.',
    og_image='/img/summit-pathologist.jpg',
    alt_link='<link rel="alternate" hreflang="ja" href="https://www.miraitech.city/jp/summit-i/">\n',
    jp_href='/jp/summit-i/',
    h1=f'<span class="ln">{n1} speakers</span> <span class="ln">on ageing</span> <span class="ln">and medicine.</span> <span class="ln">Two days</span> <span class="ln">in Kobe.</span>',
    lead='Mirai Tech City Summit I: The Science and Tech Augmenting Life. Saturday 17 and Sunday 18 October 2026, Kobe University Integrated Research Center, Port Island. All talks in English.',
    when_mono='10.17 SAT · 10.18 SUN · 11:00–20:30 JST',
    note='Live in Japan? <a class="lnk" href="/jp/summit-i/" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="hero" data-analytics-target="japan">日本居住者向けチケット ¥6,000 →</a>',
    obi_long=f'2026.10.17 SAT · 10.18 SUN · 11:00–20:30 JST · KOBE PORT ISLAND · {n1} SPEAKERS · $900',
    obi_short=f'10.17–18 · KOBE · {n1} SPEAKERS · $900',
    ticket_h='Summit I ticket', dates_mono='2026.10.17–18', sticky_dates='Oct 17–18',
    ticket_lead='Every talk and panel on both days, and the networking and drinks each evening.',
    ticket_facts='        <li>Saturday 17 and Sunday 18 October, 11:00–20:30.</li>\n        <li>Kobe University Integrated Research Center, Port Island.</li>\n        <li>Talks are in English.</li>\n        <li>Hotel and transportation are not included.</li>',
    resident_row='Residents of Japan have a ¥6,000 ticket on Peatix, and students go free with a student ID. <a class="lnk" href="/jp/summit-i/" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="ticket" data-analytics-target="japan">日本語ページへ →</a>',
    intro='Summit I is held with universities, research institutes and companies in Kobe and across Japan.',
    kobe='Host of Summit I at its Integrated Research Center.',
    days=[17, 18],
    venue_h='Venue',
    venue_body='''      <p class="vname">Kobe University Integrated Research Center, Convention Hall</p>
      <p>7-1-48 Minatojima-minamimachi, Chuo-ku, Kobe 650-0047</p>
      <p>One minute on foot from Keisan Kagaku Center station on the Port Liner. About 15 minutes from Sannomiya.</p>
      <p>Doors open at 11:00. Talks run to about 19:10, then networking and drinks until 20:30, both days.</p>
      <p>The Kobe Biomedical Innovation Cluster (KBIC), Japan's largest biomedical cluster, and the Fugaku supercomputer are on the same island.</p>
      <p><a class="lnk" href="https://maps.app.goo.gl/mXhV3fUvzCiEUmVL7" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="venue" data-analytics-target="venue_map">Open in Google Maps</a></p>
      <span class="mono">34.6543396 N · 135.2213202 E · Port Liner K Computer Mae</span>''',
    venue_img='/img/pillar-portliner.webp', venue_alt='A Port Liner train', venue_w=960, venue_h_px=643,
    venue_cap='Fig. 01 · Port Liner · one minute from Keisan Kagaku Center station',
    final_p=f'Summit I ticket, $900. Saturday 17 and Sunday 18 October, Kobe University Integrated Research Center, Port Island. {n1} speakers.',
    final_img='/img/pillar-portisland-aerial-640.webp', final_alt='Port Island from the air', final_w=640, final_h_px=427,
    final_cap='Fig. 02 · Port Island · Kobe harbour from the air',
    photo_credits='Photos · Fig. 01 Port Liner · 663highland · CC BY 2.5 · Fig. 02 Port Island aerial · 663highland · CC BY 2.5',
    sibling_href='/summit-ii/', sibling_target='summit_2', sibling_label='Summit II · Oct 24–26',
)

# ---------- Summit II ----------
R2 = build_roster({'S2', 'F'}, [24, 25, 26], ['aubrey_de_grey', 'masataka_watanabe', 'jose_cordeiro', 'mac_davis', 'natalie_coles_de_grey'])
# Joe Betts-LaCroix is never placed beside Aubrey de Grey or the LEV Foundation: he goes last on the wall.
R2 = [s for s in R2 if s['slug'] != 'joe_betts_lacroix'] + [s for s in R2 if s['slug'] == 'joe_betts_lacroix']
n2 = len(R2)
P2 = dict(
    roster=R2, path='/summit-ii/', offer='summit_2', stripe='https://buy.stripe.com/00wcN774wbjv8HBdkW3Nm06',
    title=f'Mirai Tech City Summit II · 24–26 October 2026 · Kobe · {n2} speakers',
    og_title='Mirai Tech City Summit II · Oct 24–26 · Kobe',
    desc=f'Summit II: From East to West, Bridging the Longevity Gap, plus Demo Day. Saturday 24 to Monday 26 October 2026 in Kobe. {n2} speakers. Tickets $900 on Stripe.',
    og_image='/img/early-bird-bridge.jpg',
    alt_link='',
    jp_href='/jp/',
    h1=f'<span class="ln">{n2} speakers</span> <span class="ln">on longevity.</span> <span class="ln">Three days</span> <span class="ln">in Kobe.</span>',
    lead='Mirai Tech City Summit II: From East to West, Bridging the Longevity Gap. Saturday 24 and Sunday 25 October on Port Island, Demo Day on Monday 26 October at Orbis Hall. All talks in English.',
    when_mono='10.24 SAT · 10.25 SUN · 10.26 MON · JST',
    note='Live in Japan? <a class="lnk" href="https://miraitechcity2026.peatix.com/" target="_blank" rel="noopener" lang="ja" hreflang="ja" data-analytics-action="checkout" data-analytics-location="hero" data-analytics-target="japan_resident">サミットⅡ 参加チケット ¥6,000 →</a>',
    obi_long=f'2026.10.24 SAT · 10.25 SUN · 10.26 MON · JST · KOBE · {n2} SPEAKERS · DEMO DAY · $900',
    obi_short=f'10.24–26 · KOBE · {n2} SPEAKERS · $900',
    ticket_h='Summit II ticket', dates_mono='2026.10.24–26', sticky_dates='Oct 24–26',
    ticket_lead='Every talk and panel on all three days, Demo Day, and the networking each evening.',
    ticket_facts='        <li>Saturday 24 and Sunday 25 October on Port Island, 11:00–20:30.</li>\n        <li>Monday 26 October: Demo Day at Orbis Hall, Rokko Island, 12:00–20:30.</li>\n        <li>Talks are in English.</li>\n        <li>Hotel and transportation are not included.</li>',
    resident_row='Residents of Japan have a ¥6,000 ticket on Peatix. <a class="lnk" href="https://miraitechcity2026.peatix.com/" target="_blank" rel="noopener" lang="ja" hreflang="ja" data-analytics-action="checkout" data-analytics-location="ticket" data-analytics-target="japan_resident">Peatixで申し込む →</a>',
    intro='Summit II is held with universities, research institutes and companies in Kobe and across Japan.',
    kobe='Host of the Saturday sessions at its Integrated Research Center.',
    days=[24, 25, 26],
    venue_h='Venues',
    venue_body='''      <ul class="vlist">
        <li><span class="mono">Saturday 24 October</span><span class="vname">Kobe University Integrated Research Center, Convention Hall</span><span>7-1-48 Minatojima-minamimachi, Chuo-ku, Kobe. One minute from Keisan Kagaku Center station on the Port Liner. <a class="lnk" href="https://maps.app.goo.gl/mXhV3fUvzCiEUmVL7" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="venue" data-analytics-target="venue_map">Map</a></span></li>
        <li><span class="mono">Sunday 25 October</span><span class="vname">Kobe Portopia Hotel</span><span>10-1 Minatojima-nakamachi 6-chome, Chuo-ku, Kobe. Next to Shimin Hiroba station on the Port Liner. <a class="lnk" href="https://www.google.com/maps/search/?api=1&amp;query=Kobe+Portopia+Hotel" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="venue" data-analytics-target="venue_map">Map</a></span></li>
        <li><span class="mono">Monday 26 October · Demo Day</span><span class="vname">Orbis Hall, Kobe Fashion Museum 5F, Rokko Island</span><span>2-9-1 Koyocho-naka, Higashinada-ku, Kobe. Island Center station on the Rokko Liner. <a class="lnk" href="https://www.google.com/maps/search/?api=1&amp;query=Kobe+Fashion+Museum+Orbis+Hall" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="venue" data-analytics-target="venue_map">Map</a></span></li>
      </ul>
      <p>Doors open at 11:00 on the Saturday and Sunday, 12:00 on the Monday. Networking and drinks run to 20:30 each day.</p>''',
    venue_img='/img/pillar-portisland-aerial-640.webp', venue_alt='Port Island from the air', venue_w=640, venue_h_px=427,
    venue_cap='Fig. 01 · Port Island · Kobe harbour from the air',
    final_p=f'Summit II ticket, $900. Saturday 24 to Monday 26 October: two days of talks on Port Island and Demo Day at Orbis Hall. {n2} speakers.',
    final_img='/img/pillar-portliner.webp', final_alt='A Port Liner train', final_w=960, final_h_px=643,
    final_cap='Fig. 02 · Port Liner · the line between Sannomiya and Port Island',
    photo_credits='Photos · Fig. 01 Port Island aerial · 663highland · CC BY 2.5 · Fig. 02 Port Liner · 663highland · CC BY 2.5',
    sibling_href='/summit-i/', sibling_target='summit_1', sibling_label='Summit I · Oct 17–18',
)

for out, P in ((OUT_I, P1), (OUT_II, P2)):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w').write(page(P))
    print(out, len(P['roster']), 'speakers;', sum(1 for s in P['roster'] if not s['photo']), 'without photo;',
          sum(1 for s in P['roster'] if not s['talks']), 'without a matched session')
    for s in P['roster']:
        if not s['talks']: print('   no session match:', s['short'])
