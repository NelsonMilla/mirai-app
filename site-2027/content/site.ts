// Every word and number on the page lives here. Edit this file, not the components.
// Plain copy rule: literal titles and body, no jargon or metaphors.
// `null` stats and empty lists are hidden in production and shown as dashed
// placeholders in `npm run dev`, so the backbone stays visible while it fills up.
import speakers from './speakers-2026.json';

export type Photo = { src: string; alt: string; caption?: string };
export type Stat = { value: string | null; label: string };
export type Moment = { date: string; title: string; body: string; photo?: Photo };
export type Speaker = (typeof speakers)[number];
export type Ritual = { title: string; body: string; photo?: Photo };
export type Voice = { quote: string; name: string; role: string; post?: string }; // post = blog slug
// A trailer shot in the hero. src: an image path, 'video' (the harbour loop; poster on
// phones), or 'faces' (a grid of 2026 speakers). Stills are STAND-INS for event photos.
export type Shot = { src: string; place: string; kicker: string; lines: string[]; sub?: string };
export type Built = { name: string; line: string; url?: string; post?: string }; // post = blog slug

export const site = {
  lang: 'en' as 'en' | 'ja',
  home: '/', // this language's homepage
  langSwitch: { href: '/jp', label: '日本語', lang: 'ja' },
  name: 'Mirai Tech City',
  url: 'https://www.miraitech.city', // canonical URLs, sitemap and RSS are built from this
  ogImage: '/media/kobe_harbor_night_poster.jpg', // link-preview image when a page has none of its own
  title: 'Mirai Tech City · Kobe 2026 recap · Returning in 2027',
  description:
    'In October 2026, scientists, founders and builders spent a month in Kobe working on longevity and biomedicine. Mirai Tech City returns in 2027.',

  // Where "Get the 2027 announcement" goes. TODO: swap for a real signup form when there is one.
  notifyHref: 'mailto:team@miraitech.city?subject=Tell%20me%20about%20Mirai%20Tech%20City%202027',
  partnerHref: 'mailto:team@miraitech.city?subject=Partnering%20with%20Mirai%20Tech%20City%202027',

  nav: [
    { href: '/#2026', label: '2026' },
    { href: '/#speakers', label: 'Speakers' },
    { href: '/blog', label: 'Blog' },
    { href: '/#2027', label: '2027' },
  ],
  navCta: 'Get notified',

  hero: {
    eyebrow: 'Kobe · October 2026',
    headline: ['Mirai Tech City', 'returns in 2027'],
    // 2027 is not promised to Kobe: say Japan at most until dates and places are set.
    next: 'Next edition: Japan, 2027. Dates and places announced soon.',
    cue: 'Below: what happened in 2026',
    // The trailer above the headline: 3.6s per shot. 2026 shots may say Kobe; the
    // last shot is 2027 and must not. Swap stand-in stills for event photos here.
    shots: [
      { src: 'video', place: 'Kobe, 2026', kicker: 'October 1–31, 2026 · Kobe', lines: ['31 days'] },
      { src: '/img/life/portliner.webp', place: 'Port Island, 2026', kicker: 'Every day', lines: ['Labs · talks', 'dinners'] },
      { src: 'faces', place: 'Speakers, 2026', kicker: 'Longevity and biomedicine', lines: [`${speakers.length} speakers`] },
      { src: '/img/life/kyoto.webp', place: 'Kyoto, weekend', kicker: 'Oct 17–18 · Oct 24–25', lines: ['2 summits'] },
      { src: '/img/blog/demo/pillar-lab-robot.webp', place: 'Labs, 2026', kicker: 'Oct 26', lines: ['Demo Day'] },
      { src: '/img/blog/demo/lanterns.webp', place: 'Japan, 2027', kicker: 'Mirai Tech City', lines: ['Returns', 'in 2027'],
        sub: 'Dates and places announced soon' },
    ] as Shot[],
    primary: 'Get the 2027 announcement',
    secondary: 'See what happened',
  },

  recap: {
    eyebrow: '2026 in numbers',
    headline: 'What happened in Kobe',
    lead:
      'October 1–31, 2026. A month-long city for longevity and biomedical work, on Port Island in Kobe, Japan.',
    // TODO: fill the nulls with final numbers (attendees, countries, startups at Demo Day).
    stats: [
      { value: '31', label: 'Days in Kobe' },
      { value: '2', label: 'Summits' },
      { value: String(speakers.length), label: 'Speakers' },
      { value: null, label: 'Attendees' },
      { value: null, label: 'Countries' },
    ] as Stat[],
  },

  // The lifestyle pitch: what an ordinary day and week in Kobe looked like.
  // Wording adapted from new-site/experience/ ("One day on Port Island").
  // Photos marked STAND-IN are Kobe/Kansai stills from new-site, not event photos:
  // replace them with your own before launch. Kyoto: Fg2, public domain (Wikimedia).
  life: {
    eyebrow: 'A month in Kobe',
    headline: 'What a day looked like',
    lead: 'Mornings for your own work, afternoons in the labs, evenings in the city. Weekends further out.',
    items: [
      { title: 'Mornings for deep work', body: 'Breakfast at the cowork, then the morning is yours. Talks and meetings wait until the afternoon.' },
      { title: 'Afternoons in the labs', body: 'The Kobe Biomedical Innovation Cluster is one monorail stop away: lab tours, workshops and meetings.' },
      { title: 'Golden hour on the Port Liner', body: 'The ride home across the harbour. The commute you stop noticing by week three.',
        photo: { src: '/img/life/portliner.webp', alt: 'The Port Liner crossing to Port Island at golden hour' } }, // STAND-IN
      { title: 'Dinner at the izakaya', body: 'Groups form in the chat by six. Small counters, set dinners, long conversations.',
        photo: { src: '/img/life/izakaya.webp', alt: 'An izakaya counter in Kobe' } }, // STAND-IN
      { title: 'Weekends in Kyoto, Osaka and Nara', body: 'Each is an hour or less by train. Temples in the morning, back in Kobe by night.',
        photo: { src: '/img/life/kyoto.webp', alt: 'Autumn leaves in Kyoto' } }, // STAND-IN
      { title: 'Sundays at Arima Onsen', body: 'One of the oldest hot-spring towns in Japan, 30 minutes from Kobe.',
        photo: { src: '/img/life/arima.jpg', alt: 'Steam rising in Arima Onsen' } }, // STAND-IN
    ] as Ritual[],
  },

  moments: {
    eyebrow: 'The month',
    headline: 'Four moments',
    // TODO: add a photo to each moment once the event photos are in public/img/2026/.
    items: [
      {
        date: 'Oct 1',
        title: 'The city opens',
        body: 'Residents arrived on Port Island and the month-long residency began.',
      },
      {
        date: 'Oct 17–18',
        title: 'Summit I',
        body: 'Two days of talks and panels on longevity science and biomedicine.',
      },
      {
        date: 'Oct 24–25',
        title: 'Summit II',
        body: 'The second summit weekend of talks and panels.',
      },
      {
        date: 'Oct 26',
        title: 'Demo Day',
        body: 'Startups from the residency showed what they built during the month.',
      },
    ] as Moment[],
  },

  speakers: {
    eyebrow: 'Who spoke',
    headline: `${speakers.length} speakers in 2026`,
    list: speakers as Speaker[],
    // Big cards, in this order; everyone else goes in the compact list below them.
    // Keep Joe Betts-LaCroix out of this row (never beside Aubrey de Grey / LEV).
    headliners: ['aubrey_de_grey', 'george_church', 'motoshi_hayano', 'masataka_watanabe', 'takashi_aoi', 'derya_unutmaz'],
    restLabel: 'Also on stage',
  },

  // Short quotes from people who came. Link each to their "my month in Kobe" post when there is one.
  voices: {
    eyebrow: 'In their words',
    headline: 'Why they came',
    // TODO: 3–6 quotes, e.g. { quote: '…', name: 'Jane Doe', role: 'Founder, Acme Bio', post: 'jane-doe-month-in-kobe' }
    items: [] as Voice[],
    placeholderSlots: 3,
  },

  // The companies and projects from the month (Demo Day, the hackathon, residents).
  built: {
    eyebrow: 'Built in Kobe',
    headline: 'What came out of the month',
    lead: 'Companies and projects that worked from Port Island in October 2026.',
    // TODO: one entry per company, e.g. { name: 'Acme Bio', line: 'Cell therapy for …', url: 'https://…', post: 'acme-bio' }
    items: [] as Built[],
    placeholderSlots: 6,
  },

  latest: {
    eyebrow: 'From the blog',
    headline: 'Latest stories',
    all: 'All stories',
  },

  photos: {
    eyebrow: 'Photos',
    headline: 'Kobe, October 2026',
    // TODO: drop images into public/img/2026/ and list them here.
    // Example: { src: '/img/2026/summit-i-stage.jpg', alt: 'Summit I main stage', caption: 'Summit I · Oct 17' }
    items: [] as Photo[],
    placeholderSlots: 8,
  },

  next: {
    eyebrow: 'Mirai Tech City 2027',
    headline: 'We are coming back',
    lead: 'Dates, place and the first speakers for 2027 will be announced soon. Leave your email and you will hear first.',
    primary: 'Get the 2027 announcement',
    secondary: 'Partner with us',
  },

  blog: {
    eyebrow: 'Blog',
    headline: 'Stories from Mirai',
    lead: 'The companies, scientists and builders who came to Kobe in 2026, and what they are working on.',
    empty: 'The first posts are on their way.',
  },

  footer: {
    signoff: 'See you in 2027',
    date: 'Dates to be announced',
    links: [
      { href: 'mailto:team@miraitech.city', label: 'team@miraitech.city' },
    ],
    credits: '',
  },
};

export type Copy = typeof site;
