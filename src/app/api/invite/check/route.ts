import { NextRequest, NextResponse } from 'next/server';
import { validateInviteCode } from '@/lib/inviteCodes';

export async function POST(req: NextRequest) {
  try {
    const { code } = (await req.json()) as { code?: string };

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const result = await validateInviteCode(code.trim());

    if (!result.valid) {
      const messages: Record<string, string> = {
        'not-found': 'This invite code was not found.',
        inactive: 'This invite code is no longer active.',
        expired: 'This invite code has expired.',
        exhausted: 'This invite code has reached its usage limit.',
      };
      return NextResponse.json({
        valid: false,
        reason: result.reason,
        message: messages[result.reason],
      });
    }

    return NextResponse.json({
      valid: true,
      label: result.code.label,
    });
  } catch (err) {
    console.error('[invite/check] Error:', err);
    return NextResponse.json({ error: 'Failed to check invite code' }, { status: 500 });
  }
}
