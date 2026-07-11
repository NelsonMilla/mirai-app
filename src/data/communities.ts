/**
 * Community / ecosystem partners for the "Communities behind it" logo wall.
 *
 * This is the single source of truth for the CommunitiesSection plaque on
 * the landing page. Append an entry and the wall reflows, the credit
 * counter updates, and the open slot stays last — no component edits.
 *
 * Field guide
 * -----------
 *  name       Display name, also the alt text and the wordmark for logo-less
 *             entries.
 *  href       External link. Rendered target="_blank" rel="noopener noreferrer".
 *  logo       Path to logo under /public, or null to render the name as a
 *             Fraunces wordmark in the same cell system.
 *  treatment  Which CSS normalization recipe renders this asset as a
 *             monochrome light-on-dark mark (eyeball each new logo once):
 *             'plate' — dark artwork on a baked light background (JPG/AVIF/
 *                       white-boxed art). Inverted + screen-blended so the
 *                       background vanishes.
 *             'stamp' — transparent art that reads well as a flat white
 *                       silhouette. Default when omitted.
 *             'luma'  — transparent or baked-DARK-background art whose
 *                       internal tonal detail matters. Grayscaled + brightened
 *                       + screen-blended so dark grounds dissolve.
 */

export interface Community {
  name: string;
  href: string;
  logo: string | null;
  treatment?: 'plate' | 'stamp' | 'luma';
}

export const communities: Community[] = [
  {
    name: 'Viva City',
    href: 'https://viva.city/',
    logo: '/images/partners/viva-city.avif',
    treatment: 'plate',
  },
  {
    name: 'KBIC',
    href: 'https://www.fbri-kobe.org/kbic/english/',
    logo: '/images/partners/kbic.svg',
    treatment: 'plate',
  },
  {
    name: 'Learning Layer Labs',
    href: 'https://www.learninglayer.ai/',
    logo: '/images/partners/learning-layer-labs.jpg',
    treatment: 'plate',
  },
  {
    name: 'Biopunk',
    href: 'https://haus.fund/',
    logo: '/images/partners/biopunk.png',
    treatment: 'plate',
  },
  {
    name: 'Aevitas',
    href: 'https://aevitashouse.bio/',
    logo: '/images/partners/aevitas.png',
    treatment: 'luma',
  },
  {
    name: 'Broken Symmetry Capital',
    href: 'https://brokensymmetry.capital/',
    logo: '/images/partners/broken-symmetry.jpg',
    treatment: 'luma',
  },
  {
    name: 'Vibe Coding Nights',
    href: 'https://vibecodingnights.com/',
    logo: '/images/partners/vibe-coding-nights.png',
    treatment: 'plate',
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
    treatment: 'plate',
  },
  {
    name: 'ZuCity Japan',
    href: 'https://zucity.org/en/market-homes',
    logo: '/images/partners/zucity.svg',
    treatment: 'plate',
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
    treatment: 'plate',
  },
  {
    name: 'Augmentation Lab',
    href: 'https://augmentationlab.org/',
    logo: '/images/partners/augmentation-lab.png',
    treatment: 'stamp',
  },
  {
    name: 'Vitalist Bay',
    href: 'https://vitalistbay.com/',
    logo: '/images/partners/vitalist-bay.png',
    treatment: 'plate',
  },
];
