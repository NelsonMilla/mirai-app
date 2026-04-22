import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { updateInviteCode, deleteInviteCode } from '@/lib/inviteCodes';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { maxUses, expiresAt, label, active } = (await req.json()) as {
      maxUses?: number | null;
      expiresAt?: string | null;
      label?: string;
      active?: boolean;
    };

    await updateInviteCode(id, { maxUses, expiresAt, label, active });
    return NextResponse.json({ updated: true });
  } catch (err) {
    console.error('[admin/invite-codes/[id]] PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update invite code' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteInviteCode(id);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error('[admin/invite-codes/[id]] DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete invite code' }, { status: 500 });
  }
}
