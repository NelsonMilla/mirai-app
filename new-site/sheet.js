/* Shared Google Sheet reader for the agenda and speakers scripts.
   Pure parser runs in Node for tests; fetchCsv touches fetch only when called. */
(function (window) {
  'use strict';

  // RFC 4180-ish: quoted fields, "" escapes, commas/newlines inside quotes, CRLF, BOM.
  function parseCsv(text) {
    const s = String(text || '').replace(/^﻿/, '');
    const rows = [];
    let row = [], field = '', quoted = false;
    const endRow = () => {
      row.push(field);
      if (row.some(f => f !== '')) rows.push(row);
      row = []; field = '';
    };
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (quoted) {
        if (c === '"' && s[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') quoted = false;
        else field += c;
      } else if (c === '"') quoted = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') endRow();
      else if (c === '\r') { if (s[i + 1] === '\n') i++; endRow(); }
      else field += c;
    }
    if (field !== '' || row.length) endRow();
    return rows;
  }

  // First row is the header; "Block title " → "blocktitle".
  function rowsFromCsv(text) {
    const [head, ...body] = parseCsv(text);
    if (!head) return [];
    const keys = head.map(h => h.toLowerCase().replace(/\s+/g, ''));
    return body.map(cells => {
      const o = {};
      keys.forEach((k, i) => { if (k) o[k] = cells[i] == null ? '' : cells[i]; });
      return o;
    });
  }

  // Fresh CSV as row objects; rejects on network error, non-2xx or timeout.
  function fetchCsv(url, { timeout = 6000 } = {}) {
    let timer;
    return Promise.resolve().then(() => {
      const ctl = new AbortController();
      timer = setTimeout(() => ctl.abort(), timeout);
      return fetch(url, { cache: 'no-store', signal: ctl.signal });
    }).then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    }).then(rowsFromCsv).finally(() => clearTimeout(timer));
  }

  window.MiraiSheet = { parseCsv, rowsFromCsv, fetchCsv };
})(window);
