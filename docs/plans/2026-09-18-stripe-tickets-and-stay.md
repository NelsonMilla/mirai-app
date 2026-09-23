# Stripe tickets + stay step: implementation plan

**Goal:** Sell summit tickets on Stripe hosted Checkout (promo codes native), issue the Luma ticket automatically, land the buyer on a post-purchase stay page, and retire every bundle/package offer on the site and on Luma.

**Architecture:** The site stays static. Ticket buttons become Stripe Payment Links. One Vercel function receives the Stripe webhook and calls Luma Add Guests, so Luma remains the attendee list and QR scanner. `/stay/` is a public, unlisted static page reached from the Stripe success redirect and the Luma confirmation email. No database, no auth, no bundles.

**Tech stack:** static HTML/JS in `new-site/`, Stripe Payment Links + Checkout, one Node function under `new-site/api/`, Luma public API (needs Luma Plus), Playwright suite in `legacy-site/e2e/`, Vercel.

**Skills applied:** writing-plans (this document), tdd (tracer bullets per slice), stripe-integration (webhook signature, idempotency, test cards), smoke-scaffold + never-twice rule (viewport assertions for new pages), verification-before-completion (every DoD line names its proving command), claims-audit (copy that says "on Luma" or "package" must go), analytics-tracking via `new-site/ANALYTICS.md`, finishing-a-development-branch (PR per slice), to-issues (optional: turn slices into GitHub issues).

---

## 0. Decisions

### Settled in conversation
| Decision | Value |
|---|---|
| Ticket checkout | Stripe hosted Checkout, not Luma |
| Bundles / hotel package | Retired everywhere, including the Luma ticket type and coupon |
| Accommodation | Not sold by Mirai. Recommended stays + a Portopia link at the Mirai rate |
| Post-purchase step | `/stay/` static page, public, `noindex` |
| Auth | None (tier 0). Luma email check is a later option if the Portopia asks for it |
| Attendee system | Luma stays. Tickets issued by webhook → Add Guests |
| Japan residents | Unchanged, Peatix via `/jp/` |
| $1,200 pass review (D7, settled 2026-09-18) | Anyone can buy it without an application. The Payment Link uses manual capture: the card is authorized, not charged. Stripe's Uncaptured payments list is the review queue. Approve = Capture (one click), reject = Cancel, which releases the hold with no refund and no fees lost. The webhook issues the Luma ticket only when the payment actually succeeds, so approval and issuance are the same click. Summit tickets capture automatically and issue at once. Luma is not in the review at all |
| Ticket SKUs (D1, settled 2026-09-18) | Summit I $900 · Summit II $900 · Everything, no accommodation $1,200 (both summits plus the month). No "both weekends" SKU: the $1,200 pass is the two-summit price |

### Open, with recommended default (confirm before the slice that needs it)
| # | Question | Default | Needed by |
|---|---|---|---|
| D2 | Portopia rate link or code | Ship `/stay/` without it, add when the hotel sends it | Slice 2 |
| D3 | Record where each buyer stays? | No form in v1. Add a Tally embed later if a headcount is needed | Slice 2 |
| D4 | Purchase event source | Fire `Purchase Completed` from `/stay/` using the session id, deduped in sessionStorage | Slice 5 |
| D5 | Luma Plus on the account | Required for the API. If not, tickets are added by hand until it is | Slice 4 |
| D6 | Stripe Tax | Off unless the selling entity must charge JP consumption tax | Slice 3 |
| D8 | Review window promised in the disclaimer | "within 7 days". Hard limit: a card authorization expires after 7 days (30 days only for JPY on a Japan-based Stripe account), so an unreviewed booking silently releases. Nelson checks the Uncaptured list daily while sales are open | Slice 3, Slice 5 |
| D9 | Where Luma remains after this plan | Back-office only, invisible before purchase: QR ticket email, door check-in, attendee list. Replacing check-in is a separate project after October 1 | Slice 4 |

---

## 1. Baseline

Run before any change and record the result here:

```bash
cd legacy-site && npm run smoke
```

First run on 2026-09-18, before any change: **5 passed, 6 failed, 1 flaky, 8.8 min.** All seven were test drift (stale early-bird page list, a removed `residency` section, hero selectors from before the Sep 6 rebuild, and a smoke spec driving the undeployed Next app). Fixed on branch `fix/e2e-suite-drift` before this plan starts.

