import Image from 'next/image';
import { site, type Copy } from '@/content/site';
import { DEV } from './dev';

export function Photos({ t = site }: { t?: Copy }) {
  const p = t.photos;
  if (!p.items.length && !DEV) return null;
  return (
    <section className="stripwrap" id="photos">
      <div className="cap">
        <p className="eyebrow rv">{p.eyebrow}</p>
        <h2 className="big rv">{p.headline}</h2>
      </div>
      <div className="strip">
        {p.items.length
          ? p.items.map(ph => (
              <figure key={ph.src}>
                <Image src={ph.src} alt={ph.alt} width={960} height={1200} sizes="(max-width: 860px) 50vw, 25vw" />
                {ph.caption && <figcaption>{ph.caption}</figcaption>}
              </figure>
            ))
          : Array.from({ length: p.placeholderSlots }, (_, i) => (
              <figure key={i}><div className="slot">Photo {i + 1}</div></figure>
            ))}
      </div>
    </section>
  );
}
