import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES, formatDate, issue, type PostMeta } from '@/lib/post-format';

// Meta line in the Linear manner: who · when · how long →
export function MetaLine({ p, arrow = true }: { p: PostMeta; arrow?: boolean }) {
  return (
    <span className="metaLine">
      {p.author && <span>{p.author}</span>}
      <span>{formatDate(p.date)}</span>
      <span>{p.minutes} min</span>
      {p.draft && <span className="draftChip">Draft</span>}
      {arrow && <span className="arr" aria-hidden="true">→</span>}
    </span>
  );
}

export function Kicker({ p }: { p: PostMeta }) {
  return (
    <span className="kicker">
      <span className="no">{issue(p.number)}</span>
      <span>{p.category}</span>
      {p.company && <span className="co">{p.company.name}</span>}
    </span>
  );
}

// A story without a cover gets a typographic tile: its category kanji, large.
function Cover({ p, sizes, priority }: { p: PostMeta; sizes: string; priority?: boolean }) {
  return p.cover
    ? <Image src={p.cover} alt={p.coverAlt ?? ''} fill sizes={sizes} priority={priority} />
    : <span className="tile" aria-hidden="true">{CATEGORIES[p.category]}</span>;
}

export function LeadStory({ p }: { p: PostMeta }) {
  return (
    <Link className="leadStory" href={`/blog/${p.slug}`}>
      <span className="cover"><Cover p={p} sizes="(max-width: 1440px) 100vw, 1440px" priority /></span>
      <span className="veil" />
      <span className="txt">
        <Kicker p={p} />
        <h2>{p.title}</h2>
        <p>{p.summary}</p>
        <MetaLine p={p} />
      </span>
    </Link>
  );
}

export function PostCard({ p }: { p: PostMeta }) {
  return (
    <Link className="postCard" href={`/blog/${p.slug}`}>
      <span className="cover"><Cover p={p} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" /></span>
      <Kicker p={p} />
      <h3>{p.title}</h3>
      <p>{p.summary}</p>
      <MetaLine p={p} />
    </Link>
  );
}

export function ArchiveRow({ p }: { p: PostMeta }) {
  return (
    <li>
      <Link href={`/blog/${p.slug}`}>
        <span className="no">{issue(p.number)}</span>
        <span className="t">{p.title}</span>
        <span className="c">{p.category}</span>
        <span className="d">{formatDate(p.date)}</span>
      </Link>
    </li>
  );
}
