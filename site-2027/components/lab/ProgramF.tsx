'use client';
// Lab variant F · "First light" (mission round two, Nov 16 2026).
// The statement stands in a pre-dawn sky above a horizon line. When the line scrolls into
// view, light arrives once (1.4 s): the horizon draws out from the centre, a warm glow rises
// behind it, and the statement fills with light from below ("cures" turns gold). Then
// everything is still. Not the opening's Diamond Fuji: no mountain and no sun disc, only the
// light before the sun. Without JS or with reduced motion, the lit state shows at once.
// Copy comes from content/residency.ts. The "What you get" list is unchanged from
// components/residency/Program.tsx.
import { useEffect, useRef, type ReactNode } from 'react';
import { residency, type Residency } from '@/content/residency';
import s from './ProgramF.module.css';

// Digits always in Switzer: next to kanji ("1万") the browser otherwise draws them in the
// Japanese fallback font.
const digits = (text: string): ReactNode[] =>
  text.split(/([\d,]+)/).map((part, i) => (/\d/.test(part) ? <span key={i} className={s.digits}>{part}</span> : part));

export function ProgramF({ r = residency }: { r?: Residency } = {}) {
  const root = useRef<HTMLElement>(null);
  const horizon = useRef<HTMLDivElement>(null);
  const unit = r.mission.unit;
  // "10,000 cures" needs a space; "1万の治療法" must not get one.
  const gap = /^[A-Za-z]/.test(unit) ? ' ' : '';
  const [who, goal, asrm, network] = r.mission.body;

  // First light: once, when the horizon is in the upper three quarters of the screen.
  useEffect(() => {
    const el = root.current;
    const line = horizon.current;
    if (!el || !line) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.dataset.lit = '';
      io.disconnect();
    }, { rootMargin: '0px 0px -22% 0px' });
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
          <div className={s.dawn}>
            <div className={`${s.sky} grain`} aria-hidden="true"><i className={s.glow} /></div>
            <h2 id="program-title" className={s.statement}>
              <span className={s.num}>{digits(r.mission.big)}</span>{gap}<span className={s.unit}>{unit}</span>
            </h2>
            <div ref={horizon} className={s.horizon} aria-hidden="true" />
            <i className={s.reflect} aria-hidden="true" />
          </div>
          <p className={s.lead}>{who}</p>
          <div className={s.text}>
            <p>{goal}</p>
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
