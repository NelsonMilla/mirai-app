/**
 * Community / ecosystem partners for the "Communities behind it" logo wall.
 *
 * This is the single source of truth for the CommunitiesSection logo wall on
 * the landing page.
 *
 * Field guide
 * -----------
 *  name     Display name, also the alt text and the text-placeholder label.
 *  href     External link. Rendered target="_blank" rel="noopener noreferrer".
 *  logo     Path to logo under /public, or null for a styled text-only tile.
 *  lightBg  true => render the logo on a subtle light chip. Use for logos whose
 *           artwork is dark or has a baked light background so it would be
 *           illegible / inconsistent on the near-black page. Logos already
 *           designed for dark backgrounds (transparent + light/colored art)
 *           omit this and sit directly on the dark tile.
 */

export interface Community {
  name: string;
  href: string;
  logo: string | null;
  lightBg?: boolean;
}

export const communities: Community[] = [
  {
    name: 'Viva City',
    href: 'https://viva.city/',
    logo: '/images/partners/viva-city.avif',
    lightBg: true,
  },
  {
    name: 'KBIC',
    href: 'https://www.fbri-kobe.org/kbic/english/',
    logo: '/images/partners/kbic.svg',
    lightBg: true,
  },
  {
    name: 'Learning Layer Labs',
    href: 'https://www.learninglayer.ai/',
    logo: '/images/partners/learning-layer-labs.jpg',
    lightBg: true,
  },
  {
    name: 'Biopunk',
    href: 'https://haus.fund/',
    logo: '/images/partners/biopunk.png',
    lightBg: true,
  },
  {
    name: 'Aevitas',
    href: 'https://aevitashouse.bio/',
    logo: '/images/partners/aevitas.png',
  },
  {
    name: 'Broken Symmetry Capital',
    href: 'https://brokensymmetry.capital/',
    logo: '/images/partners/broken-symmetry.jpg',
  },
  {
    name: 'Vibe Coding Nights',
    href: 'https://vibecodingnights.com/',
    logo: '/images/partners/vibe-coding-nights.png',
    lightBg: true,
  },
  {
    name: 'LEV Foundation',
    href: 'https://www.levf.org/',
    logo: null,
  },
  {
    name: 'Asagi Labs Ventures',
    href: 'https://alv.vc/',
    logo: '/images/partners/asagi-labs.jpg',
    lightBg: true,
  },
  {
    name: 'ZuCity Japan',
    href: 'https://zucity.org/en/market-homes',
    logo: '/images/partners/zucity.svg',
    lightBg: true,
  },
  {
    name: 'CHANGE',
    href: 'https://ch-ange.de/',
    logo: null,
  },
  {
    name: 'HekaBio',
    href: 'https://www.heka.bio/',
    logo: '/images/partners/hekabio.avif',
    lightBg: true,
  },
];
