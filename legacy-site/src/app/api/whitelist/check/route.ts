import { NextRequest, NextResponse } from 'next/server';
import { checkWhitelist, markCodeUsed } from '@/lib/whitelist';
import { generatePaymentToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  let body: { email?: string; code?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const input = (body.email ?? body.code ?? '').trim();

  if (!input) {
    return NextResponse.json(
      { error: 'Provide an email address or invite code' },
      { status: 400 }
    );
  }

  try {
    const result = await checkWhitelist(input);

    if (!result.found) {
      return NextResponse.json({ whitelisted: false });
    }

    // If the entry is already used, reject (applies to both email and code lookups)
    if (result.used) {
      return NextResponse.json(
        { whitelisted: false, reason: body.code ? 'This invite code has already been used' : 'This email has already been used to register' },
        { status: 200 }
      );
    }

    // Code has no email on file — collect it from the user before checkout.
    // Don't mark as used yet; that happens when they submit their email.
    if (!result.email) {
      return NextResponse.json({
        whitelisted: true,
        needsEmail: true,
        name: result.name,
      });
    }

    // Mark entry as used
    await markCodeUsed(result.pageId);

    const token = generatePaymentToken(result.email);

    return NextResponse.json({
      whitelisted: true,
      name: result.name,
      redirectUrl: `/checkout?token=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    console.error('Whitelist check error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
