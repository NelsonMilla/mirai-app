/* ============================================================
   MIRAI TECH CITY — EARLY BIRD PAGE COPY
   Every word on early-bird/index.html lives here. Edit the text
   between the backticks. Do NOT rename the keys on the left —
   the page looks elements up by those.

   Same convention as the main site's /copy.js, with one addition:
   a value may be an ARRAY, which renders as <li> items (used for
   the speaker roster and the two bullet lists).

   HTML inside a string (<b>, <strong>, <span>, <time>) is
   intentional — it carries styling the page depends on.

   ── THINGS THAT ARE NOT IN HERE, AND WHY ──────────────────
   • <title> and <meta description/og:*> stay in index.html.
     Social previews are read by scrapers that do not run JS.
   • Image alt text stays in index.html. This file sets element
     CONTENT, not attributes.
   • `datetime="..."` values inside <time> tags are machine
     readable. If you change a visible date, change its datetime
     to match.
   • The 31 tick marks in the month strip are decoration, not
     copy. So are the Luma URLs and the data-analytics-* hooks.
   • The live countdown digits are injected by the script at the
     bottom of index.html. Only the "Closes in" LABEL is here.

   ── PRICES APPEAR IN MANY PLACES ──────────────────────────
   $399 is written into hero, included.ctaCopy, proof.ctaCopy,
   price.* , close.faqA1 and close.receiptValue1. If the price
   ever changes, search this file for 399 and fix every hit.
   ============================================================ */