Baseline after that fix: **21 passed, 0 failed, 1.4 min.** The smoke spec now drives the live static site (`/`, `/experience/`, `/startups/`, `/pricing/`, `/conferences/`, `/jp/`) at phone and desktop widths. The analytics spec has a `PAGES` constant with a guard test; retiring a page means editing that constant.

Rule for every slice: the PR pastes the full `npm run smoke` output and it must be all green. There is no longer an allowed set of pre-existing reds.

---

## 2. Slices (tracer bullets, each shippable alone)

### Slice 1 — Retire the bundle everywhere (AFK, no dependencies, ship first)

Removes an offer that is no longer sold. Pure deletion plus a redirect, so it is the lowest-risk change and the most urgent.

**Files**
- Delete: `new-site/summit-bundle/` (index.html, og.png)
- Create: `new-site/vercel.json` with a 301 from `/summit-bundle/` to `/pricing/`
- Modify `new-site/index.html`: remove `showSummitPackage` flag and `package-promo-hidden` class logic; remove the `#summit-package` section and its CSS block (`/* ── summit + hotel package ── */`); remove the `luma-checkout` script tag, the `loadLumaCheckout` loader and observer, and the `packageSpotsLeft` sold-out block; check JSON-LD and meta descriptions for package text
- Modify `new-site/copy.js`: remove the `package` block; rewrite FAQ answers that mention the hotel package (a3 both branches, a6); remove `js.packageSpots*` and the `{spots}` replacement
- Modify `new-site/pricing/index.html`: remove the package row and the "Hotel package" comparison column; rewrite the footnote and the intro ("Four ways" → three)
- Modify `new-site/conferences/index.html`: nav CTA back to the default ticket CTA (drop `data-cta-*` overrides), remove the skip link, the "Package" nav item, the sticky bar link, the hero package CTA pair, section 09 "the package", and the closing package CTAs. Replace with the ticket CTA where a CTA is needed
- Modify: `new-site/sitemap.xml` (drop the URL), `new-site/llms.txt` (drop the line), `new-site/site.yml` (drop the page entry), `new-site/README.md` (drop the bundle paragraph and the flag paragraph), `new-site/ANALYTICS.md` (drop the bundle funnel, the experiment section, the QA URLs)
- Modify `legacy-site/e2e/analytics.spec.ts`: remove `summit-bundle/index.html` from the `PAGES` constant; keep the experiment plumbing comment accurate
- Leave alone: the experiment code in `analytics.js` / `posthog.js` (shared, harmless when no page assigns a variant). Mention in the PR as optional cleanup

**Luma side (Nelson, dashboard)**
- Hide or delete the hotel package ticket type `ttype-0BjQv0xV4yY5P0l`
- Deactivate coupon `SFSH`
- Verify that `https://luma.com/an4zotn9?coupon=SFSH` no longer offers the package

**Steps**
1. Add a test first: in `analytics.spec.ts`, a test that greps every `new-site/**/*.html` (excluding `_v/`) for `summit-bundle|SFSH|ttype-0BjQv0xV4yY5P0l|hotel package` and expects zero matches. Run, see it fail.
2. Make the deletions above. Run, see it pass.
3. `npm run smoke` all green.
4. Serve `new-site` on 4321 and load `/`, `/pricing/`, `/conferences/` at 375 and 1280: clean console, no horizontal overflow, no empty section where the package was.
5. Commit, PR.

**Definition of done**
- [ ] `grep -rn "summit-bundle\|SFSH\|ttype-0BjQ\|hotel package\|showSummitPackage\|packageSpots" new-site --exclude-dir=_v` returns nothing
- [ ] `new-site/summit-bundle/` does not exist; `curl -I https://<preview>/summit-bundle/` returns 301 to `/pricing/`
- [ ] The regression test from step 1 exists and passes
- [ ] `npm run smoke` output pasted in the PR, 0 new failures
- [ ] `/`, `/pricing/`, `/conferences/` have no dangling anchors (`#offer`, `#summit-package`) and no empty section
- [ ] Sitemap, llms.txt, site.yml, README, ANALYTICS.md no longer mention the bundle
- [ ] Luma package ticket type hidden and `SFSH` deactivated, checked by opening the old deep link in a private window
- [ ] PostHog: no `checkout_target: summit_hotel` events after deploy day

