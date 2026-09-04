const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

interface WhitelistHit {
  found: true;
  pageId: string;
  name: string;
  email: string;
  used: boolean;
}

interface WhitelistMiss {
  found: false;
}

export type WhitelistResult = WhitelistHit | WhitelistMiss;

function getCredentials() {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_WHITELIST_DB_ID;
  if (!apiKey || !dbId) throw new Error('Missing NOTION_API_KEY or NOTION_WHITELIST_DB_ID');
  return { apiKey, dbId };
}

function isEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

async function queryNotion(apiKey: string, dbId: string, filter: Record<string, unknown>): Promise<WhitelistResult> {
  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({ filter, page_size: 1 }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion query error:', err);
    throw new Error('Failed to query whitelist');
  }

  const data = await res.json() as {
    results: Array<{
      id: string;
      properties: {
        Name?: { title: Array<{ plain_text: string }> };
        Email?: { email: string | null };
        Used?: { checkbox: boolean };
      };
    }>;
  };

  if (data.results.length === 0) return { found: false };

  const page = data.results[0];
  const props = page.properties;

  return {
    found: true,
    pageId: page.id,
    name: props.Name?.title?.[0]?.plain_text ?? '',
    email: props.Email?.email ?? '',
    used: props.Used?.checkbox ?? false,
  };
}

export async function checkWhitelist(input: string): Promise<WhitelistResult> {
  const { apiKey, dbId } = getCredentials();
  const trimmed = input.trim();

  if (!trimmed) return { found: false };

  if (isEmail(trimmed)) {
    // Email lookup — case-insensitive via Notion's email filter
    return queryNotion(apiKey, dbId, {
      property: 'Email',
      email: { equals: trimmed.toLowerCase() },
    });
  }

  // Code lookup — exact match on rich_text
  return queryNotion(apiKey, dbId, {
    property: 'Code',
    rich_text: { equals: trimmed },
  });
}

// ---------------------------------------------------------------------------
// Admin: list all whitelist entries
// ---------------------------------------------------------------------------

export interface WhitelistEntry {
  id: string;
  name: string;
  email: string;
  code: string;
  used: boolean;
  paymentStatus: string;
}

export async function listWhitelist(): Promise<WhitelistEntry[]> {
  const { apiKey, dbId } = getCredentials();

  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 100,
    }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion query error (listWhitelist):', err);
    throw new Error('Failed to list whitelist entries');
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const data = (await res.json()) as { results: any[] };
  return data.results.map((page: any) => {
    const p = page.properties;
    return {
      id: page.id,
      name: p.Name?.title?.[0]?.plain_text ?? '',
      email: p.Email?.email ?? '',
      code: p.Code?.rich_text?.[0]?.plain_text ?? '',
      used: p.Used?.checkbox ?? false,
      paymentStatus: p['Payment Status']?.select?.name ?? '',
    };
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

// ---------------------------------------------------------------------------
// Admin: add to whitelist
// ---------------------------------------------------------------------------

export async function addToWhitelist({
  name,
  email,
  code,
}: {
  name: string;
  email?: string;
  code?: string;
}): Promise<{ id: string }> {
  const { apiKey, dbId } = getCredentials();

  const generatedCode = code || Math.random().toString(36).slice(2, 8).toUpperCase();

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: name } }] },
    Code: { rich_text: [{ text: { content: generatedCode } }] },
    Used: { checkbox: false },
  };

  const trimmedEmail = email?.trim();
  if (trimmedEmail) {
    properties.Email = { email: trimmedEmail.toLowerCase() };
  }

  const res = await fetch(`${NOTION_API}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion create error (addToWhitelist):', err);
    throw new Error('Failed to add whitelist entry');
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}

// ---------------------------------------------------------------------------
// Mark invite code as used
// ---------------------------------------------------------------------------

export async function markCodeUsed(pageId: string): Promise<void> {
  const { apiKey } = getCredentials();

  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      properties: {
        Used: { checkbox: true },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Failed to mark code as used:', err);
    throw new Error('Failed to mark code as used');
  }
}

// ---------------------------------------------------------------------------
// Set email on a whitelist entry (used when redeemer fills it in at redemption)
// ---------------------------------------------------------------------------

export async function setWhitelistEmail(pageId: string, email: string): Promise<void> {
  const { apiKey } = getCredentials();

  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      properties: {
        Email: { email: email.toLowerCase() },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Failed to set whitelist email:', err);
    throw new Error('Failed to set whitelist email');
  }
}
