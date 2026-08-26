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

  /* ─── MENU + SKIP LINK ─────────────────────────── */
  menu: {
    skipLink: `Skip to content`,
    ebStripe: `<span class="ebs-label-full">Early Bird ticket sale ending in</span><span class="ebs-label-short">Early Bird ends in</span> <span class="ebc">&#8212;</span> <span class="ebs-sep">·</span> <span class="ebs-price"><s>$1500</s><b>$399</b></span> <span class="ebs-sep">·</span> <span class="ebs-cta">Get Tickets →</span>`,
    closeButton: `✕`,
    item: `Summits <span>Oct 17–25</span>`,
    item2: `Speakers <span>38 Confirmed</span>`,
    item3: `Fashion Show <span>Oct 26</span>`,
    item4: `Residency <span>Oct 01–31</span>`,
    item5: `The Experience <span>Kobe + Kansai</span>`,
    item6: `Summit + Hotel <span>{spots} Spots Left</span>`,
    item7: `Sponsors`,
    footer: `10 · 01 · 2026 · Port Island, Kobe`,
  },

  /* ─── NAV ─────────────────────────── */
  nav: {
    label: `Tech`,
    link: `Summits`,
    link2: `Speakers`,
    link3: `Fashion Show`,
    link4: `Residency`,
    link5: `The Experience`,
    link6: `Sponsors`,
    button: `<span class="promo-full">Summit + Hotel</span><span class="promo-short">Hotel Pass</span>`,
    button2: `Apply Now`,
    menuButton: `Menu`,
  },

  /* ─── HERO SLIDES ─────────────────────────── */
  hero: {
    eyebrow: `Summit I · October 17–18`,
    headline: `Eradicate disease.`,
    buttons: `<a class="btn ghost" href="#summit-package" data-package-promo>Summit + Hotel Package</a> <a class="btn accent package-promo-fallback" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="hero_disease" data-analytics-target="tickets">Get Tickets</a>`,
    eyebrow2: `Summit II · October 24–25`,
    headline2: `Extend the healthspan.`,
    buttons2: `<a class="btn ghost" href="#summit-package" data-package-promo>Summit + Hotel Package</a> <a class="btn accent package-promo-fallback" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="hero_healthspan" data-analytics-target="tickets">Get Tickets</a>`,
    eyebrow3: `The Frontier Human Fashion Show · October 26`,
    headline3: `Augment the human.`,
    buttons3: `<a class="btn accent pop" href="#fashion">The Fashion Show →</a>`,
    headline4: `Live.`,
    lead: `Join us this October to change the future of longevity. <em>Live the future now.</em>`,
    buttons4: `<a class="btn accent" href="#summit-package" data-package-promo>Summit + Hotel Package</a> <a class="btn accent package-promo-fallback" href="#summits">See the Summits</a> <a class="btn ghost" href="#residency">The Residency →</a>`,
    scrollHint: `Scroll ↓`,
  },

  /* ─── DATES STRIP ─────────────────────────── */
  dates: {
    eyebrow: `World's Premier Longevity Biomedical Popup City`,
    headline: `Two summits and a runway.`,
    label: `Summit I`,
    date: `Oct 17–18`,
    detail: `The Science &amp; Tech Augmenting Life`,
    label2: `Summit II`,
    date2: `Oct 24–25`,
    detail2: `From East to West: Bridging the Longevity Gap`,
    label3: `Fashion Show`,
    date3: `Oct 26`,
    detail3: `The Frontier Human Fashion Show &amp; Demo Day`,
    tagline: `Join us this October. <em>See the full program.</em>`,
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
    friction: `Only {spotsTotal} at this price · Then $4,000 · Breakfast excluded`,
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
    label2: `SUMMIT — 02 + FASHION SHOW`,
    date2: `October 24–26`,
    title2: `From East to West: Bridging the Longevity Gap`,
    body2: `The bottlenecks holding the field back, and what the world looks like once we cure disease.`,
    topics2: ``,
    tieIn: ``,
    priceRow2: `<span class="priceVal">$900</span><span class="priceKey"></span>`,
    block2: `<a class="btn ghost" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="summit_2" data-analytics-target="summit_pass">Get My Ticket</a>`,
    footnote2: `Hotel & Transportation not included`,
    line: `Across the two weekends: <b>Aubrey de Grey</b>, <b>José Cordeiro</b>, and 41 more.`,
    link: `Meet the speakers ↓`,
  },

  /* ─── SPEAKERS ─────────────────────────── */
  speakers: {
    eyebrow: `43 Confirmed Speakers`,
    headline: `Speakers &amp; Residents`,
    name: `Aubrey de Grey`,
    org: `LEV Foundation`,
    name2: `José Cordeiro`,
    org2: `The Death of Death`,
    name3: `Yuki Hanyu`,
    org3: `Cellular Agriculture`,
    name4: `Adam Gries`,
    org4: `Vitalist Bay`,
    alsoLine: `Also in the arena: <b>Todd Porter</b>, <b>Josh Mann</b>, <b>Patri Friedman</b>, <b>Prof. Motoshi Hayano</b>, <b>Ian Huyett</b>, <b>Sandeep Casi</b>, <b>Sebastian Brunemeier</b>, <b>Brian Kennedy</b>, <b>Rob Claar</b>, <b>Natalie Coles</b>, <b>Devinder Sodhi</b>, <b>Sumit Jamuar</b>, <b>Keita Masui</b>, <b>Muneaki Goto</b>, <b>Prof. Takahiro Yasuda</b>, <b>Yuri Deigin</b>, <b>Laurence Ion</b>, <b>Rodney Kelly</b>, <b>Eleanor Sheekey</b>, <b>Prof. Stuart Reid</b>, <b>Mac Davis</b>, <b>Daniel Burger</b>, <b>Juliette Humer</b>, <b>Jeffrey Tibbetts</b>, <b>Ada Cyborg</b>, <b>Elen Capri</b>, <b>Cremieux</b>, <b>Nathan Cheng</b>, <b>Keiko Kobayashi</b>, <b>Felix OENS</b>, <b>Brandon Possin</b>, <b>Bilal Kharouni</b>, <b>Alice Gilman</b>, <b>Julie Ying Baron</b>, <b>Irit Rappley, PhD</b>, <b>Walter Patterson</b>, <b>Czar Gonzalez</b>, <b>Pedro Henrich</b>, <b>Nelson Milla</b>.`,
    followLine: `43 confirmed · more announced through September · <a href="#doors">Follow along ↓</a>`,
  },

  /* ─── FASHION SHOW ─────────────────────────── */
  fashion: {
    eyebrow: `The Runway · October 26 · 19:00 JST`,
    headline: `The Frontier Human<br/>Fashion Show`,
    body: `A live demo day, staged as a runway show. Device residents put their prototypes on models. CES meets Tokyo Fashion Week, and everyone's wearing exoskeletons.`,
    tags: `<span>Exoskeletons</span><span>Neural Interfaces</span><span>Smart Prosthetics</span> <span>Biosensors</span><span>Haptic Suits</span><span>AR/VR Medical</span>`,
    block: `0 / 9 presenters revealed · <span class="kanji" role="group" aria-label="Presenter categories, tap to reveal"><span title="Armor — exoskeletons">鎧</span> <span title="Brain — neural interfaces">脳</span> <span title="Prosthetic">義</span> <span title="Sense — biosensors">感</span> <span title="Touch — haptics">触</span> <span title="Machine">機</span> <span title="Garment">衣</span> <span title="Vision">視</span> <span title="Life">命</span></span>`,
    block2: `<a class="btn accent" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="fashion" data-analytics-target="fashion_show">Get Show Tickets</a> <a class="btn ghost" href="#residency">Put your device on the runway</a>`,
  },

  /* ─── ECOSYSTEM ─────────────────────────── */
  ecosystem: {
    eyebrow: `Ecosystem`,
    headline: `Supporting organizations`,
  },

  /* ─── ONE EVENING IN KOBE ─────────────────────────── */
  kobe: {
    caption: `One evening in Kobe · 17:58 → 23:41`,
    caption2: `17:58 Kobe Harbor`,
    caption3: `19:47 Dinner is a counter seat`,
    caption4: `21:15 Lantern night`,
    caption5: `22:30 One more street`,
    caption6: `23:41 Mt. Rokko, the ten-million-dollar view · <a href="/experience/" style="color:var(--accent); text-decoration:none; font-size:12px; padding:6px 0; display:inline-block" data-analytics-action="site_navigation" data-analytics-location="kobe_evening" data-analytics-target="experience_guide">Explore Kobe + Kansai →</a>`,
  },

  /* ─── THE RESIDENCY ─────────────────────────── */
  residency: {
    eyebrow: `The Full Program`,
    headline: `Join us this October<br/>to accelerate bio.`,
    tagline: `A Month for Builders.`,
    statLabel: `Build together`,
    body: `Longevity hackathons, Vibe Coding Nights, and benches shared with your cohort.`,
    statLabel2: `Find your people`,
    body2: `Co-founders and collaborators: the people you meet at breakfast build with you by night.`,
    statLabel3: `Partner with Japanese biotech`,
    body3: `KBIC's 370 member organisations, direct PMDA connection, AMED subsidies.`,
    episode: `EP.01 壱`,
    title: `Open Weeks`,
    dates: `Oct 01–16`,
    body4: `Arrivals, tours, Welcome Day on Oct 4. Lab visits, Workshops, Hackathons.`,
    episode2: `EP.02 弐`,
    title2: `Summit I`,
    dates2: `Oct 17–18`,
    body5: `Meet the people that are actively building the frontier of bio.`,
    episode3: `EP.03 参`,
    title3: `Summit II`,
    dates3: `Oct 24–25`,
    body6: `Capital, regulation, and the bridge between ecosystems.`,
    episode4: `EP.04 肆`,
    title4: `Fashion Show &amp; Close`,
    dates4: `Oct 26–31`,
    body7: `The show on Oct 26: devices become couture. Showcase what you've built.`,
    title5: `<b>夜</b>Vibe Coding Nights`,
    body8: `Ship beside future co-founders.`,
    title6: `<b>研</b>The Residency`,
    body9: `A bench in Japan's biomedical cluster.`,
    title7: `<b>学</b>Learning Layer Labs`,
    body10: `New skills, taught weekly.`,
    title8: `<b>実</b>Biohackers Workshops`,
    body11: `Hands-on frontier techniques.`,
    title9: `<b>宴</b>Socials`,
    body12: `Dinners where partnerships start.`,
    title10: `<b>休</b>Me-Time`,
    body13: `Onsen, harbor, headspace.`,
    block: `Medical Devices`,
    title11: `Devices Residency`,
    body14: `Lab infrastructure for first-in-human prototypes.`,
    cta: `Apply →`,
    block2: `Therapeutics`,
    title12: `Therapies Residency`,
    body15: `Direct PMDA connection for conditional approval.`,
    cta2: `Apply →`,
    block3: `Community`,
    title13: `Builder Pass`,
    body16: `Full access to everything. Build, connect, explore.`,
    ebTag: `Early Bird`,
    price: `$399 <s>$1500</s>`,
    left: `140 passes remaining`,
    ebClock: `Ends in <span class="ebc">&#8212;</span>`,
    cta3: `Apply →`,
    cta4: `<a class="btn accent" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="residency_cta" data-analytics-target="residency">Become a builder</a>`,
  },

  /* ─── WHY KOBE ─────────────────────────── */
  whyKobe: {
    eyebrow: `Why Kobe`,
    headline: `What takes years elsewhere<br/>takes months here.`,
    body: `Japan's regulatory framework is the fastest legal path from clinical evidence to patients. KBIC is its front door.`,
    statValue: `$88B`,
    statLabel: `3rd-largest pharma market · ¥12.4T`,
    statValue2: `4`,
    statLabel2: `Accelerated regulatory pathways`,
    statValue3: `2/3`,
    statLabel3: `AMED subsidy · matches 1:2 vs VC`,
    statValue4: `370`,
    statLabel4: `KBIC member organisations`,
    statValue5: `32`,
    statLabel5: `Nobel prizes · 4 biotech clusters`,
  },

  /* ─── TRACK RECORD ─────────────────────────── */
  trackRecord: {
    eyebrow: `Track Record`,
    headline: `Four times at scale,<br/>on three coasts.`,
    number: `500+`,
    title: `Vitalia City Pop-Ups · Roatán · 2024–25`,
    body: `Builders in a regulatory sandbox. Two popups became a permanent hub.`,
    number2: `400+`,
    title2: `Viva Frontier Tower Pop-Up · San Francisco · 2025`,
    body2: `Residents of a 6-week vertical village with biomarker testing, daily programming, and a Demo Day. Peter Diamandis, Aubrey de Grey, Emmett Shear, Patri Friedman.`,
    number3: `40M+`,
    title3: `Meet the Drapers · Roatán &amp; SF · 2025–26`,
    body3: `TV viewers across two shows with Tim &amp; Adam Draper. Muse.Bio won the $1M finale.`,
    number4: `MIT`,
    title4: `Human Augmentation Summit · Media Lab · 2025`,
    body4: `~300 people on BCIs and bioengineering, with Stephen Wolfram, Life Biosciences, and Harvard.`,
    stamp: `◆ NEXT · 2026 · KOBE — MIRAI TECH POPUP CITY · <b>YOU ARE HERE</b>`,
  },

  /* ─── APPLY ─────────────────────────── */
  apply: {
    eyebrow: `October 2026 · 300 Curated Residents`,
    headline: `The future is<br/>built here.`,
    buttons: `Tickets for the Summits &amp; Fashion Show. Applications for the Residency.`,
    buttons2: `<a class="btn accent" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="apply" data-analytics-target="tickets">Get Tickets</a> <a class="btn" href="https://luma.com/an4zotn9" target="_blank" rel="noopener" data-analytics-action="checkout" data-analytics-location="apply" data-analytics-target="residency">Apply for the Residency</a> <a class="btn ghost" href="#">Sponsor the City</a>`,
    footnote: `Tickets &amp; residency on Luma · Applications reviewed on a rolling basis`,
    footnote2: `Sponsors reach 300 residents and 43 speakers`,
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
    heroDotWords:      ['Eradicate', 'Extend', 'Augment', 'Live'],

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
