export const LUMA_EVENT_URL = 'https://luma.com/an4zotn9?utm_parameter=landing';

/**
 * The landing page's section registry — the single source of truth for
 * section ids and labels. Navbar (navLabel subset), ProgressRail
 * (railLabel), and scroll tracking all derive from this. Never hardcode
 * a parallel list of section ids/labels in a component.
 */
export interface SectionDef {
  id: string;
  /** Shown in the top navbar; omit to keep the section out of the navbar. */
  navLabel?: string;
  /** Shown in the right-edge progress rail tooltip. */
  railLabel: string;
}

export const SECTIONS: SectionDef[] = [
  { id: 'tracks', navLabel: 'Tracks', railLabel: 'CHOOSE YOUR STARTER' },
  { id: 'month', navLabel: 'Program', railLabel: 'THE MONTH' },
  { id: 'runway', navLabel: 'Show', railLabel: 'THE SHOW' },
  { id: 'kobe', navLabel: 'Kobe', railLabel: 'WHY KOBE' },
  { id: 'practical', railLabel: 'ON THE GROUND' },
  { id: 'proof', navLabel: 'Speakers', railLabel: 'FIGHTERS' },
  { id: 'apply', railLabel: 'APPLY' },
  { id: 'faq', railLabel: 'FAQ' },
];

export interface Track {
  id: string;
  name: string;
  type: string;
  color: string;
  colorBright: string;
  colorRgb: string;
  darkBg: string;
  hint: string;
  description: string;
  stats: { label: string; value: string; fill: string }[];
}

export const tracks: Track[] = [
  {
    id: 'devices',
    name: 'Devices Residency',
    type: 'Medical Devices',
    color: '#6DB5F5',
    colorBright: '#8DC8F8',
    colorRgb: '109,181,245',
    darkBg: '#0d1520',
    hint: 'Lab infrastructure for first-in-human prototypes.',
    description:
      'Lab infrastructure ready on Port Island. Bring your exoskeletons, BCIs, prosthetics, biosensors, and wearables onto the PMDA device pathway — and walk the Frontier Human Fashion Show runway.',
    stats: [
      { label: 'Lab Access', value: 'Full', fill: '95%' },
      { label: 'PMDA Track', value: 'Device', fill: '80%' },
      { label: 'Demo Day', value: 'Runway', fill: '100%' },
    ],
  },
  {
    id: 'therapies',
    name: 'Therapies Residency',
    type: 'Therapeutics',
    color: '#F5D34E',
    colorBright: '#F8E06A',
    colorRgb: '245,211,78',
    darkBg: '#1a1710',
    hint: 'Connect directly with PMDA for conditional approval.',
    description:
      'Post Phase 1b biotech companies connecting directly with PMDA and Japanese consulting firms on Japan\'s accelerated pathways. Culminates in a PMDA pre-submission and go-to-market roadmap.',
    stats: [
      { label: 'Regulatory', value: 'PMDA', fill: '100%' },
      { label: 'Stage', value: '> Ph1b', fill: '70%' },
      { label: 'Outcome', value: 'Roadmap', fill: '90%' },
    ],
  },
  {
    id: 'builder',
    name: 'Builder Pass',
    type: 'Community',
    color: '#F56B6B',
    colorBright: '#F88A8A',
    colorRgb: '245,107,107',
    darkBg: '#1a1012',
    hint: 'Full access to everything. Build, connect, explore.',
    description:
      'Open to entrepreneurs, operators, investors, and anyone drawn to the community. Full access to theme week programming, community events, meetups, the Fashion Show, and popup city life.',
    stats: [
      { label: 'Access', value: 'Full', fill: '85%' },
      { label: 'Network', value: 'Global', fill: '95%' },
      { label: 'Vibes', value: '∞', fill: '100%' },
    ],
  },
];

export interface Chapter {
  ep: string;
  kanji: string;
  title: string;
  dates: string;
  synopsis: string;
  colorClass: string;
  /** Accent as "r, g, b" — must match the colorClass theme in landing.css. */
  colorRgb: string;
  /** Accent as hex — must match the colorClass theme in landing.css. */
  color: string;
  imageSrc: string;
  events: string[];
  themes?: string[];
}

