import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickEvents } from '../scripts/sola-snapshot.mjs';

const owner = { id: 'u1', name: 'nelson-m' };

const fixture = [
  { id: 'b', title: 'Second', start_time: '2026-10-05T00:00:00Z', status: 'published', visibility: 'normal', owner },
  { id: 'a', title: 'First', start_time: '2026-10-01T00:00:00Z', status: 'published', visibility: 'normal', owner },
  { id: 'c', title: 'Draft', start_time: '2026-10-02T00:00:00Z', status: 'draft', visibility: 'normal', owner },
  { id: 'd', title: 'Private', start_time: '2026-10-03T00:00:00Z', status: 'published', visibility: 'private', owner },
];

test('keeps only published, normal-visibility events', () => {
  const result = pickEvents(fixture);
  assert.deepEqual(result.map((e) => e.id), ['a', 'b']);
});

test('sorts by start_time', () => {
  const result = pickEvents(fixture);
  assert.equal(result[0].id, 'a');
  assert.equal(result[1].id, 'b');
});

test('strips the owner object but keeps everything else', () => {
  const [first] = pickEvents(fixture);
  assert.equal(first.owner, undefined);
  assert.equal(first.title, 'First');
  assert.equal(first.start_time, '2026-10-01T00:00:00Z');
});
