import Image from 'next/image';
import { site, type Copy } from '@/content/site';

export function Moments({ t = site }: { t?: Copy }) {
  const m = t.moments;
  return (
    <section id="month">
      <p className="eyebrow rv">{m.eyebrow}</p>
      <h2 className="big rv">{m.headline}</h2>
      <ol className="moments">
        {m.items.map(item => (
          <li key={item.title} className="rv">
            <span className="d">{item.date}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            {item.photo && (
              <figure>
                <Image src={item.photo.src} alt={item.photo.alt} width={1600} height={900} sizes="(max-width: 760px) 100vw, 70vw" />
              </figure>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
