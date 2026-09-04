import { NextRequest, NextResponse } from 'next/server';
import { generateLoginCode } from '@/lib/auth';
import { checkLoginCodeRateLimit, sendLoginCode } from '@/lib/email';
import { getPostHogClient } from '@/lib/posthog-server';

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const rateCheck = checkLoginCodeRateLimit(email);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${rateCheck.retryAfterMinutes} minutes.` },
        { status: 429 },
      );
    }

    const code = generateLoginCode(email);
    const result = await sendLoginCode({ to: email, code });

    if (!result.success) {
      console.error('[send-code] Email send failed:', result.error);
      return NextResponse.json({ error: 'Failed to send code' }, { status: 500 });
    }

    const posthog = getPostHogClient();
    posthog.capture({ distinctId: email, event: 'login_code_requested' });
    await posthog.shutdown();

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error('[send-code] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
