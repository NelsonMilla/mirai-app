import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { markApplicationPaid } from '@/lib/applicants';
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
    const email = session.customer_email ?? session.customer_details?.email ?? null;
    const name = session.customer_details?.name ?? '';

    console.log(`Payment completed: email=${email}, session=${session.id}`);

    if (email) {
      // Critical: ensure Applications has a Paid row for this email.
      // Returning 500 lets Stripe retry on transient Notion failures.
      try {
        await markApplicationPaid({ email, stripeSessionId: session.id, name });
      } catch (err) {
        console.error('Failed to mark application as Paid:', err);
        return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
      }

      // Confirmation email — fire-and-forget
      try {
        await sendPaymentConfirmation({ to: email });
      } catch (err) {
        console.error('Failed to send payment confirmation email:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
