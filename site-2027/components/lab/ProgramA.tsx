// Lab variant A, "Quiet monument": the mission as one calm statement (10,000 cures) over a
// ruled two-by-two text block; the "What you get in four weeks" list is unchanged.
// Server component, CSS only. Copy comes from content/residency.ts.
import { residency, type Residency } from '@/content/residency';
import s from './ProgramA.module.css';

export function ProgramA({ r = residency }: { r?: Residency } = {}) {
  const num = r.mission.big;
  const unit = r.mission.unit;
  // "10,000 cures" needs a space; "1万の治療法" must not get one.
  const gap = /^[A-Za-z]/.test(unit) ? ' ' : '';
  const [who, goal, asrm, network] = r.mission.body;

  return (
    <section id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          <h2 id="program-title" className={s.statement}>
            <span className={s.num}>{num}</span>{gap}<span className={s.unit}>{unit}</span>
          </h2>
          <div className={s.text}>
            <p>{who}</p>
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