export const chapters: Chapter[] = [
  {
    ep: 'EP.01',
    kanji: '壱',
    title: 'Open Weeks',
    dates: 'Oct 01 – 16',
    synopsis: 'Co-building begins. Arrivals and tours, then Welcome Day on Oct 4, residency benches open, and two weeks to settle into Kobe and explore Japan alongside your cohort.',
    colorClass: 'ch-arrival',
    colorRgb: '78, 205, 196',
    color: '#4ECDC4',
    imageSrc: '/images/chapters/arrival.jpg',
    events: [
      'KBIC lab tours & orientation',
      'Welcome day & community kickoff (Oct 4)',
      'Residency benches open',
      'Port Island & Japan exploration',
    ],
  },
  {
    ep: 'EP.02',
    kanji: '弐',
    title: 'Summit I: The Science & Tech Augmenting Life',
    dates: 'Oct 17 – 18',
    synopsis: 'Part of the Longevity Biomedical Summit. The opportunities and the imperative of longevity biomedical innovation in Japan.',
    colorClass: 'ch-longevity',
    colorRgb: '245, 197, 66',
    color: '#F5C542',
    imageSrc: '/images/chapters/longevity.jpg',
    events: [
      "Japan's Longevity Imperative — what Japan learned & what it needs from the world",
      'KBIC as a global laboratory for longevity',
      'Bioengineering, MedTech, biostasis, replacement & augmentation',
      "Women's Health: the next trillion-dollar market",
      'AI×Longevity Bio',
    ],
    themes: ['Biomedical', 'Policy', 'Community', 'AI'],
  },
  {
    ep: 'EP.03',
    kanji: '参',
    title: 'Summit II: From East to West — Bridging the Longevity Gap',
    dates: 'Oct 24 – 25',
    synopsis: 'Bottlenecks and solutions to accelerate longevity biomedicine — and what the world looks like once we cure all diseases.',
    colorClass: 'ch-enhance',
    colorRgb: '91, 141, 239',
    color: '#5B8DEF',
    imageSrc: '/images/chapters/enhance.jpg',
    events: [
      'Longevity trends, supercentenarians, impact & bottlenecks',
      'The stakeholders: investment, R&D, entrepreneurship, regulation as an acceleration mechanism',
      "Japan's model: conditional approval generating real-world evidence",
      'Visions for the Future of Longevity',
    ],
    themes: ['Biomedical', 'Policy', 'Community', 'AI'],
  },
  {
    ep: 'EP.04',
    kanji: '肆',
    title: 'Fashion Show & Close',
    dates: 'Oct 26 – 31',
    synopsis: 'Runway prep, rehearsals, press day. The Frontier Human Fashion Show & Demo Day on Oct 26 — where devices become couture.',
    colorClass: 'ch-fashion',
    colorRgb: '255, 107, 146',
    color: '#FF6B92',
    imageSrc: '/images/chapters/fashion.jpg',
    events: [
      'Prototype polish & final builds',
      'PMDA regulatory submissions',
      'Press day & media preview',
      'The Frontier Human Fashion Show & Demo Day (Oct 26)',
    ],
  },
];

export interface WeeklyProgram {
  label: string;
  detail: string;
  /** Decorative kanji watermark for the rhythm rail. */
  kanji: string;
  /** Accent as "r, g, b" — drawn from the chapter/iridescent palette. */
  colorRgb: string;
  /** Accent as hex — must match colorRgb. */
  color: string;
}

export const weeklyPrograms: WeeklyProgram[] = [
  { label: 'Vibe Coding Nights', detail: 'Ship together after dark', kanji: '夜', colorRgb: '91, 141, 239', color: '#5B8DEF' },
  { label: 'The Residency', detail: 'Benches, labs, deep work', kanji: '研', colorRgb: '78, 205, 196', color: '#4ECDC4' },
  { label: 'Learning Layer Labs', detail: 'Hands-on skill sessions', kanji: '学', colorRgb: '245, 197, 66', color: '#F5C542' },
  { label: 'Biohackers Workshops', detail: 'Self-experiments & protocols', kanji: '実', colorRgb: '212, 184, 255', color: '#D4B8FF' },
  { label: 'Socials', detail: 'Dinners, drinks, connection', kanji: '宴', colorRgb: '255, 107, 146', color: '#FF6B92' },
  { label: 'Me-Time by CHANGE', detail: 'Recovery & reset', kanji: '休', colorRgb: '184, 227, 255', color: '#B8E3FF' },
];

