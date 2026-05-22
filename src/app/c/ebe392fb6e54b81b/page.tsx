import type { Metadata } from 'next';
import { Placeholder } from '@/components/about/Placeholder';
import { Stamp } from '@/components/about/Stamp';
import { SectionHeading } from '@/components/about/SectionHeading';
import { DaihyoCard, type Daihyo } from '@/components/about/DaihyoCard';
import { TeikeiBlock, TeikeiCounter, type Teikei } from '@/components/about/TeikeiBlock';
import { GaiyoSidebar, type SidebarFact, type SidebarSection } from '@/components/about/GaiyoSidebar';
import { BilingualBar } from '@/components/about/BilingualBar';

export const metadata: Metadata = {
  title: 'Mirai Tech — 会社案内 / Corporate Outline',
  description:
    'Corporate outline, business activities, leadership, and track record. Shared by direct link.',
  // Private URL — shared by direct link only. Page must not be indexed.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true, 'max-snippet': 0 },
  },
};

/*
 * /about — Redesigned for Japanese institutional partners.
 *
 * Audience: senior staff at KBIC, JETRO Kobe, Hyogo Prefecture, the
 * University of Kobe, and Japanese pharma corporate development teams.
 *
 * Structure follows JP kaisha annai (会社案内) convention:
 *   §01 Corporate Outline      / 会社概要        — the legitimacy gate
 *   §02 Business Activities    / 事業内容        — what the company does
 *   §03 Leadership             / 代表者・経営陣  — named accountability
 *   §04 Track Record           / 沿革・実績      — quantified prior delivery
 *   §05 Partners               / 提携機関        — institutional relationships
 *   §06 Founding Purpose       / 設立趣旨        — narrative back-matter
 *
 * Bilingual scaffold: every section heading reserves a JA slot. Today the
 * slot renders as a hairline rule with a faint `JA` mark on hover; when JA
 * copy lands, the slot fills without any layout change.
 *
 * Verification stamps replace inline ambiguity on row-level facts. The
 * amber <Placeholder /> pattern is preserved for blocks where content is
 * missing entirely. Grep for `PLACEHOLDER:` to find content gaps.
 */

// ---------------------------------------------------------------------------
// Section registry — feeds both the sidebar nav and the main render order
// ---------------------------------------------------------------------------
const SECTIONS: SidebarSection[] = [
  { id: 'gaiyo',    num: '01', en: 'Corporate Outline',      ja: '会社概要' },
  { id: 'jigyo',    num: '02', en: 'Business Activities',    ja: '事業内容' },
  { id: 'daihyo',   num: '03', en: 'Leadership',             ja: '代表者・経営陣' },
  { id: 'jisseki',  num: '04', en: 'Track Record',           ja: '沿革・実績' },
  { id: 'teikei',   num: '05', en: 'Partners & Institutions', ja: '提携機関' },
  { id: 'shushi',   num: '06', en: 'Founding Purpose',       ja: '設立趣旨' },
];
// JA section titles are kept here but not yet rendered as headings — they
// will activate once JA copy is approved. Pass `ja={...}` to SectionHeading.

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const ENTITY = {
  legalName: 'Unchain Bio, Inc.',
  jurisdiction: 'Delaware, USA · C-Corporation',
  foundedOn: 'May 12, 2025',
  identifierLabel: 'EIN' as string | null,
  identifierValue: '32-0817372',
};

// Registered office — the Delaware Secretary of State filing address.
// (251 Little Falls Drive is the Corporation Service Company registered agent.)
const REGISTERED_ADDRESS = '251 Little Falls Drive, Wilmington, DE 19808, United States';
// Mailing / correspondence address.
const MAILING_ADDRESS = '167-169 Great Portland Street, London, England W1W 5PF, United Kingdom';
// No Japan office is registered yet — KBIC is the event host/partner, not a Mirai Tech office.

