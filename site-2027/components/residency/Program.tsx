// Program section: the mission (10,000 cures, ASRM) and the four things founders receive.
// Server component, CSS only. Copy comes from content/residency.ts.
import { residency, type Residency } from '@/content/residency';
import s from './Program.module.css';

export function Program({ r = residency }: { r?: Residency } = {}) {
  const num = r.mission.big;
  const unit = r.mission.unit;
  const [who, goal, asrm, network] = r.mission.body;

  return (
    <section id="program" className={s.program} aria-labelledby="program-title">
      <div className={s.inner}>
        <header className={s.top}>
          <p className="kanjiMark"><b lang="ja">未来</b><span>{r.marks.program}</span></p>
          <p className={s.eyebrow}>{r.mission.eyebrow}</p>
        </header>

        <div className={s.mission}>
          <h2 id="program-title" className={s.headline}>
            <span className={s.num}>{num}</span>
            <span className={s.unit}>{unit}</span>
          </h2>
          <div className={s.copy}>
            <p className={s.lead}>{who}</p>
            <p className={s.goal}>{goal}</p>
          </div>
        </div>

        <blockquote className={s.asrm}>
          <p>{asrm}</p>
        </blockquote>
        <p className={s.network}>{network}</p>

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
