// Pure helpers and types shared by server pages and client components.
// Keep node-only imports (fs, path) out of this file.

// The story categories. Each gets a kanji for the post header (Japan as texture).
export const CATEGORIES = {
  Companies: '企業',
  Science: '研究',
  Residents: '住民',
  Kobe: '神戸',
  News: '報告',
} as const;
export type Category = keyof typeof CATEGORIES;

export type TocItem = { id: string; text: string };
export type PostMeta = {
  slug: string;
  number: number; // issue number, oldest = 1 ("No. 01")
  title: string;
  date: string; // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD, optional: when the post was last meaningfully edited
  summary: string;
  category: Category;
  author?: string;
  authorRole?: string;
  company?: { name: string; url?: string; line?: string };
  cover?: string; // e.g. /img/blog/acme-bio/cover.jpg
  coverAlt?: string;
  coverPosition?: string; // CSS object-position for the hero crop, e.g. "65% 0%" (default centre)
  coverCredit?: string;
  seoTitle?: string; // search-result and link-preview title, under 60 characters; the page H1 stays `title`
  seoDescription?: string; // search-result and link-preview description, 150–160 characters; /blog cards keep `summary`
  shareImage?: string; // 1200×630 JPEG for link previews (LinkedIn, X, Slack); falls back to cover
  tags: string[];
  draft: boolean;
  minutes: number;
};
export type Post = PostMeta & { html: string; toc: TocItem[] };

export const issue = (n: number) => `No. ${String(n).padStart(2, '0')}`;

export function formatDate(d: string) {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}
