import { site, type Copy } from '@/content/site';
import { DEV } from './dev';

export function Recap({ t = site }: { t?: Copy }) {
  const r = t.recap;
  const stats = r.stats.filter(s => s.value !== null || DEV);
  return (
    <section id="2026">
      <p className="eyebrow rv">{r.eyebrow}</p>
      <h2 className="big rv">{r.headline}</h2>
      <p className="lead rv">{r.lead}</p>
      <div className="stats rv" style={{ gridTemplateColumns: stats.length < 5 ? `repeat(${stats.length}, 1fr)` : undefined }}>
        {stats.map(s => (
          <div key={s.label}>
            {s.value !== null ? <div className="v">{s.value}</div> : <div className="slot">Number to come</div>}
            <div className="k">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
