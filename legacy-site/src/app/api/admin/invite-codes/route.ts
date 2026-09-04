import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { listInviteCodes, createInviteCode } from '@/lib/inviteCodes';

export async function GET() {
  const session = await getSession();
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const codes = await listInviteCodes();
    return NextResponse.json({ codes });
  } catch (err) {
    console.error('[admin/invite-codes] GET error:', err);
    return NextResponse.json({ error: 'Failed to list invite codes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { code, maxUses, expiresAt, label, active } = (await req.json()) as {
      code?: string;
      maxUses?: number | null;
      expiresAt?: string | null;
      label?: string;
      active?: boolean;
    };

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'code is required' }, { status: 400 });
    }

    const result = await createInviteCode({
      code: code.trim(),
      maxUses: maxUses ?? null,
      expiresAt: expiresAt ?? null,
      label: label ?? '',
      active: active ?? true,
    });

    return NextResponse.json({ created: true, id: result.id });
  } catch (err) {
    console.error('[admin/invite-codes] POST error:', err);
    return NextResponse.json({ error: 'Failed to create invite code' }, { status: 500 });
  }
}
