/**
 * Track record for the "Other events we have supported" section.
 *
 * Single source of truth for PastEventsSection.
 *
 * Field guide
 * -----------
 *  period    Year/location mono eyebrow (e.g. "2025 · San Francisco").
 *  name      Event name, rendered in Fraunces serif.
 *  stat      Lead stat line (e.g. "400+ people, 6-week vertical village").
 *  detail    Second line of supporting description / notable names.
 *  photos    Optional photo-collage paths under /public. A photo strip is
 *            planned for later; when absent the slot renders nothing.
 */

export interface PastEvent {
  period: string;
  name: string;
  stat: string;
  detail: string;
  photos?: string[];
}

export const pastEvents: PastEvent[] = [
  {
    period: '2024–25 · Roatán',
    name: 'Vitalia City Pop-Ups',
    stat: '500+ builders. Regulatory sandboxing.',
    detail: 'Two popups, multiple conferences — converted into a permanent hub.',
  },
  {
    period: '2025 · San Francisco',
    name: 'Viva Frontier Tower Pop-Up',
    stat: '400+ people, 6-week vertical village.',
    detail:
      'Biomarkers, daily programming, Demo Day. Peter Diamandis, Aubrey de Grey, Emmett Shear, Patri Friedman.',
  },
  {
    period: '2025–26 · Roatán & SF',
    name: 'Meet the Drapers',
    stat: 'Two shows with Tim & Adam Draper.',
    detail: 'Thousands of applicants, 40M+ TV viewers. Muse.Bio won the $1M finale.',
  },
  {
    period: '2025 · MIT Media Lab',
    name: 'Human Augmentation Summit',
    stat: '~300 people. BCIs, bioengineering.',
    detail: 'Prof. Stephen Wolfram, Life Biosciences, MIT, Harvard.',
  },
];
