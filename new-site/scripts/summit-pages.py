#!/usr/bin/env python3
"""Build the shells of /summit-i/ and /summit-ii/ (the English summit landing pages).

Run from anywhere:  python3 new-site/scripts/summit-pages.py
The wall of faces and the programme are rendered in the browser by summit-live.js from the
Speakers and Program tabs of the sheet (snapshot first, then the live sheet), so this script
only writes the page: copy, ticket, partners, venue, and the speaker and session counts that
sit in the static text (the browser corrects those too). It borrows the stylesheet from
/jp/summit-i/index.html. Copy lives in this file (P1 and P2 at the bottom).
"""
import json, re, os, html

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JP = open(os.path.join(SITE, 'jp', 'summit-i', 'index.html')).read()
OUT_I = os.path.join(SITE, 'summit-i', 'index.html')
OUT_II = os.path.join(SITE, 'summit-ii', 'index.html')

def load(path):
    s = open(path).read()
    return json.loads(s[s.index('['):s.rindex(']')+1])

SPK = load(os.path.join(SITE, 'speakers-data.js'))
PRG = load(os.path.join(SITE, 'program-data.js'))

def esc(s): return html.escape(str(s), quote=True)

HIDDEN = ('false', 'no', '0', 'hidden')

# The same reading of the sheet as speakers.js and program.js, reduced to what the counts need.
def speaker_count(tokens):
    n = 0
    for r in SPK:
        if not r.get('firstname', '').strip() or r.get('publish', '').strip().lower() in HIDDEN: continue
        have = [t for t in re.split(r'[^A-Za-z0-9]+', r.get('sessions', '')) if t]
        if any(t in tokens for t in have): n += 1
    return n

DATE_RE = re.compile(r'^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:\s*\(([A-Za-z]{3})[A-Za-z]*\))?(?:\s+(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2}))?')

def norm(r):
    if r.get('day', '').strip():
        return {'day': int(re.search(r'\d{1,2}', r['day']).group()), 'kind': r.get('kind', '').strip().lower()}
    m = DATE_RE.match(r.get('date', '').strip())
    if not m: return None
    b, t = r.get('blocktitle', '').strip().lower(), r.get('title', '').strip().lower()
    brk = re.match(r'^(break|networking|registration|lunch|coffee)', b) or re.match(r'^(break|networking|lunch)\b', t)
    return {'day': int(m.group(2)), 'kind': 'break' if brk else ''}

def session_count(days):
    n = 0
    for r in PRG:
        if r.get('publish', '').strip().lower() in HIDDEN: continue
        s = norm(r)
        if s and s['day'] in days and s['kind'] not in ('break', 'pitch'): n += 1
    return n

SEAL = ('<svg class="wall-seal" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><polygon fill="#D0442C" points="96.0,50.0 95.7,57.2 92.3,63.7 90.1,70.4 87.0,76.9 82.5,82.5 76.0,85.9 71.6,92.3 64.3,94.1 57.1,95.1 50.0,95.1 42.6,96.5 35.6,94.3 29.9,89.5 23.0,87.2 18.2,81.8 12.2,77.4 10.2,70.3 6.0,64.3 4.6,57.2 5.3,50.0 6.3,43.1 4.6,35.2 7.3,28.3 14.0,23.9 17.6,17.6 21.9,11.3 29.7,10.1 35.9,6.6 42.8,4.4 50.0,3.3 57.1,5.4 63.8,7.5 71.8,7.3 76.9,13.0 81.8,18.2 87.4,22.9 90.4,29.4 92.4,36.2 96.5,42.6"/>'
        '<text x="50" y="44.2" font-family="\'Dela Gothic One\',sans-serif" font-size="34" fill="#F4F3F0" text-anchor="middle">講</text>'
        '<text x="50" y="80.2" font-family="\'Dela Gothic One\',sans-serif" font-size="34" fill="#F4F3F0" text-anchor="middle">演</text></svg>')

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
    n = P['n']
    if P.get('past'):
        buy = lambda loc, label: (f'<a class="btn mizu" href="/summit-ii/" data-analytics-action="site_navigation" '
                                  f'data-analytics-target="summit_2" data-analytics-location="{loc}">Summit II tickets · $900</a>')
    else:
        buy = lambda loc, label: (f'<a class="btn mizu" href="{P["stripe"]}" target="_blank" rel="noopener" data-analytics-action="checkout" '
                                  f'data-analytics-target="{P["offer"]}" data-analytics-location="{loc}">{label}</a>')
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
<body data-analytics-offer="{P["offer"]}" data-summit="{P["summit"]}" data-days="{",".join(str(d) for d in P["days"])}" data-first="{",".join(P["first"])}" data-last="{",".join(P["last"])}">

