// ---------------------------------------------------------------------------
// Applicant queries — reads/writes to the Notion Applications database
// ---------------------------------------------------------------------------

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function getCredentials() {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_APPLICATIONS_DB_ID;
  if (!apiKey || !dbId) throw new Error('Missing NOTION_API_KEY or NOTION_APPLICATIONS_DB_ID');
  return { apiKey, dbId };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ApplicationStatus = 'New' | 'Approved' | 'Rejected' | 'Paid';

export interface Application {
  id: string;           // Notion page ID
  name: string;
  email: string;
  profile: string;
  about: string;
  track: string;
  status: ApplicationStatus;
  createdAt: string;    // ISO timestamp
  link: string | null;
  telegram: string;
  country: string;
  goals: string[];
}

// ---------------------------------------------------------------------------
// Notion property extractors
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text ?? '';
}

function extractEmail(prop: any): string {
  return prop?.email ?? '';
}

function extractRichText(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? '';
}

function extractSelect(prop: any): string {
  return prop?.select?.name ?? '';
}

function extractMultiSelect(prop: any): string[] {
  return (prop?.multi_select ?? []).map((s: any) => s.name);
}

function extractUrl(prop: any): string | null {
  return prop?.url ?? null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function parseApplication(page: any): Application {
  const props = page.properties;
  return {
    id: page.id,
    name: extractTitle(props['Name']),
    email: extractEmail(props['Email']),
    profile: extractSelect(props['Profile']),
    about: extractRichText(props['About']),
    track: extractSelect(props['Track']),
    status: (extractSelect(props['Status']) || 'New') as ApplicationStatus,
    createdAt: page.created_time,
    link: extractUrl(props['Link']),
    telegram: extractRichText(props['Telegram']),
    country: extractSelect(props['Country']),
    goals: extractMultiSelect(props['Goals']),
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function listApplications(
  statusFilter?: ApplicationStatus | ApplicationStatus[],
): Promise<Application[]> {
  const { apiKey, dbId } = getCredentials();

  const filters = statusFilter
    ? Array.isArray(statusFilter)
      ? {
          or: statusFilter.map((s) => ({
            property: 'Status',
            select: { equals: s },
          })),
        }
      : { property: 'Status', select: { equals: statusFilter } }
    : undefined;

  const body: Record<string, unknown> = {
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: 100,
  };
  if (filters) body.filter = filters;

  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 }, // always fresh
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion query error (listApplications):', err);
    throw new Error('Failed to fetch applications from Notion');
  }

  const data = (await res.json()) as { results: any[] };
  return data.results.map(parseApplication);
}

/**
 * Find an application by email and update its status.
 * Used by the Stripe webhook to mark applications as "Paid".
 */
export async function updateApplicationStatusByEmail(
  email: string,
  status: ApplicationStatus,
): Promise<void> {
  const { apiKey, dbId } = getCredentials();

  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      filter: { property: 'Email', email: { equals: email.toLowerCase() } },
      page_size: 1,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion query error (updateApplicationStatusByEmail):', err);
    throw new Error('Failed to find application by email');
  }

  const data = (await res.json()) as { results: Array<{ id: string }> };
  if (data.results.length === 0) {
    // No application found — user may have come through whitelist only
    return;
  }

  await updateApplicationStatus(data.results[0].id, status);
}

export async function updateApplicationStatus(
  pageId: string,
  status: ApplicationStatus,
): Promise<void> {
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
        Status: { select: { name: status } },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion update error (updateApplicationStatus):', err);
    throw new Error(`Failed to update application status to ${status}`);
  }
}
