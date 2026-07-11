/**
 * Attendee / speaker roster data.
 *
 * This is the single source of truth for the "Select Your Fighter" section
 * on the landing page. Edit names, titles, bios, tags, stats, and the
 * mystery placeholders here.
 *
 * Field guide
 * -----------
 *  name      Short display name shown on the selector card (e.g. "Rodney").
 *  fullName  Full name shown in the detail panel (e.g. "Rodney Kelly").
 *  title     Role + company line under the name.
 *  bio       Long-form description. Used when the fighter has no stats (e.g. mystery).
 *  photo     Path to portrait under /public (e.g. "/images/speakers/rodney.jpg").
 *            Omit for mystery fighters — a "?" placeholder renders instead.
 *  tag       One of: 'Devices' | 'Therapies' | 'Builder' | 'Speaker' | 'Incoming'.
 *            Drives the nameplate color via tagColors below.
 *            Use 'Speaker' for people speaking but not enrolled in a residency track.
 *  mystery   true => render as locked "Challenger Approaching" slot.
 *  headliner true => featured in the TOP BILLING main card (large slot +
 *            detail panel). Everyone else renders in the supporting bill.
 *  hook      One-line credibility strapline. Headliners only — shown on the
 *            large billing slot under the name.
 *  special   Optional "SPECIAL: <name>" line shown above stats.
 *  stats     Up to 3 stat bars. Each value is 0–100 (percentage fill).
 *            If omitted, bio renders instead.
 *
 * Counts
 * ------
 * The "X / N Fighters confirmed" counter in RosterSection is computed as
 *   fighters.filter(f => !f.mystery).length  /  ROSTER_TOTAL (below)
 */

export interface Fighter {
  name: string;
  fullName: string;
  title: string;
  bio: string;
  photo?: string;
  tag: 'Devices' | 'Therapies' | 'Builder' | 'Speaker' | 'Incoming';
  mystery?: boolean;
  headliner?: boolean;
  hook?: string;
  special?: string;
  stats?: { label: string; value: number }[];
}

