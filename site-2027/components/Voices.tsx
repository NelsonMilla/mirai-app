import Link from 'next/link';
import { site, type Copy } from '@/content/site';
import { DEV } from './dev';

export function Voices({ t = site }: { t?: Copy }) {
  const v = t.voices;
  if (!v.items.length && !DEV) return null;
  return (
    <section id="voices">
      <p className="eyebrow rv">{v.eyebrow}</p>
      <h2 className="big rv">{v.headline}</h2>
      <div className="voices">
        {v.items.length
          ? v.items.map(q => (
              <figure key={q.name} className="rv">
                <blockquote>“{q.quote}”</blockquote>
                <figcaption>
                  <b>{q.name}</b> · {q.role}
                  {q.post && <> · <Link href={`/blog/${q.post}`}>Read their story →</Link></>}
                </figcaption>
              </figure>
            ))
          : Array.from({ length: v.placeholderSlots }, (_, i) => (
              <figure key={i}><div className="slot">Quote {i + 1}: name, role, one or two sentences</div></figure>
            ))}
      </div>
    </section>
  );
}
