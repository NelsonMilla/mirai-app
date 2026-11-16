'use client';
// Lab variant G · "Read it into light" (mission round three, revision 3, Nov 16 2026).
// The four mission paragraphs are the display text of the block: one size, one voice. The stakes
// come first and stand as the manifesto's headline, followed by a beat of space: "There are more
// than 10,000 rare diseases." then, on its own line, "Our goal is 10,000 cures, shipped through our
// community." The stakes are always lit. "10,000 cures" is cream like every other word and turns
// dawn gold as it rises from 80% to 60% of the screen. The paragraphs after it light where the
// reader's eyes are: each line comes up from dim as it crosses 60% of the screen height. Opacity
// only, driven by scroll; it only ever brightens, and the listener is removed once everything is
// lit. The h2 ("10,000 cures") stays in the outline, visually hidden. Without JS or with reduced
// motion, every word is lit and the phrase is gold.
// Copy comes from content/residency.ts, every word unchanged. ORDER PENDING THE OWNER'S APPROVAL:
// paragraph 2 (the goal) is read first, then 1 (community), 3 (ASRM), 4 (Kobe University).
// The "What you get" list is unchanged from components/residency/Program.tsx.
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { residency, type Residency } from '@/content/residency';
import s from './ProgramG.module.css';

// Digits always in Switzer: next to kanji ("1万") the browser otherwise draws them in the
// Japanese fallback font. A number never ends a line on its own: in English it is bound to the
// next word with a no-break space ("10,000 rare"), in Japanese "1万" is kept together.
const digits = (text: string): ReactNode[] =>
  text.replace(/(\d) /g, '$1\u00a0').split(/(\d[\d,]*万?)/).map((part, i) => {
    if (!/\d/.test(part)) return part;
    const n = part.replace(/万$/, '');
    return <span key={i} className={s.num}><span className={s.digits}>{n}</span>{part.slice(n.length)}</span>;
  });

// The units that light up: a word with its trailing space, or one Japanese character.
const CJK = '\u3000-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef';
const UNIT = new RegExp(`[${CJK}]|[^\\s${CJK}]+\\s*|\\s+`, 'g');

// Reading height: a line lights left to right as it crosses 60% of the screen height.
const ANCHOR = 0.6;
// The gold: the phrase turns gold as its top rises from 80% to 60% of the screen.
const GOLD_FROM = 0.8;
const GOLD_TO = 0.6;

