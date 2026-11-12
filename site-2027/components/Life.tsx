import Image from 'next/image';
import { site, type Copy } from '@/content/site';
import { DEV } from './dev';

export function Life({ t = site }: { t?: Copy }) {
  const l = t.life;
  const items = l.items.filter(i => i.photo || DEV);
  return (
    <section id="life">
      <p className="eyebrow rv">{l.eyebrow}</p>
      <h2 className="big rv">{l.headline}</h2>
      <p className="lead rv">{l.lead}</p>
      <ol className="life">
        {items.map((it, n) => (
          <li key={it.title} className="rv">
            <div className="ph">
              {it.photo
                ? <Image src={it.photo.src} alt={it.photo.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                : <div className="slot">Photo to come</div>}
            </div>
            <span className="n">{String(n + 1).padStart(2, '0')}</span>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
