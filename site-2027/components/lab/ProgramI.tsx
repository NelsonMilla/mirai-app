'use client';
// Lab variant I · "Problem, then promise" (mission round three, Nov 16 2026).
// Two statements at one display size, stacked: the problem in cool slate (paragraph 2's first
// sentence, "There are more than 10,000 rare diseases.") and the answer in dawn gold (the h2,
// "10,000 cures"). The two numbers sit one above the other in their own column, so the eye
// lands on the pair: the same number, two meanings. The text below hangs from the word column.
// One gesture: the gold line arrives once (opacity and a short rise) after the slate one comes
// into view. Without JS or with reduced motion it is simply there.
// COPY ORDER CHANGES (needs the owner's OK): paragraph 2 is split at its first sentence end;
// the first sentence moves above the h2, the rest follows paragraph 1. Every word appears once.
// Copy comes from content/residency.ts. The "What you get" list is unchanged from
// components/residency/Program.tsx.
import { useEffect, useRef, type ReactNode } from 'react';
import { residency, type Residency } from '@/content/residency';
import s from './ProgramI.module.css';

// Digits always in Switzer: next to kanji ("1万") the browser otherwise draws them in the
// Japanese fallback font.
const digits = (text: string): ReactNode[] =>
  text.split(/([\d,]+)/).map((part, i) => (/\d/.test(part) ? <span key={i} className={s.digits}>{part}</span> : part));

// "There are more than 10,000 rare diseases. Our goal…" → [first sentence, the rest].
// English sentences end at ". ", Japanese at "。".
const splitFirstSentence = (text: string): [string, string] => {
  const m = text.match(/^(.+?(?:\.(?=\s)|。))\s*([\s\S]*)$/);
  return m ? [m[1], m[2]] : [text, ''];
};

export function ProgramI({ r = residency }: { r?: Residency } = {}) {
  const root = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLParagraphElement>(null);
  const { big, unit } = r.mission;
  // "10,000 cures" needs a space; "1万の治療法" must not get one.
  const gap = /^[A-Za-z]/.test(unit) ? ' ' : '';
  const [who, goal, asrm, network] = r.mission.body;
  const [problem, goalRest] = splitFirstSentence(goal);
  const ja = problem.endsWith('。');
  // The problem, cut around its number: "There are more than" · "10,000" · "rare diseases."
  // The spaces between the parts are kept as in the copy (none in Japanese).
  const at = problem.indexOf(big);
  const before = at > 0 ? problem.slice(0, at) : '';
  const after = at >= 0 ? problem.slice(at + big.length) : '';
  const space = (t: string) => (/\s/.test(t) ? ' ' : '');

  // The promise arrives once, when the problem is in the upper two thirds of the screen.
  useEffect(() => {
    const el = root.current;
    const line = problemRef.current;
    if (!el || !line) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.dataset.in = '';
      io.disconnect();
    }, { rootMargin: '0px 0px -34% 0px' });
    io.observe(line);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          {at >= 0 ? (
            <p ref={problemRef} className={`${s.line} ${s.problem}`}>
              {before && <span className={s.before}>{before.trim()}</span>}{space(before.slice(-1))}
              <span className={s.num}>{digits(big)}</span>{space(after.charAt(0))}
              <span className={s.w}>{after.trim()}</span>
            </p>
          ) : (
            <p ref={problemRef} className={`${s.line} ${s.problem}`}><span className={s.before}>{digits(problem)}</span></p>
          )}
          <h2 id="program-title" className={`${s.line} ${s.promise}`}>
            <span className={s.num}>{digits(big)}</span>{gap}<span className={s.w}>{unit}</span>
          </h2>

          <p className={s.lead}>{who}{goalRest && (ja ? '' : ' ')}{digits(goalRest)}</p>
          <div className={s.text}>
            <p className={s.asrm}>{asrm}</p>
            <p>{network}</p>
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
