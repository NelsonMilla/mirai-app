# Landing-page measurement plan

This plan covers the standalone `new-site` deployment. Every page loads two
analytics sinks and the shared `/analytics.js` instrumentation, which dispatches
one event taxonomy to both:

- **Vercel Web Analytics** — page views, referrer, device, geography, plus the
  custom events below at two properties each. This is the aggregate view.
- **PostHog** (`/posthog.js`) — the same custom events with
  full property payloads, plus autocapture, heatmaps, session replay, and
  funnel/trend analysis. This is the diagnostic view.

The conversion funnel below applies to `/`, `/summit-bundle/`, (`/early-bird/` retired Sep 1 2026),
and `/experience/`. `/jp/` shares the taxonomy but sells no ticket directly; its
outcome is an email enquiry, not a checkout.

## Deployment checklist

- Enable Web Analytics for the `new-site` Vercel project, then redeploy so the
  `/_vercel/insights/*` routes are provisioned.
- Confirm the project is on Pro or Enterprise; page views work on all plans,
  but Vercel custom events are not available on Hobby.
- In production DevTools, verify a page-view request and an event request after
  opening one checkout. Ad/privacy blockers can suppress either request.
- Complete one test Luma purchase and confirm both `Checkout Opened` and
  `Purchase Completed` in Analytics before relying on the funnel.
- Add `localhost` to PostHog's internal/test-account filter so setup traffic is
  excluded from the funnel.
- Confirm in DevTools that a request reaches `us.i.posthog.com/e/`. PostHog is
  the sink that survives Vercel's Hobby-plan limits, so verify it independently.

## Outcome and funnel

The primary outcome is a completed paid checkout. Read each page as this
ordered funnel:

1. Page view / visitor (automatic Vercel Web Analytics)
2. `5-Second Visit` after five cumulative seconds with the page visible
3. `Section Viewed` from `offer` through the final offer
4. `Checkout Opened`
5. `Purchase Completed`

`Section Viewed` requires the section to remain in the central 60% of the
viewport for 800 ms. This avoids counting fast scroll-throughs and works for
sections taller than the viewport. Sections and checkout locations are counted
once per page load, making the section reach curve and first checkout intent
comparable with page views.

## Event taxonomy

| Event | Vercel properties (maximum two) | Question answered |
|---|---|---|
| Page view | Automatic path, referrer, device, geography | Who reaches each offer and from where? |
| `5-Second Visit` | None | How many visitors remain for at least five visible seconds? |
| `Experiment Assigned` | `experiment`, `variant` | How many eligible Summit Bundle visits entered each test group? |
| `Section Viewed` | `section`, `position` or `variant` | Where does meaningful page reach fall off, including by Summit Bundle variant? |
| `Checkout Opened` | `offer`, `location` | Which CTA first creates purchase intent? |
| `Purchase Completed` | `offer`, `value` | Which offer produces paid conversion and revenue? |
| `FAQ Opened` | `question`, `position` or `variant` | Which package objections need the most clarification? |
| `Alternative Offer Clicked` | `offer`, `location` | Are Early Bird visitors actually looking for accommodation? |
| `Site Navigation Clicked` | `destination`, `location` | Are package visitors leaving to explore the broader event? |

The current offer values distinguish `$399` Early Bird, ended Early Bird,
`$2,500` Summit + Hotel, and `$4,000` Summit + Hotel. During a hero test, the
offer value also includes the assigned variant, such as `__program_value` or
`__founder_value`. Event payloads contain no
names, email addresses, transaction IDs, free text, full URLs, or other personal
data. The page path is already part of Vercel's event data, so it is not repeated
as a custom property. This keeps every event within the two-property Vercel Pro
limit.

`Purchase Completed` listens only for the trusted `https://luma.com`
`luma:purchase` message used by the embedded checkout and records only the offer
and numeric value. Validate this event with a test purchase after deployment.
For durable financial reporting, reconcile it against Luma/Stripe and add a
server-side event from an official checkout webhook if that becomes available;
the browser event should not be the accounting source of truth.

## What PostHog adds

`/posthog.js` initialises PostHog before `/analytics.js` and exposes a small
`window.MiraiPostHog.capture` bridge that queues events until the library
finishes loading, so nothing fired early is lost. It is the only file that
touches `window.posthog`.

