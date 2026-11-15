// The blog "CMS": one Markdown file per post in content/posts/.
// The file name is the URL: content/posts/acme-bio.md → /blog/acme-bio.
// Files starting with "_" (like _template.md) are ignored.
// `draft: true` posts show in `npm run dev` only; production builds leave them out.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked, type Tokens } from 'marked';
import { DEV } from '@/components/dev';

const DIR = path.join(process.cwd(), 'content/posts');

import { CATEGORIES, type Category, type Post, type TocItem } from './post-format';
export * from './post-format';

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Local images in posts go through Next's optimiser (resized, WebP/AVIF), like <Image>.
// Widths are from Next's default deviceSizes; external URLs are left as they are.
const WIDTHS = [640, 1080, 1920];
const opt = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
function imgAttrs(src: string) {
  if (!src.startsWith('/') || src.startsWith('//')) return `src="${escAttr(src)}"`;
  return `src="${escAttr(opt(src, 1080))}" srcset="${WIDTHS.map(w => `${escAttr(opt(src, w))} ${w}w`).join(', ')}" ` +
    `sizes="(max-width: 760px) 100vw, 980px"`;
}

// Markdown → HTML with three additions:
//  - h2s get ids and feed the contents rail;
//  - an image on its own line becomes a numbered figure ("Fig. 01"), its title is the caption:
//      ![alt text](/img/blog/slug/photo.jpg "Caption · Credit")
//  - blockquotes are styled as pull quotes by CSS.
function render(md: string) {
  const toc: TocItem[] = [];
  let fig = 0;
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, t: Tokens.Heading) {
        const html = this.parser.parseInline(t.tokens);
        if (t.depth !== 2) return `<h${t.depth}>${html}</h${t.depth}>\n`;
        const base = slugify(t.text) || `section-${toc.length + 1}`;
        const id = toc.some(x => x.id === base) ? `${base}-${toc.length + 1}` : base;
        toc.push({ id, text: t.text.replace(/[*_`]/g, '') });
        return `<h2 id="${id}"><a href="#${id}">${html}</a></h2>\n`;
      },
      paragraph(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, t: Tokens.Paragraph) {
        const only = t.tokens.filter(x => !(x.type === 'text' && !x.raw.trim()));
        if (only.length === 1 && only[0].type === 'image') {
          const img = only[0] as Tokens.Image;
          fig += 1;
          const n = String(fig).padStart(2, '0');
          return `<figure><img ${imgAttrs(img.href)} alt="${escAttr(img.text)}" loading="lazy" decoding="async" />` +
            `<figcaption><span>Fig. ${n}</span>${img.title ? escAttr(img.title) : escAttr(img.text)}</figcaption></figure>\n`;
        }
        return `<p>${this.parser.parseInline(t.tokens)}</p>\n`;
      },
    },
  });
  const html = marked.parse(md, { async: false });
  return { html, toc };
}

function read(file: string): Omit<Post, 'number'> {
  const slug = file.replace(/\.md$/, '');
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'));
  const need = (k: string) => {
    if (!data[k]) throw new Error(`content/posts/${file}: frontmatter is missing "${k}"`);
    return data[k];
  };
  // YAML turns an unquoted 2026-11-04 into a Date; normalise back to the string.
  const day = (d: unknown) => d instanceof Date ? d.toISOString().slice(0, 10) : String(d);
  const category = (data.category ?? 'News') as Category;
  if (!(category in CATEGORIES)) {
    throw new Error(`content/posts/${file}: category "${category}" must be one of ${Object.keys(CATEGORIES).join(', ')}`);
  }
  const { html, toc } = render(content);
  return {
    slug,
    title: String(need('title')),
    date: day(need('date')),
    updated: data.updated ? day(data.updated) : undefined,
    summary: String(need('summary')),
    category,
    author: data.author ? String(data.author) : undefined,
    authorRole: data.authorRole ? String(data.authorRole) : undefined,
    company: data.company?.name
      ? { name: String(data.company.name), url: data.company.url, line: data.company.line ? String(data.company.line) : undefined }
      : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    coverCredit: data.coverCredit ? String(data.coverCredit) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    minutes: Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 220)),
    html,
    toc,
  };
}

let cache: Post[] | undefined;
export function getPosts(): Post[] {
  if (cache && !DEV) return cache;
  if (!fs.existsSync(DIR)) return [];
  const posts = fs.readdirSync(DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(read)
    .filter(p => DEV || !p.draft)
    .sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug))
    .map((p, i) => ({ ...p, number: i + 1 }))
    .reverse();
  cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find(p => p.slug === slug);
}

// "Next story" is the one published before this one (wraps to the newest);
// related are up to two others from the same category, else the most recent.
export function getNeighbours(slug: string) {
  const posts = getPosts();
  const i = posts.findIndex(p => p.slug === slug);
  const others = posts.filter(p => p.slug !== slug);
  const next = posts.length > 1 ? posts[(i + 1) % posts.length] : undefined;
  const pool = others.filter(p => p.slug !== next?.slug);
  const cat = posts[i]?.category;
  const related = [...pool.filter(p => p.category === cat), ...pool.filter(p => p.category !== cat)].slice(0, 2);
  return { next, related };
}
