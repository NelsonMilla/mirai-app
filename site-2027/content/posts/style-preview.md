---
title: Style preview, every element a post can use
date: 2026-11-04
summary: A draft that exercises every Markdown element so the post styles can be checked in one place. It only appears in npm run dev.
author: Mirai Tech City
company:
  name: Example Company
  url: https://www.miraitech.city
  line: One sentence on what the company does, shown at the end of the post.
cover: /img/life/kyoto.webp
coverAlt: Autumn leaves in Kyoto
tags: [Style test, Founders, Demo Day]
category: Companies
authorRole: Editor
coverCredit: 'Stand-in photo: Kyoto, Fg2 (public domain)'
draft: true
---

This is an opening paragraph. It has **bold text**, *italic text*, ***both***,
~~strikethrough~~, `inline code` and [a link to the main site](https://www.miraitech.city).
A long word to test wrapping: pneumonoultramicroscopicsilicovolcanoconiosis.

A second paragraph, to check the spacing between paragraphs. Posts read best at
around 65–75 characters per line, which is what this column is set to.

## A second-level heading

Text right after a heading. Headings at this level are bold and uppercase.

### A third-level heading

Third-level headings are bold but not uppercase.

#### A fourth-level heading

Fourth-level headings are the smallest.

## Lists

An unordered list:

- The first item
- A second item that runs long enough to wrap onto a second line, so the hanging indent can be checked
- A third item with a nested list:
  - Nested item one
  - Nested item two

An ordered list:

1. Arrive on Port Island
2. Find a desk at the cowork
3. Build something for Demo Day

A task list:

- [x] Summit I
- [x] Summit II
- [ ] 2027

## Quote

> We came for the summits and stayed for the month. The best conversations
> happened at the izakaya, not on stage.
>
> — A founder, Demo Day 2026

## Image

An image in the body, with its alt text:

![The Port Liner crossing to Port Island at golden hour](/img/life/portliner.webp "The Port Liner to Port Island · Stand-in photo")

A second figure, numbered automatically:

![Port Island from the air](/img/blog/demo/pillar-portisland-aerial.webp "Port Island, Kobe, from the air · Stand-in photo")

## Table

| Week | Dates | What happened |
| ---- | ----- | ------------- |
| 1 | Oct 1–4 | Arrival and opening night |
| 3 | Oct 17–18 | Summit I |
| 4 | Oct 24–26 | Summit II and Demo Day |

## Code

A code block:

```js
const city = { name: 'Mirai Tech City', place: 'Kobe', next: 2027 };
console.log(`${city.name} returns in ${city.next}`);
```

---

A paragraph after a horizontal rule, then a closing line with a footnote-style
link back to [the blog](/blog).
