import { NextRequest, NextResponse } from 'next/server';
import { verifyLoginCode, setSessionCookie, isAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = (await req.json()) as { email?: string; code?: string };

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
    }

    const valid = verifyLoginCode(email, code);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
    }

    await setSessionCookie(email);

    return NextResponse.json({
      verified: true,
      isAdmin: isAdmin(email),
    });
  } catch (err) {
    console.error('[verify-code] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
