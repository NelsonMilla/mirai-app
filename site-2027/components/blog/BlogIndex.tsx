'use client';
// Category tabs (Linear) over a lead story (Quanta), a card grid, and a flat archive (Vercel).
// The selected tab lives in the URL hash, so a filtered view can be shared and survives reload.
import { useEffect, useState } from 'react';
import type { PostMeta } from '@/lib/post-format';
import { ArchiveRow, LeadStory, PostCard } from './PostCard';

const GRID = 6; // cards after the lead; the rest drop into the archive list

export function BlogIndex({ posts, categories }: { posts: PostMeta[]; categories: string[] }) {
  const [cat, setCat] = useState('All');
  useEffect(() => {
    const sync = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      setCat(categories.includes(h) ? h : 'All');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [categories]);

  const pick = (c: string) => {
    setCat(c);
    history.replaceState(null, '', c === 'All' ? location.pathname : `#${encodeURIComponent(c)}`);
  };

  const shown = cat === 'All' ? posts : posts.filter(p => p.category === cat);
  const [lead, ...rest] = shown;
  const count = (c: string) => (c === 'All' ? posts.length : posts.filter(p => p.category === c).length);

  return (
    <>
      {categories.length > 1 && (
        <div className="tabs" role="tablist" aria-label="Filter stories by category">
          {['All', ...categories].map(c => (
            <button key={c} role="tab" aria-selected={cat === c} className="tab" onClick={() => pick(c)}>
              {c}<sup>{String(count(c)).padStart(2, '0')}</sup>
            </button>
          ))}
        </div>
      )}
      {lead && <LeadStory p={lead} />}
      {rest.length > 0 && (
        <div className="cardGrid">{rest.slice(0, GRID).map(p => <PostCard key={p.slug} p={p} />)}</div>
      )}
      {rest.length > GRID && (
        <>
          <p className="mono archLabel">Archive</p>
          <ol className="archive">{rest.slice(GRID).map(p => <ArchiveRow key={p.slug} p={p} />)}</ol>
        </>
      )}
    </>
  );
}
