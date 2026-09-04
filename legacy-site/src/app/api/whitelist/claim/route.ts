import { NextRequest, NextResponse } from 'next/server';
import { checkWhitelist, markCodeUsed, setWhitelistEmail } from '@/lib/whitelist';
import { generatePaymentToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  let body: { code?: string; email?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const code = body.code?.trim();
  const email = body.email?.trim();

  if (!code) {
    return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  try {
    const result = await checkWhitelist(code);

    if (!result.found) {
      return NextResponse.json({ error: 'Invite code not found' }, { status: 404 });
    }

    if (result.used) {
      return NextResponse.json(
        { error: 'This invite code has already been used' },
        { status: 400 },
      );
    }

    const lowered = email.toLowerCase();

    // Save the email the user provided so their record is complete.
    await setWhitelistEmail(result.pageId, lowered);
    await markCodeUsed(result.pageId);

    const token = generatePaymentToken(lowered);
    return NextResponse.json({
      success: true,
      redirectUrl: `/checkout?token=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    console.error('Whitelist claim error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