<header class="nav">
  <a class="wm" href="/" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="full_city">Mirai Tech City<img src="/img/brand/seal-mirai-solid.png" alt="" width="240" height="240"><span class="sr"> home</span></a>
  <nav class="nav-links" aria-label="Site">
    <a class="mono" href="/program/" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="program">Program</a>
    <a class="mono" href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="pricing">Pricing</a>
    <a class="mono" href="{P["jp_href"]}" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="nav" data-analytics-target="japan">日本語</a>
  </nav>
  {buy("nav", "Get my ticket · $900")}
</header>

<main>
<!-- THE WALL: the faces are rendered by summit-live.js from the Speakers and Program tabs of the sheet. -->
<section class="wall" id="speakers" data-track-section="offer" data-track-position="1" aria-label="{n} speakers">
  <div class="grid" id="grid">
    {SEAL}
    <div class="head">
      <h1 class="h1">{P["h1"]}</h1>
      <p class="lead">{P["lead"]}</p>
      <div class="cta">
        {buy("hero", "Get my ticket · $900")}
        <span class="mono">{P["when_mono"]}</span>
      </div>
      <p class="note">{P["note"]}</p>
    </div>
    <div class="obi" aria-hidden="true"><span class="mono long" data-live="speakers">{P["obi_long"]}</span><span class="mono short" data-live="speakers">{P["obi_short"]}</span></div>
  </div>
</section>

<!-- TICKET -->
<section class="ticket" id="ticket" data-track-section="ticket" data-track-position="2">
  <div class="wrap koma-grid">
    <div class="koma main">
      <h2 class="sub">{P["ticket_h"]}</h2>
      <p class="price">{P.get("price", "$900")}</p>
      <p class="lead2">{P["ticket_lead"]}</p>
      <ul class="facts">
{P["ticket_facts"]}
      </ul>
      <div class="cta">
        {buy("ticket", "Get my ticket")}
        <span class="mono">{P.get("pay_mono", "Stripe · USD")} · {P["dates_mono"]}</span>
      </div>
    </div>
    <div class="koma side">
      <h3 class="sub">If you can't pay for a ticket</h3>
      <p class="lead2">A few tickets are paid for by sponsors, for researchers, founders and artists who should be in Kobe.</p>
      <ul class="facts">
        <li>Book a call and tell us what you work on.</li>
        <li>We tell you whether a sponsor can cover you.</li>
      </ul>
      <a class="btn shu" href="https://calendly.com/nelson-frontierhumans/mtc-acceleration-sprint?utm_source=mirai-site&amp;utm_campaign=summit-sponsorship" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="ticket" data-analytics-target="calendly">Book a call</a>
    </div>
    <div class="rows">
      <p>{P["resident_row"]}</p>
      <p>Teams at KBIC and Kobe University have free seats. Write to <a class="lnk" href="mailto:team@miraitech.city" data-analytics-action="alternative_offer" data-analytics-target="{P["offer"]}_access_email">team@miraitech.city</a> to check if you qualify.</p>
    </div>
  </div>
</section>

{PARTNERS % P}

<!-- PROGRAMME: rendered by summit-live.js from the Program tab of the sheet. Full timetable on /program/. -->
<section class="prog" id="program" data-track-section="program" data-track-position="4">
  <div class="wrap">
    <div class="top"><h2 class="sub">Programme</h2><span class="mono" data-live="sessions">{len(P["days"])} Days · {session_count(P["days"])} Sessions · JST</span><a class="lnk" href="/program/" data-analytics-action="site_navigation" data-analytics-location="program" data-analytics-target="program">Full programme</a></div>
    <div class="days{" three" if len(P["days"]) == 3 else ""}" id="days"></div>
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
      <p data-live="speakers">{P["final_p"]}</p>
      {buy("final_offer", "Get my ticket · $900")}
      <span class="mono">{P.get("pay_mono", "Stripe · $900")} · {P["dates_mono"]}</span>
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
  <span class="lbl">{P.get("sticky_lbl", "$900")} · {P["sticky_dates"]}</span>
  {buy("sticky", "Get my ticket")}
</div>

