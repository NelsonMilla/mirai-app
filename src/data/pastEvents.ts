/**
 * Track record for the "Other events we have supported" section.
 *
 * Single source of truth for PastEventsSection — rendered as four trophy
 * figures (500+ · 400+ · 40M+ · MIT) with the event as attribution, and a
 * "next stop" coda pointing at Kobe.
 *
 * Field guide
 * -----------
 *  figure        The one unfakeable headline figure, set monumental
 *                ("500", "40M", "MIT"). Chosen per event: reach beats
 *                money (40M+ TV viewers over the $1M prize), institution
 *                beats headcount (MIT over ~300).
 *  figureSuffix  Optional pink suffix ("+"). Omit for word-figures.
 *  period        Year/location mono eyebrow (e.g. "2025 · San Francisco").
 *  name          Event name, rendered in Fraunces serif.
 *  support       One attribution line under the name. Reads as a
 *                continuation of the figure where possible ("40M+ … TV
 *                viewers across two shows…"). Facts audited — keep true.
 *  photos        Optional evidence-stamp paths under /public. photos[0]
 *                renders as a small tilted stamp on the figure once
 *                supplied; absent, the trophy is pure type (intentional).
 */

export interface PastEvent {
  figure: string;
  figureSuffix?: string;
  period: string;
  name: string;
  support: string;
  photos?: string[];
}

export const pastEvents: PastEvent[] = [
  {
    figure: '500',
    figureSuffix: '+',
    period: '2024–25 · Roatán',
    name: 'Vitalia City Pop-Ups',
    support: 'Builders in a regulatory sandbox. Two popups converted into a permanent hub.',
  },
  {
    figure: '400',
    figureSuffix: '+',
    period: '2025 · San Francisco',
    name: 'Viva Frontier Tower Pop-Up',
    support: 'A 6-week vertical village — biomarkers, daily programming, Demo Day. Peter Diamandis, Aubrey de Grey, Emmett Shear, Patri Friedman.',
  },
  {
    figure: '40M',
    figureSuffix: '+',
    period: '2025–26 · Roatán & SF',
    name: 'Meet the Drapers',
    support: 'TV viewers across two shows with Tim & Adam Draper. Thousands of applicants; Muse.Bio won the $1M finale.',
  },
  {
    figure: 'MIT',
    period: '2025 · Media Lab',
    name: 'Human Augmentation Summit',
    support: '~300 people on BCIs and bioengineering. Prof. Stephen Wolfram, Life Biosciences, MIT, Harvard.',
  },
];

/** Coda line under the trophy band — the record points forward. */
export const trackRecordNext = 'Next · 2026 · Kobe — Mirai Tech PopUp City';
