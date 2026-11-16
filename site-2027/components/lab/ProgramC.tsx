// Lab variant C · "A page of paper": the mission block is set on warm paper (cream ground,
// night type), a quiet printed page between the dark opening and the dark "What you get" list.
// Editorial layout: chapter mark in the left margin, a modest headline, the copy as a short
// article, the ASRM paragraph as a margin note. No motion. Server component, CSS only.
// The "What you get" list is unchanged from components/residency/Program.tsx.
import { residency, type Residency } from '@/content/residency';
import s from './ProgramC.module.css';

export function ProgramC({ r = residency }: { r?: Residency } = {}) {
  const num = r.mission.big;
  const unit = r.mission.unit;
  // '10,000' + 'cures' needs a word space; '1万' + 'の治療法' must not get one.
  const sep = /^[A-Za-z]/.test(unit) ? ' ' : '';
  const [who, goal, asrm, network] = r.mission.body;

  return (
    <section id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.paper}>
        <div className={s.page}>
          <header className={s.meta}>
            <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
            <p className={s.eyebrow}>{r.mission.eyebrow}</p>
          </header>
          <h2 id="program-title" className={s.headline}>
            {num}{sep}{unit}
          </h2>
          <p className={s.lead}>{who}</p>
          <p className={s.goal}>{goal}</p>
          <div className={s.note}>
            <span className={s.noteMark} aria-hidden="true">※</span>
            <p>{asrm}</p>
          </div>
          <p className={s.network}>{network}</p>
        </div>
      </div>

      <div className={s.inner}>
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
