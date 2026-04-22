'use server';

import { sendApplicationReceivedEmail } from '@/lib/email';

interface ApplicationData {
  profile: string;
  name: string;
  email: string;
  telegram: string;
  country: string;
  link: string;
  about: string;
  stage: string;
  goals: string[];
  commitment: string;
  commitmentDates: string;
  promoCode: string;
  referral: string;
  anything: string;
}

interface SubmitResult {
  success: boolean;
  message: string;
}

export async function submitApplication(
  _prev: SubmitResult | null,
  formData: FormData
): Promise<SubmitResult> {
  const data: ApplicationData = {
    profile: formData.get('profile') as string,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    telegram: formData.get('telegram') as string,
    country: formData.get('country') as string,
    link: formData.get('link') as string,
    about: formData.get('about') as string,
    stage: formData.get('stage') as string || '',
    goals: formData.getAll('goals') as string[],
    commitment: formData.get('commitment') as string,
    commitmentDates: formData.get('commitmentDates') as string,
    promoCode: formData.get('promoCode') as string,
    referral: formData.get('referral') as string,
    anything: formData.get('anything') as string,
  };

  // Validate required fields
  if (!data.profile || !data.name || !data.email || !data.telegram || !data.country || !data.about || !data.commitment) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  if (data.goals.length === 0) {
    return { success: false, message: 'Please select at least one goal.' };
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    const notionApiKey = process.env.NOTION_API_KEY;
    const notionDbId = process.env.NOTION_APPLICATIONS_DB_ID;

    if (!notionApiKey || !notionDbId) {
      console.error('Missing Notion credentials');
      return { success: false, message: 'Application system is being set up. Please try again later.' };
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
          'Name': {
            title: [{ text: { content: data.name } }],
          },
          'Email': {
            email: data.email,
          },
          'Telegram': {
            rich_text: [{ text: { content: data.telegram } }],
          },
          'Country': {
            select: { name: data.country },
          },
          'Profile': {
            select: { name: data.profile },
          },
          'Link': {
            url: data.link || null,
          },
          'About': {
            rich_text: [{ text: { content: data.about } }],
          },
          ...(data.stage ? {
            'Stage': {
              select: { name: data.stage },
            },
          } : {}),
          'Goals': {
            multi_select: data.goals.map((g) => ({ name: g })),
          },
          'Commitment': {
            select: { name: data.commitment },
          },
          'Commitment Dates': {
            rich_text: [{ text: { content: data.commitmentDates || '' } }],
          },
          'Promo Code': {
            rich_text: [{ text: { content: data.promoCode || '' } }],
          },
          'Referral': {
            rich_text: [{ text: { content: data.referral || '' } }],
          },
          'Notes': {
            rich_text: [{ text: { content: data.anything || '' } }],
          },
          'Track': {
            select: { name: 'Builder' },
          },
          'Status': {
            select: { name: 'New' },
          },
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Notion API error:', err);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }

    // Fire-and-forget confirmation email — don't fail the submission if it errors
    const emailResult = await sendApplicationReceivedEmail({ to: data.email, name: data.name });
    if (!emailResult.success) {
      console.error('[apply] Confirmation email failed:', emailResult.error);
    }

    return { success: true, message: 'Application submitted! We\'ll be in touch soon.' };
  } catch (error) {
    console.error('Submit error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function joinMailingList(
  _prev: SubmitResult | null,
  formData: FormData
): Promise<SubmitResult> {
  const email = formData.get('email') as string;
  const track = formData.get('track') as string || 'General';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_GROUP_ID;

    if (!apiKey) {
      console.error('Missing MAILERLITE_API_KEY');
      return { success: false, message: 'Mailing list is being set up. Please try again later.' };
    }

    const body: Record<string, unknown> = {
      email,
      fields: {
        track_interest: track,
      },
    };

    if (groupId) {
      body.groups = [groupId];
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('MailerLite error:', err);

      if (response.status === 422) {
        return { success: false, message: 'This email is already on the list or is invalid.' };
      }

      return { success: false, message: 'Something went wrong. Please try again.' };
    }

    return { success: true, message: 'You\'re on the list! We\'ll notify you when applications open.' };
  } catch (error) {
    console.error('Mailing list error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
