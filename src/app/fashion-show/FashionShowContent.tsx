'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const SHOW_DATE = new Date('2026-10-31T19:00:00+09:00');

const CATEGORIES = [
  {
    tag: 'EXO',
    name: 'Exoskeletons',
    desc: 'Worn robotics that augment strength, mobility, or endurance.',
  },
  {
    tag: 'NEUR',
    name: 'Neural Interfaces',
    desc: 'BCIs and non-invasive neurotech, on-body for the first time.',
  },
  {
    tag: 'PROS',
    name: 'Smart Prosthetics',
    desc: 'Next-gen limbs — sensor-rich, actuated, intent-aware.',
  },
  {
    tag: 'BIO',
    name: 'Biosensors',
    desc: 'Garments and patches that read physiology in real time.',
  },
  {
    tag: 'HAP',
    name: 'Haptic Suits',
    desc: 'Whole-body feedback systems for sensory augmentation.',
  },
  {
    tag: 'BION',
    name: 'Bionics',
    desc: 'Hybrid devices that blur the line between hardware and body.',
  },
  {
    tag: 'WEAR',
    name: 'Smart Wearables',
    desc: 'Adaptive clothing, on-skin UI, and ambient health tech.',
  },
  {
    tag: 'AR/VR',
    name: 'Spatial Medical',
    desc: 'Optics and spatial compute as medical-grade interfaces.',
  },
  {
    tag: 'GEN',
    name: 'Genes & Cells',
    desc: 'Therapeutic products visualized through wearable delivery.',
  },
] as const;

const AUDIENCE_MIX = [
  { label: 'Founders & residents', pct: 30 },
  { label: 'Investors (check-cutters on-site)', pct: 20 },
  { label: 'Operators & engineers', pct: 20 },
  { label: 'Press & media', pct: 15 },
  { label: 'Fashion / design industry', pct: 10 },
  { label: 'Invited VIPs & partners', pct: 5 },
] as const;

const SPONSOR_FAQ = [
  {
    q: 'When do sponsors need to commit?',
    a: 'Title and Runway tiers close 60 days out (Sep 1, 2026) to allow for broadcast integration, branding production, and press announcements. Category and Media tiers remain open until 30 days out.',
  },
  {
    q: 'What rights come with the livestream package?',
    a: 'Your tier-appropriate branding runs for the full 90-minute live broadcast and in all replays. Sponsors receive raw and edited footage with perpetual usage rights for their own channels.',
  },
  {
    q: 'Is category exclusivity available?',
    a: 'Yes. Category Sponsors own their category on stage and on-broadcast. Title and Runway tiers are always exclusive by definition.',
  },
  {
    q: 'Who owns the broadcast footage post-event?',
    a: 'Frontier Humans retains the master. Sponsors get asset rights per tier. Each cohort\'s 8-minute segment (Walk + Demo + Conversation) is distributed as a standalone clip.',
  },
  {
    q: 'Can we host our own VIPs on-site?',
    a: 'Yes. Tier-appropriate VIP seat allocations, pre-show reception access, and a private on-site hospitality option for Title and Runway partners.',
  },
  {
    q: 'Are on-site activations allowed?',
    a: 'Brand lounges, demo pods, and co-branded installations are available as add-ons. Subject to venue approval and tier.',
  },
] as const;

const SPONSOR_MAILTO =
  'mailto:pedro@frontierhumans.com?subject=Fashion%20Show%20Sponsor%20Deck%20Request';
const BOOK_CALL_MAILTO =
  'mailto:pedro@frontierhumans.com?subject=Sponsor%20Intro%20Call%20-%20Fashion%20Show';

function useCountdown(target: Date): number | null {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      setDays(Math.max(0, Math.ceil(diff / 86_400_000)));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [target]);
  return days;
}