// PLACEHOLDER: founder LinkedIn URLs + headshot paths — verify and replace each null.
const founders: Daihyo[] = [
  {
    name: 'Victoria Massó',
    role: 'Co-Founder & CEO',
    roleJa: '共同創業者・CEO',
    affiliation:
      'UN/ITU innovation expert deployed across 30+ countries · Designed and operationalised 17 Acceleration Centers.',
    credentials:
      'Prior: COO, Vitalia City @ Próspera SEZ · Head of Operations, Viva City SF (with Peter Diamandis, Bryan Johnson, Naval Ravikant). Founder, Behaviour Hackers / Scale&Connect — clients: IBM, Oliver Wyman, Linklaters, Fujitsu.',
    photo: '/team/victoria-masso.png',
    linkedin: 'https://www.linkedin.com/in/victoriamasso/',
    email: 'victoria@miraitech.city',
  },
  {
    name: 'Pedro Henrich',
    role: 'Co-Founder & COO',
    roleJa: '共同創業者・COO',
    affiliation:
      'Architected Vitalia City’s biotech commercialisation pipeline — compressing biotech time-to-market from 10+ years to under 1 year inside Próspera SEZ.',
    credentials:
      'Prior: KPMG (Healthcare, Governance & Consumer Markets) · MIT alumnus · Co-organised Meet The Drapers ($1M pitch, 40M+ viewers) · Mentor, Longevity Biotech Fellowship (Nathan Cheng, Mark Hamalainen) · Connected to ARPA-H, Vitalist Bay, Foresight Institute, Longevity Investors Network · Fractional CSO, Muse Bio.',
    photo: '/team/pedro-henrich.png',
    linkedin: 'https://www.linkedin.com/in/henrichai/',
    email: null,
  },
  {
    name: 'Nelson Milla',
    role: 'Co-Founder & CTO',
    roleJa: '共同創業者・CTO',
    affiliation:
      'Co-founder & CTO of Vitalia City — built the technical backbone from scratch. Compressed biotech time-to-market from 10+ years to under 1 year.',
    credentials:
      'Backed by Boost VC · Winklevoss Capital · North Island Ventures · Balaji Srinivasan. Venture Partner at Venture University SF and Infinita VC · Scout, Enduring Planet · 5× Techstars organiser, Honduras · Featured by ITU as a YILF global success story.',
    photo: '/team/nelson-milla.png',
    linkedin: 'https://www.linkedin.com/in/nelsonmilla/',
    email: 'nelson@frontierhumans.com',
  },
  {
    name: 'Elliot Roth',
    role: 'Residency Director',
    roleJa: 'レジデンシー責任者',
    affiliation:
      'Biomedical engineer · 12 years in synthetic biology · 8 companies founded · Built Biopunk Lab, Cellsius Biolab, IndieLab RVA and CrabLab from zero.',
    credentials:
      'Current: Head of Strategic Partnerships & Venture Portfolio, Deep Science Ventures · Former founder of Spira (algae biomanufacturing, 8 years) · Kairos, Future Founders & Halcyon Fellow.',
    photo: '/team/elliot-roth.png',
    linkedin: 'https://www.linkedin.com/in/thatmre/',
    email: null,
  },
];

