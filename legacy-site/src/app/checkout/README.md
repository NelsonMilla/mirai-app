# Dormant commerce/access routes — intentionally kept

The Luma page is currently the only public application funnel, so none of
these routes are linked from the landing page. They are **not** dead code;
they're a built-and-tested payments/access stack kept warm for when
applications move in-house. Do not delete or "clean up" these in
refactoring passes:

- `/checkout`, `/checkout/success`, `/checkout/cancel` + `src/app/api/checkout`,
  `src/app/api/webhooks/stripe`, `src/lib/stripe.ts` — Stripe checkout flow.
- `/invite` + `src/app/api/invite/*`, `src/lib/inviteCodes.ts` — invite-code
  redemption (the "Have an invite code?" navbar link points here, so this
  one is reachable).
- `/console` + `src/app/api/admin/*` — internal admin console
  (applications, approvals, invite codes, whitelist).
- `src/app/api/whitelist/*`, `src/lib/whitelist.ts` — whitelist check/claim
  (the apply section's "already invited?" box calls these).
- `src/lib/auth.ts`, `src/lib/tokens.ts`, `src/lib/email.ts` — supporting
  auth/email plumbing for the above.

Styles for these routes live in `src/styles/dormant.css`.

If the Luma-only funnel ever becomes permanent, delete this whole stack in
one deliberate pass — not piecemeal.
