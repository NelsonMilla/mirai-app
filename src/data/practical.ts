/**
 * Practical / "On the ground" section data.
 *
 * Single source of truth for the housing links and community resources shown
 * in PracticalSection. Edit URLs, labels, and descriptions here so they can be
 * swapped in one place.
 *
 * Field guide
 * -----------
 *  name   Card title.
 *  meta   Short mono subtitle (category · location).
 *  href   Destination URL. External links open in a new tab.
 */

export interface StayLink {
  name: string;
  meta: string;
  href: string;
}

export interface CommunityLink {
  name: string;
  description: string;
  href: string;
}

/** One-line intro shown above the Stay cards. */
export const stayIntro =
  'A partner hotel and a constellation of hacker houses, all minutes from the labs.';

export const stayLinks: StayLink[] = [
  {
    name: 'Portopia Hotel',
    meta: 'Partner hotel · Mirai special discounts',
    // Corrected check-in date (source doc had 10/31); keep these exact dates.
    href: 'https://www.portopia.co.jp/en/?tripla_booking_widget_open=search&adults=1&hotel_plan_codes=19734219,10810796&checkin=2026/10/01&checkout=2026/11/01&mode=secret',
  },
  {
    name: 'The Sanctuary',
    meta: 'Residency & hacker house',
    href: 'https://thesanctuary.to/',
  },
  {
    name: 'Biopunk House',
    meta: 'Biohacker house',
    // Same domain as The Sanctuary on purpose — Biopunk is rebranding under
    // The Sanctuary. Do not "fix" this.
    href: 'https://thesanctuary.to/',
  },
  {
    name: 'Aevitas',
    meta: 'Community house',
    href: 'https://aevitashouse.bio/',
  },
  {
    name: 'ZuCity Japan',
    meta: 'Popup housing network',
    href: 'https://zucity.org/',
  },
  {
    name: 'Airbnb',
    meta: 'Independent stays · Port Island & Kobe',
    href: 'https://www.airbnb.com/s/Kobe--Japan/homes',
  },
];

export const communityLinks: CommunityLink[] = [
  {
    name: 'Community guide',
    description:
      'Guidelines, resources, and everything you need before you land.',
    // TODO: replace with public Notion URL (not yet provided)
    href: '#',
  },
  {
    name: 'Side events calendar',
    description:
      'Residents host their own workshops, dinners, and salons throughout the month. Browse the calendar or propose your own — every side event is screened and approved by the team.',
    // TODO: replace with public side events calendar URL (not yet provided)
    href: '#',
  },
];
