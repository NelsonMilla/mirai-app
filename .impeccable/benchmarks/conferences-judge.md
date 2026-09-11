# /conferences variant judging rubric

You are judging three complete variants of the same landing page. You have not seen the brief that produced them and you must not go looking for it. Judge what a first-time visitor sees.

## Who the visitor is

A senior person in longevity biotech (an investor, an operator, a founder post Phase 1b, or an official) who received this link from a well-connected friend with the words "you should look at this". They will give it ten seconds on a phone or laptop before deciding whether to keep scrolling. If they keep scrolling, they are deciding whether $2,500 for two summit weekends, a finale, and twelve nights in Kobe is a serious offer from serious people.

## The test you run on every screen (the ten-second scan)

1. **Scan.** Look at the screen for the time it takes to read one headline. Say what you now know. If you cannot state the screen's one idea in one sentence, it fails.
2. **Zoom is optional.** Anything that needs reading to be understood is a support layer. It may exist, but the screen must work without it.
3. **VIP-ready.** Would this screenshot embarrass the friend who sent it? Anything that looks templated, cramped, inconsistent, or unfinished fails.
4. **Same site.** Does the screen belong to the same page as the previous one, without repeating its layout?
5. **Honest.** Does anything on it read as a claim you would want to check? Note it.

## Scoring

For each of the eleven screens (hero, five reasons, statement, why Japan speed, why Japan science and market, why now, who it's for, speakers, Kobe, package, closing plus footnotes), for each variant, give:
- a score 1 to 5 on the ten-second scan,
- a score 1 to 5 on craft (type, spacing, alignment, imagery quality, consistency),
- one sentence of what works and one of what does not.

Then, per screen, name the winner and say in one line why.

Then answer, for the page as a whole per variant:
- The single most memorable moment, in one sentence.
- Where it feels longest or most repetitive.
- Whether the light package section reads as the same site under different light or as a different site.
- Any copy that could read as foreigners telling Japan what to do, or as politics.
- Mobile: does it hold at 375px, and where does it break.

Finish with a synthesis recommendation: a per-screen list of which variant's execution to take, and the two or three cross-cutting rules (type scale, spacing, motion) the synthesis should follow so the assembled page reads as one design. Do not average. Pick.

## How to look

A static server is on `http://localhost:4322/` rooted at the site. The variants are at `/conferences/_v/a/`, `/conferences/_v/b/`, `/conferences/_v/c/`. Capture each with:

```
OUT=<scratch>/judge node /Users/nelson/Downloads/Mirai/mirai-app/.impeccable/benchmarks/shoot.mjs '[["a","http://localhost:4322/conferences/_v/a/"],["b","http://localhost:4322/conferences/_v/b/"],["c","http://localhost:4322/conferences/_v/c/"]]'
```

That writes 720px-wide tiles and a metrics JSON per variant. Read every tile. For mobile, copy the script, set the viewport to 375×812 and deviceScaleFactor to 1, and capture again. Do not read the variants' source code before you have scored the screenshots. You may read source afterwards only to explain a defect.