### Slice 2 — `/stay/` page (AFK once D2/D3 answered, no code dependency)

**Files**
- Create: `new-site/stay/index.html`
- Modify: `new-site/sitemap.xml` (do not add; the page is `noindex`), `new-site/README.md` (document the page), `new-site/ANALYTICS.md` (add the page and its sections)
- Modify `legacy-site/e2e/analytics.spec.ts`: add `stay/index.html` to `PAGES`

**Content, plain copy per DESIGN.md and the plain-titles rule**
1. "Your ticket is confirmed" — Luma email is on its way, add the calendar file (`/mirai_oct1.ics` exists). When the URL carries `pass=everything` (set per Payment Link redirect, no server needed) the heading becomes "Your booking is in review": the card is held, not charged, until the spot is confirmed within 7 days; if not accepted the hold is released
2. "Where to sleep" — three cards: Portopia (Mirai rate link when D2 arrives), hacker houses (The Sanctuary, Biopunk House, Aevitas, ZuCity Japan, with their existing links), Book it yourself (Airbnb and Booking search links for Sannomiya / Port Island, Oct 2026)
3. "Getting there" — one paragraph, link to `/citizens/` map
4. Shared `nav.js` header, `posthog.js` + `analytics.js`, `data-track-section` on each section

**Steps**
1. Write the page.
2. Add `/stay/` to `PAGES` in `legacy-site/e2e/smoke.spec.ts` (already covers overflow, reveal and console at phone and desktop widths). Run, see it pass.
3. Add `stay/index.html` to the analytics page lists. Run, pass.
4. Commit, PR.

**Definition of done**
- [ ] `/stay/` renders at four viewports with clean console and no overflow (spec output in PR)
- [ ] `<meta name="robots" content="noindex, nofollow">` present; not in sitemap
- [ ] `/stay/?pass=everything` shows the review heading and refund promise; `/stay/` without it shows the confirmed heading (assertion in the analytics spec)
- [ ] Loads `/posthog.js` then `/analytics.js`; every outbound stay link carries `data-analytics-action="site_navigation"` or a new `stay_option` action documented in ANALYTICS.md
- [ ] No copy says "package", "bundle", or "on Luma" for tickets
- [ ] Reviewed against DESIGN.md; no clever titles

### Slice 3 — Stripe catalog and Payment Links (HITL: Nelson in the Stripe dashboard, test mode first)

**Dashboard work**
1. Products: Summit I $900, Summit II $900, Everything $1,200. No hotel product, no bundle.
2. Coupons: one per discount level, `applies_to` the ticket products, `max_redemptions` set. Promotion codes on top with the customer-facing code.
3. Payment Links: one per SKU, quantity fixed at 1, promo codes on, receipt email on, collect name and email. Redirect after payment to `https://mirai-tech-city.vercel.app/stay/?session_id={CHECKOUT_SESSION_ID}&pass=<sku>`. The $1,200 link is created through the API or CLI, not the dashboard form, because it needs `payment_intent_data.capture_method=manual` and `submit_type=book`; its `custom_text.submit.message` carries the disclaimer: your card is held now and only charged when we confirm your spot, within 7 days; if we cannot accept you the hold is released. Stripe shows it above the pay button.
4. Repeat in live mode once slice 4 is green.

**Definition of done**
- [ ] Test-mode Payment Link for each SKU completes with card 4242 and lands on `/stay/?session_id=cs_test_…`
- [ ] A promo code applies and the receipt shows the discount
- [ ] A promo code cannot exceed its redemption cap (try cap+1)
- [ ] The $1,200 link shows the review disclaimer above the pay button; the summit links do not
- [ ] Review rehearsed once in test mode: one $1,200 test booking captured from the Uncaptured list, one cancelled; the captured one produces a `payment_intent.succeeded` event, the cancelled one a `payment_intent.canceled` event, both visible in the Stripe event log
- [ ] Live-mode links exist with identical settings; URLs recorded in `new-site/README.md`

### Slice 4 — Webhook function: Stripe → Luma (AFK after D5; depends on slice 3 test links)

