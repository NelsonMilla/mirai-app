import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { updateApplicationStatus } from '@/lib/applicants';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId } = (await req.json()) as { applicationId?: string };

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 });
    }

    await updateApplicationStatus(applicationId, 'Rejected');

    return NextResponse.json({ rejected: true });
  } catch (err) {
    console.error('[admin/reject] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