export const fighters: Fighter[] = [
  {
    name: 'Rodney',
    fullName: 'Rodney Kelly',
    title: 'European Ambassador · Mediso',
    bio: '',
    photo: '/images/speakers/rodney.jpg',
    tag: 'Speaker',
    special: 'APAC Orchestration',
    stats: [
      { label: 'ENG', value: 92 },
      { label: 'BIO', value: 78 },
      { label: 'REG', value: 85 },
    ],
  },
  {
    name: 'Rob',
    fullName: 'Rob Claar',
    title: 'Founder · HekaBio',
    bio: '',
    photo: '/images/speakers/rob.jpg',
    tag: 'Speaker',
    special: 'Regulatory Deployment',
    stats: [
      { label: 'SPD', value: 95 },
      { label: 'BLD', value: 90 },
      { label: 'SHP', value: 88 },
    ],
  },
  {
    name: 'Masa',
    fullName: 'Masa Nakatsu',
    title: 'Founder of Orb',
    bio: '',
    photo: '/images/speakers/masa.jpg',
    tag: 'Builder',
    special: 'Crypto Genius',
    stats: [
      { label: 'HW', value: 94 },
      { label: 'AUG', value: 90 },
      { label: 'VIS', value: 86 },
    ],
  },
  {
    name: 'Zoe',
    fullName: 'Zoe',
    title: 'Founder of Primordia Grants & Aevitas',
    bio: '',
    photo: '/images/speakers/zoe.jpg',
    tag: 'Builder',
    special: 'Community Champ',
    stats: [
      { label: 'FND', value: 95 },
      { label: 'SCI', value: 88 },
      { label: 'NET', value: 92 },
    ],
  },
  {
    name: 'Aubrey',
    fullName: 'Aubrey de Grey',
    title: 'LEV Foundation',
    bio: '',
    tag: 'Speaker',
    headliner: true,
    hook: 'LEV Foundation',
    special: 'Longevity Escape Velocity',
    stats: [
      { label: 'REG', value: 99 },
      { label: 'SCI', value: 97 },
      { label: 'VIS', value: 96 },
    ],
  },
  {
    name: 'Jose',
    fullName: 'Jose Cordeiro',
    title: 'Speaker · Announcement soon',
    bio: '',
    tag: 'Speaker',
    special: 'The Death of Death',
    stats: [
      { label: 'VIS', value: 94 },
      { label: 'SCI', value: 88 },
      { label: 'NET', value: 90 },
    ],
  },
  {
    name: 'Cassox',
    fullName: 'Cassox',
    title: 'Symbiont Labs',
    bio: '',
    tag: 'Speaker',
    special: 'Grinder Supreme',
    stats: [
      { label: 'HW', value: 90 },
      { label: 'AUG', value: 92 },
      { label: 'BIO', value: 86 },
    ],
  },
  {
    name: 'Devinder',
    fullName: 'Devinder Sodhi',
    title: 'Speaker · Announcement soon',
    bio: '',
    tag: 'Speaker',
    special: 'Signal Booster',
    stats: [
      { label: 'STR', value: 85 },
      { label: 'NET', value: 88 },
      { label: 'VIS', value: 82 },
    ],
  },
  {
    name: 'Pedro',
    fullName: 'Pedro Henrich',
    title: 'Speaker · Announcement soon',
    bio: '',
    tag: 'Speaker',
    special: 'Momentum Builder',
    stats: [
      { label: 'BLD', value: 87 },
      { label: 'SPD', value: 84 },
      { label: 'NET', value: 86 },
    ],
  },
  {
    name: 'Adam',
    fullName: 'Adam Gries',
    title: 'Speaker · Announcement soon',
    bio: '',
    tag: 'Speaker',
    headliner: true,
    hook: 'Announcement soon',
    special: 'Full Send',
    stats: [
      { label: 'FND', value: 88 },
      { label: 'BLD', value: 85 },
      { label: 'SHP', value: 83 },
    ],
  },
  {
    name: 'Natalie',
    fullName: 'Natalie Coles',
    title: 'Speaker · Announcement soon',
    bio: '',
    tag: 'Speaker',
    special: 'Sharp Focus',
    stats: [
      { label: 'SCI', value: 86 },
      { label: 'STR', value: 84 },
      { label: 'NET', value: 88 },
    ],
  },
  {
    name: 'Keita',
    fullName: 'Keita Masui',
    title: 'Asagi Labs Ventures',
    bio: '',
    tag: 'Speaker',
    special: 'Deal Flow Master',
    stats: [
      { label: 'FND', value: 89 },
      { label: 'NET', value: 91 },
      { label: 'VIS', value: 85 },
    ],
  },
  {
    name: 'Sumit',
    fullName: 'Sumit Jamuar',
    title: 'Speaker · Announcement soon',
    bio: '',
    tag: 'Speaker',
    special: 'Genome Pioneer',
    stats: [
      { label: 'BIO', value: 87 },
      { label: 'FND', value: 85 },
      { label: 'VIS', value: 88 },
    ],
  },
  {
    name: 'Nelson',
    fullName: 'Nelson Milla',
    title: 'Frontier Humans',
    bio: '',
    tag: 'Speaker',
    special: 'Host With The Most',
    stats: [
      { label: 'FND', value: 90 },
      { label: 'NET', value: 93 },
      { label: 'VIS', value: 89 },
    ],
  },
  {
    // TODO(Nelson): supply real portrait for Yuki Hanyu and confirm exact title.
    // Full descriptor: IntegriCulture — cultured-meat / cellular agriculture, Japan.
    name: 'Yuki',
    fullName: 'Yuki Hanyu',
    title: 'Founder · IntegriCulture',
    bio: '',
    tag: 'Speaker',
    headliner: true,
    hook: 'Cellular Agriculture',
    special: 'Cellular Agriculture',
    stats: [
      { label: 'BIO', value: 93 },
      { label: 'BLD', value: 88 },
      { label: 'VIS', value: 90 },
    ],
  },
  {
    name: 'Juliette',
    fullName: 'Juliette Humer',
    title: 'Founder · MuseBio',
    bio: "",
    photo: '/images/speakers/juliette.jpg',
    tag: 'Therapies',
    headliner: true,
    hook: 'Founder · MuseBio',
    special: 'Blood into Life',
    stats: [
      { label: 'REG', value: 98 },
      { label: 'STR', value: 82 },
      { label: 'NET', value: 90 },
    ],
  },
  {
    name: '???',
    fullName: 'Challenger Approaching',
    title: 'Track TBA',
    bio: 'Identity classified. Announcement incoming September 2026. The signal is getting stronger...',
    tag: 'Incoming',
    mystery: true,
  },
  {
    name: '???',
    fullName: 'Challenger Approaching',
    title: 'Track TBA',
    bio: 'Identity classified. Announcement incoming September 2026. Stand by for transmission...',
    tag: 'Incoming',
    mystery: true,
  },
];

/** Nameplate/accent color per tag — the roster selector and detail panel key off this. */
export const tagColors: Record<Fighter['tag'], string> = {
  Devices: '#6DB5F5',
  Therapies: '#F5C542',
  Builder: '#FF6B92',
  Speaker: '#B98BF5',
  Incoming: '#8585A8',
};

/** Roster capacity — the "X / N Fighters confirmed" denominator. */
export const ROSTER_TOTAL = 24;

/** Pull-quote rendered alongside the roster (currently unused by RosterSection but kept for future use). */
export const rosterQuote = {
  text: "Japan's regenerative medicine framework is the best-kept secret in biotech. We built this to put it in the hands of builders who refuse to wait a decade.",
  cite: 'Frontier Humans',
};
