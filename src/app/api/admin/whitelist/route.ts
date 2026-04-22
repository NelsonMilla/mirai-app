import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { listWhitelist, addToWhitelist } from '@/lib/whitelist';

export async function GET() {
  const session = await getSession();
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entries = await listWhitelist();
    return NextResponse.json({ entries });
  } catch (err) {
    console.error('[admin/whitelist] GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch whitelist' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, code } = (await req.json()) as {
      name?: string;
      email?: string;
      code?: string;
    };

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const trimmedEmail = email?.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const result = await addToWhitelist({ name, email: trimmedEmail, code });
    return NextResponse.json({ added: true, id: result.id });
  } catch (err) {
    console.error('[admin/whitelist] POST error:', err);
    return NextResponse.json({ error: 'Failed to add whitelist entry' }, { status: 500 });
  }
}