export function ProgramG({ r = residency }: { r?: Residency } = {}) {
  const text = useRef<HTMLDivElement>(null);
  const unit = r.mission.unit;
  // "10,000 cures" needs a space; "1万の治療法" must not get one.
  const gap = /^[A-Za-z]/.test(unit) ? ' ' : '';
  const phrase = `${r.mission.big}${gap}${unit}`;
  const [who, goal, asrm, network] = r.mission.body;

  // Every unit carries its character offset (--c) in the whole text, in reading order.
  let c = 0;
  const words = (t: string) => (t.match(UNIT) ?? []).map((w) => {
    const node = <span key={c} className={s.w} style={{ '--c': c } as CSSProperties}>{digits(w)}</span>;
    c += w.length;
    return node;
  });

  // The stakes: the goal paragraph, always lit, with a line break before the sentence that holds
  // the phrase ("Our goal is…" / "私たちの目標は…"), so "10,000 cures" lands on a fresh line, still
  // right after "Our goal is". The phrase is a gold copy (the text) under a cream copy that fades
  // out as it lands. The first character after it (",", "を") stays on its line.
  const at = goal.indexOf(phrase);
  const head = at < 0 ? goal : goal.slice(0, at);
  const en = head.lastIndexOf('. ');
  const ja = head.lastIndexOf('。');
  const cut = Math.max(en < 0 ? 0 : en + 2, ja < 0 ? 0 : ja + 1);
  const tail = at < 0 ? '' : goal.slice(at + phrase.length);
  const stakes = (
    <p className={s.stakes}>
      {digits(head.slice(0, cut))}
      {cut > 0 && <br />}
      {digits(head.slice(cut))}
      {at >= 0 && (
        <span className={s.landing}>
          <span className={s.gold}>
            <span className={s.goldText}>{digits(phrase)}</span>
            <span className={s.cream} aria-hidden="true">{digits(phrase)}</span>
          </span>
          {tail.slice(0, 1)}
        </span>
      )}
      {digits(tail.slice(1))}
    </p>
  );
  const community = words(who);
  const path = words(asrm);
  const kobe = words(network);

  // The gesture: one rAF scroll handler writes --r (the furthest character lit, counted from the
  // second paragraph) and --g (how gold the phrase is). Lines are measured on mount, on resize and
  // once the fonts are ready. Both values only grow.
  useEffect(() => {
    const box = text.current;
    if (!box || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const units = Array.from(box.querySelectorAll<HTMLElement>(`.${s.w}`));
    const gold = box.querySelector<HTMLElement>(`.${s.gold}`);
    const off = (u: HTMLElement) => Number(u.style.getPropertyValue('--c'));
    const last = units[units.length - 1];
    const total = off(last) + (last.textContent ?? '').length;
    let lines: { top: number; bottom: number; c0: number; c1: number }[] = [];
    let read = -Infinity;
    let lit = gold ? -1 : 1;
    let frame = 0;
    let done = false;

    const measure = () => {
      lines = [];
      for (const u of units) {
        const top = u.offsetTop;
        const end = off(u) + (u.textContent ?? '').length;
        const line = lines[lines.length - 1];
        if (line && top < line.top + u.offsetHeight / 2) line.c1 = end;
        else lines.push({ top, bottom: top + u.offsetHeight, c0: off(u), c1: end });
      }
    };
    const update = () => {
      frame = 0;
      const vh = innerHeight;
      const y = vh * ANCHOR - box.getBoundingClientRect().top; // reading height, below the text's top
      let pos = -100; // above the first line: nothing lit yet
      for (const l of lines) {
        if (y < l.top) break;
        pos = y >= l.bottom ? l.c1 : l.c0 + ((y - l.top) / (l.bottom - l.top)) * (l.c1 - l.c0);
      }
      if (pos > read) {
        read = pos;
        box.style.setProperty('--r', pos.toFixed(1));
      }
      if (gold && lit < 1) {
        const g = Math.min(1, Math.max(0, (GOLD_FROM - gold.getBoundingClientRect().top / vh) / (GOLD_FROM - GOLD_TO)));
        if (g > lit) {
          lit = g;
          box.style.setProperty('--g', g.toFixed(3));
        }
      }
      if (read >= total && lit >= 1) stop();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const remeasure = () => { if (!done) { measure(); onScroll(); } };
    const ro = new ResizeObserver(remeasure);
    const stop = () => { done = true; removeEventListener('scroll', onScroll); ro.disconnect(); };

    addEventListener('scroll', onScroll, { passive: true });
    ro.observe(box);
    document.fonts.ready.then(remeasure);
    measure();
    update();
    box.dataset.reading = '';
    return () => { stop(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          <h2 id="program-title" className="sr-only">{phrase}</h2>
          <div ref={text} className={s.manifesto}>
            {stakes}
            <p>{community}</p>
            <p>{path}</p>
            <p>{kobe}</p>
          </div>
        </div>

        <div className={s.receive}>
          <header className={s.receiveHead}>
            <p className={s.eyebrow}>{r.receive.eyebrow}</p>
            <h3 className={s.receiveTitle}>{r.receive.headline}</h3>
          </header>
          <ol className={s.list}>
            {r.receive.items.map((it) => (
              <li key={it.n} className={s.row}>
                <span className={s.n}>{it.n}</span>
                <h4 className={s.title}>{it.title}</h4>
                <p className={s.body}>{it.body}</p>
                <span className={s.kanji} aria-hidden="true">{it.kanji}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
