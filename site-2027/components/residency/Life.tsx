// Life in Japan (暮らし) and Voices: real Cohort 0 photos, then testimonials.
// Server component, CSS only. Composition: head → one dinner, full-bleed → a strip of four
// supporting prints (2×2 on phones) → the big people moment (the whole cohort) with two
// prints beside it. The one scroll-linked gesture is pure CSS: the full-bleed dinner drifts
// slowly inside its frame (animation-timeline: view()). Without support, with reduced
// motion, or without JS it sits still.
//
// Photo rules: the section opens on the dinner, never on a selfie, and the same-person
// selfies (travel, neon here) are never next to each other: first and last of the strip
// on desktop, diagonal in the 2×2 on phones. A print shows its manifest caption (or
// r.photoText on /jp) or no caption at all. DOM order = visual order everywhere.
import Image from 'next/image';
import Script from 'next/script';
import photos from '@/content/photos-2026.json';
import { residency, type Residency } from '@/content/residency';
import { DEV } from '@/components/dev';
import s from './Life.module.css';

type Photo = (typeof photos)[number];

const byName = new Map(photos.map(p => [p.src.slice(p.src.lastIndexOf('/') + 1, -'.webp'.length), p]));
const get = (name: string): Photo => {
  const p = byName.get(name);
  if (!p) throw new Error(`Life: no photo "${name}" in content/photos-2026.json`);
  return p;
};

// Full-bleed dinner.
const OPEN = 'meal-pub-01';
// Strip of four supporting prints, cropped 4:3.
const STRIP = ['people-friends-travel-01', 'meal-long-table-01', 'meal-wagyu-01', 'people-group-neon-street-01'];
// The big people moment. Its source is only 1024px wide: a large print, never full-bleed.
const BIG = 'people-group-laughing-01';
// Stacked beside it (side by side on phones), cropped 4:3.
const SIDE = ['people-friends-hike-01', 'meal-hibachi-01'];

// Honest `sizes`. Content width is min(1440px, 88vw). Strip: a quarter of it on desktop,
// half on phones. Moment: 7fr 3fr on desktop; full width + halves on phones.
const SIZES = {
  strip: '(max-width: 799px) 43vw, (min-width: 1637px) 340px, 21vw',
  big: '(max-width: 799px) 88vw, (min-width: 1637px) 990px, 61vw',
  side: '(max-width: 799px) 43vw, (min-width: 1637px) 420px, 26vw',
};

function Print({ name, sizes, className, r }: { name: string; sizes: string; className?: string; r: Residency }) {
  const p = get(name);
  const alt = r.photoText[name]?.alt ?? p.alt;
  const caption = r.photoText[name]?.caption ?? p.caption;
  return (
    <figure className={`${s.print} ${className ?? ''}`} style={{ '--ratio': p.w / p.h } as React.CSSProperties}>
      <div className={`${s.frame} grain`}>
        <Image className={`${s.img} grade`} src={p.src} alt={alt} fill sizes={sizes} style={{ objectPosition: p.focal }} />
      </div>
      {caption && <figcaption className={s.cap}>{caption}</figcaption>}
    </figure>
  );
}

export function Life({ r = residency }: { r?: Residency } = {}) {
  const l = r.life;
  const cut = l.headline.indexOf(', ') + 1; // "Even if you don't raise," | "you'll have a great month in Japan"
  const headline = l.headline.replace(/'/g, '’');

  return (
    <section id="life" className={s.life} aria-labelledby="life-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">暮らし</b><span>{r.marks.life}</span></p>
          <p className={s.eyebrow}>{l.eyebrow}</p>
        </header>
        <h2 id="life-title" className={s.headline}>
          {cut > 0 ? <><span className={s.if}>{headline.slice(0, cut)}</span> {headline.slice(cut + 1)}</> : headline}
        </h2>
        <p className={s.lead}>{l.lead}</p>
      </div>

      <Print r={r} name={OPEN} sizes="100vw" className={s.bleed} />

      <div className={s.inner}>
        <div className={s.strip}>
          {STRIP.map(name => <Print r={r} key={name} name={name} sizes={SIZES.strip} />)}
        </div>

        <div className={s.moment}>
          <Print r={r} name={BIG} sizes={SIZES.big} />
          <div className={s.side}>
            {SIDE.map(name => <Print r={r} key={name} name={name} sizes={SIZES.side} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// Dev placeholders only show with ?voices=1 in the URL (hidden by default, so the client can
// review the dev site without three empty boxes). Production: nothing until items exist.
const SHOW_SLOTS = `if (new URLSearchParams(location.search).get('voices') === '1') document.getElementById('voices').hidden = false;`;

export function Voices({ r = residency }: { r?: Residency } = {}) {
  const v = r.voices;
  if (!v.items.length && !DEV) return null;
  const slots = !v.items.length;
  const count = v.items.length || 3;

  return (
    <section id="voices" className={s.voices} aria-labelledby="voices-title" hidden={slots}>
      {slots && <Script id="voices-slots">{SHOW_SLOTS}</Script>}
      <div className={s.inner}>
        <header className={s.vHead}>
          <p className={s.eyebrow}>{v.eyebrow}</p>
          <h2 id="voices-title" className={s.vTitle}>{v.headline}</h2>
        </header>
        {/* odd counts: the first quote runs the full width, larger */}
        <ul className={s.quotes} data-odd={count % 2 === 1 || undefined}>
          {v.items.length
            ? v.items.map(q => (
                <li key={q.name} className={s.quote} data-long={q.quote.length > 180 || undefined}>
                  <figure>
                    <blockquote><p>{`“${q.quote}”`}</p></blockquote>
                    <figcaption className={s.who}>
                      <b>{q.name}</b>
                      <span>{q.company ? `${q.role}, ${q.company}` : q.role}</span>
                      {q.link && <a className={s.more} href={q.link.href}>{q.link.label} →</a>}
                    </figcaption>
                  </figure>
                </li>
              ))
            : [1, 2, 3].map(i => (
                <li key={i} className={`${s.quote} ${s.slot}`}>Testimonial {i}: quote, name, role</li>
              ))}
        </ul>
      </div>
    </section>
  );
}