new-site reports to its own PostHog project, whose token is the `PROJECT_TOKEN`
constant in `posthog.js`. This is deliberately *not* the project the Next.js app
uses (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` in `.env.local`): the two surfaces have
separate event histories and separate dashboards. The cost is that a visitor who
goes from a landing page into the apply flow cannot be followed across the two in
a single funnel. If that cross-surface funnel becomes the question worth
answering, move both surfaces onto one project and accept the history split.

Session replay, heatmaps, dead clicks, and exception autocapture are all governed
by that project's server-side settings. `posthog.js` asks for them; the project
decides. If replay stops appearing, check the project toggle before the code — a
disabled project returns `"sessionRecording": false` from
`https://us.i.posthog.com/array/<token>/config` and the client will correctly
refuse to record.

**Automatic, no markup required**

- `$pageview` and `$pageleave`, which together give time on page and the maximum
  scroll percentage per view (`$prev_pageview_max_scroll_percentage`).
- `$autocapture` on every click, so any CTA added later is measurable before
  anyone remembers to tag it — and heatmaps and click maps come from the same
  data.
- Session replay, with all inputs masked.
- `$exception` capture, so a JavaScript error that silently breaks a CTA shows
  up as a cause of lost conversion rather than as unexplained drop-off.

**Every custom event additionally carries**

| Property | Meaning |
|---|---|
| `offer` | The page's offer key, without the variant suffix |
| `experiment`, `variant` | The assignment, when the page runs a test |
| `qa` | `true` for forced-variant views (see below) |
| `seconds_on_page` | Seconds since navigation start |
| `sections_viewed` | How many sections had been read by this point |
| `deepest_section`, `deepest_section_position` | How far down the page the visitor had reached |

That context is the difference between knowing that checkout intent fell and
knowing that it fell among visitors who never reached the price. Two events also
carry their own extras: `Checkout Opened` adds `checkout_target` (tickets,
residency, summit_hotel, fashion_show) and `is_first_checkout`, and
`Section Viewed` adds `seconds_to_view`.

Vercel counts only the first `Checkout Opened` per page load, so its funnel stays
comparable with page views. PostHog records every click, which is what makes
repeat attempts and returns-after-abandon visible.

**Funnels to build**

1. Paid conversion — `$pageview` → `Section Viewed` (`offer`) → `Checkout Opened`
   → `Purchase Completed`, broken down by `offer`.
2. Page reach — `Section Viewed` as a trend by `deepest_section_position`. The
   largest adjacent decline is the content boundary that loses attention.
3. CTA placement — `Checkout Opened` by `location`, filtered to
   `is_first_checkout = true`.
4. Experiment readout — `Purchase Completed` / `Experiment Assigned` split by
   `variant`, with `qa = true` excluded.

**Privacy**

No page on this site collects a name, an email address, or a payment; checkout
happens on Luma. PostHog runs with `person_profiles: 'identified_only'` and the
site never calls `identify`, so every event stays anonymous and no person
profiles are created. Session replay masks all inputs. Add PostHog's cookies to
the site's cookie disclosure alongside the two experiment cookies.

**Forced variants**

`?early_bird_hero=…` and `?summit_hero=…` suppress every custom event in both
sinks, exactly as before. PostHog still receives the automatic `$pageview` and
autocapture for those views, tagged `qa: true` — filter on that property rather
than assuming QA traffic is absent.

**Ad blockers**

Events currently go directly to `us.i.posthog.com`, which some blockers stop.
Routing them through the site's own origin recovers most of that loss; it needs
a `new-site/vercel.json` and a one-line change to `API_HOST` in `posthog.js`:

```json
{ "rewrites": [
  { "source": "/ingest/static/:path*", "destination": "https://us-assets.i.posthog.com/static/:path*" },
  { "source": "/ingest/:path*", "destination": "https://us.i.posthog.com/:path*" }
] }
```

This is deliberately not shipped yet: it is unverifiable until it is deployed,
and a rewrite that fails silently takes all analytics with it. Deploy it to a
preview, confirm `/ingest/decide` responds, then switch `API_HOST`.

## Dashboard and bottleneck review

Review by page, device, referrer, and week. Use the Web Analytics dashboard for
ad hoc checks and the Web Analytics API for a repeatable weekly table.

Track these rates/trends:

- Five-second engagement = `5-Second Visit` / page views. Use this as the
  landing-page quality signal when single-page visits make bounce rate
  misleading. The timer pauses while the tab is hidden and fires once per page
  view.
- Section reach = `Section Viewed` at a position / page views. The largest
  adjacent decline identifies the content boundary where attention is lost.
- Checkout intent = `Checkout Opened` / page views. Break down by `location` to
  see which first CTA placement works.
- Checkout completion = `Purchase Completed` / `Checkout Opened`. A large gap
  points to offer, payment, checkout UX, or trust friction outside the page.
- Paid conversion = `Purchase Completed` / page views. Treat this as the primary
  business metric and reconcile counts with Luma.
- FAQ demand = each `FAQ Opened` / FAQ section views. High demand identifies an
  objection to answer earlier or more clearly; it is hypothesis evidence, not
  proof that the answer causes conversion.
- Automatic bounce rate by route/referrer/device. Vercel does not count custom
  events as additional page views; treat bounce as secondary to five-second
  engagement for these landing pages.

Avoid reacting to raw totals alone. Compare rates with absolute denominators,
look for the same pattern across at least two meaningful time periods, and
segment only where sample sizes remain useful. First validate that events arrive,
then collect a baseline before changing copy or layout.

## Evidence-driven iteration

1. Fix instrumentation or checkout failures before testing persuasion changes.
2. Rank opportunities by the largest absolute loss in the funnel, not the most
   dramatic percentage on a tiny denominator.
3. Form one causal hypothesis per change: audience, problem, proposed change,
   expected metric movement, and guardrail.
4. Change the earliest content boundary associated with the loss. For example,
   weak `package_contents` reach suggests hero/value-proposition work; strong
   final-offer reach with weak checkout intent suggests price, trust, or CTA work.
5. Ship a single controlled experiment, keep allocation stable, and decide the
   sample size and minimum detectable lift before launch. Do not stop early after
   a favorable fluctuation.
6. Promote the winner, remove the flag, annotate the change date, and monitor the
   primary metric plus guardrails for regression.

## Active A/B test: Summit hero framing

The test is active as soon as this deployment reaches production.

- **Experiment:** `summit_hero_framing_v1`
- **Route:** `/summit-bundle/` only
- **Allocation:** stable 50/50
- **Control:** “Two summit weekends, hotel included” and the current package
  explanation
- **Variant (`founder_value`):** “One booking. The full Kobe run.” with explicit
  `$1,500` launch savings, 12 nights, both summits, and founder/investor-oriented
  convenience framing
- **Primary metric:** `Purchase Completed` / `Experiment Assigned`, by variant
- **Secondary metric:** `Checkout Opened` / `Experiment Assigned`, by variant
- **Diagnostics:** section reach, first CTA location, FAQ demand, and
  checkout-to-purchase completion
- **Guardrails:** bounce rate, mobile section reach, checkout completion, and no
  page-layout or performance regression

Only the hero message changes. Price, package contents, scarcity, imagery, CTA,
and Luma checkout are identical, isolating the framing hypothesis.

Assignment happens synchronously in the document head before the page renders,
so there is no control-to-variant flash. A first-party cookie stores only the
two-value assignment for 90 days; it contains no identifier or personal data.
Add this experiment cookie to the site's privacy/cookie disclosure and review
whether consent is required for the outreach jurisdictions in scope.

For QA, use `/summit-bundle/?summit_hero=control` or
`/summit-bundle/?summit_hero=founder_value`. Forced views do not emit custom
analytics events, so internal testing does not contaminate the experiment.

Because the reachable audience is small, record the expected outreach volume,
baseline purchase rate, minimum worthwhile lift, and stopping date before the
send. Do not call a winner from a handful of purchases. If the test cannot reach
the required sample, report the result as directional and combine it with direct
feedback from qualified founders/investors rather than claiming statistical
certainty.

## Retired A/B test (page removed Sep 1 2026): Early Bird hero framing

The test is active as soon as this deployment reaches production.

- **Experiment:** `early_bird_hero_framing_v1`
- **Route:** `/early-bird/` only
- **Allocation:** stable 50/50
- **Control:** “All of October. $399.” with flexibility and refund framing
- **Variant (`program_value`):** “The full October program. $399.” followed by
  the included summits, Fashion Show, programming, and confirmed-speaker proof
- **Primary metric:** `Purchase Completed` / `Experiment Assigned`, by variant
- **Secondary metric:** `Checkout Opened` / `Experiment Assigned`, by variant
- **Diagnostics:** section reach and first CTA location
- **Guardrails:** mobile section reach, checkout completion, and no layout shift

Only the hero eyebrow, headline, and lead change. Price, refund terms, included
program, offer panel, imagery, CTA, and Luma checkout stay the same. The copy
uses facts already present on the page and avoids audience labels or promises
that the program does not substantiate.

Assignment runs before the page renders and uses the same 90-day, two-value
first-party cookie as the Summit test. Add
`mirai_early_bird_hero_framing_v1` to the site's privacy/cookie disclosure.

For QA, use `/early-bird/?early_bird_hero=control` or
`/early-bird/?early_bird_hero=program_value`. Forced views do not emit custom
analytics events.

### Future platform upgrade

This static implementation is intentionally narrow and production-ready for the
outreach window. The longer-term foundation remains moving these routes into the
existing Next.js 16 app and using server-evaluated Vercel Flags plus `FlagValues`.
That would centralize allocation and annotate Vercel Web Analytics automatically.

## References

- [PostHog JavaScript Web SDK](https://posthog.com/docs/libraries/js)
- [PostHog funnels](https://posthog.com/docs/product-analytics/funnels)
- [PostHog session replay privacy controls](https://posthog.com/docs/session-replay/privacy)
- [PostHog reverse proxy](https://posthog.com/docs/advanced/proxy)
- [Vercel custom events](https://vercel.com/docs/analytics/custom-events)
- [Vercel Web Analytics privacy](https://vercel.com/docs/analytics/privacy-policy)
- [Vercel Web Analytics limits and pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Vercel Web Analytics API](https://vercel.com/docs/rest-api/reference/endpoints/web-analytics)
- [Vercel A/B test workflow](https://vercel.com/docs/flags/vercel-flags/cli/run-ab-test)
- [Vercel Flags and Web Analytics](https://vercel.com/docs/flags/observability/web-analytics)
- [Amplitude funnel analysis methodology](https://amplitude.com/docs/analytics/charts/funnel-analysis/funnel-analysis-get-the-most)
