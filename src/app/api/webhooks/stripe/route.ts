import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { markPaid } from '@/lib/payments';
import { updateApplicationStatusByEmail } from '@/lib/applicants';
import { sendPaymentConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const token = session.client_reference_id;
    const email = session.customer_email;

    console.log(`Payment completed: email=${email}, token=${token?.slice(0, 20)}...`);

    if (email && token) {
      // Critical: record payment in Notion. Return 500 on failure so Stripe retries.
      try {
        await markPaid(email, session.id, token);
      } catch (err) {
        console.error('Failed to record payment in whitelist:', err);
        return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
      }

      // Update applications DB — best-effort (user may have come through whitelist only)
      try {
        await updateApplicationStatusByEmail(email, 'Paid');
      } catch (err) {
        console.error('Failed to update application status to Paid:', err);
      }
    }

    // Confirmation email — fire-and-forget (not worth failing the webhook over)
    if (email) {
      try {
        await sendPaymentConfirmation({ to: email });
      } catch (err) {
        console.error('Failed to send payment confirmation email:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
