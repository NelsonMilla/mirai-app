// ---------------------------------------------------------------------------
// Invitation Codes — multi-use codes with expiration + usage limits.
// Separate from the single-use whitelist (src/lib/whitelist.ts).
// ---------------------------------------------------------------------------

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function getCredentials() {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_INVITE_CODES_DB_ID;
  if (!apiKey || !dbId) throw new Error('Missing NOTION_API_KEY or NOTION_INVITE_CODES_DB_ID');
  return { apiKey, dbId };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InviteCode {
  id: string;          // Notion page ID
  code: string;
  maxUses: number | null;
  usesCount: number;
  expiresAt: string | null;  // ISO date (YYYY-MM-DD) or null
  active: boolean;
  label: string;
  usedBy: string;      // accumulated log, newline-separated
  createdAt: string;
}

export type ValidateResult =
  | { valid: true; code: InviteCode }
  | { valid: false; reason: 'not-found' | 'inactive' | 'expired' | 'exhausted' };

// ---------------------------------------------------------------------------
// Notion property extractors
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseCode(page: any): InviteCode {
  const p = page.properties;
  return {
    id: page.id,
    code: p.Code?.title?.[0]?.plain_text ?? '',
    maxUses: typeof p['Max Uses']?.number === 'number' ? p['Max Uses'].number : null,
    usesCount: p['Uses Count']?.number ?? 0,
    expiresAt: p['Expires At']?.date?.start ?? null,
    active: p.Active?.checkbox ?? false,
    label: p.Label?.rich_text?.[0]?.plain_text ?? '',
    usedBy: p['Used By']?.rich_text?.map((t: any) => t.plain_text).join('') ?? '',
    createdAt: page.created_time,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Validate + find by code string
// ---------------------------------------------------------------------------

export async function findInviteCode(code: string): Promise<InviteCode | null> {
  const { apiKey, dbId } = getCredentials();
  const trimmed = code.trim();
  if (!trimmed) return null;

  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      filter: { property: 'Code', title: { equals: trimmed } },
      page_size: 1,
    }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion query error (findInviteCode):', err);
    throw new Error('Failed to query invite codes');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { results: any[] };
  if (data.results.length === 0) return null;
  return parseCode(data.results[0]);
}

export async function validateInviteCode(code: string): Promise<ValidateResult> {
  const found = await findInviteCode(code);
  if (!found) return { valid: false, reason: 'not-found' };
  if (!found.active) return { valid: false, reason: 'inactive' };

  if (found.expiresAt) {
    // Treat expiration as end-of-day in UTC for simplicity
    const expiryMs = new Date(`${found.expiresAt}T23:59:59Z`).getTime();
    if (Date.now() > expiryMs) return { valid: false, reason: 'expired' };
  }

  if (found.maxUses !== null && found.usesCount >= found.maxUses) {
    return { valid: false, reason: 'exhausted' };
  }

  return { valid: true, code: found };
}

// ---------------------------------------------------------------------------
// Admin list / create / update / delete
// ---------------------------------------------------------------------------

export async function listInviteCodes(): Promise<InviteCode[]> {
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
    console.error('Notion query error (listInviteCodes):', err);
    throw new Error('Failed to list invite codes');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { results: any[] };
  return data.results.map(parseCode);
}

export interface CreateInviteCodeParams {
  code: string;
  maxUses?: number | null;
  expiresAt?: string | null;  // YYYY-MM-DD
  label?: string;
  active?: boolean;
}

export async function createInviteCode(params: CreateInviteCodeParams): Promise<{ id: string }> {
  const { apiKey, dbId } = getCredentials();

  const properties: Record<string, unknown> = {
    Code: { title: [{ text: { content: params.code.trim() } }] },
    Active: { checkbox: params.active ?? true },
    'Uses Count': { number: 0 },
  };

  if (params.maxUses !== undefined && params.maxUses !== null) {
    properties['Max Uses'] = { number: params.maxUses };
  }
  if (params.expiresAt) {
    properties['Expires At'] = { date: { start: params.expiresAt } };
  }
  if (params.label !== undefined) {
    properties.Label = { rich_text: [{ text: { content: params.label } }] };
  }

  const res = await fetch(`${NOTION_API}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion create error (createInviteCode):', err);
    throw new Error('Failed to create invite code');
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}

export interface UpdateInviteCodeParams {
  maxUses?: number | null;
  expiresAt?: string | null;
  label?: string;
  active?: boolean;
}

export async function updateInviteCode(id: string, updates: UpdateInviteCodeParams): Promise<void> {
  const { apiKey } = getCredentials();

  const properties: Record<string, unknown> = {};
  if (updates.maxUses !== undefined) {
    properties['Max Uses'] = updates.maxUses === null ? { number: null } : { number: updates.maxUses };
  }
  if (updates.expiresAt !== undefined) {
    properties['Expires At'] = updates.expiresAt === null ? { date: null } : { date: { start: updates.expiresAt } };
  }
  if (updates.label !== undefined) {
    properties.Label = { rich_text: [{ text: { content: updates.label } }] };
  }
  if (updates.active !== undefined) {
    properties.Active = { checkbox: updates.active };
  }

  if (Object.keys(properties).length === 0) return;

  const res = await fetch(`${NOTION_API}/pages/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({ properties }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion update error (updateInviteCode):', err);
    throw new Error('Failed to update invite code');
  }
}

export async function deleteInviteCode(id: string): Promise<void> {
  const { apiKey } = getCredentials();

  // Notion "delete" is archive
  const res = await fetch(`${NOTION_API}/pages/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({ archived: true }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion archive error (deleteInviteCode):', err);
    throw new Error('Failed to delete invite code');
  }
}

// ---------------------------------------------------------------------------
// Redemption — atomic-ish update: increment Uses Count + append to Used By
// ---------------------------------------------------------------------------

export async function recordRedemption(
  codePage: InviteCode,
  redeemer: { name: string; email: string },
): Promise<void> {
  const { apiKey } = getCredentials();

  const stamp = new Date().toISOString().slice(0, 10);
  const line = `${redeemer.email} · ${stamp} · ${redeemer.name}`;
  const newUsedBy = codePage.usedBy ? `${codePage.usedBy}\n${line}` : line;

  // Notion rich_text has a 2000-char limit per text block. Chunk if needed.
  const chunks: string[] = [];
  for (let i = 0; i < newUsedBy.length; i += 1900) {
    chunks.push(newUsedBy.slice(i, i + 1900));
  }

  const res = await fetch(`${NOTION_API}/pages/${codePage.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      properties: {
        'Uses Count': { number: codePage.usesCount + 1 },
        'Used By': {
          rich_text: chunks.map((c) => ({ text: { content: c } })),
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion update error (recordRedemption):', err);
    throw new Error('Failed to record invite code redemption');
  }
}

// ---------------------------------------------------------------------------
// Create a pre-approved Application row for an invite-code redeemer
// ---------------------------------------------------------------------------

export interface InviteApplicantInput {
  name: string;
  email: string;
  telegram: string;
  profile: string;
  inviteCode: string;
}

export async function createInviteApplication(input: InviteApplicantInput): Promise<{ id: string }> {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_APPLICATIONS_DB_ID;
  if (!apiKey || !dbId) throw new Error('Missing NOTION_API_KEY or NOTION_APPLICATIONS_DB_ID');

  const res = await fetch(`${NOTION_API}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: input.name } }] },
        Email: { email: input.email.toLowerCase() },
        Telegram: { rich_text: [{ text: { content: input.telegram } }] },
        Profile: { select: { name: input.profile } },
        Track: { select: { name: input.profile } },
        Status: { select: { name: 'Approved' } },
        'Promo Code': { rich_text: [{ text: { content: input.inviteCode } }] },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion create error (createInviteApplication):', err);
    throw new Error('Failed to create application row');
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}
