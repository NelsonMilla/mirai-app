// ---------------------------------------------------------------------------
// Events data — fetched from the Notion "Mirai Events" database
// ---------------------------------------------------------------------------

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

export interface MiraiEvent {
  id: string;
  title: string;
  date: string;       // ISO date: "2026-10-03"
  time: string;       // e.g. "18:00 JST"
  description: string;
  location: string;
  type: string;       // Meetup, Ceremony, Demo Day, Social, Workshop, Other
  link?: string;
}

function getCredentials() {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_EVENTS_DB_ID;
  if (!apiKey || !dbId) throw new Error('Missing NOTION_API_KEY or NOTION_EVENTS_DB_ID');
  return { apiKey, dbId };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseEvent(page: any): MiraiEvent {
  const p = page.properties;
  return {
    id: page.id,
    title: p.Title?.title?.[0]?.plain_text ?? '',
    date: p.Date?.date?.start ?? '',
    time: p.Time?.rich_text?.[0]?.plain_text ?? '',
    description: p.Description?.rich_text?.[0]?.plain_text ?? '',
    location: p.Location?.rich_text?.[0]?.plain_text ?? '',
    type: p.Type?.select?.name ?? '',
    link: p.Link?.url ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function fetchEvents(filter?: Record<string, unknown>): Promise<MiraiEvent[]> {
  const { apiKey, dbId } = getCredentials();

  const body: Record<string, unknown> = {
    sorts: [{ property: 'Date', direction: 'ascending' }],
    page_size: 100,
    // Only fetch published events
    filter: filter
      ? { and: [{ property: 'Published', checkbox: { equals: true } }, filter] }
      : { property: 'Published', checkbox: { equals: true } },
  };

  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion query error (events):', err);
    throw new Error('Failed to fetch events from Notion');
  }

  const data = (await res.json()) as { results: any[] };
  return data.results.map(parseEvent);
}

export async function getUpcomingEvents(): Promise<MiraiEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  return fetchEvents({
    property: 'Date',
    date: { on_or_after: today },
  });
}

export async function getAllEvents(): Promise<MiraiEvent[]> {
  return fetchEvents();
}
