import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogFromEnv, lumaPayload, ticketTypesFor } from '../lib/fulfil.js';

const env = {
  STRIPE_PRICE_SUMMIT_1: 'price_s1',
  STRIPE_PRICE_SUMMIT_2: 'price_s2',
  STRIPE_PRICE_EVERYTHING: 'price_all',
  LUMA_TICKET_SUMMIT_1: 'ttyp-s1',
  LUMA_TICKET_SUMMIT_2: 'ttyp-s2',
  LUMA_TICKET_EVERYTHING: 'ttyp-all',
};
const catalog = catalogFromEnv(env);
const item = (priceId) => ({ price: { id: priceId }, quantity: 1 });

test('a known price maps to its Luma ticket type; an unknown one is reported', () => {
  const { tickets, unknown } = ticketTypesFor([item('price_s1'), item('price_sponsor')], catalog);
  assert.deepEqual(tickets, [{ key: 'summit_1', event_ticket_type_id: 'ttyp-s1' }]);
  assert.deepEqual(unknown, ['price_sponsor']);
});

test('a SKU with a missing env var is left out of the catalog rather than mis-mapped', () => {
  const partial = catalogFromEnv({ ...env, LUMA_TICKET_EVERYTHING: undefined });
  assert.equal(partial.price_all, undefined);
  assert.equal(partial.price_s1.lumaTicketTypeId, 'ttyp-s1');
});

test('the Luma payload carries the buyer email and name, every guest approved', () => {
  const session = { id: 'cs_1', customer_details: { email: 'ada@example.com', name: 'Ada' } };
  const payload = lumaPayload({ session, lineItems: [item('price_all')], catalog, eventId: 'evt-1' });
  assert.deepEqual(payload, {
    event_id: 'evt-1',
    guests: [{ email: 'ada@example.com', name: 'Ada' }],
    tickets: [{ event_ticket_type_id: 'ttyp-all' }],
    approval_status: 'approved',
    send_email: true,
  });
});

test('a missing name still yields a valid guest', () => {
  const session = { id: 'cs_2', customer_details: { email: 'x@example.com' } };
  const payload = lumaPayload({ session, lineItems: [item('price_s2')], catalog, eventId: 'evt-1' });
  assert.deepEqual(payload.guests, [{ email: 'x@example.com', name: null }]);
});

test('a session with no Mirai ticket yields no payload', () => {
  const session = { id: 'cs_3', customer_details: { email: 'sponsor@example.com' } };
  assert.equal(lumaPayload({ session, lineItems: [item('price_sponsor')], catalog, eventId: 'evt-1' }), null);
});

test('a Mirai ticket without a buyer email is an error, not a silent skip', () => {
  const session = { id: 'cs_4', customer_details: {} };
  assert.throws(() => lumaPayload({ session, lineItems: [item('price_s1')], catalog, eventId: 'evt-1' }), /no customer email/);
});