export interface LifestyleCard {
  id: string;
  tag: string;
  title: string;
  description: string;
  kanji: string;
  hudTitle: string;
  hudSubtitle: string;
  hudText: string;
  stats: { value: string; label: string }[];
  hp: number;
  abilities: { name: string; cost: string; effect: string }[];
  flavorText: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare';
  setCode: string;
}

export const lifestyleCards: LifestyleCard[] = [
  {
    id: 'onsen',
    tag: 'Wellness',
    title: 'Onsen Culture',
    description: 'Natural hot springs woven into daily recovery rituals.',
    kanji: '湯',
    hudTitle: 'Onsen Culture',
    hudSubtitle: 'Arima · Kobe · Recovery',
    hudText:
      'Arima Onsen, one of Japan\'s oldest hot spring towns, is 30 minutes from Port Island. Gold and silver springs for daily recovery between lab sessions.',
    stats: [
      { value: '1300+', label: 'Years' },
      { value: '30min', label: 'Transit' },
      { value: '2', label: 'Springs' },
    ],
    hp: 120,
    abilities: [
      { name: 'Mineral Soak', cost: '湯', effect: 'Restore 40 HP. Remove all status conditions.' },
      { name: 'Rotenburo', cost: '湯', effect: 'If played at night, draw 2 cards.' },
    ],
    flavorText: 'The waters remember what the body forgets.',
    rarity: 'ultra-rare',
    setCode: 'MTC-001/004 · KOBE SET',
  },
  {
    id: 'food',
    tag: 'Cuisine',
    title: 'Kobe Wagyu & Beyond',
    description: 'The world\'s most celebrated beef, in its hometown.',
    kanji: '食',
    hudTitle: 'Kobe Wagyu & Beyond',
    hudSubtitle: 'A5 · Sake · Izakaya',
    hudText:
      'Kobe beef needs no introduction. But the city\'s food scene goes far beyond — from Nankinmachi Chinatown to sake breweries in Nada, Kobe is a food city through and through.',
    stats: [
      { value: 'A5', label: 'Grade' },
      { value: '1.5M', label: 'Pop.' },
      { value: '∞', label: 'Umami' },
    ],
    hp: 160,
    abilities: [
      { name: 'A5 Cut', cost: '食', effect: 'Deal 80 damage. Discard 1 energy.' },
      { name: 'Omakase', cost: '食', effect: 'Look at the top 3 cards of your deck.' },
    ],
    flavorText: 'In Kobe, the cow is the artist.',
    rarity: 'rare',
    setCode: 'MTC-002/004 · KOBE SET',
  },
  {
    id: 'fitness',
    tag: 'Movement',
    title: 'Mountain & Sea',
    description: 'Rokko mountain trails meet harbor-front runs.',
    kanji: '動',
    hudTitle: 'Mountain & Sea',
    hudSubtitle: 'Rokko · Harbor · Trails',
    hudText:
      'Mt. Rokko\'s trails start 20 minutes from the lab. Harbor-front running paths, climbing gyms, and onsen recovery make Kobe a biohacker\'s playground.',
    stats: [
      { value: '931m', label: 'Summit' },
      { value: '20min', label: 'To Trail' },
      { value: '365', label: 'Days/Yr' },
    ],
    hp: 100,
    abilities: [
      { name: 'Morning Run', cost: '動', effect: '+20 speed until end of turn.' },
      { name: 'Port Island Circuit', cost: '動', effect: 'Move to any bench position.' },
    ],
    flavorText: 'The mountain doesn\'t care about your pace.',
    rarity: 'uncommon',
    setCode: 'MTC-003/004 · KOBE SET',
  },
  {
    id: 'explore',
    tag: 'Culture',
    title: 'Osaka · Kyoto · Nara',
    description: 'Kansai\'s ancient capitals at your doorstep.',
    kanji: '遊',
    hudTitle: 'Osaka · Kyoto · Nara',
    hudSubtitle: 'Day Trips · Culture · History',
    hudText:
      'Kobe sits at the heart of the Kansai region. Osaka\'s street food (~40 min), Kyoto\'s temples (~90 min), and Nara\'s deer park are all day-trip distance — and Tokyo is 3 hours by shinkansen.',
    stats: [
      { value: '40m', label: 'Osaka' },
      { value: '90m', label: 'Kyoto' },
      { value: '3h', label: 'Tokyo' },
    ],
    hp: 140,
    abilities: [
      { name: 'Shrine Visit', cost: '遊', effect: 'Flip a coin. Heads: gain 1 blessing token.' },
      { name: 'Night Market', cost: '遊', effect: 'Search your deck for any item card.' },
    ],
    flavorText: 'Three cities. A thousand years. One train pass.',
    rarity: 'rare',
    setCode: 'MTC-004/004 · KOBE SET',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'Who is this for?',
    answer:
      'Biotech builders with working prototypes (Devices), post-Phase 1b therapeutic companies (Therapies), and entrepreneurs, operators, and investors who want to be part of the community (Builder).',
  },
  {
    question: 'Where exactly in Kobe?',
    answer:
      'Port Island, home to KBIC (Kobe Biomedical Innovation Cluster). A purpose-built biomedical district with lab infrastructure, connected to central Kobe via the Port Liner monorail.',
  },
  {
    question: 'How long is the program?',
    answer:
      'Four weeks: October 1–31, 2026. You can attend the full month or specific theme weeks, depending on your track.',
  },
  {
    question: 'What does the Builder Pass include?',
    answer:
      'Full access to all theme week programming, community events, meetups, the Frontier Human Fashion Show, and popup city lifestyle. Lab access and PMDA regulatory support require applying through a residency track.',
  },
  {
    question: 'What is the Frontier Human Fashion Show?',
    answer:
      'A live demo day reimagined as a runway show. Device residents showcase their prototypes on models, blending medical technology with fashion. Think CES meets Tokyo Fashion Week.',
  },
  {
    question: 'How do applications work?',
    answer:
      'Builder passes are available directly through our ticketing page. Residency tracks are application-only — we review on a rolling basis, and accepted teams receive next steps by email.',
  },
  {
    question: 'What is a popup city?',
    answer:
      'A temporary village where a curated community lives, works, and builds together in one place for one month. Housing, labs, programming, and social life share the same few blocks on Port Island, so the people you meet at breakfast are the ones you build with by night.',
  },
  {
    question: 'Where do I stay?',
    answer:
      'Two options: our partner hotel, the Portopia, a short walk from KBIC, or one of the community hacker houses — The Sanctuary, Biopunk House, Aevitas, and ZuCity Japan. Housing details arrive with your acceptance.',
  },
];