// Advisor bios sourced from the FH Pitch Deck May 2026. PLACEHOLDER fields
// remain for LinkedIn URLs (not in the deck) and Masa Nakatsu's kanji nameJa.
const advisors: Daihyo[] = [
  {
    name: 'Rob Claar',
    role: 'Advisor',
    roleJa: '顧問',
    affiliation:
      '30+ years building Japan’s biotech access infrastructure. Co-founder & CEO of HekaBio. Led Japan’s first foreign new-category Shōnin approval ahead of US & Europe (Alpha DaRT, Feb 2026).',
    credentials:
      'Founded Junicon in 1992 — Japan’s first specialised healthcare KOL physician network · 7-year PMDA process for Alpha DaRT as Designated Marketing Authorization Holder · HekaBio reviews 200+ assets annually · Strategic partner to Alfresa Holdings (¥2.9T net sales) · Yale-educated · Trustee, Yokohama International School.',
    photo: '/team/rob-claar.png',
    linkedin: 'https://www.linkedin.com/in/robclaar/',
  },
  {
    name: 'Sumit Jamuar',
    role: 'Advisor',
    roleJa: '顧問',
    affiliation:
      'Co-founder & former CEO of Global Gene Corp (post-exit) — genomics platform with the Regeneron Genetics Center. Winner of the $1M Roddenberry Prize for Science (2020). XPRIZE BrainTrust member.',
    credentials:
      'Profiled by BBC, MIT Technology Review, Financial Times · Former MD & Global Head of Sales, Lloyds Banking Group · Former CEO, SBICAP UK · McKinsey alumnus · MBA, INSEAD; Chemical Engineering, IIT Delhi · Vice Chair, ITU & Gates Foundation Digital Financial Services initiative.',
    photo: '/team/sumit-jamuar.png',
    linkedin: 'https://www.linkedin.com/in/sumit-jamuar-b112b7/',
    wikipedia: 'https://en.wikipedia.org/wiki/Sumit_Jamuar',
    wikipediaLabel: 'Wikipedia',
  },
  {
    name: 'Sebastian Brunemeier',
    role: 'Advisor',
    roleJa: '顧問',
    affiliation:
      'Partner & Co-Founder at Long Game Ventures and Healthspan Capital — one of the most active longevity investors, 32 investments in three years. Co-founder of Cambrian Biopharma and Samsara Therapeutics.',
    credentials:
      'Three longevity biotech companies with combined equity exceeding $700M · DPhil Biochemistry, Oxford · Fulbright Fellow and Skaggs-Oxford Scholar at the Scripps Research Institute · Dual MSc Molecular Neuroscience & Biotech Business, University of Amsterdam · Founding Fellow, OnDeck Longevity Biotech Fellowship.',
    photo: '/team/sebastian-brunemeier.png',
    linkedin: 'https://www.linkedin.com/in/sebastianaguiar/',
  },
  {
    name: 'Masa Nakatsu',
    nameJa: '仲津正朗',
    role: 'Advisor',
    roleJa: '顧問',
    affiliation:
      'Co-founder & CEO of Orb — Joi Ito-backed, ¥550M+ raised from leading VCs. Developed Orb DLT — world’s first linearly scalable blockchain (30,000 tx/sec). Entrepreneur-in-Residence at OIST.',
    credentials:
      'Director, Japan Blockchain Association (nation’s first blockchain lobby) · Member, Japan FSA FinTech expert advisory committee — shaped Japan’s first virtual currency legislation · Former APAC Director, Criteo · Product lead, SevenNet Shopping · Investment analyst, Wall Street.',
    photo: '/team/masa-nakatsu.png',
    linkedin: 'https://jp.linkedin.com/in/masaakinakatsu',
    wikipedia: 'https://ja.wikipedia.org/wiki/%E4%BB%B2%E6%B4%A5%E6%AD%A3%E6%9C%97',
    wikipediaLabel: 'Wikipedia (JA)',
  },
];

const products = [
  {
    tag: 'Flagship Event',
    name: 'Mirai Tech Pop-Up City',
    desc:
      'A 30-day biotech popup city in Kobe (October 1–31, 2026). Co-living, public conference weekends, and policy co-creation with Japanese institutions.',
  },
  {
    tag: 'In-Residence Program',
    name: 'Mirai Tech Residency',
    desc:
      'A 7-week in-residence program for early-stage biotech and medical device companies in Kobe, focused on lab access and PMDA regulatory mentorship.',
  },
  {
    tag: 'Multi-Stakeholder Output',
    name: 'Longevity Super City Blueprint',
    desc:
      'A multi-stakeholder document drafted across the 30-day program, co-authored with policy makers, researchers, and entrepreneurs. Published in the closing week.',
  },
];

type TrackRecordEntry = {
  name: string;
  location: string;
  period: string;
  desc: string;
  stats: { val: string; label: string }[];
  pressUrl: string | null;
};

