// Pure functions behind the Stripe → Luma webhook. No I/O here, so every
// branch is unit-testable without keys.

const SKUS = [
  { key: 'summit_1', priceEnv: 'STRIPE_PRICE_SUMMIT_1', lumaEnv: 'LUMA_TICKET_SUMMIT_1' },
  { key: 'summit_2', priceEnv: 'STRIPE_PRICE_SUMMIT_2', lumaEnv: 'LUMA_TICKET_SUMMIT_2' },
  { key: 'everything', priceEnv: 'STRIPE_PRICE_EVERYTHING', lumaEnv: 'LUMA_TICKET_EVERYTHING' },
];

/**
 * Builds the price → Luma ticket type map from environment variables.
 * SKUs whose variables are unset are left out, so a half-configured
 * environment never silently maps a price to the wrong ticket.
 */
export function catalogFromEnv(env) {
  const catalog = {};
  for (const sku of SKUS) {
    const priceId = env[sku.priceEnv];
    const lumaTicketTypeId = env[sku.lumaEnv];
    if (priceId && lumaTicketTypeId) catalog[priceId] = { key: sku.key, lumaTicketTypeId };
  }
  return catalog;
}

/**
 * Maps a Checkout Session's line items to Luma ticket types.
 * Unknown prices are reported, not thrown: the sponsor pricing table shares
 * this Stripe account, and its payments must pass through untouched.
 */
export function ticketTypesFor(lineItems, catalog) {
  const tickets = [];
  const unknown = [];
  for (const item of lineItems) {
    const priceId = item.price?.id;
    const entry = catalog[priceId];
    if (entry) tickets.push({ key: entry.key, event_ticket_type_id: entry.lumaTicketTypeId });
    else unknown.push(priceId ?? '(no price)');
  }
  return { tickets, unknown };
}

/**
 * The Luma Add Guests body for a paid session. Returns null when nothing in
 * the session is a Mirai ticket. Every guest is added as approved: a
 * succeeded payment is the approval (the $1,200 pass is only captured after
 * review, so its payment_intent.succeeded is the approval itself).
 */
export function lumaPayload({ session, lineItems, catalog, eventId }) {
  const { tickets } = ticketTypesFor(lineItems, catalog);
  if (tickets.length === 0) return null;
  const email = session.customer_details?.email;
  if (!email) throw new Error(`session ${session.id} has no customer email`);
  return {
    event_id: eventId,
    guests: [{ email, name: session.customer_details?.name ?? null }],
    tickets: tickets.map(({ event_ticket_type_id }) => ({ event_ticket_type_id })),
    approval_status: 'approved',
    send_email: true,
  };
}
