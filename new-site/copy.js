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
    /* The <i class="heroRot"> word is retyped by the hero script in index.html.
       data-words is the cycle; the first entry must match the static text. */
    headline: `<span>Live the future</span> <span class="heroLine">of <i class="heroRot" data-words="frontier tech|longevity|biotech|gene therapy|AI medicine|augmentation">frontier tech</i><i class="heroDot">.</i></span>`,
    lead: `Cell and gene therapy, AI-designed drugs, N-of-1 medicine, brain-computer interfaces, radical life extension, human augmentation.`,
    where: `Kobe, Japan &ndash; <b>October 1&ndash;31, 2026</b>`,
    /* Two summit chips. The page script fills .hsState (Next / Then / Now on / Done, strings
       under js below) and the live countdown in .hsCd of whichever summit is next. */
    summits: `<a class="heroSummit" data-summit="1" href="#summits" data-analytics-action="site_navigation" data-analytics-location="hero" data-analytics-target="summit_1"><span class="hsState"></span><b>Summit I &middot; Oct 17&ndash;18</b><span class="hsCd"></span></a><a class="heroSummit" data-summit="2" href="#summits" data-analytics-action="site_navigation" data-analytics-location="hero" data-analytics-target="summit_2"><span class="hsState"></span><b>Summit II &middot; Oct 24&ndash;26</b><span class="hsCd"></span></a>`,
    buttons: `<a class="btn accent" href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="hero_primary" data-analytics-target="pricing">Get Tickets</a>`,
    /* Japanese readers: one small link to /jp/, the Japan-resident ticket (Peatix). */
    jpLink: `<a class="heroJp" href="/jp/" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="hero" data-analytics-target="japan">日本語ページはこちら <span aria-hidden="true">&rarr;</span></a>`,
    scrollHint: `&darr;`,
  },

  /* ─── INTRO + PILLARS (under the fold) ─────────────────
     Structure and copy from marketing's hero-intro mockup:
     one plain statement, then Accelerate / Inspire / Live. */
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
    items2: `<li><b>2 summits</b> on the future of longevity, human augmentation and frontier tech</li><li><b>Demo Day</b> on October 26: MedTech device residents show their prototypes live</li>`,
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

  /* ─── SUMMITS ─────────────────────────── */
  summits: {
    eyebrow: `The Longevity Biomedical Summit`,
    headline: `Come for a weekend.`,
    label: `SUMMIT — 01`,
    date: `October 17–18`,
    title: `The Science &amp; Tech Augmenting Life`,
    body: `Why the next decade of longevity biomedicine runs through Japan: regenerative medicine, devices, and accelerated regulatory paths.`,
    topics: ``,
    priceRow: `<span class="priceKey">This summit has taken place</span>`,
    block: `<a class="more" href="/summit-i/" data-analytics-action="site_navigation" data-analytics-location="summit_1" data-analytics-target="summit_1_page">Speakers and programme →</a>`,
    footnote: ``,
    label2: `SUMMIT — 02`,
    date2: `October 24–25`,
    title2: `From East to West: Bridging the Longevity Gap`,
    body2: `The bottlenecks holding the field back, and what the world looks like once we cure disease.`,
    topics2: ``,
    tieIn: ``,
    priceRow2: `<span class="priceVal">$900</span><span class="priceKey"></span>`,
    block2: `<a class="btn ghost" href="https://buy.stripe.com/00wcN774wbjv8HBdkW3Nm06" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="summit_2" data-analytics-target="summit_2">Get My Ticket</a><a class="more" href="/summit-ii/" data-analytics-action="site_navigation" data-analytics-location="summit_2" data-analytics-target="summit_2_page">Learn more →</a>`,
    footnote2: `Hotel & Transportation not included`,
    line: `Across the two weekends: <b>Aubrey de Grey</b>, <b>Motoshi Hayano</b>, and 41 more.`,
    link: `Meet the speakers ↑`,
    pricingLink: `See all pricing →`,
    jpLink: `日本居住者向け参加枠 →`,
  },

  /* ─── SPEAKERS ─────────────────────────── */
  /* The cards and the "Also in the arena" names come from the Speakers
     tab of the agenda sheet (speakers.js); the count span is filled
     with the number of published speakers. */
  speakers: {
    eyebrow: `<span data-speakers-count>55</span> Confirmed Speakers`,
    headline: `Speakers &amp; Residents`,
    followLine: `<span data-speakers-count>55</span> confirmed · more announced through September · <a href="#doors">Follow along ↓</a>`,
  },

  /* ─── ECOSYSTEM (inside the proof section) ─────────────── */
  ecosystem: {
    summit: `Summit partners`,
    marketEntry: `Official Market-Entry Execution Partner`,
    community: `Community partners`,
    media: `Media partner`,
    support: `With the support of`,
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
     Only the section chrome lives here. The sessions (blocks, dates,
     titles, subtitles) now come from the public Google Sheet, rendered
     by agenda.js with the shipped snapshot in agenda-data.js. The stashed
     "Full Program" section this replaced lives in
     ../retreat/full-program-section.html for the Retreat page. */
  agenda: {
    eyebrow: `The Agenda · Oct 17–26`,
    headline: `Nine sessions<br/>and a demo day.`,
    ctaNote: `Oct 17–26 · Kobe · <a href="/program/" style="color:var(--accent); text-decoration:none" data-analytics-action="site_navigation" data-analytics-location="agenda" data-analytics-target="program">Full program →</a>`,
    cta: `<a class="btn accent" href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="agenda" data-analytics-target="pricing">Get Tickets</a>`,
  },

  /* ─── FAQ ─────────────────────────── */
  faq: {
    eyebrow: `FAQ`,
    headline: `Before you book<span class="fq-tick">.</span>`,
    meta: `<strong>06 questions</strong> on file<br/>Kobe · Port Island<br/>Oct 01–31 · 2026`,
    foot: `Retain your stub — further questions issued at the gate`,
    q1: `What is a popup city?`,
    a1: `A temporary village where a curated community lives, works, and builds together in one place for one month. Housing, labs, programming, and social life share the same few blocks on Port Island — and the summits are its two flagship weekends.`,
    q2: `Where exactly in Kobe?`,
    a2: `Port Island, home to KBIC (Kobe Biomedical Innovation Cluster). A purpose-built biomedical district with lab infrastructure, connected to central Kobe via the Port Liner monorail.`,
    q3: `Do I have to stay the whole month?`,
    a3: `No. The city runs October 1–31, but the Summit II ticket stands alone: come for October 24–26, no application.`,
    q4: `Where do I stay?`,
    a4: `Our partner hotel, the Portopia, is a short walk from KBIC, and the community hacker houses — The Sanctuary, Biopunk House, Aevitas, and ZuCity Japan — host residents across the city. Accommodation is booked separately; we point you to the options after you get your ticket.`,
    q5: `What is the Demo Day on October 26?`,
    a5: `The closing day of the summits. MedTech device residents show their prototypes live on stage, twenty companies pitch, and the awards are handed out. See the <a href="/program/" data-analytics-action="site_navigation" data-analytics-location="faq" data-analytics-target="program">full program</a>.`,
    q6: `How do tickets and applications work?`,
    a6: `The Summit II ticket (<b>$900</b>) checks out on Stripe. No application. Accommodation is booked separately.`,
  },

  /* ─── APPLY ─────────────────────────── */
  apply: {
    eyebrow: `October 2026 · 300 Curated Residents`,
    headline: `The future is<br/>built here.`,
    buttons: `Tickets for Summit II, October 24–26.`,
    buttons2: `<a class="btn accent" href="https://buy.stripe.com/00wcN774wbjv8HBdkW3Nm06" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="apply" data-analytics-target="summit_2">Get My Ticket — $900</a> <a class="btn" href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="apply" data-analytics-target="pricing">Get Tickets</a> <a class="btn ghost" href="#">Sponsor the City</a>`,
    footnote: `Tickets check out on Stripe · No application · <a href="/pricing/" data-analytics-action="site_navigation" data-analytics-location="apply" data-analytics-target="pricing">See pricing →</a>`,
    footnote2: `Sponsors reach 300 residents and 55 speakers`,
    footnote3: `Residents of Japan: a Japan-resident ticket is sold separately on Peatix through the <a href="/jp/" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="apply" data-analytics-target="japan">Japanese page</a> · That pricing is exclusive to residents of Japan · <a href="/jp/" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="apply" data-analytics-target="japan">日本語ページ →</a>`,
  },

  /* ─── FOOTER ─────────────────────────── */
  footer: {
    signoff: `See you on Port Island`,
    date: `10 · 17 · 2026`,
    statLabel: `Days`,
    statLabel2: `Hours`,
    statLabel3: `Min`,
    statLabel4: `Sec`,
    countdownLabel: `<span id="cdtext">Until Summit I</span> · <a href="mirai_oct1.ics" style="color:var(--accent); text-decoration:none">Add to calendar</a>`,
    jst: `Kobe right now · <b id="jst">—</b> JST`,
    links: `<a href="#">The Group Chat →</a> <a href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="luma_listing">Follow on Luma →</a> <a href="#">The Build Server →</a> <a href="#">Sponsor the City →</a> <a href="/conduct/" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="conduct">Code of Conduct →</a> <a href="/jp/" lang="ja" hreflang="ja" data-analytics-action="site_navigation" data-analytics-location="footer" data-analytics-target="japan">日本語ページ →</a>`,
    block: `Stills: Kobe Tourism Bureau · Hideyuki Kamon (CC BY-SA) · art comments (CC BY)`,
  },

  /* ─── STRINGS THE PAGE SCRIPT USES ───────────────────── */
  js: {
    placeholderLink:   `Opening soon`,
    /* Countdown: the footer clock and hero chips count to the next summit. */
    summitName:        { 1: `Summit I`, 2: `Summit II` },
    countdownUntil:    `Until %s`,
    countdownOn:       `%s is on`,
    countdownOver:     `Both summits have happened`,
    summitNext:        `Next`,
    summitThen:        `Then`,
    summitOn:          `Now on`,
    summitDone:        `Done`,
    summitIn:          `in %s`,
  },
};

/* Applies the copy above to the page. Called at the end of <body>. */
window.applyCopy = function () {
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    var v = el.getAttribute('data-copy').split('.')
      .reduce(function (o, k) { return o && o[k]; }, window.MIRAI_COPY);
    if (typeof v === 'string') el.innerHTML = v;
    else console.warn('[copy] missing key:', el.getAttribute('data-copy'));
  });
};
