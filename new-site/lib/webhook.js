import { catalogFromEnv, lumaPayload, ticketTypesFor } from './fulfil.js';

const LUMA_ADD_GUESTS = 'https://public-api.luma.com/v1/events/guests/add';

/**
 * Builds the webhook handler with its dependencies injected, so tests can
 * pass a stubbed Stripe client and fetch. `api/stripe-webhook.js` wires the
 * real ones.
 *
 * Flow: verify the Stripe signature → keep only payment_intent.succeeded →
 * find the Checkout Session for that payment → map its prices to Luma ticket
 * types → Add Guests on Luma. A Luma failure returns 500 so Stripe retries
 * (for up to three days), which is the fallback for a buyer without a ticket.
 *
 * payment_intent.succeeded fires at purchase for the summit tickets and at
 * capture for the $1,200 pass (manual capture, reviewed first). One event
 * covers both, and the handler never needs to know a review exists.
 */
export function createWebhookHandler({ stripe, env, fetch: doFetch = fetch, log = console }) {
  const catalog = catalogFromEnv(env);

  return async function handle(request) {
    const raw = await request.text();
    const signature = request.headers.get('stripe-signature') ?? '';
    let event;
    try {
      event = stripe.webhooks.constructEvent(raw, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      log.warn?.('[stripe-webhook] bad signature', error.message);
      return json({ error: 'bad signature' }, 400);
    }

    if (event.type !== 'payment_intent.succeeded') {
      return json({ ignored: event.type }, 200);
    }

    const paymentIntent = event.data.object;
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
      expand: ['data.line_items'],
    });
    const session = sessions.data[0];
    if (!session) {
      // A payment made outside Checkout (dashboard, invoice). Nothing to issue.
      return json({ ignored: 'no checkout session', payment_intent: paymentIntent.id }, 200);
    }

    const lineItems = session.line_items?.data ?? [];
    const { unknown } = ticketTypesFor(lineItems, catalog);
    const payload = lumaPayload({ session, lineItems, catalog, eventId: env.LUMA_EVENT_ID });
    if (!payload) {
      // Sponsor packages and anything else sold on this account pass through.
      return json({ ignored: 'no mirai ticket in session', prices: unknown }, 200);
    }

    const response = await doFetch(LUMA_ADD_GUESTS, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-luma-api-key': env.LUMA_API_KEY },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      log.error?.('[stripe-webhook] luma add-guests failed', response.status, body);
      return json({ error: 'luma add-guests failed', status: response.status }, 500);
    }
    const result = await response.json().catch(() => ({}));
    log.info?.('[stripe-webhook] issued', { session: session.id, email: payload.guests[0].email, unknown });
    return json({ issued: payload.tickets.length, skipped: result.skipped ?? [], unknown }, 200);
  };
}

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