export const runwayDevices = [
  'Exoskeletons',
  'Neural Interfaces',
  'Smart Prosthetics',
  'Biosensors',
  'Haptic Suits',
  'AR/VR Medical',
];

export interface Evolution {
  name: string;
  stage: number;
  desc: string;
}

/**
 * Evolution-line copy for the three mascots. Currently unreferenced —
 * its consumer (EvolutionShowcase) was cut in the apply-section redesign
 * — but intentionally kept with the sprites for a possible return.
 */
export const evolutions = {
  devices: [
    { name: 'Volt', stage: 1, desc: 'You arrive with a working prototype and a plan to test it on humans.' },
    { name: 'Voltaic', stage: 2, desc: 'KBIC labs open. Regulatory mapping begins. Your device meets real infrastructure.' },
    { name: 'Voltron', stage: 3, desc: 'First-in-human pathway clear. You walk the Fashion Show runway with your device on a body.' },
  ] as Evolution[],
  therapies: [
    { name: 'Helix', stage: 1, desc: 'You land with clinical data and a regulatory question mark.' },
    { name: 'Helion', stage: 2, desc: 'Face-to-face with PMDA. SAKIGAKE framework mapped. Your pathway starts to crystallize.' },
    { name: 'Helios', stage: 3, desc: 'Pre-submission roadmap locked. You leave with a conditional approval strategy ready to execute.' },
  ] as Evolution[],
  builder: [
    { name: 'Ember', stage: 1, desc: 'You show up knowing nobody. Just curiosity and a carry-on.' },
    { name: 'Kindling', stage: 2, desc: 'Two weeks deep. You know every founder by name. Three collabs already forming.' },
    { name: 'Inferno', stage: 3, desc: 'A month of building. Lifelong co-founders, investors on speed dial, ready to launch.' },
  ] as Evolution[],
};
