#!/usr/bin/env node
// Fetches every So.La event for the Mirai Tech City group within the Oct 2026 residency
// window and writes new-site/citizens/data/sola-events.json — the saved copy the Today
// screen falls back to when So.La is unreachable. Run with: npm run today:snapshot
//
// Node 20+, no dependencies (global fetch).

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const GROUP = 'miraitechcity';
const START_DATE = '2026-10-01';
const END_DATE = '2026-11-01';
const API_BASE = 'https://api.sola.day/api/v1/events';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '..', 'citizens', 'data', 'sola-events.json');

// Keeps only published, normal-visibility events, strips the `owner` object (a person's
// handle we don't need), and sorts by start_time. Pure, so it's unit-testable without
// a network call.
export function pickEvents(list) {
  return list
    .filter((e) => e.status === 'published' && e.visibility === 'normal')
    .map((e) => {
      const { owner, ...rest } = e;
      return rest;
    })
    .sort((a, b) => (a.start_time < b.start_time ? -1 : a.start_time > b.start_time ? 1 : 0));
}

async function fetchAllPages() {
  const events = [];
  let page = 1;
  for (;;) {
    const url = `${API_BASE}?group_id=${GROUP}&start_date=${START_DATE}&end_date=${END_DATE}&timezone=Asia/Tokyo&limit=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`So.La API returned ${res.status} ${res.statusText} for page ${page}`);
    }
    const body = await res.json();
    if (!body || !Array.isArray(body.data)) {
      throw new Error(`So.La API returned an unexpected shape for page ${page}`);
    }
    events.push(...body.data);
    const nextPage = body.meta && body.meta.next_page;
    if (!nextPage) break;
    page = nextPage;
  }
  return events;
}

async function main() {
  const raw = await fetchAllPages();
  const events = pickEvents(raw);
  const snapshot = {
    version: 1,
    note: 'Refresh with: npm run today:snapshot. This is the saved copy of the So.La calendar the Today screen uses when So.La is unreachable.',
    group: GROUP,
    fetched_at: new Date().toISOString(),
    events,
  };
  await writeFile(OUT_PATH, JSON.stringify(snapshot, null, 1) + '\n');
  console.log(`Wrote ${events.length} events to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(`sola-snapshot failed: ${err.message}`);
  process.exitCode = 1;
});
