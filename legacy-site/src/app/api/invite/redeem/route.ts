import { NextRequest, NextResponse } from 'next/server';
import {
  validateInviteCode,
  recordRedemption,
  createInviteApplication,
} from '@/lib/inviteCodes';
import { generatePaymentToken } from '@/lib/tokens';

const VALID_PROFILES = new Set(['Entrepreneur', 'Academic', 'Artist', 'Investor', 'Operator', 'Student', 'Other']);

export async function POST(req: NextRequest) {
  try {
    const { code, name, email, telegram, profile } = (await req.json()) as {
      code?: string;
      name?: string;
      email?: string;
      telegram?: string;
      profile?: string;
    };

    if (!code || !name || !email || !telegram || !profile) {
      return NextResponse.json(
        { error: 'code, name, email, telegram, and profile are required' },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!VALID_PROFILES.has(profile)) {
      return NextResponse.json({ error: 'Invalid profile' }, { status: 400 });
    }

    // 1. Re-validate code (may have just expired / been exhausted)
    const validation = await validateInviteCode(code);
    if (!validation.valid) {
      return NextResponse.json({
        error: 'This invite code is no longer valid.',
        reason: validation.reason,
      }, { status: 400 });
    }

    // 2. Create pre-approved Application row
    await createInviteApplication({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      telegram: telegram.trim(),
      profile,
      inviteCode: code.trim(),
    });

    // 3. Record the redemption on the invite code row
    //    (best-effort — if this fails the application still exists)
    try {
      await recordRedemption(validation.code, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
    } catch (err) {
      console.error('[invite/redeem] recordRedemption failed:', err);
    }

    // 4. Generate payment token + URL
    const token = generatePaymentToken(email.trim().toLowerCase());
    const rawBase = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://miraitech.city';
    const baseUrl = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`;
    const paymentUrl = `${baseUrl}/checkout?token=${token}`;

    return NextResponse.json({ success: true, paymentUrl });
  } catch (err) {
    console.error('[invite/redeem] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
