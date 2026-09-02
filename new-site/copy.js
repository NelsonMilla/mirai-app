/* ============================================================
   MIRAI TECH CITY — LANDING PAGE COPY
   Every word on index.html lives here. Edit the text between
   the backticks. Do NOT rename the keys on the left — the page
   looks elements up by those.
   HTML inside a string (<br/>, <b>, <em>, <a>) is intentional.
   NOTE: the <title> and <meta description/og:*> tags stay in
   index.html — social previews are read by scrapers that do
   not run JavaScript.
   ============================================================ */
/* Fashion-show launch control: strings below pick a variant off
   window.MIRAI_FLAGS.showFashionShow (set in index.html, which loads
   the flags before this file). Both variants stay here so flipping
   the flag restores the show everywhere at once. */
const SHOW_FASHION = !!(window.MIRAI_FLAGS && window.MIRAI_FLAGS.showFashionShow);
window.MIRAI_COPY = {

  /* ─── SKIP LINK ─────────────────────────── */
  menu: {
    skipLink: `Skip to content`,
  },

  /* ─── NAV ─────────────────────────── */
  nav: {
    logo: `Mirai<span class="logoTech">Tech</span>`,
    pricing: `Pricing`,
    startups: `For Startups`,
    button: `Get Tickets`,
  },

  /* ─── HERO OFFER ─────────────────────────── */
  hero: {
    eyebrow: `Mirai Tech City 2026 · Kobe, Japan · October 1–31`,
    headline: `<span>Live the future</span> <span>of frontier tech.</span>`,
    thesis: `Biotech is the next AI race.`,
    lead: `Cell and gene therapy, AI-designed drugs, N-of-1 medicine, brain-computer interfaces, radical life extension, human augmentation.`,
    program: SHOW_FASHION
      ? `<li><b>2</b> <span>summit weekends</span></li><li><span>Fashion Show</span> <b>Oct 26</b></li><li><span>Citizenship</span> <b>all October</b></li>`
      : `<li><b>2</b> <span>summit weekends</span></li><li><span>Citizenship</span> <b>all October</b></li>`,
    buttons: `<a class="btn accent" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="hero_primary" data-analytics-target="tickets">Get Tickets</a>`,
    proof: `<span><b>51</b> confirmed speakers · Aubrey de Grey + José Cordeiro</span><span><b>300-person</b> popup city</span><span>KBIC · Japan's largest biomedical cluster · <b>370</b> member organizations</span>`,
    scrollHint: `See what October looks like ↓`,
  },

  /* ─── INTRO + PILLARS (under the fold) ─────────────────
     Structure and copy from marketing's hero-intro mockup:
     one plain statement, then Accelerate / Inspire / Live.
     The fashion-show line carries data-fashion so the
     MIRAI_FLAGS.showFashionShow flag controls it like
     everywhere else on the page. */
  pillars: {
    /* The statement is a composed five-line lockup ("Brodovitch Cascade"):
       whispered mono qualifier, display subject, indented bridge, accent
       payoff. The spans are aria-hidden because the <p> in index.html
       carries the full sentence as its aria-label. */
    statement: `<span class="msl-line msl-mono" aria-hidden="true">Month-long</span><span class="msl-line msl-subject" aria-hidden="true">Popup City,</span><span class="msl-line msl-bridge" aria-hidden="true">for scientists, founders, and builders <em>to&nbsp;experience</em></span><span class="msl-line msl-payoff" aria-hidden="true">Japan's Frontier</span><span class="msl-line msl-payoff msl-payoff--shift" aria-hidden="true">Tech Renaissance.</span>`,
    num1: `01`,
    gloss1: `加速 / Kasoku`,
    title1: `Accelerate`,
    items1: `<li><b>Biotech commercialization in under 1 year</b> — <a href="/conferences/" data-analytics-action="site_navigation" data-analytics-location="pillars" data-analytics-target="conferences">Why Japan? »</a></li><li><b>Get ready to fundraise in less than 1 month</b> — <a href="/startups/" data-analytics-action="site_navigation" data-analytics-location="pillars" data-analytics-target="startups">the startup program</a></li>`,
    num2: `02`,
    gloss2: `刺激 / Shigeki`,
    title2: `Inspire`,
    items2: `<li><b>2 summits</b> on the future of longevity, human augmentation and frontier tech</li><li data-fashion><b>Enhanced Fashion:</b> Brightmirror narratives of the future of humanity — <a href="/fashion-show/" data-analytics-action="site_navigation" data-analytics-location="pillars" data-analytics-target="fashion_show">the fashion show</a></li>`,
    num3: `03`,
    gloss3: `暮らし / Kurashi`,
    title3: `Live`,
    items3: `<li><b>Bring your community:</b> peptides, biohacking, AI, philosophy, human augmentation</li><li><b>Enjoy:</b> onsens, cold plunges, fitness, delicious food and a unique culture</li>`,
    /* Harimaze prints: mounted-photo figures beside each pillar's ledger.
       Imagery from Wikimedia Commons — licenses and attribution in
       img/PILLARS-CREDITS.md. Captions are checkable facts, museum-label
       register; the figures are aria-hidden decoration. */
    prints1: `<figure class="knt-chip" style="--r:-2.4deg"><img src="img/pillar-lab-robot.webp" alt="" loading="lazy" decoding="async" width="960" height="540"><figcaption><b>Fig. 01</b>Liquid-handling robot</figcaption></figure><figure class="knt-chip knt-chip--tape" style="--r:2deg"><img src="img/summit-lab.webp" alt="" loading="lazy" decoding="async" width="900" height="600"><figcaption><b>Fig. 02</b>KBIC — wet lab</figcaption></figure>`,
    prints2: `<figure class="knt-chip knt-chip--tall" style="--r:2.6deg"><img src="img/pillar-exoskeleton-hal.webp" alt="" loading="lazy" decoding="async" width="960" height="1440"><figcaption><b>Fig. 03</b>HAL — Cyberdyne exoskeleton</figcaption></figure>`,
    prints3: `<figure class="knt-chip knt-chip--tall" style="--r:-2.2deg"><img src="img/pillar-nankinmachi-night.webp" alt="" loading="lazy" decoding="async" width="960" height="1280"><figcaption><b>Fig. 04</b>Nankinmachi — Kobe Chinatown</figcaption></figure><figure class="knt-chip knt-chip--tape" style="--r:2.4deg"><img src="img/pillar-harborland-wheel.webp" alt="" loading="lazy" decoding="async" width="960" height="540"><figcaption><b>Fig. 05</b>Harborland — Mosaic wheel</figcaption></figure>`,
  },

  /* ─── WHY JAPAN (the approval record) ───────────────────
     Compressed proof band under the pillars — "Kessai-ran":
     one claim plus the three audited numbers, each stamped by
     the institution that certifies it. The vermilion seal SVGs
     live in index.html (decorative, aria-hidden); every word
     lives here. Numbers mirror the /conferences outcome strip. */
  whyjapan: {
    head1: `Why Japan <b>· 証明 / Proof</b>`,
    head2: `<b>決裁欄</b> · Approval record`,
    claim: `<span class="hkb-cl">What takes years elsewhere</span><span class="hkb-cl hkb-cl2">takes months here.</span>`,
    gloss: `何年も → 数ヶ月`,
    mach1: `<b>PMDA</b> · conditional approval`,
    stat1: `10×`,
    qual1: `Faster`,
    fact1: `to first revenue`,
    mach2: `<b>AMED</b> · matches VC 2:1 in non-dilutive grants`,
    stat2: `100×`,
    qual2: `Cheaper`,
    fact2: `than the Phase 3 route`,
    mach3: `<b>KBIC</b> · Japan's largest biomedical cluster — 370 member organizations`,
    stat3: `+61%`,
    qual3: `More value`,
    fact3: `from the same patent`,
    footLabel: `The full argument`,
    footLink: `<a class="hkb-link" href="/conferences/" data-analytics-action="site_navigation" data-analytics-location="whyjapan" data-analytics-target="conferences">Why Japan? <em>»</em></a>`,
  },

  /* ─── SUMMIT + HOTEL PACKAGE ─────────────────────────── */
  package: {
    eyebrow: `Launch price · {spots} of {spotsTotal} spots left`,
    name: `Both Weekends + Hotel`,
    headline: `Or take both weekends,<br/>hotel included.`,
    promise: `Both summit weekends, the week between them, and a room in Sannomiya for the whole run.`,
    fact: `<b>Summit I</b><span>October 17–18</span><i>$900</i>`,
    fact2: `<b>Summit II</b><span>October 24–25</span><i>$900</i>`,
    subtotal: `<span>Two weekends only</span><i>$1,800</i>`,
    fact3: `<b>+ Hotel</b><span>October 16–28 · Sannomiya · 12 nights</span>`,
    fact4: `<b>+ Finale</b><span>Frontier Human Fashion Show &amp; Demo Day · October 26</span>`,
    price: `$2,500<span>Launch price · $4,000 once these {spotsTotal} are gone</span>`,
    button: `Get My Package — $2,500`,
    friction: `Only {spotsTotal} at this price · Then $4,000 · Breakfast included`,
    detailsLink: `<a class="bundle-feature__details" href="/summit-bundle/" data-analytics-action="alternative_offer" data-analytics-location="summit_package" data-analytics-target="summit_hotel">See everything included →</a>`,
  },

  /* ─── SUMMITS ─────────────────────────── */
  summits: {
    eyebrow: `The Longevity Biomedical Summit`,
    headline: `Come for a weekend.`,
    label: `SUMMIT — 01`,
    date: `October 17–18`,
    title: `The Science &amp; Tech Augmenting Life`,
    body: `Why the next decade of longevity biomedicine runs through Japan: regenerative medicine, devices, and accelerated regulatory paths.`,
    topics: ``,
    priceRow: `<span class="priceVal">$900</span><span class="priceKey"></span>`,
    block: `<a class="btn ghost" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="summit_1" data-analytics-target="summit_pass">Get My Ticket</a>`,
    footnote: `Hotel & Transportation not included`,
    label2: SHOW_FASHION ? `SUMMIT — 02 + FASHION SHOW` : `SUMMIT — 02`,
    date2: SHOW_FASHION ? `October 24–26` : `October 24–25`,
    title2: `From East to West: Bridging the Longevity Gap`,
    body2: `The bottlenecks holding the field back, and what the world looks like once we cure disease.`,
    topics2: ``,
    tieIn: ``,
    priceRow2: `<span class="priceVal">$900</span><span class="priceKey"></span>`,
    block2: `<a class="btn ghost" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="summit_2" data-analytics-target="summit_pass">Get My Ticket</a>`,
    footnote2: `Hotel & Transportation not included`,
    line: `Across the two weekends: <b>Aubrey de Grey</b>, <b>Motoshi Hayano</b>, and 41 more.`,
    link: `Meet the speakers ↑`,
    pricingLink: `See all pricing →`,
  },

  /* ─── SPEAKERS ─────────────────────────── */
  speakers: {
    eyebrow: `51 Confirmed Speakers`,
    headline: `Speakers &amp; Residents`,
    name: `Aubrey de Grey`,
    org: `LEV Foundation`,
    name2: `Motoshi Hayano`,
    org2: `Asagi Labs`,
    name3: `Yuki Hanyu`,
    org3: `Cellular Agriculture`,
    name4: `Adam Gries`,
    org4: `Vitalist Bay`,
    alsoLine: `Also in the arena: <b>José Cordeiro</b>, <b>Todd Porter</b>, <b>Josh Mann</b>, <b>Patri Friedman</b>, <b>Ian Huyett</b>, <b>Sandeep Casi</b>, <b>Sebastian Brunemeier</b>, <b>Brian Kennedy</b>, <b>Rob Claar</b>, <b>Natalie Coles</b>, <b>Devinder Sodhi</b>, <b>Sumit Jamuar</b>, <b>Keita Masui</b>, <b>Muneaki Goto</b>, <b>Takahiro Yasuda</b>, <b>Yuri Deigin</b>, <b>Laurence Ion</b>, <b>Rodney Kelly</b>, <b>Eleanor Sheekey</b>, <b>Stuart Reid</b>, <b>Mac Davis</b>, <b>Daniel Burger</b>, <b>Juliette Humer</b>, <b>Jeffrey Tibbetts</b>, <b>Ada Cyborg</b>, <b>Elen Capri</b>, <b>Cremieux</b>, <b>Nathan Cheng</b>, <b>Keiko Kobayashi</b>, <b>Felix OENS</b>, <b>Brandon Possin</b>, <b>Bilal Kharouni</b>, <b>Alice Gilman</b>, <b>Julie Ying Baron</b>, <b>Irit Rappley, PhD</b>, <b>Walter Patterson</b>, <b>Czar Gonzalez</b>, <b>Pedro Henrich</b>, <b>Nelson Milla</b>.`,
    followLine: `51 confirmed · more announced through September · <a href="#doors">Follow along ↓</a>`,
  },

  /* ─── FASHION SHOW ─────────────────────────── */
  fashion: {
    eyebrow: `The Runway · October 26 · 19:00 JST`,
    headline: `The Frontier Human<br/>Fashion Show`,
    body: `A live demo day, staged as a runway show. Device residents put their prototypes on models. CES meets Tokyo Fashion Week, and everyone's wearing exoskeletons.`,
    tags: `<span>Exoskeletons</span><span>Neural Interfaces</span><span>Smart Prosthetics</span> <span>Biosensors</span><span>Haptic Suits</span><span>AR/VR Medical</span>`,
    block: `0 / 9 presenters revealed · <span class="kanji" role="group" aria-label="Presenter categories, tap to reveal"><span title="Armor — exoskeletons">鎧</span> <span title="Brain — neural interfaces">脳</span> <span title="Prosthetic">義</span> <span title="Sense — biosensors">感</span> <span title="Touch — haptics">触</span> <span title="Machine">機</span> <span title="Garment">衣</span> <span title="Vision">視</span> <span title="Life">命</span></span>`,
    block2: `<a class="btn accent" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="fashion" data-analytics-target="fashion_show">Get Show Tickets</a> <a class="btn ghost" href="#apply">Put your device on the runway</a>`,
  },

  /* ─── ECOSYSTEM (inside the proof section) ─────────────── */
  ecosystem: {
    majorLabel: `With support of`,
    headline: `Other supporting organizations`,
  },

  /* ─── ONE EVENING IN KOBE ─────────────────────────── */
  kobe: {
    caption: `One evening in Kobe · 17:58 → 23:41`,
    caption2: `17:58 Kobe Harbor`,
    caption3: `19:47 Dinner at the local izakaya`,
    caption4: `21:15 Lantern night`,
    caption5: `22:30 One more street`,
    caption6: `23:41 Mt. Rokko, the ten-million-dollar view · <a href="/experience/" style="color:var(--accent); text-decoration:none; font-size:12px; padding:6px 0; display:inline-block" data-analytics-action="site_navigation" data-analytics-location="kobe_evening" data-analytics-target="experience_guide">Explore Kobe + Kansai →</a>`,
  },

  /* ─── AGENDA ───────────────────────────
     Session themes are audited event-deck copy (they mirror the
     summit chapters in ../src/lib/constants.ts). The stashed
     "Full Program" section this replaced lives in
     ../retreat/full-program-section.html for the Retreat page. */
  agenda: {
    eyebrow: `The Agenda · Oct 17–26`,
    headline: `Nine sessions<br/>and a runway.`,
    stn1: `<span class="ag-code">STN·01</span>Oct 17–18`,
    tag1: `Summit I`,
    summit1: `The Science &amp; Tech Augmenting&nbsp;Life`,
    t1: `Japan's Longevity Imperative`,
    p1: `What Japan learned — and what it needs from the world.`,
    t2: `KBIC as a Global Laboratory for Longevity`,
    t3: `Bioengineering, MedTech, Biostasis, Replacement &amp; Augmentation`,
    t4: `Women's Health`,
    p4: `The next trillion-dollar market.`,
    t5: `AI &times; Longevity Bio`,
    stn2: `<span class="ag-code">STN·02</span>Oct 24–25`,
    tag2: `Summit II`,
    summit2: `From East to West: Bridging the Longevity&nbsp;Gap`,
    t6: `Longevity Trends &amp; Supercentenarians`,
    p6: `Impact, and the bottlenecks holding the field back.`,
    t7: `The Stakeholders`,
    p7: `Investment, R&amp;D, entrepreneurship — and regulation as an acceleration mechanism.`,
    t8: `Japan's Model`,
    p8: `Conditional approval generating real-world evidence.`,
    t9: `Visions for the Future of Longevity`,
    stn3: `<span class="ag-code">STN·03</span>Oct 26`,
    tag3: `Finale`,
    t10: `The Frontier Human Fashion Show &amp; Demo&nbsp;Day`,
    p10: SHOW_FASHION
      ? `Devices become couture. <a href="#fashion" style="color:var(--accent); text-decoration:none" data-analytics-action="site_navigation" data-analytics-location="agenda" data-analytics-target="fashion">See the show ↑</a>`
      : `Devices become couture.`,
    ctaNote: `Oct 17–26 · Kobe`,
    cta: `<a class="btn accent" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="agenda" data-analytics-target="tickets">Get Tickets</a>`,
  },

  /* ─── FAQ ─────────────────────────── */
  faq: {
    eyebrow: `FAQ`,
    headline: `Before you book<span class="fq-tick">.</span>`,
    meta: SHOW_FASHION
      ? `<strong>06 questions</strong> on file<br/>Kobe · Port Island<br/>Oct 01–31 · 2026`
      : `<strong>05 questions</strong> on file<br/>Kobe · Port Island<br/>Oct 01–31 · 2026`,
    foot: `Retain your stub — further questions issued at the gate`,
    q1: `What is a popup city?`,
    a1: `A temporary village where a curated community lives, works, and builds together in one place for one month. Housing, labs, programming, and social life share the same few blocks on Port Island — and the summits are its two flagship weekends.`,
    q2: `Where exactly in Kobe?`,
    a2: `Port Island, home to KBIC (Kobe Biomedical Innovation Cluster). A purpose-built biomedical district with lab infrastructure, connected to central Kobe via the Port Liner monorail.`,
    q3: `Do I have to stay the whole month?`,
    a3: SHOW_FASHION
      ? `No. The city runs October 1–31, but summit tickets stand alone — come for one weekend (Oct 17–18 or Oct 24–26), take both with the hotel package, or apply for the PopUp and stay the month.`
      : `No. The city runs October 1–31, but summit tickets stand alone — come for one weekend (Oct 17–18 or Oct 24–25), take both with the hotel package, or apply for the PopUp and stay the month.`,
    q4: `Where do I stay?`,
    a4: `Our partner hotel, the Portopia, is a short walk from KBIC, and the community hacker houses — The Sanctuary, Biopunk House, Aevitas, and ZuCity Japan — host residents across the city. The Both Weekends + Hotel package includes 12 nights in Sannomiya.`,
    q5: `What is the Frontier Human Fashion Show?`,
    a5: `A live demo day reimagined as a runway show. Device residents showcase their prototypes on models, blending medical technology with fashion. Think CES meets Tokyo Fashion Week.`,
    q6: `How do tickets and applications work?`,
    a6: `Summit tickets and the hotel package are on Luma. The month-long PopUp is <b>$1,200</b> and application-only — we review on a rolling basis, and accepted teams receive next steps by email.`,
  },

  /* ─── APPLY ─────────────────────────── */
  apply: {
    eyebrow: `October 2026 · 300 Curated Residents`,
    headline: `The future is<br/>built here.`,
    buttons: SHOW_FASHION
      ? `Tickets for the Summits &amp; Fashion Show. Applications for the PopUp.`
      : `Tickets for the Summits. Applications for the PopUp.`,
    buttons2: `<a class="btn accent" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="apply" data-analytics-target="tickets">Get Tickets</a> <a class="btn" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="apply" data-analytics-target="residency">Come Live Japan</a> <a class="btn ghost" href="#">Sponsor the City</a>`,
    footnote: `Tickets &amp; PopUp on Luma · Applications reviewed on a rolling basis · <a href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="apply" data-analytics-target="pricing">See pricing →</a>`,
    footnote2: `Sponsors reach 300 residents and 51 speakers`,
  },

  /* ─── FOOTER ─────────────────────────── */
  footer: {
    signoff: `See you on Port Island`,
    date: `10 · 01 · 2026`,
    statLabel: `Days`,
    statLabel2: `Hours`,
    statLabel3: `Min`,
    statLabel4: `Sec`,
    countdownLabel: `<span id="cdtext">Until the city opens</span> · <a href="mirai_oct1.ics" style="color:var(--accent); text-decoration:none">Add to calendar</a>`,
    jst: `Kobe right now · <b id="jst">—</b> JST`,
    links: `<a href="#">The Group Chat →</a> <a href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="luma_listing">Follow on Luma →</a> <a href="#">The Build Server →</a> <a href="#">Sponsor the City →</a>`,
    block: `Stills: Kobe Tourism Bureau · Hideyuki Kamon (CC BY-SA) · art comments (CC BY)`,
  },

  /* ─── STRINGS THE PAGE SCRIPT USES ───────────────────── */
  js: {
    /* Summit + Hotel package is limited by SPOTS, not by a date.
       Update packageSpotsLeft as they sell. {spots} and {spotsTotal}
       in any string above are replaced with these numbers.
       At 0 the page falls back to the standard-price copy below. */
    packageSpotsTotal:  10,
    packageSpotsLeft:   9,
    packageSoldOutLabel: `Launch price gone · $4,000`,
    packageSoldOutPrice: `$4,000<span>All {spotsTotal} launch spots taken</span>`,
    packageSoldOutCta:   `Get My Package — $4,000`,
    placeholderLink:   `Opening soon`,
    countdownOpen:     `The city is open`,
  },
};

/* Applies the copy above to the page. Called at the end of <body>. */
window.applyCopy = function () {
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    var v = el.getAttribute('data-copy').split('.')
      .reduce(function (o, k) { return o && o[k]; }, window.MIRAI_COPY);
    if (typeof v === 'string') el.innerHTML = v
      .replace(/\{spots\}/g, window.MIRAI_COPY.js.packageSpotsLeft)
      .replace(/\{spotsTotal\}/g, window.MIRAI_COPY.js.packageSpotsTotal);
    else console.warn('[copy] missing key:', el.getAttribute('data-copy'));
  });
};