export function FashionShowContent() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const daysOut = useCountdown(SHOW_DATE);
  const [progress, setProgress] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blocks = sectionRef.current?.querySelectorAll<HTMLElement>('.fs-reveal');
    if (!blocks) return;

    if (reduced) {
      blocks.forEach((b) => b.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );

    blocks.forEach((b) => {
      const rect = b.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        b.classList.add('in');
      } else {
        io.observe(b);
      }
    });

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(total > 0 ? Math.min(1, y / total) : 0);
      const heroBottom = heroRef.current
        ? heroRef.current.getBoundingClientRect().bottom
        : 0;
      setShowStickyCta(heroBottom < 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="fs-page" ref={sectionRef}>
      <div
        className={`fs-sticky-bar ${showStickyCta ? 'visible' : ''}`}
        aria-hidden={!showStickyCta}
      >
        <div className="fs-sticky-inner">
          <a href="/" className="fs-sticky-logo mono" aria-label="Back to Mirai Tech">
            <span className="fs-sticky-mark jp">未</span>
            <span>FRONTIER HUMAN FASHION SHOW · KOBE · OCT 2026</span>
          </a>
          <a className="btn btn-primary fs-sticky-cta" href={SPONSOR_MAILTO}>
            Sponsor the Show
          </a>
        </div>
        <div className="fs-sticky-progress" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="fs-kanji-watermark jp" aria-hidden="true">服</div>

      <div className="fs-page-inner">
        {/* ── HERO ── */}
        <header className="fs-hero" ref={heroRef}>
          <a href="/" className="fs-back mono">&larr; mirai.tech</a>
          <div className="fs-hero-grid">
            <div className="fs-hero-text">
              <div className="fs-eyebrow mono">[ THE EVENT ]</div>
              <h1 className="fs-title display">
                The Frontier Human<br />
                <em>Fashion Show</em>
              </h1>
              <p className="fs-tagline">
                A live demo day, reimagined as a runway. Device residents debut
                first-in-human prototypes on models &mdash; blending medical
                technology with high fashion.
                <br />
                <span className="fs-tagline-emph">
                  One night in Kobe. 90 minutes, broadcast worldwide to
                  investors, press, and operators.
                </span>
              </p>
              <div className="fs-meta mono">
                <span>OCT 2026</span>
                <span className="fs-meta-dot" />
                <span>KOBE PORT ISLAND</span>
                <span className="fs-meta-dot" />
                <span>ONE NIGHT ONLY</span>
              </div>
              <div className="fs-countdown mono">
                <span className="fs-countdown-num">
                  {daysOut !== null ? daysOut : '—'}
                </span>
                <span className="fs-countdown-label">DAYS OUT · OCT 2026</span>
              </div>
              <div className="fs-hero-ctas">
                <a className="btn btn-primary fs-btn-solid" href={SPONSOR_MAILTO}>
                  Sponsor the Show →
                </a>
                <a className="btn btn-outline" href="/apply">
                  Apply to Walk
                </a>
              </div>
              <p className="fs-hero-proof">
                Produced by <strong>Frontier Humans</strong> &mdash; community
                meetups and talks in Tokyo and Cambridge.
              </p>
            </div>
            <div className="fs-hero-visual" aria-hidden="true">
              <Image
                src="/images/FS/frontier-helmet.png"
                alt=""
                width={720}
                height={720}
                className="fs-hero-img"
                priority
                sizes="(max-width: 980px) 60vw, 480px"
              />
              <div className="fs-hero-glow" />
            </div>
          </div>
        </header>

        {/* ── §4.2 BROADCAST AS ASSET ── */}
        <section className="fs-broadcast fs-reveal" aria-labelledby="fs-broadcast-h">
          <div className="section-label">The broadcast is the asset</div>
          <h2 id="fs-broadcast-h" className="display fs-h2">
            One sponsorship. Three audiences.
          </h2>
          <p className="fs-broadcast-lede">
            Kobe is the venue. The broadcast is the product. Sponsors show up
            in the room, on the stream, and on the clips that live forever.
          </p>
          <div className="fs-broadcast-grid">
            <article className="fs-broadcast-card">
              <div className="fs-broadcast-num mono">01 · IN-PERSON</div>
              <h3 className="fs-broadcast-name display">Kobe Port Island</h3>
              <p>
                Seated audience of founders, investors, and press. Front row:
                Builder Pass holders and invited VIPs. The room every sponsor
                wants their brand standing in.
              </p>
              <div className="fs-broadcast-stat mono">ONE NIGHT · OCT 31</div>
            </article>
            <article className="fs-broadcast-card fs-broadcast-card--primary">
              <div className="fs-broadcast-num mono">02 · LIVE BROADCAST</div>
              <h3 className="fs-broadcast-name display">90 Minutes, Worldwide</h3>
              <p>
                Streamed to investors, press, and operators who couldn&apos;t
                fly to Kobe. Targeted reach:{' '}
                <strong>2,500 concurrent · 25,000 replay</strong>{' '}
                <span className="fs-small">(projection)</span>.
              </p>
              <div className="fs-broadcast-stat mono">LIVE + ON-DEMAND</div>
            </article>
            <article className="fs-broadcast-card">
              <div className="fs-broadcast-num mono">03 · POST-EVENT</div>
              <h3 className="fs-broadcast-name display">Evergreen Clips</h3>
              <p>
                Each cohort&apos;s 8-minute segment (Walk + Demo + Conversation)
                becomes a standalone clip, distributed to press and posted to
                YouTube + X. Sponsors get asset rights.
              </p>
              <div className="fs-broadcast-stat mono">PERPETUAL USAGE</div>
            </article>
          </div>
        </section>

        {/* ── §4.4 WHO'S IN THE ROOM ── */}
        <section className="fs-audience fs-reveal" aria-labelledby="fs-audience-h">
          <div className="section-label">Who&apos;s in the room</div>
          <h2 id="fs-audience-h" className="display fs-h2">
            A room underwritten by check-cutters and press.
          </h2>
          <p className="fs-audience-lede">
            Target mix for Kobe, modeled on prior Frontier Humans community events.
          </p>
          <ul className="fs-audience-list" role="list">
            {AUDIENCE_MIX.map((row) => (
              <li key={row.label} className="fs-audience-row">
                <div className="fs-audience-label">{row.label}</div>
                <div className="fs-audience-track">
                  <div className="fs-audience-fill" style={{ width: `${row.pct * 2}%` }} />
                </div>
                <div className="fs-audience-pct mono">{row.pct}%</div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── §4.5 LINEAGE (promoted up) ── */}
        <section className="fs-lineage fs-reveal" aria-labelledby="fs-lineage-heading">
          <div className="fs-lineage-header">
            <div className="section-label">Community lineage</div>
            <h2 id="fs-lineage-heading" className="display fs-h2">
              Built on a community we&apos;ve been gathering for years.
            </h2>
            <p className="fs-lineage-sub mono">
              TOKYO &middot; CAMBRIDGE &middot; COMMUNITY EVENTS &middot; BACKED BY THE $1T ENHANCED-FASHION CATEGORY
            </p>
          </div>

          <div className="fs-lineage-grid">
            <article className="fs-lineage-card fs-lineage-card--upcoming">
              <div className="fs-lineage-img-wrap">
                <Image
                  src="/images/FS/luma.png"
                  alt="Enhanced Fashion Show — Kobe, Japan · October 2026"
                  fill
                  sizes="(max-width: 980px) 100vw, 33vw"
                  className="fs-lineage-img"
                />
              </div>
              <div className="fs-lineage-meta">
                <span className="fs-lineage-tag mono">UPCOMING &middot; JAPAN</span>
                <h3 className="fs-lineage-name display">
                  Enhanced Fashion Show
                </h3>
                <p className="fs-lineage-desc">
                  Kobe Port Island. The inaugural edition &mdash; closing
                  Mirai Tech PopUp City, October 2026.
                </p>
                <p className="fs-lineage-press mono">DOORS OPEN &middot; OCT 2026</p>
              </div>
            </article>

            <article className="fs-lineage-card fs-lineage-card--past">
              <div className="fs-lineage-img-wrap">
                <Image
                  src="/images/FS/fttokyo.png"
                  alt="Frontier Humans · Enhanced Fashion Meetup — Tokyo"
                  fill
                  sizes="(max-width: 980px) 100vw, 33vw"
                  className="fs-lineage-img"
                />
              </div>
              <div className="fs-lineage-meta">
                <span className="fs-lineage-tag mono">TOKYO &middot; NOV 2025</span>
                <h3 className="fs-lineage-name display">
                  Enhanced Fashion Meetup
                </h3>
                <p className="fs-lineage-desc">
                  Shinjuku Higashiguchi. Frontier Humans Tokyo cohort,
                  November 2025.
                </p>
                <p className="fs-lineage-press mono">RECAP &middot; AVAILABLE ON REQUEST</p>
              </div>
            </article>

            <article className="fs-lineage-card fs-lineage-card--past">
              <div className="fs-lineage-img-wrap">
                <Image
                  src="/images/FS/hum.png"
                  alt="Human Augmentation Summit — MIT Media Lab"
                  fill
                  sizes="(max-width: 980px) 100vw, 33vw"
                  className="fs-lineage-img"
                />
              </div>
              <div className="fs-lineage-meta">
                <span className="fs-lineage-tag mono">CAMBRIDGE &middot; AUG 2025</span>
                <h3 className="fs-lineage-name display">
                  Human Augmentation Summit
                </h3>
                <p className="fs-lineage-desc">
                  MIT Media Lab. Augmentation Lab x Frontier Humans.
                </p>
                <p className="fs-lineage-press mono">MIT MEDIA LAB &middot; PARTNER WRITE-UP</p>
              </div>
            </article>
          </div>
        </section>

        {/* ── INSPO BLOCK: ENHANCED FASHION callout ── */}
        <section className="fs-callout fs-reveal" aria-label="Enhanced Fashion">
          <div className="fs-callout-circuit" aria-hidden="true" />
          <div className="fs-callout-inner">
            <div className="fs-callout-eyebrow mono">[ THE CONCEPT ]</div>
            <div className="fs-callout-bar">
              <h2 className="fs-callout-title mono">ENHANCED FASHION</h2>
            </div>
            <p className="fs-callout-sub">
              CES meets Tokyo Fashion Week. Everyone&apos;s wearing exoskeletons
              and neural interfaces.
            </p>
          </div>
        </section>

        {/* ── WHAT IT IS ── */}
        <section className="fs-what fs-reveal">
          <div className="fs-what-image">
            <Image
              src="/images/FS/fashion.png"
              alt="Frontier Human Fashion Show — four models showcasing futuristic couture and bionic enhancements"
              fill
              sizes="(max-width: 980px) 100vw, 50vw"
              className="fs-what-img"
            />
            <div className="fs-what-img-grain" aria-hidden="true" />
          </div>

          <div className="fs-what-text">
            <div className="section-label">What it is</div>
            <h2 className="display fs-h2">
              The runway <em>becomes</em> the demo day.
            </h2>
            <p>
              Traditional demo days happen under fluorescent lights, in
              conference rooms, with founders pitching to a room of folded arms.
              We&apos;re doing the opposite. The Frontier Human Fashion Show
              closes Mirai Tech PopUp City with a single live event &mdash; one
              night where every Device resident cohort debuts their prototype
              <strong> on a person, on a runway</strong>.
            </p>
            <p>
              Models, athletes, dancers, and residents themselves walk wearing
              exoskeletons, neural interfaces, smart prosthetics, biosensor
              garments, and haptic suits. Each look is a working prototype
              &mdash; not a render, not a mockup &mdash; staged with
              choreography, lighting, and original sound design.
            </p>
          </div>
        </section>

        {/* ── §4.6 FORMAT (with sponsor touchpoints) ── */}
        <section className="fs-format fs-reveal">
          <div className="section-label">The format</div>
          <h2 className="display fs-h2">A 90-minute live broadcast.</h2>

          <div className="fs-format-grid">
            <article className="fs-format-card">
              <div className="fs-format-num mono">01</div>
              <h3 className="fs-format-name display">The Walk</h3>
              <p>
                Each Device cohort gets a 6-minute slot. Their prototype walks
                under stage lighting, soundtracked by a custom score. No slides,
                no pitch deck &mdash; the device speaks for itself.
              </p>
              <p className="fs-format-touchpoint mono">
                RUNWAY SPONSOR: FLOOR GRAPHIC · LIGHTING CUE · SOUNDTRACK CREDIT
              </p>
            </article>

            <article className="fs-format-card">
              <div className="fs-format-num mono">02</div>
              <h3 className="fs-format-name display">The Live Demo</h3>
              <p>
                After the walk, the resident steps to the front of the runway
                and demonstrates the device working in real time. Five minutes,
                one camera, no edits.
              </p>
              <p className="fs-format-touchpoint mono">
                CATEGORY SPONSOR: "POWERED BY [BRAND]" LOWER-THIRD
              </p>
            </article>

            <article className="fs-format-card">
              <div className="fs-format-num mono">03</div>
              <h3 className="fs-format-name display">The Conversation</h3>
              <p>
                A short on-stage interview with the resident: what it does, who
                it&apos;s for, where it goes from here. Streamed live to
                investors, press, and operators worldwide.
              </p>
              <p className="fs-format-touchpoint mono">
                TITLE SPONSOR: INTERVIEW SET · CHYRON · HOST INTRO
              </p>
            </article>
          </div>
        </section>

        {/* ── §4.7 CATEGORIES ON STAGE (consolidated) ── */}
        <section className="fs-categories fs-reveal" aria-labelledby="fs-cats-h">
          <div className="section-label">Categories on stage</div>
          <h2 id="fs-cats-h" className="display fs-h2">
            Seeking category sponsors.
          </h2>
          <ul className="fs-cat-grid" role="list">
            {CATEGORIES.map((c) => (
              <li key={c.name} className="fs-cat-card">
                <span className="fs-cat-tag mono">{c.tag}</span>
                <h3 className="fs-cat-name">{c.name}</h3>
                <p className="fs-cat-desc">{c.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── §4.10 VENUE & LOGISTICS ── */}
        <section className="fs-venue fs-reveal" aria-labelledby="fs-venue-h">
          <div className="section-label">Venue &amp; logistics</div>
          <h2 id="fs-venue-h" className="display fs-h2">
            Kobe Port Island.
          </h2>
          <div className="fs-venue-grid">
            <div className="fs-venue-block">
              <div className="fs-venue-eyebrow mono">VENUE</div>
              <p>
                Kobe Biomedical Innovation Cluster (KBIC) &mdash; purpose-built
                biomedical district on Port Island, home to the four-week
                Mirai residency.
              </p>
            </div>
            <div className="fs-venue-block">
              <div className="fs-venue-eyebrow mono">ACCESS</div>
              <p>
                Kobe Airport is 8 minutes by monorail. Osaka (KIX) is 45
                minutes. Tokyo via Shinkansen is under 3 hours. Hotel partner
                block within walking distance.
              </p>
            </div>
            <div className="fs-venue-block">
              <div className="fs-venue-eyebrow mono">HOSPITALITY</div>
              <p>
                Title and Runway partners can host their own VIPs on-site with
                a dedicated reception area. Brand lounges and demo pods
                available as add-ons.
              </p>
            </div>
          </div>
        </section>

        {/* ── §4.11 SPONSOR FAQ ── */}
        <section className="fs-faq fs-reveal" aria-labelledby="fs-faq-h">
          <div className="section-label">Sponsor FAQ</div>
          <h2 id="fs-faq-h" className="display fs-h2">
            Questions we get every week.
          </h2>
          <div className="fs-faq-list">
            {SPONSOR_FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className={`fs-faq-item ${open ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="fs-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="fs-faq-plus mono" aria-hidden="true">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && <p className="fs-faq-a">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── §4.12 FINAL CTA ── */}
        <section className="fs-cta fs-reveal">
          <div className="fs-cta-block">
            <div className="section-label fs-cta-label">Book the call</div>
            <h2 className="display fs-h2">
              Sponsor the <em>show.</em>
            </h2>
            <p className="fs-cta-sub">
              One night in Kobe, 90 minutes on-broadcast, evergreen clips
              after. The deck lands in your inbox the moment you ask.
            </p>
            <div className="fs-cta-buttons">
              <a className="btn btn-primary fs-btn-solid" href={SPONSOR_MAILTO}>
                Request the Sponsor Deck →
              </a>
              <a className="btn btn-outline" href={BOOK_CALL_MAILTO}>
                Book a 20-min intro
              </a>
              <a className="btn btn-ghost" href="/apply">
                Apply to Walk
              </a>
            </div>
            <p className="fs-cta-contact mono">
              PARTNERSHIPS · PEDRO ·{' '}
              <a href="mailto:pedro@frontierhumans.com">pedro@frontierhumans.com</a>
            </p>
          </div>

          <div className="fs-attribution">
            <span className="mono fs-attribution-text">An event by</span>
            <Image
              src="/images/FS/frontierHumans.svg"
              alt="Frontier Humans"
              width={220}
              height={36}
              className="fs-attribution-logo"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