const trackRecord: TrackRecordEntry[] = [
  {
    name: 'Vitalia City',
    location: 'Roatán, Honduras',
    period: '2024–2025',
    desc:
      'Two-month longevity biotech popup at the Próspera SEZ. Operated by the team that founded Mirai Tech. Regulatory sandboxing compressed from 10+ years to under 1 year.',
    stats: [
      { val: '500+', label: 'Builders / season' },
      { val: '$5M', label: 'Capital raised' },
      { val: '50+', label: 'Startups hosted' },
      { val: '<1 yr', label: 'Regulatory cycle' },
    ],
    pressUrl: 'https://longevity.technology/news/vitalia-pop-up-city-aims-to-redefine-the-longevity-biotech-landscape/',
  },
  {
    name: 'Meet The Drapers — $1M Pitch Competition',
    location: 'Roatán & San Francisco',
    period: '2025',
    desc:
      'Co-organised with Tim Draper and Adam Draper. Honduras edition outperformed comparable rounds held in New York, Dubai, and Los Angeles.',
    stats: [
      { val: '150+', label: 'Applicants' },
      { val: '40M+', label: 'TV viewers (global)' },
      { val: '$1M', label: 'Prize pool' },
    ],
    pressUrl: 'https://techcrunch.com/2025/10/08/heres-what-its-really-like-to-appear-on-billionaire-vc-tim-drapers-meet-the-drapers-pitch-show/',
  },
  {
    name: 'Human Augmentation Summit',
    location: 'MIT Media Lab, Cambridge, MA',
    period: '2025',
    desc:
      'Sold-out summit on brain-computer interfaces, cybernetics, bioengineering, and longevity science. Held in partnership with the MIT Media Lab.',
    stats: [
      { val: '300+', label: 'Attendees' },
      { val: 'Sold out', label: 'Capacity' },
      { val: 'MIT', label: 'Partner venue' },
    ],
    pressUrl: 'https://augmentationlab.org/summit',
  },
  {
    name: 'UN/ITU Global Innovation Forum',
    location: 'Switzerland & rotating hosts',
    period: '2018–2024',
    desc:
      'Three editions of the UN International Telecommunication Union flagship innovation forum. Government officials from 64 countries; 100+ ventures supported.',
    stats: [
      { val: '3', label: 'Editions' },
      { val: '~500', label: 'Participants' },
      { val: '64', label: 'Countries' },
      { val: '100+', label: 'Ventures supported' },
    ],
    pressUrl: 'https://www.itu.int/itu-d/sites/innovation-alliance/network-of-itu-acceleration-centres/',
  },
  {
    name: 'Viva City',
    location: 'Frontier Tower, San Francisco',
    period: 'Jun–Aug 2025',
    desc:
      '6-week popup village in the 16-floor Frontier Tower in downtown San Francisco. Convened the AI · crypto · longevity communities. Backed by Peter Diamandis, Bryan Johnson, Naval Ravikant. Victoria led Operations.',
    stats: [
      { val: '6 wk', label: 'Duration' },
      { val: '16', label: 'Floors' },
      { val: 'SF', label: 'Location' },
      { val: 'AI · Long.', label: 'Themes' },
    ],
    pressUrl: 'https://viva.city/',
  },
  {
    name: 'Vitalist Bay',
    location: 'Lighthaven, Berkeley, CA',
    period: 'Apr–May 2025',
    desc:
      '8-week longevity-focused popup city organised by the Vitalism Foundation at the Lighthaven campus in Berkeley. 8 specialised conferences across longevity, biotech, AI, desci, policy, and wellness.',
    stats: [
      { val: '8 wk', label: 'Duration' },
      { val: '8', label: 'Conferences' },
      { val: '1000+', label: 'Attendees' },
      { val: '70', label: 'Residents' },
    ],
    pressUrl: 'https://vitalistbay.com/',
  },
];

// PLACEHOLDER: confirm permissionState per partner before publishing.
// JP norm: a logo/name display asserts a confirmed relationship.
//   'written' → logo + 確認済 stamp (publishable)
//   'verbal'  → text-only name + 照会中 stamp (relationship discussed, no written sign-off)
//   'pending' → suppressed from page
const partners: Teikei[] = [
  {
    name: 'HekaBio',
    role: 'Commercial partner · Japan regulatory. Team with 50+ Japanese licence approvals. Delivered Japan’s first foreign new-category Shōnin approval ahead of US and Europe (Alpha DaRT, February 2026). SNK01 commercial partner under Japan’s Regenerative Medicine Act.',
    permissionState: 'written',
    logo: null,
  },
  {
    name: 'Viva City',
    role: 'Sister popup-city partner · San Francisco · longevity ecosystem collaboration.',
    permissionState: 'written',
    logo: null,
  },
  {
    name: 'AEVITAS',
    role: 'Partner hacker house organisation during the popup (San Francisco).',
    permissionState: 'written',
    logo: null,
  },
  {
    name: 'Founder’s Voyage',
    role: 'Partner hacker house organisation during the popup (London).',
    permissionState: 'verbal',
    logo: null,
  },
];
const partnersConfirmed = partners.filter(p => p.permissionState === 'written').length;
const partnersTotal = partners.length;

// Media coverage / speaking engagements — verified press URLs.
// Each entry carries a normalized date (YYYY or YYYY.MM, empty for undated),
// a 5-code subject tag, a content type, and a credentialing tier (1–4) that
// drives typography weight in the render. The list is sorted by date desc;
// undated items fall into a "— ongoing —" trailing block.
//
// Subject codes:
//   VITALIA · Vitalia City    MTD · Meet The Drapers
//   AUGMENT · Human Augmentation Summit (MIT)
//   ITU     · ITU Acceleration Centres
//   ELLIOT  · Elliot Roth (Spira / Deep Science Ventures)
//
// Tier:
//   1 = institutional / public-record (UN, MIT, VCU, GapSummit, ETIIA)
//   2 = independent trade press (Longevity.Technology, Lifespan.io, TechAfrica)
//   3 = network-affiliated (Próspera Connect)
//   4 = databases & long-form (Crunchbase, podcasts)
type MediaSubject = 'VITALIA' | 'MTD' | 'AUGMENT' | 'ITU' | 'ELLIOT';
type MediaType =
  | 'feature'
  | 'press rel.'
  | 'program page'
  | 'registry'
  | 'talk'
  | 'profile'
  | 'database'
  | 'podcast';
