// Vercel function: POST /api/stripe-webhook
// Stripe sends payment_intent.succeeded here; the handler issues the matching
// Luma ticket. See lib/webhook.js for the flow and README.md for the env vars.
import Stripe from 'stripe';
import { createWebhookHandler } from '../lib/webhook.js';

let handler;

export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
}

export async function POST(request) {
  handler ??= createWebhookHandler({
    stripe: new Stripe(process.env.STRIPE_SECRET_KEY),
    env: process.env,
  });
  return handler(request);
}
