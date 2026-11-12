import Link from 'next/link';
import { site, type Copy } from '@/content/site';
import { getPosts, formatDate } from '@/lib/posts';

export function LatestPosts({ t = site }: { t?: Copy }) {
  const posts = getPosts().slice(0, 3);
  if (!posts.length) return null;
  const l = t.latest;
  return (
    <section id="latest">
      <p className="eyebrow rv">{l.eyebrow}</p>
      <h2 className="big rv">{l.headline}</h2>
      <ul className="latest">
        {posts.map(p => (
          <li key={p.slug} className="rv">
            <Link href={`/blog/${p.slug}`}>
              <span className="d">{formatDate(p.date)}{p.company && ` · ${p.company.name}`}{p.draft && ' · Draft'}</span>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link className="btn ghost rv" href="/blog">{l.all}</Link>
    </section>
  );
}
