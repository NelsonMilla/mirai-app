// Lab variant B · "Scale, shown" (mission round, Nov 16 2026).
// A still field of 10,000 marks (100 × 100, in blocks of 10 × 10) carries the size of the number,
// so the headline can stay modest. The gold is dawn light on the field, not a count.
// Server component, CSS only. Copy comes from content/residency.ts. The "What you get" list is
// unchanged from components/residency/Program.tsx.
import { residency, type Residency } from '@/content/residency';
import s from './ProgramB.module.css';

export function ProgramB({ r = residency }: { r?: Residency } = {}) {
  const num = r.mission.big;
  const unit = r.mission.unit;
  const [who, goal, asrm, network] = r.mission.body;
  // English reads "10,000 cures", Japanese "1万の治療法": keep the space only where the headline has one.
  const space = r.mission.headline.includes(' ') ? ' ' : '';

  return (
    <section id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          <div className={s.field} aria-hidden="true" />
          <div className={s.text}>
            <h2 id="program-title" className={s.headline}>
              {num}{space}<span className={s.unit}>{unit}</span>
            </h2>
            <p className={s.lead}>{who}</p>
            <div className={s.ledger}>
              <p>{goal}</p>
              <p className={s.strong}>{asrm}</p>
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