type MediaItem = {
  date: string;
  subject: MediaSubject;
  outlet: string;
  type: MediaType;
  tier: 1 | 2 | 3 | 4;
  url: string;
};
const mediaCoverage: MediaItem[] = [
  {
    date: '2025.08', subject: 'AUGMENT', tier: 1, type: 'program page',
    outlet: 'Augmentation Lab — Human Augmentation Summit at MIT Media Lab',
    url: 'https://augmentationlab.org/summit',
  },
  {
    date: '2025.08', subject: 'AUGMENT', tier: 1, type: 'registry',
    outlet: 'MIT Events Calendar — Human Augmentation Summit',
    url: 'https://calendar.mit.edu/event/human-augmentation-summit',
  },
  {
    date: '2025.10', subject: 'MTD', tier: 1, type: 'feature',
    outlet: 'TechCrunch — What it’s really like to appear on Tim Draper’s ‘Meet the Drapers’ pitch show',
    url: 'https://techcrunch.com/2025/10/08/heres-what-its-really-like-to-appear-on-billionaire-vc-tim-drapers-meet-the-drapers-pitch-show/',
  },
  {
    date: '2025', subject: 'AUGMENT', tier: 2, type: 'feature',
    outlet: 'Lifespan.io — Augmentation Lab Announces the Human Augmentation Summit',
    url: 'https://www.lifespan.io/news/augmentation-lab-announces-the-human-augmentation-summit/',
  },
  {
    date: '2025.03', subject: 'MTD', tier: 2, type: 'feature',
    outlet: 'Roatan Tourism Bureau — Tim & Adam Draper Visit Próspera',
    url: 'https://roatantourismbureau.com/community-updates/meet-the-drapers-visit-prospera-roatan',
  },
  {
    date: '2025.03', subject: 'MTD', tier: 2, type: 'feature',
    outlet: 'La Prensa (Honduras) — Meet The Drapers reunió a 150 startups tecnológicas en Roatán',
    url: 'https://www.laprensa.hn/economia/meet-the-drapers-reunion-150-starups-tecnologicas-roatan-GL24856123',
  },
  {
    date: '2024', subject: 'VITALIA', tier: 2, type: 'feature',
    outlet: 'Longevity.Technology — Vitalia pop-up city aims to redefine longevity biotech',
    url: 'https://longevity.technology/news/vitalia-pop-up-city-aims-to-redefine-the-longevity-biotech-landscape/',
  },
  {
    date: '2024', subject: 'VITALIA', tier: 2, type: 'feature',
    outlet: 'Longevity.Technology — Life extension breaking new ground (Vitalia)',
    url: 'https://longevity.technology/news/life-extension-breaking-new-ground/',
  },
  {
    date: '2024', subject: 'VITALIA', tier: 2, type: 'feature',
    outlet: 'Lifespan.io — Vitalia: An Island Destination for Life Extension',
    url: 'https://lifespan.io/vitalia-living-the-longevity-dream/',
  },
  {
    date: '2023.09', subject: 'ITU', tier: 2, type: 'feature',
    outlet: 'TechAfrica News — ITU Selects 17 Global Centers to Drive Digital Innovation',
    url: 'https://techafricanews.com/2023/09/18/itu-selects-17-global-centers-to-drive-digital-innovation-and-entrepreneurship/',
  },
  {
    date: '2023', subject: 'ITU', tier: 1, type: 'press rel.',
    outlet: 'eTrade for All — Launch of the Network of Acceleration Centers',
    url: 'https://etradeforall.org/news/launch-of-the-network-of-acceleration-centers-to-unlock-innovation-for-sustainable-digital-transformation/',
  },
  {
    date: '2019', subject: 'ELLIOT', tier: 1, type: 'talk',
    outlet: 'GapSummit (Cambridge) — Speaker: Elliot Roth',
    url: 'https://2019.gapsummit.com/speaker/elliot-roth/',
  },
  // ----- ongoing / undated -----
  {
    date: '', subject: 'ITU', tier: 1, type: 'program page',
    outlet: 'ITU — Network of ITU Acceleration Centres',
    url: 'https://www.itu.int/itu-d/sites/innovation-alliance/network-of-itu-acceleration-centres/',
  },
  {
    date: '', subject: 'ELLIOT', tier: 1, type: 'profile',
    outlet: 'MIT Solve — Global Solvers & Social Impact Innovators',
    url: 'https://solve.mit.edu/users/elliot-roth',
  },
  {
    date: '', subject: 'ELLIOT', tier: 1, type: 'feature',
    outlet: 'VCU Entrepreneurship — The Entrepreneurial Spirit Behind Spira',
    url: 'https://entrepreneurship.vcu.edu/blog/The-Entrepreneurial-Spirit-Behind-Spira',
  },
  {
    date: '', subject: 'ELLIOT', tier: 4, type: 'database',
    outlet: 'Crunchbase — Elliot Roth · Founder profile',
    url: 'https://www.crunchbase.com/person/elliot-roth',
  },
  {
    date: '', subject: 'ELLIOT', tier: 4, type: 'podcast',
    outlet: 'Inside Biotech — Elliot Roth, Founder of Spira Inc.',
    url: 'https://inside-biotech.simplecast.com/episodes/elliot-roth-founder-of-spira-inc-f7WHnEvK',
  },
];
const mediaDated = mediaCoverage.filter(m => m.date !== '');
const mediaUndated = mediaCoverage.filter(m => m.date === '');

