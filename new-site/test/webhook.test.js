import { test } from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { createWebhookHandler } from '../lib/webhook.js';

const SECRET = 'whsec_test_secret';
const env = {
  STRIPE_WEBHOOK_SECRET: SECRET,
  STRIPE_PRICE_SUMMIT_1: 'price_s1',
  STRIPE_PRICE_SUMMIT_2: 'price_s2',
  STRIPE_PRICE_EVERYTHING: 'price_all',
  LUMA_TICKET_SUMMIT_1: 'ttyp-s1',
  LUMA_TICKET_SUMMIT_2: 'ttyp-s2',
  LUMA_TICKET_EVERYTHING: 'ttyp-all',
  LUMA_API_KEY: 'luma-key',
  LUMA_EVENT_ID: 'evt-mirai',
};

// The real SDK signs and verifies offline; only sessions.list is stubbed.
const realStripe = new Stripe('sk_test_placeholder');
const silent = { info() {}, warn() {}, error() {} };

function stripeWith(sessions) {
  return {
    webhooks: realStripe.webhooks,
    checkout: { sessions: { list: async (params) => ({ data: sessions, params }) } },
  };
}

function signedRequest(event, { secret = SECRET } = {}) {
  const payload = JSON.stringify(event);
  const signature = realStripe.webhooks.generateTestHeaderString({ payload, secret });
  return new Request('https://example.test/api/stripe-webhook', {
    method: 'POST',
    headers: { 'stripe-signature': signature, 'content-type': 'application/json' },
    body: payload,
  });
}

const succeeded = (id = 'pi_1') => ({
  id: 'evt_stripe_1',
  object: 'event',
  type: 'payment_intent.succeeded',
  data: { object: { id, object: 'payment_intent' } },
});

const session = (priceIds, email = 'ada@example.com') => ({
  id: 'cs_1',
  customer_details: { email, name: 'Ada' },
  line_items: { data: priceIds.map((id) => ({ price: { id }, quantity: 1 })) },
});

function fetchRecorder(status = 200, body = { skipped: [] }) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return new Response(JSON.stringify(body), { status });
  };
  return { fn, calls };
}

test('a bad signature is rejected with 400 and nothing is issued', async () => {
  const luma = fetchRecorder();
  const handle = createWebhookHandler({ stripe: stripeWith([session(['price_s1'])]), env, fetch: luma.fn, log: silent });
  const res = await handle(signedRequest(succeeded(), { secret: 'whsec_wrong' }));
  assert.equal(res.status, 400);
  assert.equal(luma.calls.length, 0);
});

test('events other than payment_intent.succeeded are acknowledged and ignored', async () => {
  const luma = fetchRecorder();
  const handle = createWebhookHandler({ stripe: stripeWith([session(['price_s1'])]), env, fetch: luma.fn, log: silent });
  // checkout.session.completed fires at authorisation, before the $1,200 review.
  const res = await handle(signedRequest({ ...succeeded(), type: 'checkout.session.completed' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ignored: 'checkout.session.completed' });
  assert.equal(luma.calls.length, 0);
});

test('a succeeded payment for a summit ticket adds the buyer to Luma as approved', async () => {
  const luma = fetchRecorder();
  const stripe = stripeWith([session(['price_s2'])]);
  const handle = createWebhookHandler({ stripe, env, fetch: luma.fn, log: silent });
  const res = await handle(signedRequest(succeeded('pi_42')));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { issued: 1, skipped: [], unknown: [] });
  assert.equal(luma.calls.length, 1);
  assert.equal(luma.calls[0].url, 'https://public-api.luma.com/v1/events/guests/add');
  assert.equal(luma.calls[0].init.headers['x-luma-api-key'], 'luma-key');
  assert.deepEqual(luma.calls[0].body, {
    event_id: 'evt-mirai',
    guests: [{ email: 'ada@example.com', name: 'Ada' }],
    tickets: [{ event_ticket_type_id: 'ttyp-s2' }],
    approval_status: 'approved',
    send_email: true,
  });
});

test('the session is looked up by payment intent with line items expanded', async () => {
  const luma = fetchRecorder();
  let seen;
  const stripe = stripeWith([session(['price_all'])]);
  stripe.checkout.sessions.list = async (params) => { seen = params; return { data: [session(['price_all'])] }; };
  const handle = createWebhookHandler({ stripe, env, fetch: luma.fn, log: silent });
  await handle(signedRequest(succeeded('pi_7')));
  assert.deepEqual(seen, { payment_intent: 'pi_7', limit: 1, expand: ['data.line_items'] });
});

test('a payment with no Mirai ticket (sponsor package) passes through untouched', async () => {
  const luma = fetchRecorder();
  const handle = createWebhookHandler({ stripe: stripeWith([session(['price_sponsor_gold'])]), env, fetch: luma.fn, log: silent });
  const res = await handle(signedRequest(succeeded()));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ignored: 'no mirai ticket in session', prices: ['price_sponsor_gold'] });
  assert.equal(luma.calls.length, 0);
});

test('a payment without a checkout session is acknowledged and ignored', async () => {
  const luma = fetchRecorder();
  const handle = createWebhookHandler({ stripe: stripeWith([]), env, fetch: luma.fn, log: silent });
  const res = await handle(signedRequest(succeeded('pi_dash')));
  assert.equal(res.status, 200);
  assert.equal(luma.calls.length, 0);
});

test('a Luma failure returns 500 so Stripe retries the delivery', async () => {
  const luma = fetchRecorder(502, { message: 'upstream' });
  const handle = createWebhookHandler({ stripe: stripeWith([session(['price_s1'])]), env, fetch: luma.fn, log: silent });
  const res = await handle(signedRequest(succeeded()));
  assert.equal(res.status, 500);
});

test('a redelivery whose guest Luma skips is still a 200', async () => {
  const luma = fetchRecorder(200, { skipped: [{ email: 'ada@example.com' }] });
  const handle = createWebhookHandler({ stripe: stripeWith([session(['price_s1'])]), env, fetch: luma.fn, log: silent });
  const res = await handle(signedRequest(succeeded()));
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).skipped, [{ email: 'ada@example.com' }]);
});