**Files**
- Create: `new-site/package.json` (`private`, `type: module`, dependency `stripe`, script `test: node --test test/`)
- Create: `new-site/api/stripe-webhook.js` — Web Request handler: raw body via `request.text()`, `stripe.webhooks.constructEvent`, on `payment_intent.succeeded` look up the Checkout Session for that payment intent with line items expanded, call `fulfil`, return 200 on success, 500 on Luma failure so Stripe retries. `payment_intent.succeeded` fires at purchase for the summit tickets and at capture for the $1,200 pass, so one event covers both and the webhook never needs to know about the review
- Create: `new-site/lib/fulfil.js` — pure functions: `ticketTypesFor(lineItems)` maps the three Stripe price ids to the three Luma ticket types (Summit I, Summit II, Everything) from a constant map; `lumaPayload(session, lineItems)` builds the Add Guests body (`event_id`, `guests[{email,name}]`, `tickets[]`, `send_email: true`); every guest is added as approved because a succeeded payment is the approval
- Create: `new-site/test/fulfil.test.js` (node:test) and `new-site/test/webhook.test.js` using `stripe.webhooks.generateTestHeaderString` for signature cases
- Create: `new-site/.env.example` listing `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `LUMA_API_KEY`, `LUMA_EVENT_ID`
- Modify: `.claude/launch.json` add `new-site-vercel` running `vercel dev --listen 4330` in `new-site/` (python server on 4321 cannot run functions)
- Modify: `new-site/README.md` (functions, env vars, local run), `mirai-app/CLAUDE.md` (new-site now has a package.json; still no build step)
- Vercel project: env vars per environment (test keys on Preview, live on Production). Framework preset stays "Other", no build command.

**Tracer bullets, one test → one implementation each**
1. `ticketTypesFor` maps a known price id to its Luma ticket type; unknown id returns nothing and is reported
2. `lumaPayload` uses `customer_details.email` and `name`; missing name still yields a valid guest
3. Webhook rejects a bad signature with 400; accepts a `generateTestHeaderString` signed body with 200
4. Webhook ignores event types other than `payment_intent.succeeded` with 200, including `checkout.session.completed` (which fires at authorization, before the review)
5. Webhook returns 500 when the Luma call fails (mock fetch), so Stripe retries
6. Idempotency: a second delivery of the same event is safe because Luma skips existing guests; assert the function does not throw on a "skipped" response

**Integration (manual, test mode)**
```bash
cd new-site && vercel dev --listen 4330
stripe listen --forward-to localhost:4330/api/stripe-webhook
```
Complete a test Payment Link checkout per SKU. Summit buyers must appear on the private Luma test event at once with the right ticket type and the ticket email sent. The $1,200 buyer must NOT appear until the payment is captured from the Uncaptured list, then appear within seconds. A cancelled $1,200 booking must never appear.

**Definition of done**
- [ ] `npm test` in `new-site/` passes, output in PR
- [ ] Stripe CLI run shows `200` for a real test checkout and the guest exists on the Luma test event (screenshot or API `Get Guest` output)
- [ ] A $1,200 test booking does not reach Luma before capture and does reach it after (Get Guest before and after)
- [ ] A forced Luma failure shows Stripe retrying in the dashboard (event marked failed, retry scheduled)
- [ ] Secrets only in Vercel env vars; `grep -rn "sk_live\|sk_test\|whsec_" new-site` returns nothing but `.env.example` placeholders
- [ ] Preview deployment serves `/` unchanged and `GET /api/stripe-webhook` returns 405
- [ ] `vercel dev` launch config works; README documents it
- [ ] Luma event webhook secret and API key rotated if they were ever pasted in chat

### Slice 5 — Cutover: site CTAs to Stripe (AFK, depends on 1–4; one PR, revert-able)

**Files**
- Modify `new-site/copy.js`: hero, summit, agenda, apply, footer CTAs from `luma.com/an4zotn9` to the Payment Link (or to `/pricing/` where a choice of SKU is needed)
- Modify `new-site/nav.js`: default CTA href
- Modify `new-site/index.html`, `new-site/experience/index.html`, `new-site/pricing/index.html`, `new-site/conferences/index.html`: remaining ticket links. Keep the footer "Follow on Luma" listing link and the Peatix link
- Modify `new-site/stay/index.html`: on load, if `session_id` is in the URL and not in sessionStorage, call `track('Purchase Completed', {offer, session_id})`; store the id
- Modify `new-site/analytics.js`: retire `initPurchaseTracking` (Luma postMessage) or leave it inert; document in ANALYTICS.md that the event now comes from `/stay/`
- Modify `legacy-site/e2e/analytics.spec.ts`: the "every Luma link is instrumented" test becomes "every checkout link (luma.com or buy.stripe.com) is instrumented"; add a test that `/stay/?session_id=x` emits `Purchase Completed` once across a reload
- Modify `new-site/README.md`: "All ticket CTAs → Stripe Payment Links"; `new-site/ANALYTICS.md`: targets and the new purchase source
- Claims audit: every sentence that says tickets are "on Luma" is rewritten; `/experience/` FAQ 09 and stat line, `/pricing/` footnote, `copy.js` a6. Per D7, every "application-only · rolling review" line about the $1,200 pass becomes "Book now · confirmed within 7 days · your card is only charged once confirmed" (D8 window)
- Modify `new-site/pricing/index.html`: three rows (Summit I, Summit II, Everything $1,200) plus the startup sprint; the arithmetic line becomes "both weekends separately $1,800, everything $1,200"

**Definition of done**
- [ ] `grep -rn "luma.com/an4zotn9" new-site --exclude-dir=_v` lists only the footer listing links
- [ ] Every `buy.stripe.com` anchor carries `data-analytics-action="checkout"` (test in PR)
- [ ] `Purchase Completed` fires once per session id (test in PR)
- [ ] `npm run smoke` green, output in PR
- [ ] Live purchase by Nelson with a real card for $1 test price or a 100% promo code: Luma ticket email arrives, `/stay/` shows, PostHog shows the event
- [ ] Rollback rehearsed: `git revert` of the cutover commit restores Luma links; noted in PR

### Slice 6 — Optional follow-ups (not in scope now)
- Luma email gate on `/stay/` (Get Guest by email) if the Portopia asks to keep the rate off the open web
- `payment_intent.canceled` → a "we could not accept your booking" email through an email API, since Stripe sends nothing on a cancelled authorization; until then Nelson emails declined buyers by hand
- `charge.refunded` → Luma `update-status` declined, for refunds after capture
- Checkout Sessions function instead of Payment Links if prefilled email or per-SKU inventory is needed

---

## 3. Global definition of done

- [ ] Every slice merged through its own PR with the proving command output pasted
- [ ] No page on the site mentions a bundle, package, or hotel nights for sale
- [ ] Old bundle deep links (site and Luma) cannot buy anything
- [ ] A ticket bought on Stripe produces a Luma ticket without human action, verified live once
- [ ] `/stay/` is reachable from the Stripe redirect and from the Luma confirmation email text (Nelson edits the Luma email template to link it)
- [ ] `new-site/` still deploys as one folder; `../legacy-site` never referenced
- [ ] README, ANALYTICS.md, CLAUDE.md describe the new flow; the memory file `mirai-scheduling-link` updated (Stripe for tickets)
- [ ] Never-twice: every visual bug found during this work has an assertion in `legacy-site/e2e/smoke.spec.ts`

## 4. Risks and how each is held

| Risk | Hold |
|---|---|
| Webhook fails, buyer has no Luma ticket | Stripe retries for 3 days; failure email to team@; manual Add Guests fallback |
| Buyer loses the `/stay/` URL | Page is public; Luma confirmation email links it |
| Old bundle links shared on social | 301 to `/pricing/`; Luma ticket type hidden |
| `package.json` makes Vercel try to build | Preset "Other", no build script; preview deploy checked in slice 4 |
| Analytics funnel breaks silently | Spec tests on page lists and link instrumentation; ANALYTICS.md updated in the same PR |
| One promo code per session | Acceptable; no stacking needed once SFSH is gone |
| Quantity > 1 | Payment Links fixed at 1; one buyer, one email, one Luma guest |
| $1,200 booking not reviewed within 7 days | The authorization expires and the buyer silently loses the spot with no charge. Daily look at Stripe's Uncaptured list while sales are open; JPY pricing on a Japan account would extend the hold to 30 days if this becomes a problem |
| Declined buyer hears nothing | Stripe sends no email on a cancelled hold. Nelson emails them by hand until slice 6 automates it |

## 5. Out of scope
Selling accommodation, holding hotel inventory, auth, refunds automation, the startup sprint application flow, Japan-resident ticket, fashion-show tickets.
