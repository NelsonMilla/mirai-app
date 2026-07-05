'use server';

import { getPostHogClient } from '@/lib/posthog-server';

interface ShowcaseData {
  company: string;
  contactName: string;
  email: string;
  role: string;
  showcase: string;
  stage: string;
  regulatory: string;
  link: string;
  goToMarketJapan: string;
  ticketStatus: string;
}

interface SubmitResult {
  success: boolean;
  message: string;
}

export async function submitShowcase(
  _prev: SubmitResult | null,
  formData: FormData
): Promise<SubmitResult> {
  const data: ShowcaseData = {
    company: (formData.get('company') as string || '').trim(),
    contactName: (formData.get('contactName') as string || '').trim(),
    email: (formData.get('email') as string || '').trim(),
    role: (formData.get('role') as string || '').trim(),
    showcase: (formData.get('showcase') as string || '').trim(),
    stage: formData.get('stage') as string || '',
    regulatory: (formData.get('regulatory') as string || '').trim(),
    link: (formData.get('link') as string || '').trim(),
    goToMarketJapan: formData.get('goToMarketJapan') as string || '',
    ticketStatus: formData.get('ticketStatus') as string || '',
  };

  // Validate required fields
  if (
    !data.company ||
    !data.contactName ||
    !data.email ||
    !data.role ||
    !data.showcase ||
    !data.stage ||
    !data.goToMarketJapan ||
    !data.ticketStatus
  ) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    const notionApiKey = process.env.NOTION_API_KEY;
    const notionDbId = process.env.NOTION_SHOWCASE_DB_ID;

    if (!notionApiKey || !notionDbId) {
      console.error('Missing Notion credentials (NOTION_API_KEY or NOTION_SHOWCASE_DB_ID)');
      return { success: false, message: 'Showcase applications are being set up. Please try again later.' };
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: notionDbId },
        properties: {
          'Company': {
            title: [{ text: { content: data.company } }],
          },
          'Contact Name': {
            rich_text: [{ text: { content: data.contactName } }],
          },
          'Email': {
            email: data.email,
          },
          'Role': {
            rich_text: [{ text: { content: data.role } }],
          },
          'Showcase': {
            rich_text: [{ text: { content: data.showcase } }],
          },
          'Stage': {
            select: { name: data.stage },
          },
          'Regulatory Status': {
            rich_text: [{ text: { content: data.regulatory || '' } }],
          },
          'Link': {
            url: data.link || null,
          },
          'Go To Market Japan': {
            select: { name: data.goToMarketJapan },
          },
          'Ticket Status': {
            select: { name: data.ticketStatus },
          },
          'Status': {
            select: { name: 'New' },
          },
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Notion API error (submitShowcase):', err);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }

    const posthog = getPostHogClient();
    posthog.identify({ distinctId: data.email, properties: { name: data.contactName, company: data.company } });
    posthog.capture({
      distinctId: data.email,
      event: 'showcase_submitted',
      properties: {
        company: data.company,
        stage: data.stage,
        go_to_market_japan: data.goToMarketJapan,
        ticket_status: data.ticketStatus,
        has_link: !!data.link,
      },
    });
    await posthog.shutdown();

    return { success: true, message: 'Showcase application submitted!' };
  } catch (error) {
    console.error('Showcase submit error:', error);
    try {
      const posthog = getPostHogClient();
      posthog.capture({ distinctId: 'anonymous', event: 'showcase_submission_failed', properties: { reason: 'server_error' } });
      await posthog.shutdown();
    } catch { /* ignore posthog errors */ }
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
