// Copy and facts for the Residency 2027 landing page (brief.md, Nov 12 2026).
// Every word on the homepage lives here; components only render it.
//
// Sources: brief.md; ~/Downloads/Mirai_Tech_City_2026_Results.pdf (8 Nov 2026).
// Rules for anyone editing this file:
// - Plain, literal copy. The imagery and type carry the mystique, not metaphors.
// - Japan tone: Japan built the path; founders learn and use it. Never "loophole",
//   "shortcut", "faster than the FDA", "shape/reform regulation". Read every line as a
//   PMDA official would.
// - KBIC is never a "host". GlobalDeal's own wording belongs to Karen (see memory).
// - Facts below are confirmed by the brief or the results report. Anything marked
//   TODO is not confirmed and must not be invented.

export const residency = {
  short: 'Residency 2027', // used by the /lab design-round variants only

  // Primary CTA. TODO: confirm this is the residency form (it was the Aug 2026 sprint form).
  applyHref: 'https://form.typeform.com/to/sG9eS2Ok',
  talkHref: 'https://calendly.com/nelson-frontierhumans/mtc-acceleration-sprint',
  apply: 'Apply for March 2027',
  talk: 'Talk to us first',

  seo: {
    title: 'Mirai Tech City Residency · Mount Fuji and Kobe · March 2027',
    description:
      'A one-month residency in Japan for early-stage regenerative medicine startups: three weeks of focused work at Mount Fuji, a week of meetings in Kobe, and a Demo Day with investors including Tim Draper.',
  },

  // ── Opening ──────────────────────────────────────────────
  hero: {
    eyebrow: 'Residency · March 2027',
    // Used by the /lab design-round variants only (the shipped opening uses pre + word).
    claims: ['A month at Mount Fuji', 'Build your company at Mount Fuji', 'Four weeks in Japan. One Demo Day.'],
    sub: 'A one-month residency for early-stage regenerative medicine startups. Three weeks of focused work at the foot of Mount Fuji, one week of meetings in Kobe, and a Demo Day with investors including Tim Draper.',
    // Used by the /lab design-round variants only (Nelson removed the tags from the opening, Nov 16 2026).
    meta: ['March 2027', 'Mount Fuji → Kobe', 'Regenerative medicine'],
    kanji: '不死', // fushi, "without death": one old reading of the name Fuji
    // The giant word set behind the summit, and the line above it.
    pre: 'Build Your Biotech Startup in',
    word: 'Japan',
    survey: ['3,776 m', '35.3606° N 138.7274° E'],
    scrollCue: 'Scroll',
  },

  // ── The legend (why Fuji) ────────────────────────────────
  legend: {
    eyebrow: 'Why Fuji',
    headline: "Fuji's oldest legends are about the search for eternal life",
    paragraphs: [
      'The first emperor of China sent Xu Fu across the sea to find the elixir of immortality, and he landed in Japan.',
      'In The Tale of the Bamboo Cutter, often called the oldest Japanese story, an emperor has the elixir of life burned on the summit of Mount Fuji, the mountain closest to heaven. One popular reading of the name is 不死, fushi: without death.',
      'We are bringing founders who are working on the real thing to the mountain.',
    ],
  },

  // ── Who we are / mission ─────────────────────────────────
  mission: {
    eyebrow: 'Who we are',
    headline: '10,000 cures',
    big: '10,000', // the monumental number
    unit: 'cures',
    body: [
      'Mirai Tech City is a community for frontier biotech: how to build it, and how to bring it to patients fast and safely.',
      'There are more than 10,000 rare diseases. Our goal is 10,000 cures, shipped through our community.',
      "Japan's Act on the Safety of Regenerative Medicine (ASRM) gives regenerative medicine a clear, safe path to first-in-human studies. We help founders learn it and use it.",
      'We work with Kobe University and have a wide network across Japanese biotech.',
    ],
  },

  // ── What startups receive ────────────────────────────────
  receive: {
    eyebrow: 'The program',
    headline: 'What you get in four weeks',
    items: [
      { n: '01', kanji: '法', title: 'ASRM workshops', body: 'Workshops on how ASRM works in Japan and how to write and submit an ASRM research proposal.' },
      { n: '02', kanji: '数', title: 'Investable numbers', body: 'Polish your unit economics and financials until they are ready for investors.' },
      { n: '03', kanji: '縁', title: 'Meetings arranged for you', body: 'Map the people and organizations you want to meet in Japan. In the last week, we arrange the meetings.' },
      { n: '04', kanji: '闘', title: 'Pitch Fight Club', body: 'Learn to pitch your company and the startup basics, then pitch again, and again.' },
    ],
  },

  // ── The month ────────────────────────────────────────────
  month: {
    eyebrow: 'The month',
    headline: 'Three weeks of focus. One week of meetings.',
    stages: [
      { when: 'Weeks 1–3', place: 'Mount Fuji', kanji: '富士', title: 'Deep work', body: 'Live and work together at the foot of the mountain: your company, your Japan landing plan, workshops and pitch practice.' },
      { when: 'Week 4', place: 'Kobe', kanji: '神戸', title: 'Meetings', body: 'Move to the Kobe Biomedical Innovation Cluster for the meetings we arrange with the stakeholders you mapped.' },
      { when: 'End of the month', place: 'Kobe', kanji: '発表', title: 'Demo Day', body: 'Pitch to investors, including Tim Draper.' },
    ],
  },

  // ── Week 4 + Demo Day (Kobe) ─────────────────────────────
  // Two places in Kobe: meetings in KBIC on Port Island (never call KBIC a host), then
  // Demo Day in Orbis Hall inside the Kobe Fashion Museum on Rokko Island, "the UFO
  // building" (2026 Demo Day venue per the results report; Nelson, Nov 15 2026: "the
  // venue we use"). Photos: content/photos-kobe.json.
  kobe: {
    eyebrow: 'Week 4 · Kobe',
    headline: 'The last week: meetings + Demo Day',
    meetings: {
      // A place may start with its island ("Island · Place"); the map's island names come from `route`.
      place: 'Kobe Biomedical Innovation Cluster',
      title: 'Meetings',
      body: "Move into the Kobe Biomedical Innovation Cluster on Port Island, Japan's largest biomedical cluster. We arrange meetings with the people and organizations you mapped in the first three weeks.",
    },
    demo: {
      place: 'Rokko Island · Kobe Fashion Museum',
      title: 'Demo Day',
      body: 'The month ends on stage in Orbis Hall, inside the Kobe Fashion Museum, the UFO-shaped building where Cohort 0 pitched in October 2026. You pitch to investors, including Tim Draper.',
    },
    venue: { name: 'Kobe Fashion Museum', nickname: 'The UFO building', hall: 'Orbis Hall', island: 'Rokko Island' },
    route: 'Port Island → Rokko Island',
    investors: 'Investors including Tim Draper',
    // Chapter mark: 舞台 (butai, the stage). 神戸 is already the big kanji in the Month section.
    mark: '舞台',
  },

  // ── Who it is for ────────────────────────────────────────
  fit: {
    eyebrow: 'Who it is for',
    headline: 'Early-stage regenerative medicine',
    body: 'The residency is for early-stage startups working directly on regenerative medicine, or in a field that supports it.',
    yes: ['Working directly on regenerative medicine', 'Building tools, devices, data or services that regenerative medicine depends on'],
    // TODO: cohort size, price/terms and exact dates are not confirmed. Do not state them.
  },

  // ── Cohort 0 (proof) ─────────────────────────────────────
  cohort0: {
    eyebrow: 'Cohort 0 · Kobe, October 2026',
    headline: 'All seven are building a base in Japan.',
    lead: 'Seven companies came to do business in Japan for the first time. All seven are continuing to build here. Some were picked up by Antler, others received in-kind support from GlobalDeal, and every one of them made new partnerships in Japan.',
    stats: [
      { value: '7', label: 'First-time Japan entrants' },
      { value: '7', label: 'Continuing to build in Japan' },
      { value: '150+', label: 'Attendees' },
      { value: '76', label: 'Speakers' },
      { value: '17', label: 'Demo Day teams' },
    ],
    // All seven Cohort 0 teams are continuing to build in Japan (Japan program manager, Nov 18
    // 2026: HALOS Biosciences and Eightsix Science added to the five from the results report p.10).
    companies: ['Avenyx Bio', 'aeon.science', 'Cingularity', 'Muse Bio', 'Probabilistic Bio', 'HALOS Biosciences', 'Eightsix Science'],
    companiesLabel: 'Continuing to build in Japan',
    note: 'Company plans in progress, November 2026.',
    filmCaption: 'Demo Day · Kobe · Oct 26 2026',
    filmLabel: 'Demo Day 2026 footage: teams on stage, the audience laughing, the cohort gathering for a group photo.',
    // Prefixed with the speaker count. Only name institutions shown in the face strip.
    network: 'speakers in 2026, from Kobe University to Harvard',
    lastYearLink: 'All 2026 speakers and the full agenda', // links to /2026
  },

  // ── Life (real photos) ───────────────────────────────────
  life: {
    eyebrow: 'Life in Japan',
    headline: 'Come to build your company, stay for the great people',
    lead: 'Real photos from Cohort 0 in Kobe: the dinners, the labs, the trips, the people.',
  },

  // ── Voices (testimonials to come) ────────────────────────
  voices: {
    eyebrow: 'In their words',
    headline: 'From Cohort 0',
    // Testimonials from Cohort 0 founders (more being collected). { quote, name, role, company }
    items: [
      {
        quote: "Thanks to you at Mirai Tech City, I toured Nobel laureate Yamanaka's lab and was introduced to many brilliant scientists.",
        name: 'Max Koko', role: 'CEO, Founder', company: 'Probabilistic Bio',
      },
    ] as { quote: string; name: string; role: string; company?: string }[],
  },

  // ── Final call ───────────────────────────────────────────
  final: {
    eyebrow: 'Residency · March 2027',
    headline: 'Join the next cohort',
    body: 'Applications are open for early-stage regenerative medicine startups.',
  },

  nav: [
    { href: '/#program', label: 'Program' },
    { href: '/#month', label: 'The month' },
    { href: '/#cohort-0', label: 'Cohort 0' },
    { href: '/2026', label: '2026' },
    { href: '/blog', label: 'Blog' },
  ],
  navCta: 'Apply',
  home: '/',
  langSwitch: { href: '/jp', label: '日本語', lang: 'ja' },
  footerLine: 'Residency · March 2027 · Mount Fuji → Kobe',
  newTab: '(opens in a new tab)', // screen-reader suffix on links that open a new tab
  // Fuji photo alt (opening and month), and per-language photo text keyed by file name
  // (without .webp). English falls back to content/photos-2026.json.
  fujiAlt: 'Mount Fuji at sunrise, across a still lake',
  photoText: {
    // English overrides where the page shows a photo differently from the manifest.
    'ufo-exterior-day-01': { alt: 'The white saucer-shaped entrance of the Kobe Fashion Museum above a wide stone staircase.', caption: 'The Kobe Fashion Museum entrance on Rokko Island.' },
    'lab-supercomputer-01': { alt: 'Rows of computer cabinets behind a glass wall in a large dark hall.', caption: 'Fugaku supercomputer during Cohort 0, October 2026.' },
  } as Record<string, { alt: string; caption?: string }>,
  // Readings shown under each section's kanji mark (romaji in English, hiragana in Japanese).
  marks: { program: 'Mirai', month: 'Fuji', kobe: 'The stage', cohort: 'Jisseki', life: 'Kurashi · Daily life', apply: 'Ōbo · Apply' },
  ui: { source: 'Source', primaryNav: 'Primary', footerNav: 'Footer', menu: 'Menu', close: 'Close', play: 'Play', pause: 'Pause', rss: 'RSS' },

  credits: 'Mt. Fuji and Lake Shojiko at sunrise, by hogeasdf, CC BY 2.0, via Wikimedia Commons. Colour graded and cropped.',
  // CC BY 2.0 attribution links: the source file page and the licence.
  creditLinks: { source: 'https://commons.wikimedia.org/wiki/File:Mt.Fuji_and_Lake_Shojiko_at_sunrise.jpg', license: 'https://creativecommons.org/licenses/by/2.0/' },
};

export type Residency = typeof residency;
