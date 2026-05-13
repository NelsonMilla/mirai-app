export const LUMA_EVENT_URL = 'https://luma.com/an4zotn9?utm_parameter=landing';

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
      'Lab infrastructure ready on Port Island. Bring your exoskeletons, BCIs, prosthetics, biosensors, and wearables for first-in-human testing — and walk the Frontier Human Fashion Show runway.',
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
      'Post Phase 1b biotech companies connecting directly with PMDA and Japanese consulting firms for conditional approval under Section 23-2-5. Culminates in a PMDA pre-submission and go-to-market roadmap.',
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
  imageSrc: string;
  events: string[];
}

export const chapters: Chapter[] = [
  {
    ep: 'EP.01',
    kanji: '壱',
    title: 'Arrival & Onboarding',
    dates: 'Oct 01 – 07',
    synopsis: 'Arrivals, KBIC lab tours, JETRO soft-landing, community kickoff. Meet your cohort, claim your bench.',
    colorClass: 'ch-arrival',
    imageSrc: '/images/chapters/arrival.jpg',
    events: [
      'KBIC lab tours & bench assignments',
      'JETRO soft-landing orientation',
      'Community welcome dinner',
      'Port Island neighborhood walkthrough',
    ],
  },
  {
    ep: 'EP.02',
    kanji: '弐',
    title: 'Longevity Biotech',
    dates: 'Oct 08 – 14',
    synopsis: 'Senolytics, reprogramming, biomarkers, regenerative medicine protocols. The science of not dying.',
    colorClass: 'ch-longevity',
    imageSrc: '/images/chapters/longevity.jpg',
    events: [
      'Senolytic compound workshop',
      'Biomarker panel deep-dive',
      'Regenerative medicine protocols',
      'Guest lecture: cellular reprogramming',
    ],
  },
  {
    ep: 'EP.03',
    kanji: '参',
    title: 'Human Enhancement',
    dates: 'Oct 15 – 21',
    synopsis: 'BCIs, exoskeletons, prosthetics, sensory augmentation. Upgrading the default human.',
    colorClass: 'ch-enhance',
    imageSrc: '/images/chapters/enhance.jpg',
    events: [
      'BCI integration lab sessions',
      'Exoskeleton fitting & calibration',
      'Sensory augmentation demos',
      'Performance medicine roundtable',
    ],
  },
  {
    ep: 'EP.04',
    kanji: '肆',
    title: 'Fashion Show & Close',
    dates: 'Oct 22 – 31',
    synopsis: 'Runway prep, rehearsals, press day. The Frontier Human Fashion Show — where devices become couture.',
    colorClass: 'ch-fashion',
    imageSrc: '/images/chapters/fashion.jpg',
    events: [
      'Prototype polish & final builds',
      'PMDA regulatory submissions',
      'Press day & media preview',
      'The Frontier Human Fashion Show',
    ],
  },
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
    description: 'Three ancient cities within an hour.',
    kanji: '遊',
    hudTitle: 'Osaka · Kyoto · Nara',
    hudSubtitle: 'Day Trips · Culture · History',
    hudText:
      'Kobe sits at the heart of the Kansai region. Osaka\'s street food (30 min), Kyoto\'s temples (50 min), and Nara\'s deer park (60 min) are all day-trip distance.',
    stats: [
      { value: '30m', label: 'Osaka' },
      { value: '50m', label: 'Kyoto' },
      { value: '60m', label: 'Nara' },
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
      'Apply through the site. We review applications on a rolling basis. Accepted applicants receive a payment link to secure their spot.',
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

export interface Partner {
  name: string;
  role: string;
}

export const partners: Partner[] = [
  { name: 'Frontier Humans', role: 'Community & Programming' },
  { name: 'Viva City', role: 'Residency Ops' },
  { name: 'KBIC', role: 'Labs & Science' },
  { name: 'JETRO', role: 'Japan Market Entry' },
];

export interface Evolution {
  name: string;
  stage: number;
  desc: string;
}

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
