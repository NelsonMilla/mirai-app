// Lab variant D · "万" (mission round two, Nov 16 2026).
// One monumental 万 (man, ten thousand) in Shippori Mincho, a deep indigo barely lifted from the
// night and cropped by the right edge, is the block's only visual. "10,000 cures" sits on the
// glyph's top stroke, so the statement and the glyph read as one image. Still: no motion.
// Server component, CSS only. Copy comes from content/residency.ts. The "What you get" list is
// unchanged from components/residency/Program.tsx.
import type { ReactNode } from 'react';
import { residency, type Residency } from '@/content/residency';
import s from './ProgramD.module.css';

// Digits always in Switzer: next to kanji ("1万") the browser otherwise draws them in the
// Japanese fallback font.
const digits = (text: string): ReactNode[] =>
  text.split(/([\d,]+)/).map((part, i) => (/\d/.test(part) ? <span key={i} className={s.digits}>{part}</span> : part));

export function ProgramD({ r = residency }: { r?: Residency } = {}) {
  const unit = r.mission.unit;
  // "10,000 cures" needs a space; "1万の治療法" must not get one.
  const latin = /^[A-Za-z]/.test(unit);
  const gap = latin ? ' ' : '';
  const [who, goal, asrm, network] = r.mission.body;

  return (
    <section id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          <div className={s.copy}>
            {/* .head shrink-wraps the statement so the glyph can start right where it ends. The
                glyph is decoration; the headline carries the meaning. In Japanese the headline
                already contains 万, so the English gloss is left out. */}
            <div className={s.head}>
              <h2 id="program-title" className={s.statement}>
                <span className={s.num}>{digits(r.mission.big)}</span>{gap}<span className={s.unit}>{unit}</span>
              </h2>
              <div className={s.figure} aria-hidden="true">
                <span className={s.glyph} lang="ja">万</span>
                {latin && <span className={s.gloss}><b lang="ja">万</b> · man · ten thousand</span>}
              </div>
            </div>
            <p className={s.lead}>{who}</p>
            <div className={s.text}>
              <p>{goal}</p>
              <p className={s.asrm}>{asrm}</p>
              <p>{network}</p>
            </div>
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
