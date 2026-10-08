import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Evaluate the classic scripts the way the page does: globals on a stub window.
const load = (file, w = {}) => {
  vm.runInNewContext(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { window: w, console });
  return w;
};
// vm objects come from another realm; clone so deepStrictEqual compares plain values.
const plain = (fn) => (...a) => JSON.parse(JSON.stringify(fn(...a)));
// agenda.js takes its parser from sheet.js, which the page loads first.
const api = load('agenda.js', load('sheet.js')).MiraiAgenda;
const [parseCsv, rowsFromCsv, buildModel] = [api.parseCsv, api.rowsFromCsv, api.buildModel].map(plain);
const model = (csv) => buildModel(rowsFromCsv(csv));
const HEAD = 'Block,Date,Block title,Title,Subtitle,Link,Publish\n';

test('quoted fields keep commas, newlines and doubled quotes', () => {
  assert.deepEqual(
    parseCsv('a,"b, c","line 1\nline 2","say ""hi"""\n'),
    [['a', 'b, c', 'line 1\nline 2', 'say "hi"']],
  );
});

test('CRLF line endings, a BOM and blank lines are handled', () => {
  const rows = rowsFromCsv('﻿Block,Title\r\nSummit I,One\r\n\r\nSummit I,Two\r\n');
  assert.deepEqual(rows.map(r => r.title), ['One', 'Two']);
  assert.equal(rows[0].block, 'Summit I');
});

test('header names tolerate case and stray spaces', () => {
  const [row] = rowsFromCsv(' BLOCK ,Date,BLOCK TITLE ,  Title\nSummit I,Oct 17,Science,Talk\n');
  assert.equal(row.block, 'Summit I');
  assert.equal(row.blocktitle, 'Science');
  assert.equal(row.title, 'Talk');
});

test('blocks keep first-appearance order; date and block title are typed once per block', () => {
  const { stops } = model(HEAD +
    'Summit II,Oct 24,East to West,A,,,\n' +
    'Summit I,Oct 17,Science,B,,,\n' +
    'Summit II,,,C,,,\n' +
    'Summit II,Oct 99,Ignored,D,,,\n');
  assert.deepEqual(stops.map(s => [s.code, s.tag, s.date, s.title]), [
    ['STN·01', 'Summit II', 'Oct 24', 'East to West'],
    ['STN·02', 'Summit I', 'Oct 17', 'Science'],
  ]);
  assert.deepEqual(stops[0].sessions.map(s => [s.num, s.title]), [['01', 'A'], ['02', 'C'], ['03', 'D']]);
});

test('publish: blank/TRUE/yes/1 shown, FALSE/no/0/hidden hidden', () => {
  const shown = ['', 'TRUE', ' yes ', '1'], hidden = ['FALSE', 'No', '0', 'HIDDEN'];
  const csv = HEAD + [...shown, ...hidden].map((p, i) => `Summit I,,,T${i},,,${p}`).join('\n');
  assert.deepEqual(model(csv).stops[0].sessions.map(s => s.title), ['T0', 'T1', 'T2', 'T3']);
});

test('a block whose sessions are all unpublished is dropped and codes stay contiguous', () => {
  const { stops } = model(HEAD + 'Draft,,,X,,,FALSE\nSummit I,,,A,,,\n');
  assert.deepEqual(stops.map(s => [s.code, s.tag]), [['STN·01', 'Summit I']]);
});

test('rows with an empty title or block are skipped', () => {
  const { stops } = model(HEAD + 'Summit I,,,,,,\n,,,Orphan,,,\nSummit I,,,  ,,,\nSummit I,,,Kept,,,\n');
  assert.deepEqual(stops[0].sessions.map(s => s.title), ['Kept']);
});

test('a block named Finale in any case is the finale card', () => {
  const { stops } = model(HEAD + 'Summit I,,,A,,,\n finale ,Oct 26,,Show,Couture.,#fashion,\n');
  assert.deepEqual(stops.map(s => s.finale), [false, true]);
  assert.equal(stops[1].sessions[0].subtitle, 'Couture.');
});

test('links: only /…, #… and https://… survive', () => {
  const links = ['/pricing/', '#fashion', 'https://lu.ma/x', 'javascript:alert(1)', 'http://x.com', 'JaVaScRiPt:void(0)', 'data:text/html,x'];
  const csv = HEAD + links.map((l, i) => `Summit I,,,T${i},,"${l}",`).join('\n');
  assert.deepEqual(model(csv).stops[0].sessions.map(s => s.link), ['/pricing/', '#fashion', 'https://lu.ma/x', '', '', '', '']);
});

test('cell text is kept verbatim (the renderer sets it as text, never HTML)', () => {
  const { stops } = model(HEAD + 'Summit I,,,"R&D <b>now</b>",,,\n');
  assert.equal(stops[0].sessions[0].title, 'R&D <b>now</b>');
});

test('an empty sheet, or a header with no rows, yields zero stops', () => {
  assert.deepEqual(model('').stops, []);
  assert.deepEqual(model(HEAD).stops, []);
  assert.deepEqual(buildModel(undefined).stops, []);
});

test('the shipped snapshot builds today\'s rail: 5 + 4 sessions and the finale', () => {
  const w = load('agenda-data.js');
  assert.match(w.MIRAI_AGENDA_SHEET_CSV, /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[^/]+\/gviz\/tq\?tqx=out:csv&gid=\d+$/);
  const { stops } = buildModel(w.MIRAI_AGENDA_SNAPSHOT);
  assert.deepEqual(stops.map(s => [s.code, s.tag, s.date, s.sessions.length, s.finale]), [
    ['STN·01', 'Summit I', 'Oct 17–18', 5, false],
    ['STN·02', 'Summit II', 'Oct 24–25', 4, false],
    ['STN·03', 'Finale', 'Oct 26', 1, true],
  ]);
  assert.equal(stops[0].title, 'The Science & Tech Augmenting Life');
  assert.equal(stops[2].sessions[0].link, '#fashion');
  assert.ok(!JSON.stringify(w.MIRAI_AGENDA_SNAPSHOT).includes('&amp;'));
});
