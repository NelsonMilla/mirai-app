import { NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { listApplications } from '@/lib/applicants';

export async function GET() {
  const session = await getSession();
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const applications = await listApplications();
    return NextResponse.json({ applications });
  } catch (err) {
    console.error('[admin/applications] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