<script src="/sheet.js"></script>
<script src="/speakers-data.js"></script>
<script src="/speakers-photos.js"></script>
<script src="/speakers.js"></script>
<script src="/program-data.js"></script>
<script src="/program.js"></script>
<script src="/summit-live.js"></script>
</body>
</html>
'''

# ---------- Summit I ----------
n1 = speaker_count({'S1'})
P1 = dict(
    n=n1, summit=1, days=[17, 18], first=['motoshi_hayano', 'takashi_aoi', 'eleanor_sheekey', 'walter_patterson', 'yoshihiro_muragaki'], last=[],
    path='/summit-i/', offer='summit_1', stripe='https://buy.stripe.com/dRmdRb1Kc9bn7Dx80C3Nm05',
    title=f'Mirai Tech City Summit I · 17–18 October 2026 · Kobe · {n1} speakers',
    og_title='Mirai Tech City Summit I · Oct 17–18 · Kobe',
    desc=f'Summit I: The Science and Tech Augmenting Life. Saturday 17 and Sunday 18 October 2026 at Kobe University Integrated Research Center, Port Island. {n1} speakers. Tickets $900 on Stripe.',
    og_image='/img/summit-pathologist.jpg',
    alt_link='<link rel="alternate" hreflang="ja" href="https://www.miraitech.city/jp/summit-i/">\n',
    jp_href='/jp/summit-i/',
    h1=f'<span class="ln" data-live="speakers">{n1} speakers</span> <span class="ln">on ageing</span> <span class="ln">and medicine.</span> <span class="ln">Two days</span> <span class="ln">in Kobe.</span>',
    lead='Mirai Tech City Summit I: The Science and Tech Augmenting Life. Saturday 17 and Sunday 18 October 2026, Kobe University Integrated Research Center, Port Island. All talks in English.',
    when_mono='10.17 SAT · 10.18 SUN · 11:00–20:30 JST',
    note='This summit has taken place. <a class="lnk" href="/summit-ii/" data-analytics-action="site_navigation" data-analytics-location="hero" data-analytics-target="summit_2">Summit II, October 24–26 →</a>',
    obi_long=f'2026.10.17 SAT · 10.18 SUN · KOBE PORT ISLAND · {n1} SPEAKERS · TOOK PLACE',
    obi_short=f'10.17–18 · KOBE · {n1} SPEAKERS · TOOK PLACE',
    past=True, price='Done', pay_mono='Took place', sticky_lbl='Summit I took place',
    ticket_h='Summit I took place on October 17–18', dates_mono='2026.10.17–18', sticky_dates='Oct 17–18',
    ticket_lead='Thank you to everyone who came. Summit II follows on October 24–26, with Demo Day on the Monday.',
    ticket_facts='        <li>Saturday 17 and Sunday 18 October, 11:00–20:30.</li>\n        <li>Kobe University Integrated Research Center, Port Island.</li>\n        <li>Talks are in English.</li>\n        <li>Hotel and transportation are not included.</li>',
    resident_row='Summit I has taken place. The speakers and the programme stay on this page as a record; the recordings follow. <a class="lnk" href="/summit-ii/" data-analytics-action="site_navigation" data-analytics-location="ticket" data-analytics-target="summit_2">Summit II tickets →</a>',
    intro='Summit I is held with universities, research institutes and companies in Kobe and across Japan.',
    kobe='Host of Summit I at its Integrated Research Center.',
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
    final_p=f'Summit I took place on Saturday 17 and Sunday 18 October at Kobe University Integrated Research Center, with {n1} speakers. Summit II is on October 24–26.',
    final_img='/img/pillar-portisland-aerial-640.webp', final_alt='Port Island from the air', final_w=640, final_h_px=427,
    final_cap='Fig. 02 · Port Island · Kobe harbour from the air',
    photo_credits='Photos · Fig. 01 Port Liner · 663highland · CC BY 2.5 · Fig. 02 Port Island aerial · 663highland · CC BY 2.5',
    sibling_href='/summit-ii/', sibling_target='summit_2', sibling_label='Summit II · Oct 24–26',
)

# ---------- Summit II ----------
n2 = speaker_count({'S2', 'F'})
P2 = dict(
    n=n2, summit=2, days=[24, 25, 26], first=['aubrey_de_grey', 'masataka_watanabe', 'jose_cordeiro', 'mac_davis', 'natalie_coles_de_grey'],
    # Joe Betts-LaCroix is never placed beside Aubrey de Grey or the LEV Foundation: he goes last on the wall.
    last=['joe_betts_lacroix'],
    path='/summit-ii/', offer='summit_2', stripe='https://buy.stripe.com/00wcN774wbjv8HBdkW3Nm06',
    title=f'Mirai Tech City Summit II · 24–26 October 2026 · Kobe · {n2} speakers',
    og_title='Mirai Tech City Summit II · Oct 24–26 · Kobe',
    desc=f'Summit II: From East to West, Bridging the Longevity Gap, plus Demo Day. Saturday 24 to Monday 26 October 2026 in Kobe. {n2} speakers. Tickets $900 on Stripe.',
    og_image='/img/early-bird-bridge.jpg',
    alt_link='',
    jp_href='/jp/',
    h1=f'<span class="ln" data-live="speakers">{n2} speakers</span> <span class="ln">on longevity.</span> <span class="ln">Three days</span> <span class="ln">in Kobe.</span>',
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
    print(out, P['n'], 'speakers;', session_count(P['days']), 'sessions')
