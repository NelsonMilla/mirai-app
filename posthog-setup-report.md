<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Mirai Tech PopUp City Next.js App Router application. Here's what was done:

- **Client-side initialization** via `instrumentation-client.ts` — PostHog loads automatically on every page using Next.js 15.3+ instrumentation, with a reverse proxy (`/ingest/*`) configured in `next.config.ts` to reduce ad-blocker interference and improve event delivery reliability.
- **Server-side client** created at `src/lib/posthog-server.ts` — a shared singleton used by all API routes and server actions.
- **User identification** wired at every key identity moment: application form submit (client), verify-code login (server), and invite code redemption (client).
- **13 events** instrumented across 9 files, covering the full visitor-to-paid-attendee journey.
- **Environment variables** written to `.env.local` (never committed).

| Event | Description | File |
|---|---|---|
| `track_selected` | User selects a residency track (Devices, Therapies, or Builder) | `src/components/tracks/TrackCard.tsx` |
| `application_step_advanced` | User advances to the next step in the multi-step form | `src/app/apply/ApplyForm.tsx` |
| `application_submitted` | Application successfully written to Notion | `src/app/apply/actions.ts` |
| `application_submission_failed` | Application failed due to a server error | `src/app/apply/actions.ts` |
| `mailing_list_joined` | User joined the pre-launch mailing list | `src/app/apply/actions.ts` |
| `faq_opened` | User expanded an FAQ accordion item | `src/components/apply/FaqAccordion.tsx` |
| `invite_code_validated` | Invite code or email passed the whitelist/invite check | `src/app/invite/page.tsx` |
| `invite_code_redeemed` | User completed mini-form and was sent to Stripe checkout | `src/app/invite/page.tsx` |
| `login_code_requested` | User requested a magic-link login code | `src/app/api/auth/send-code/route.ts` |
| `login_code_verified` | User verified their login code and received a session | `src/app/api/auth/verify-code/route.ts` |
| `application_approved` | Admin approved an application and sent the payment link | `src/app/api/admin/approve/route.ts` |
| `checkout_session_created` | Stripe checkout session created and user redirected | `src/app/api/checkout/route.ts` |
| `payment_completed` | Stripe webhook confirmed a successful payment | `src/app/api/webhooks/stripe/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/398937/dashboard/1513395
- **Application Funnel** (track_selected → application_step_advanced → application_submitted): https://us.posthog.com/project/398937/insights/h1eTAeMp
- **Payment Conversion Funnel** (application_approved → checkout_session_created → payment_completed): https://us.posthog.com/project/398937/insights/Xk1gt8ux
- **Applications Submitted Over Time**: https://us.posthog.com/project/398937/insights/ox2B52mx
- **Track Selections by Track**: https://us.posthog.com/project/398937/insights/hcg9aBzK
- **Invite Code & Mailing List Signups**: https://us.posthog.com/project/398937/insights/Fair2nas

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
