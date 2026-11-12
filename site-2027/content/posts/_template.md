---
# Copy this file to content/posts/<url-slug>.md (no leading underscore).
# The file name becomes the URL: /blog/<url-slug>
title: Company name builds the thing
date: 2026-11-04            # YYYY-MM-DD, newest first on /blog
summary: One or two plain sentences. Shown on /blog and in link previews.
category: Companies         # Companies | Science | Residents | Kobe | News (default News)
author: Nelson Milla        # optional
authorRole: Co-founder      # optional, shown after the name
company:                    # optional
  name: Company name
  url: https://example.com
  line: What the company does, in one sentence (shown at the end)
cover: /img/blog/url-slug/cover.jpg   # optional; put images in public/img/blog/<url-slug>/
coverAlt: What the cover photo shows
coverCredit: Photo by …      # optional, small credit on the hero
tags: [Founders, Demo Day]  # optional
# updated: 2026-11-05       # optional; last real edit (search engines read it)
draft: true                 # true = visible in `npm run dev` only
---

Write the post in Markdown. GitHub-flavoured: tables, ~~strikethrough~~, autolinks.

## A section heading

An image on its own line becomes a numbered, wide figure; the quoted text is its caption:

![What it shows](/img/blog/url-slug/photo.jpg "Caption · Photo credit")

> A pull quote from the founder.
>
> — Name, Role
