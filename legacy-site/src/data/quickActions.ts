/**
 * Quick-action doorways for the "Stay in the loop" section (QuickActions).
 *
 * Three outbound links: Telegram (community), Luma (calendar — the funnel),
 * Discord (build server). Per-platform accent tones live here, next to the
 * data, per the repo convention — never hardcoded in JSX.
 *
 * Field guide
 * -----------
 *  label    Mono eyebrow on the card ("01 · The group chat").
 *  title    Fraunces card title — host voice, short.
 *  desc     One or two sentences. Hidden in the compact variant.
 *  cta      Card CTA text, arrow included.
 *  href     Outbound URL. Prefers env vars so ops can rotate invites
 *           without a deploy.
 *  tone     "r, g, b" accent tuned to sit on the ink palette.
 *  primary  Funnel emphasis — renders the CTA as a solid pink pill.
 *           Luma only: the landing funnel runs through Luma.
 */

export interface QuickAction {
  id: 'telegram' | 'luma' | 'discord';
  label: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  tone: string;
  primary?: boolean;
}

export const quickActions: QuickAction[] = [
  {
    id: 'telegram',
    label: '01 · The group chat',
    title: 'Come say hi',
    desc: 'The Telegram is where early residents and organizers already trade intros, questions, and plans. Jump in mid-conversation.',
    cta: 'Step in →',
    href: process.env.NEXT_PUBLIC_TELEGRAM_INVITE_URL || 'https://t.me/+miraitech',
    tone: '111, 196, 238',
  },
  {
    id: 'luma',
    label: '02 · The calendar',
    title: 'Never miss a night',
    desc: 'Follow us on Luma and every demo night, dinner, and rooftop session lands on your calendar by itself.',
    cta: 'Follow on Luma →',
    href: process.env.NEXT_PUBLIC_LUMA_CALENDAR_URL || 'https://luma.com/mirai-tech-city',
    tone: '255, 142, 122',
    primary: true,
  },
  {
    id: 'discord',
    label: '03 · The build server',
    title: 'Where the building happens',
    desc: 'Discord holds the track channels and project threads — the building starts before October does.',
    cta: 'Join the server →',
    href: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || 'https://discord.gg/jv3Vpv2KT9',
    tone: '139, 157, 255',
  },
];
