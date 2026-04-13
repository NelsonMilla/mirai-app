import { createHash } from 'crypto';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function getCredentials() {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_WHITELIST_DB_ID;
  if (!apiKey || !dbId) throw new Error('Missing NOTION_API_KEY or NOTION_WHITELIST_DB_ID');
  return { apiKey, dbId };
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Find the whitelist entry by email and update it with payment details.
 * Called from the Stripe webhook after checkout.session.completed.
 */
export async function markPaid(email: string, stripeSessionId: string, token: string): Promise<void> {
  const { apiKey, dbId } = getCredentials();

  // 1. Find the whitelist entry by email
  const queryRes = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      filter: { property: 'Email', email: { equals: email.toLowerCase() } },
      page_size: 1,
    }),
  });

  if (!queryRes.ok) {
    const err = await queryRes.text();
    console.error('Notion query error (markPaid):', err);
    throw new Error('Failed to find whitelist entry for payment update');
  }

  const data = await queryRes.json() as { results: Array<{ id: string }> };

  if (data.results.length === 0) {
    console.error(`No whitelist entry found for email: ${email}`);
    throw new Error('Whitelist entry not found');
  }

  const pageId = data.results[0].id;

  // 2. Update the entry with payment details
  const updateRes = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      properties: {
        Used: { checkbox: true },
        'Payment Status': { select: { name: 'Paid' } },
        'Stripe Session ID': { rich_text: [{ text: { content: stripeSessionId } }] },
        'Token Hash': { rich_text: [{ text: { content: hashToken(token) } }] },
        'Paid At': { date: { start: new Date().toISOString() } },
      },
    }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error('Notion update error (markPaid):', err);
    throw new Error('Failed to update payment status in Notion');
  }

  console.log(`Payment recorded: email=${email}, session=${stripeSessionId}`);
}
