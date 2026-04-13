import { NextRequest, NextResponse } from 'next/server';
import { validatePaymentToken } from '@/lib/tokens';
import { createCheckoutSession } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/checkout/cancel?error=missing', req.url));
  }

  const result = validatePaymentToken(token);

  if (!result.valid) {
    const reason = result.reason === 'Token expired' ? 'expired' : 'invalid';
    return NextResponse.redirect(new URL(`/checkout/cancel?error=${reason}`, req.url));
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.startsWith('http')
      ? process.env.NEXT_PUBLIC_BASE_URL
      : `https://${process.env.NEXT_PUBLIC_BASE_URL}`;

    const session = await createCheckoutSession({
      email: result.email,
      token,
      baseUrl,
    });

    if (!session.url) {
      return NextResponse.redirect(new URL('/checkout/cancel?error=stripe', req.url));
    }

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.redirect(new URL('/checkout/cancel?error=stripe', req.url));
  }
}
