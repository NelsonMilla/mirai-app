import Image from 'next/image';
import { site, type Copy } from '@/content/site';

export function Speakers({ t = site }: { t?: Copy }) {
  const s = t.speakers;
  const byId = new Map(s.list.map(p => [p.id, p]));
  const top = s.headliners.map(id => byId.get(id)).filter(p => p !== undefined);
  const rest = s.list.filter(p => !s.headliners.includes(p.id));
  return (
    <section id="speakers">
      <p className="eyebrow rv">{s.eyebrow}</p>
      <h2 className="big rv">{s.headline}</h2>
      <div className="headliners">
        {top.map(p => (
          <figure key={p.id} className="hcard rv">
            {p.photo
              ? <Image src={p.photo} alt="" width={480} height={600} sizes="(max-width: 640px) 50vw, (max-width: 1100px) 25vw, 16vw" />
              : <div className="initials" aria-hidden="true">{p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>}
            <figcaption className="meta">
              <div className="nm">{p.name}</div>
              {p.affiliation && <div className="og">{p.affiliation}</div>}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mono restLabel rv">{s.restLabel}</p>
      <ul className="roll">
        {rest.map(p => (
          <li key={p.id}><b>{p.name}</b>{p.affiliation && <span>{p.affiliation}</span>}</li>
        ))}
      </ul>
    </section>
  );
}
