import Link from 'next/link';
import { site, type Copy } from '@/content/site';
import { DEV } from './dev';

export function BuiltHere({ t = site }: { t?: Copy }) {
  const b = t.built;
  if (!b.items.length && !DEV) return null;
  return (
    <section id="built">
      <p className="eyebrow rv">{b.eyebrow}</p>
      <h2 className="big rv">{b.headline}</h2>
      <p className="lead rv">{b.lead}</p>
      <ul className="built">
        {b.items.length
          ? b.items.map(c => (
              <li key={c.name} className="rv">
                <h3>{c.url ? <a href={c.url} target="_blank" rel="noopener">{c.name}</a> : c.name}</h3>
                <p>{c.line}</p>
                {c.post && <Link className="more" href={`/blog/${c.post}`}>Read the story →</Link>}
              </li>
            ))
          : Array.from({ length: b.placeholderSlots }, (_, i) => (
              <li key={i}><div className="slot">Company {i + 1}</div></li>
            ))}
      </ul>
    </section>
  );
}