// ---------------------------------------------------------------------------
// Sidebar facts (single source of truth — same values as §01 table)
// ---------------------------------------------------------------------------
const sidebarFacts: SidebarFact[] = [
  { key: 'Trading name', value: 'Mirai Tech (JP) · Frontier Humans (US)' },
  { key: 'Legal entity', value: 'Unchain Bio, Inc. · Delaware C-Corp' },
  { key: 'Founded', value: ENTITY.foundedOn ?? <Placeholder variant="inline" note="month + year" /> },
  { key: 'Representative', value: 'Victoria Massó' },
  { key: 'Registered', value: 'Wilmington, DE (USA)' },
  { key: 'Mailing', value: 'London W1W 5PF (UK)' },
  { key: 'Contact', value: 'victoria@miraitech.city' },
];

// ---------------------------------------------------------------------------
// Row helper for the company facts table
// ---------------------------------------------------------------------------
function Row({
  k,
  kJa,
  stamp,
  children,
}: {
  k: string;
  kJa?: string;
  stamp?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="kaisha-table-row">
      <div className="kaisha-table-key">
        {k}
        {kJa && <span className="kaisha-table-key-ja jp">{kJa}</span>}
      </div>
      <div className="kaisha-table-val">{children}</div>
      <div className="kaisha-table-stamp">{stamp}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-watermark jp" aria-hidden="true">未来</div>

      <div className="about-page-inner">
        <a href="/" className="about-back mono">&larr; miraitech.city</a>

        <header className="about-top">
          <div className="about-eyebrow mono">COMPANY · MIRAI TECH · 会社案内</div>
          <h1 className="about-title">Mirai Tech</h1>
          <p className="about-lede">
            We are an international team that runs popup cities, biotech accelerators, and
            innovation programmes. The Mirai Tech Pop-Up City takes place on Port Island, Kobe,
            from October&nbsp;1 to&nbsp;31, 2026, with the support of KBIC.
          </p>
        </header>

        <div className="about-layout">
          <div className="about-main">

            {/* §01 — 会社概要 / Corporate Outline */}
            <section className="about-section" id="gaiyo">
              <SectionHeading
                number="01"
                en="Corporate Outline"
                deck="Facts third parties can verify independently. Items marked PLACEHOLDER are not yet final and will be confirmed before this page is shared with institutional partners."
              />
              <div className="kaisha-table">
                <Row k="Trading name" kJa="商号">Mirai Tech (Japan) · Frontier Humans (USA)</Row>
                <Row k="Website" kJa="ウェブサイト">
                  <a href="https://miraitech.city" rel="noopener">miraitech.city</a>
                </Row>
                <Row
                  k="Legal entity"
                  kJa="法人名"
                  stamp={ENTITY.legalName ? <Stamp state="on-record" source="company registry" /> : undefined}
                >
                  {ENTITY.legalName ?? <Placeholder variant="inline" note="e.g. Mirai Tech, Inc." />}
                </Row>
                <Row
                  k="Jurisdiction"
                  kJa="登記管轄"
                  stamp={ENTITY.jurisdiction ? <Stamp state="on-record" source="state of incorporation" /> : undefined}
                >
                  {ENTITY.jurisdiction ?? <Placeholder variant="inline" note="state / country" />}
                </Row>
                <Row
                  k="Founded"
                  kJa="設立"
                  stamp={ENTITY.foundedOn ? <Stamp state="on-record" source="Delaware Sec. of State" /> : undefined}
                >
                  {ENTITY.foundedOn ?? <Placeholder variant="inline" note="month + year of entity formation" />}
                </Row>
                <Row
                  k="Corporate ID"
                  kJa="法人番号"
                  stamp={ENTITY.identifierValue ? <Stamp state="on-record" source="IRS" /> : undefined}
                >
                  {ENTITY.identifierValue
                    ? `${ENTITY.identifierLabel}: ${ENTITY.identifierValue}`
                    : <Placeholder variant="inline" note="EIN (US) / 法人番号 (JP entity TBD)" />}
                </Row>
                <Row
                  k="Registered office"
                  kJa="登記住所"
                  stamp={<Stamp state="on-record" source="Delaware Sec. of State" />}
                >
                  {REGISTERED_ADDRESS}
                </Row>
                <Row k="Mailing address" kJa="連絡先住所">
                  {MAILING_ADDRESS}
                </Row>
                <Row
                  k="Representative"
                  kJa="代表者"
                  stamp={<Stamp state="pending" source="LinkedIn URL to be added" />}
                >
                  Victoria Massó · Co-Founder & CEO
                </Row>
                <Row k="Primary contact" kJa="問合せ先">
                  <a href="mailto:victoria@miraitech.city">victoria@miraitech.city</a>
                  <span className="mono" style={{ color: 'var(--slate)', marginLeft: '0.5rem', fontSize: 10 }}>
                    · 2 business-day response SLA
                  </span>
                </Row>
              </div>
            </section>

            {/* §02 — 事業内容 / Business Activities */}
            <section className="about-section" id="jigyo">
              <SectionHeading
                number="02"
                en="Business Activities"
                deck="Mirai Tech designs and operates time-bounded innovation programmes that connect international biotech founders, researchers, and investors with Japanese institutions. Three product lines."
              />
              <div className="about-products">
                {products.map((p) => (
                  <div key={p.name} className="about-product">
                    <div className="about-product-tag mono">{p.tag}</div>
                    <div className="about-product-name">{p.name}</div>
                    <div className="about-product-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* §03 — 代表者・経営陣 / Leadership */}
            <section className="about-section" id="daihyo">
              <SectionHeading
                number="03"
                en="Leadership"
                deck="The founding team accountable for designing and delivering the Mirai Tech Pop-Up City, plus the senior advisors guiding strategy. Each card links to verifiable third-party sources."
              />

              <h3 className="about-subheading">
                Founders <span className="about-subheading-ja jp">創業者</span>
              </h3>
              <div className="daihyo-list">
                {founders.map((d) => (
                  <DaihyoCard key={d.name} d={d} />
                ))}
              </div>

              <h3 className="about-subheading" style={{ marginTop: '3rem' }}>
                Advisors <span className="about-subheading-ja jp">顧問</span>
              </h3>
              <div className="daihyo-list">
                {advisors.map((d) => (
                  <DaihyoCard key={d.name} d={d} />
                ))}
              </div>
            </section>

            {/* §04 — 沿革・実績 / Track Record */}
            <section className="about-section" id="jisseki">
              <SectionHeading
                number="04"
                en="Track Record"
                deck="Selected programmes operated by members of the founding team prior to Mirai Tech. Each entry includes location, dates, and quantified outcomes."
              />
              <div className="about-record">
                {trackRecord.map((r) => (
                  <article key={r.name} className="about-record-item">
                    <div className="about-record-head">
                      <div className="about-record-meta mono">{r.location} · {r.period}</div>
                      <div className="about-record-name">{r.name}</div>
                      <div className="about-record-desc">{r.desc}</div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {r.pressUrl ? (
                          <a
                            href={r.pressUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mono"
                            style={{
                              color: 'var(--white)',
                              fontSize: 10,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              borderBottom: '1px solid var(--pink)',
                              paddingBottom: 1,
                            }}
                          >
                            External coverage ↗
                          </a>
                        ) : (
                          <Stamp state="pending" source="press link pending" />
                        )}
                      </div>
                    </div>
                    <div className="about-record-stats">
                      {r.stats.map((s) => (
                        <div key={s.label} className="about-record-stat">
                          <div className="about-record-stat-val">{s.val}</div>
                          <div className="about-record-stat-label mono">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* §05 — 提携機関 / Partners & Institutions */}
            <section className="about-section" id="teikei">
              <SectionHeading
                number="05"
                en="Partners & Institutions"
                deck="Display reflects written consent from each named institution. Until written sign-off is on file, partners appear text-only with a 照会中 stamp rather than a logo."
              />
              <TeikeiCounter ready={partnersConfirmed} total={partnersTotal} />
              <div className="teikei-list">
                {partners.map((p) => (
                  <TeikeiBlock key={p.name} p={p} />
                ))}
              </div>
              <p className="teikei-footnote">
                掲載は各機関の書面承認に基づきます / Display reflects written consent from each named institution.
              </p>

              <h3 className="about-subheading" style={{ marginTop: '2.5rem' }}>
                Media coverage <span className="about-subheading-ja jp">メディア掲載</span>
              </h3>
              {mediaCoverage.length > 0 ? (
                <>
                  <p className="media-intro">
                    Coverage spans MIT Solve · ITU.int · VCU Entrepreneurship · Longevity.Technology · Lifespan.io · GapSummit Cambridge. The archive below; reverse chronological.
                  </p>

                  <div className="media-table">
                    <div className="media-table-header">
                      <div>Date</div>
                      <div>Subject</div>
                      <div>Outlet</div>
                      <div>Type</div>
                    </div>
                    {mediaDated.map((m) => (
                      <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer" className={`media-row tier-${m.tier}`}>
                        <div className="media-row-date mono">{m.date}</div>
                        <div className="media-row-subject mono">{m.subject}</div>
                        <div className="media-row-outlet">{m.outlet}</div>
                        <div className="media-row-type mono">{m.type}</div>
                      </a>
                    ))}
                  </div>

                  {mediaUndated.length > 0 && (
                    <>
                      <div className="media-table-divider mono">— ongoing · undated —</div>
                      <div className="media-table">
                        {mediaUndated.map((m) => (
                          <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer" className={`media-row tier-${m.tier}`}>
                            <div className="media-row-date mono">—</div>
                            <div className="media-row-subject mono">{m.subject}</div>
                            <div className="media-row-outlet">{m.outlet}</div>
                            <div className="media-row-type mono">{m.type}</div>
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  <p className="media-codes mono">
                    Subject codes: <strong>VITALIA</strong> Vitalia City · <strong>MTD</strong> Meet The Drapers · <strong>AUGMENT</strong> Human Augmentation Summit · <strong>ITU</strong> ITU Acceleration Centres · <strong>ELLIOT</strong> Elliot Roth / Spira
                  </p>
                </>
              ) : (
                <Placeholder note="Media coverage list — add publications, dates, and external URLs. Strongest items: founder speaking engagements, prior event recaps (Vitalia, MIT, ITU), podcast appearances." />
              )}
            </section>

            {/* §06 — 設立趣旨 / Founding Purpose */}
            <section className="about-section" id="shushi">
              <SectionHeading
                number="06"
                en="Founding Purpose"
              />
              <div className="about-section-body">
                <p style={{ marginBottom: '1rem' }}>
                  Kobe has welcomed the world&apos;s builders since 1868, when its port opened and foreign engineers and innovators came to help shape modern Japan. Mirai Tech continues that tradition. Our purpose is to accelerate the future of <em>longevity</em> and <em>human enhancement</em>{' '}by connecting Japan&apos;s biotech ecosystem and forward-thinking regulatory frameworks with the international community of builders working at the frontier.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  The social issues we address are concrete: aging populations facing a widening healthspan gap, fragmented East–West regulatory pathways that slow the deployment of new therapies, and the absence of a dense, in-person convening point where Japanese institutions, international entrepreneurs, and regulators can do real work together.
                </p>
                <p>
                  The team&apos;s combined expertise spans synthetic biology, biotech commercialisation, UN/ITU multilateral programming, and the operational delivery of popup cities at Próspera SEZ (Honduras) and Viva City SF — the relevant prior work for this mission.
                </p>
              </div>
            </section>

          </div>

          <GaiyoSidebar facts={sidebarFacts} sections={SECTIONS} />
        </div>
      </div>

      <BilingualBar />
    </main>
  );
}
