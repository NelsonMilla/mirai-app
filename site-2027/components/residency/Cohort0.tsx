'use client';
// Cohort 0 (実績, track record): the proof that companies stayed in Japan.
// 7 → 5 is drawn as seven marks between two dimension lines: the cream line spans all
// seven entrants, the gold line the five that are staying. On wide screens the five lit
// discs carry the company names and the two unlit ones are bare hairline rings; below
// 1000px the marks shrink to a small tally and the names show as the list instead.
// Then the lead, the companies label and the apply pill beside the Demo Day footage, the
// secondary stats and a small strip of 2026 speakers.
// Without JS or with reduced motion everything renders in its finished state; JS only
// arms the entrance when the figure starts below the fold, and plays the video in view.
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { residency, type Residency } from '@/content/residency';
import speakers from '@/content/speakers-2026.json';
import s from './Cohort0.module.css';

// Left to right, Kobe University → Harvard. Joe Betts-LaCroix is never beside Aubrey de
// Grey or Natalie Coles de Grey: keep Watanabe between them (8 across on desktop) and Joe
// off Aubrey's column (4 across on phones: Aubrey ends row one, Joe is second in row two).
const FACES = [
  'takashi_aoi', 'motoshi_hayano', 'rie_yano', 'aubrey_de_grey',
  'masataka_watanabe', 'joe_betts_lacroix', 'louise_hecker', 'george_church',
]
  .map(id => speakers.find(p => p.id === id))
  .filter((p): p is (typeof speakers)[number] & { photo: string } => Boolean(p?.photo));
// Photos that are not headshots, zoomed so the face fills the disc like the others.
const FACE_CROP: Record<string, CSSProperties> = {
  joe_betts_lacroix: { transform: 'translate(25%, 45%) scale(1.9)' }, // waist-up shot on black
};
// "Prof. George Church, PhD" → "George Church"
const plainName = (name: string) => name.replace(/^(Prof\.|Dr\.)\s+/, '').replace(/,.*$/, '');

const VIDEO = { wide: '/media/cohort0-loop.mp4', small: '/media/cohort0-loop-720.mp4', poster: '/media/cohort0-loop-poster.jpg' };

export function Cohort0({ r = residency }: { r?: Residency } = {}) {
  const c = r.cohort0;
  const [entrants, staying, ...secondary] = c.stats; // 7, 5 | 150+, 76, 17
  const speakerCount = c.stats[3]?.value; // "76"
  const FILM_CAPTION = c.filmCaption;
  const FILM_LABEL = c.filmLabel;
  const NETWORK_LINE = `${speakerCount} ${c.network}`;
  const figure = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [canPlay, setCanPlay] = useState(false);
  const [paused, setPaused] = useState(false);

  // Entrance for the 7 → 5 figure: only armed when it starts below the fold, so the
  // finished state is never hidden and never flashes. It plays as soon as the figure enters.
  useEffect(() => {
    const el = figure.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    el.dataset.armed = '';
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.dataset.in = '';
      io.disconnect();
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Video: poster only for reduced motion or Save-Data; otherwise load and play in view.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    v.muted = true;
    setCanPlay(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.getAttribute('src')) {
          v.src = window.matchMedia('(max-width: 760px)').matches ? VIDEO.small : VIDEO.wide;
        }
        if (!userPaused.current) v.play().catch(() => {});
      } else {
        v.pause();
      }
    }, { threshold: 0.2 });
    io.observe(v);
    return () => { io.disconnect(); v.pause(); };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    if (userPaused.current) v.pause();
    else v.play().catch(() => {});
  };

  return (
    <section id="cohort-0" className={s.section} aria-labelledby="cohort-0-title">
      <div className={s.inner}>
        <div className={s.top}>
          <p className="kanjiMark"><b lang="ja">実績</b><span>{r.marks.cohort}</span></p>
          <p className={s.eyebrow}>{c.eyebrow}</p>
        </div>
        <h2 id="cohort-0-title" className={s.title}>{c.headline}</h2>

        {/* 7 → 5 */}
        <div className={s.figure} ref={figure}>
          <p className={s.count}>
            <span className={s.num} style={{ '--d': '0ms' } as React.CSSProperties}>{entrants.value}</span>
            <span className={s.label} style={{ '--d': '120ms' } as React.CSSProperties}>{entrants.label}</span>
          </p>
          <span className={`${s.dim} ${s.dimAll}`} aria-hidden="true" />
          <ol className={s.marks} aria-hidden="true">
            {Array.from({ length: Number(entrants.value) }, (_, i) => {
              const lit = i < Number(staying.value);
              return (
                <li key={i} className={lit ? `${s.mark} ${s.lit}` : s.mark} style={{ '--i': i } as React.CSSProperties}>
                  {lit && <i className={s.glow} />}
                  {lit && <span className={s.fill}><span className={s.co}>{c.companies[i]}</span></span>}
                  <i className={s.ring} />
                </li>
              );
            })}
          </ol>
          <span className={`${s.dim} ${s.dimStay}`} aria-hidden="true" />
          <p className={`${s.count} ${s.stay}`}>
            <span className={s.num} style={{ '--d': '380ms' } as React.CSSProperties}>{staying.value}</span>
            <span className={s.label} style={{ '--d': '480ms' } as React.CSSProperties}>{staying.label}</span>
          </p>
        </div>

        <div className={s.body}>
          <div className={s.text}>
            <p className={s.lead}>{c.lead}</p>
            <h3 className={s.listLabel}>{c.companiesLabel}</h3>
            <ul className={s.companies}>
              {c.companies.map(name => <li key={name}>{name}</li>)}
            </ul>
            <p className={s.note}>{c.note}</p>
            <a className={s.cta} href={r.applyHref} target="_blank" rel="noopener">
              {r.apply}<span className={s.arrow} aria-hidden="true">↗</span><span className={s.sr}> {r.newTab}</span>
            </a>
          </div>

          <figure className={s.film}>
            <div className={`${s.frame} grain`}>
              <video
                ref={video}
                className={`${s.video} grade`}
                poster={VIDEO.poster}
                width={1920}
                height={1080}
                muted
                loop
                playsInline
                preload="none"
                aria-label={FILM_LABEL}
              />
            </div>
            <figcaption className={s.caption}>
              <span>{FILM_CAPTION}</span>
              {canPlay && (
                <button type="button" className={s.toggle} onClick={toggle} aria-pressed={paused}>
                  {paused ? r.ui.play : r.ui.pause}
                </button>
              )}
            </figcaption>
          </figure>
        </div>

        <dl className={s.stats}>
          {secondary.map(x => (
            <div key={x.label} className={s.stat}>
              <dt>{x.label}</dt>
              <dd>{x.value}</dd>
            </div>
          ))}
        </dl>

        <div className={s.network}>
          <div>
            <p className={s.networkLine}>{NETWORK_LINE}</p>
            <a className={s.more} href="/2026">{c.lastYearLink}<span aria-hidden="true"> →</span></a>
          </div>
          <ul className={s.faces}>
            {FACES.map(p => (
              <li key={p.id}>
                <span className={`${s.face} grain`}>
                  <Image className="grade" src={p.photo} alt="" fill sizes={FACE_CROP[p.id] ? '128px' : '64px'} style={FACE_CROP[p.id]} />
                </span>
                <span className={s.name}>{plainName(p.name)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
