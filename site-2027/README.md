# site-2027 — post-conference site (2026 recap, 2027 teaser)

Next.js 16 (App Router, TypeScript, plain CSS). Not deployed yet. Reuses the
`new-site/` design system (DESIGN.md): its tokens, nav, hero, ruled stats grid,
speaker cards, photo strip, apply block and footer, ported into
`app/globals.css` and `components/`.

```
npm install
npm run dev      # http://localhost:4350  (launch config: site-2027)
npm run build
```

## Where things go

- **All copy and numbers:** `content/site.ts`. Components only render it.
- **Event photos:** put files in `public/img/2026/`, then list them in
  `content/site.ts` → `photos.items`, or attach one to a moment
  (`moments.items[n].photo`).
- **Missing content:** a `null` stat or an empty photo list shows as a dashed
  placeholder in `npm run dev` and is left out of production builds.
- **Speakers:** `content/speakers-2026.json` + `public/img/speakers/` are copied
  from `new-site/` by `npm run speakers:sync` (reads the sheet snapshot in
  `new-site/speakers-data.js`). Commit the output. The script fails if Joe
  Betts-LaCroix ever lands within 8 places of Aubrey de Grey.
- **"Get notified" link:** `notifyHref` in `content/site.ts`. It is a mailto to
  team@miraitech.city until there is a signup form.

## Blog (Markdown in the repo)

Posts live in `content/posts/` as Markdown files. Committing one is publishing it:
Vercel rebuilds on push and the post appears at `/blog/<file-name>`.

1. Copy `content/posts/_template.md` to `content/posts/<url-slug>.md`.
2. Fill the frontmatter (`title`, `date`, `summary` are required; `author`,
   `company`, `cover`, `tags` optional) and write the body in Markdown (GFM).
3. Images go in `public/img/blog/<url-slug>/` and are referenced as
   `/img/blog/<url-slug>/photo.jpg`.
4. `draft: true` shows the post in `npm run dev` only. Remove it (or set
   `false`) to publish.
5. A missing required field fails the build with the file name, so a broken
   post never ships.

SEO, all built at build time from the frontmatter: per-post title, description,
canonical URL, Open Graph + Twitter cards (cover image, else the site image),
schema.org `BlogPosting` JSON-LD, `/sitemap.xml`, `/robots.txt` and an RSS feed
at `/blog/rss.xml`. Drafts are `noindex` and never reach the sitemap or feed.
Add `updated: YYYY-MM-DD` when you meaningfully edit a published post.

Design (borrowed moves, see `.impeccable/benchmarks/`): category tabs and a
lead story on `/blog`, numbered issues ("No. 03"), a full-bleed hero with the
category kanji, a sticky contents rail built from `##` headings, a reading bar,
numbered wide figures (`![alt](src "caption")` on its own line), pull quotes
from `>` blocks, a sign-off, author/company credits, and a "Next story" block.
Categories: Companies, Science, Residents, Kobe, News (`category:` frontmatter).

Files starting with `_` are ignored. Parsing is `gray-matter` + `marked` in
`lib/posts.ts`; pages are `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`,
all generated at build time.

## SEO and the domain switch

- **Old addresses:** `next.config.ts` 308-redirects every page the 2026 static
  site served (`/program/`, `/pricing/`, `/summit-i/`, `/jp/summit-i/`,
  `/citizens/…`, `/conduct/…` and the rest) to its nearest section here, so
  indexed pages and inbound links survive the switch. Add any new old path there.
- **Japanese:** `/jp` is the homepage in Japanese, copy in
  `content/site.ja.ts` (same shape as `site.ts`; draft translation, needs a native
  review). Both homepages carry hreflang `en` / `ja` / `x-default`, also in the sitemap.
  The blog is English only.
- **Structured data:** the homepage has Organization, WebSite and an EventSeries
  with the 2026 month, both summits and Demo Day (`components/StructuredData.tsx`).
  Add the 2027 event there once dates exist.
- **Search Console:** set `GOOGLE_SITE_VERIFICATION` in Vercel to the token from
  the HTML-tag method; the meta tag appears on every page.
- **Speed:** Switzer is self-hosted from `app/fonts/` (ITF Free Font License, via
  `next/font/local`), and images in posts go through the Next image optimiser.

## Rules

- Self-contained: nothing under `site-2027/` may import or link to
  `../new-site` at runtime (Vercel deploys one folder). The sync script is the
  only thing that reads `new-site/`, at authoring time.
- Plain copy: literal titles and body, no jargon.
- Not wired yet: PostHog analytics, Vercel project, partner logos (the Kobe
  logo approval ends Dec 15 2026; partner wording rules apply).
