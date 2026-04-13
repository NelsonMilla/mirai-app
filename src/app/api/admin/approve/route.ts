import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { updateApplicationStatus } from '@/lib/applicants';
import { generatePaymentToken } from '@/lib/tokens';
import { sendApprovalEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, email, name } = (await req.json()) as {
      applicationId?: string;
      email?: string;
      name?: string;
    };

    if (!applicationId || !email || !name) {
      return NextResponse.json(
        { error: 'applicationId, email, and name are required' },
        { status: 400 },
      );
    }

    // 1. Update status in Notion
    await updateApplicationStatus(applicationId, 'Approved');

    // 2. Generate payment token + URL
    const token = generatePaymentToken(email);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mirai.city';
    const paymentUrl = `${baseUrl}/checkout?token=${token}`;

    // 3. Send approval email with payment link
    const emailResult = await sendApprovalEmail({ to: email, name, paymentUrl });
    if (!emailResult.success) {
      console.error('[admin/approve] Email failed but status updated:', emailResult.error);
      return NextResponse.json({
        approved: true,
        emailSent: false,
        error: 'Approved but email failed to send',
      });
    }

    return NextResponse.json({ approved: true, emailSent: true });
  } catch (err) {
    console.error('[admin/approve] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
