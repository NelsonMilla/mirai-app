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
 *            Drives the nameplate color via RosterSection.tagColor.
 *            Use 'Speaker' for people speaking but not enrolled in a residency track.
 *  mystery   true => render as locked "Challenger Approaching" slot.
 *  special   Optional "SPECIAL: <name>" line shown above stats.
 *  stats     Up to 3 stat bars. Each value is 0–100 (percentage fill).
 *            If omitted, bio renders instead.
 *
 * Counts
 * ------
 * The "X / 24 Fighters confirmed" counter in RosterSection is computed as
 *   fighters.filter(f => !f.mystery).length + 2
 * Adjust there if the offset changes.
 */

export interface Fighter {
  name: string;
  fullName: string;
  title: string;
  bio: string;
  photo?: string;
  tag: 'Devices' | 'Therapies' | 'Builder' | 'Speaker' | 'Incoming';
  mystery?: boolean;
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
    name: 'Juliette',
    fullName: 'Juliette Humer',
    title: 'Founder · MuseBio',
    bio: "",
    photo: '/images/speakers/juliette.jpg',
    tag: 'Therapies',
    special: 'Blood into Life',
    stats: [
      { label: 'REG', value: 98 },
      { label: 'STR', value: 82 },
      { label: 'NET', value: 90 },
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

/** Partner logos shown under the roster grid. */
export const rosterPartners = ['Frontier Humans', 'HekaBio', 'Viva City', 'KBIC'];

/** Pull-quote rendered alongside the roster (currently unused by RosterSection but kept for future use). */
export const rosterQuote = {
  text: "Japan's regenerative medicine framework is the best-kept secret in biotech. We built this to put it in the hands of builders who refuse to wait a decade.",
  cite: 'Frontier Humans',
};
