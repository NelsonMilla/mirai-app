import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session for a Mirai event ticket.
 * The email is locked so the attendee can't change it at checkout.
 */
export async function createCheckoutSession(opts: {
  email: string;
  token: string;
  baseUrl: string;
}) {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) throw new Error('STRIPE_PRICE_ID environment variable is not set');

  return stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: opts.email,
    client_reference_id: opts.token,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${opts.baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.baseUrl}/checkout/cancel?token=${encodeURIComponent(opts.token)}`,
  });
}