window.MIRAI_COPY = {

  /* ─── SKIP LINK + NAV ─────────────────────────── */
  nav: {
    skipLink: `Skip to the offer`,
    logo: `Mirai <span>Tech City</span>`,
    meta: `Early Bird · Kobe · October 1–31`,
    cta: `Get My Pass — $399`,
  },

  /* ─── 1 · HERO ─────────────────────────── */
  hero: {
    /* This one also gets rewritten by the script after Aug 31 —
       see js.offerEndedStatus below. */
    status: `Early Bird · Ends August 31`,
    clockLabel: `Closes in`,
    clockSrOnly: `The Early Bird price closes on 31 August 2026.`,

    /* Both lines are permanent. The price is deliberately not in the
       headline — it is carried by the CTAs and the pricing section, so
       nothing here needs to disappear after Aug 31. */
    headline: `<span class="early-page__hero-line">A Month in Japan for</span><span class="early-page__hero-accent">Biotech Leaders.</span>`,

    lead: `A month of biotech and longevity in Japan. Your pass covers both summit weekends, the Fashion Show, and everything in between.`,

    /* The four-cell fact ledger under the lead. */
    factLabel1: `When`,
    factValue1: `<time datetime="2026-10-01">Oct 1</time>–<time datetime="2026-10-31">31</time>, 2026`,
    factLabel2: `Where`,
    factValue2: `Kobe, Japan`,
    factLabel3: `Your dates`,
    factValue3: `Pick them later`,
    factLabel4: `Speakers`,
    factValue4: `43 confirmed`,

    cta: `Get My Pass — $399`,
    anchor: `After August 31, the same month costs <b>$1,500</b>.`,
    trust: `<span>Full refund until September 30</span><span>Checkout opens on Luma</span><span>Travel and hotel not included</span>`,
  },

  /* ─── 2 · WHAT YOU GET ─────────────────────────── */
  included: {
    eyebrow: `What the pass covers`,
    headline: `Two summits, one runway, 31 days.`,
    lead: `Your pass covers every public event in October. There is no schedule to lock in and nothing to add on. Come for the days you want and skip the rest.`,

    monthLabel: `Your pass is good for`,
    monthRange: `<time datetime="2026-10-01">Oct 01</time><span aria-hidden="true">→</span><time datetime="2026-10-31">Oct 31</time>`,
    monthNote: `One pass · Every public event · No dates to pick now`,
    /* Deliberately makes NO claim about what happens on any given
       day — the October schedule is still being built. Say what the
       pass COVERS, not how full the calendar is. */
    monthKey: `Your pass covers all 31 days. Come for one of them or all of them — the price is the same either way.`,

    /* The three anchor events. Dates are also in the datetime
       attributes in index.html — keep them in sync. */
    anchorDate1: `Oct 17—18`,
    anchorName1: `Summit I`,
    anchorCopy1: `Science and technology that make life better.`,
    anchorMeta1: `Two days`,

    anchorDate2: `Oct 24—25`,
    anchorName2: `Summit II`,
    anchorCopy2: `How the East and the West work on living longer.`,
    anchorMeta2: `Two days`,

    anchorDate3: `Oct 26`,
    anchorName3: `Fashion Show &amp; Demo Day`,
    anchorCopy3: `Medical devices worn down a runway, like couture. Device builders put their prototypes on models.`,
    anchorTags: [
      `Exoskeletons`,
      `Neural interfaces`,
      `Smart prosthetics`,
      `Biosensors`,
      `Haptic suits`,
      `AR/VR medical`,
    ],
    anchorMeta3: `One day`,

    aroundCaption: `Concept visual. Mirai runs for the first time in October 2026.`,
    aroundLabel: `Oct 01 — 31`,
    aroundHeadline: `The month is the point.`,
    /* "Peaks" framing, without asserting the rest of the calendar is
       packed — we do not know that yet. */
    aroundCopy: `The two summit weekends and the runway are the peaks. This is what runs in between them, and it is the reason people stay for weeks instead of days.`,
    aroundNote: `Programming is still being added. More is announced through September.`,
    aroundList: [
      `Workshops`,
      `Lab and community spaces`,
      `Longevity hackathons`,
      `Vibe Coding Nights`,
      `Partner programming`,
      `Wellness activities`,
      `Arrivals and tours early in the month`,
      `Welcome Day, <time datetime="2026-10-04">Oct 4</time>`,
    ],

    /* Each of the three CTA bands argues something different.
       This one argues SCOPE. Keep them distinct. */
    ctaCopy: `Come for one day, one weekend, or all 31. Same pass, same <strong>$399</strong>.`,
    cta: `Get My Pass — $399`,
  },

  /* ─── 3 · PROOF ─────────────────────────── */
  proof: {
    eyebrow: `Who is already booked`,
    headline: `Here are all <span class="early-page__proof-count">43</span> speakers.`,
    lead: `This is not a sample. Every speaker we have confirmed is named below. They speak across both summit weekends and the Fashion Show. More names are added through September.`,

    facts: `<li><b>300</b><span>Residents expected</span></li><li><b>2</b><span>Summit weekends</span></li><li><b>1</b><span>Fashion show</span></li>`,

    /* The four speakers we have portraits for. They are numbered
       01–04 and the roster below continues at 05. */
    speakerName1: `Aubrey de Grey`,
    speakerOrg1: `LEV Foundation`,
    speakerName2: `José Cordeiro`,
    speakerOrg2: `The Death of Death`,
    speakerName3: `Yuki Hanyu`,
    speakerOrg3: `Cellular Agriculture`,
    speakerName4: `Adam Gries`,
    speakerOrg4: `Vitalist Bay`,

    /* Speakers 05–43. The headline above says "all 43", and the
       last number is highlighted, so THIS LIST MUST HOLD EXACTLY
       39 NAMES. Add or remove one and the count breaks. */
    roster: [
      `Todd Porter`,
      `Josh Mann`,
      `Patri Friedman`,
      `Prof. Motoshi Hayano`,
      `Ian Huyett`,
      `Sandeep Casi`,
      `Sebastian Brunemeier`,
      `Brian Kennedy`,
      `Rob Claar`,
      `Natalie Coles`,
      `Devinder Sodhi`,
      `Sumit Jamuar`,
      `Keita Masui`,
      `Muneaki Goto`,
      `Prof. Takahiro Yasuda`,
      `Yuri Deigin`,
      `Laurence Ion`,
      `Rodney Kelly`,
      `Eleanor Sheekey`,
      `Prof. Stuart Reid`,
      `Mac Davis`,
      `Daniel Burger`,
      `Juliette Humer`,
      `Jeffrey Tibbetts`,
      `Ada Cyborg`,
      `Elen Capri`,
      `Cremieux`,
      `Nathan Cheng`,
      `Keiko Kobayashi`,
      `Felix OENS`,
      `Brandon Possin`,
      `Bilal Kharouni`,
      `Alice Gilman`,
      `Julie Ying Baron`,
      `Irit Rappley, PhD`,
      `Walter Patterson`,
      `Czar Gonzalez`,
      `Pedro Henrich`,
      `Nelson Milla`,
    ],
    rosterNote: `Count them. Listed in no order · more added through September`,

    partnersTitle: `Supported by`,
    partner1: `KBIC`,
    partner2: `Viva City`,
    partner3: `Vitalist Bay`,
    partner4: `HekaBio`,
    partner5: `ZuCity Japan`,
    partner6: `Augmentation Lab`,
    partnerNote: `KBIC is the Kobe Biomedical Innovation Cluster. It has <strong>370 member organisations</strong>, and it is based on the island where the city runs.`,

    /* This CTA band argues SOCIAL PROOF. */
    ctaCopy: `That is the room. <strong>$399 holds your place in it</strong> until August 31.`,
    cta: `Get My Pass — $399`,
  },

  /* ─── 4 · PRICE & RISK REVERSAL ─────────────────────────── */
  price: {
    eyebrow: `Why it costs $399`,
    headline: `The price only goes up.`,
    lead: `Mirai runs for the first time this October. Everything is booked. Two summit weekends, 43 confirmed speakers, labs, workshops, wellness programming, and a runway. None of it has happened yet, so there are no reviews to read. <strong>$399 is what it costs to say yes before anyone has been.</strong> Everyone who books after August 31 pays more.`,

    ladderTitle: `What a pass costs`,

    /* The live tier. Its bar width is set in index.html as
       --w:26.6% — that is 399/1500, so if a price changes the
       bar widths need recalculating too. */
    tierWhen: `Right now · through August 31`,
    tierName: `The whole month<span>Every public event in October. Come for one day or all 31.</span>`,
    tierAmount: `$399`,

    gateDate: `August 31`,
    gateNote: `The Early Bird ends. After this date, the same October costs this:`,
    gateClockLabel: `Closes in`,

    /* Prices after Aug 31. Bar widths: 60% / 80% / 100%. */
    laterName1: `One week<span>Pick the week that works for you</span>`,
    laterAmount1: `$900`,
    laterName2: `Two-Summit Pass<span>Both summits plus the Fashion Show</span>`,
    laterAmount2: `$1,200`,
    laterName3: `Full Month<span>This is the starting price. It climbs every week after.</span>`,
    laterAmount3: `$1,500`,

    savingAmount: `$501`,
    savingCopy: `The Early Bird is <strong>$501 less than one week</strong> costs after August 31. And it covers the whole month, not one week.`,

    refundKicker: `The safety net`,
    refundDate: `Sep 30`,
    refundHead: `Buy now. You can still change your mind.`,
    refundBody: `Ask for a refund any time before September 30 and we send back all $399. You do not need a reason. That is a month after the price goes up, so booking early costs you nothing to try.`,

    /* This CTA band argues RISK. */
    ctaCopy: `Pay <strong>$399</strong> today. Decide for real by <strong>September 30</strong>.`,
    cta: `Get My Pass — $399`,
  },

  /* ─── 5 · CLOSE + FAQ ─────────────────────────── */
  close: {
    eyebrow: `The last few questions`,
    headline: `Nothing left in the way.`,
    /* If you add or remove an FAQ item, change this number word. */
    lead: `Four straight answers. Then the button.`,

    faqQ1: `What do I get for $399?`,
    faqA1: `Every public event in October. Both summits, the Fashion Show and Demo Day, workshops, partner events, community time, and wellness activities.`,
    faqQ2: `Do I have to pick my dates now?`,
    faqA2: `No. Your pass works on any day in October. Come for one weekend, come for a week, or stay all 31 days. The price is the same.`,
    faqQ3: `Are flights and a hotel included?`,
    faqA3: `No. The pass pays for the program only. You book your own flight and your own room in Kobe.`,
    faqQ4: `Do I need to be a scientist?`,
    faqA4: `No. You do not need a science degree. Founders, builders, doctors, investors, students, and curious people are all welcome.`,

    finalStatus: `Early Bird · Ends August 31`,
    finalClockLabel: `Closes in`,
    finalClockSrOnly: `The Early Bird closes on 31 August 2026.`,
    finalTitle: `Everything is booked but you.`,
    finalLore: `A daruma gets one eye when you set a goal, and the second one when you reach it. Ours has had one eye since we picked the date. We paint the other on October 1.`,

    /* The receipt is hidden automatically after Aug 31, because
       it asserts a price that is no longer true. */
    receiptLabel1: `You pay`,
    receiptValue1: `$399`,
    receiptLabel2: `You get`,
    receiptValue2: `All of October`,
    receiptLabel3: `You can cancel`,
    receiptValue3: `Until Sep 30`,

    cta: `Get My Pass — $399`,
    checkoutNote: `Checkout opens on Luma`,
    fine: `Travel and hotel not included`,
  },

  /* ─── FOOTER ─────────────────────────── */
  footer: {
    mark: `Mirai <span>Tech</span>`,
    meta: `Kobe, Japan · October 1–31, 2026`,
    /* The daruma's hover tooltip is a title="" attribute, so it
       stays in index.html — this file sets content, not attributes. */
  },

  /* ─── STRINGS THE PAGE SCRIPT USES ───────────────────── */
  js: {
    /* After 31 August 2026 the page rewrites itself: every
       .offer-status element gets the first string, every checkout
       button gets the second. Both must stay PLAIN TEXT — the
       script assigns them with textContent, so any HTML here
       would show up as literal angle brackets. */
    offerEndedStatus: `Early Bird pricing has ended`,
    offerEndedCta:    `View Current Passes`,

    /* Shown in the countdown slots if the deadline passes while
       someone has the page open. */
    countdownClosed:  `Closed`,
  },
};

/* Applies the copy above to the page. Called near the end of <body>,
   BEFORE the countdown script — that script caches the .ebc clock
   elements, so nothing here may replace a node containing one.
   (No key does: only the "Closes in" labels beside them are here.)

   A string value is written as innerHTML.
   An array value is written as <li> items. */
window.applyCopy = function () {
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    var key = el.getAttribute('data-copy');
    var v = key.split('.').reduce(function (o, k) { return o && o[k]; }, window.MIRAI_COPY);

    if (typeof v === 'string') el.innerHTML = v;
    else if (Array.isArray(v)) el.innerHTML = v.map(function (item) {
      return '<li>' + item + '</li>';
    }).join('');
    else console.warn('[copy] missing key:', key);
  });
};
