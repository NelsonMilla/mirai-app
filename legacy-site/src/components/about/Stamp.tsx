import React from 'react';

/**
 * Stamp — verification-state pill for row-level facts.
 *
 *  - `confirmed`  → 確認済 · pink-bordered, white text. Third-party verifiable.
 *  - `pending`    → 照会中 · slate-bordered. Verification in progress.
 *  - `on-record`  → 登記済 · white-faded border. Registry-backed.
 *
 * The optional `source` attribution is the evidence path — what specifically
 * verifies this row. Examples:
 *   <Stamp state="confirmed" source="KBIC reference" />
 *   <Stamp state="on-record" source="DE Sec. of State" />
 *   <Stamp state="pending"   source="awaiting MoU" />
 */

export type StampState = 'confirmed' | 'pending' | 'on-record';

const LABELS: Record<StampState, { ja: string; en: string }> = {
  confirmed: { ja: '確認済', en: 'CONFIRMED' },
  pending: { ja: '照会中', en: 'PENDING' },
  'on-record': { ja: '登記済', en: 'ON RECORD' },
};

export function Stamp({ state, source }: { state: StampState; source?: string }) {
  const label = LABELS[state];
  return (
    <span className={`stamp stamp-${state}`} aria-label={`${label.en} status`}>
      <span className="stamp-label">
        <span className="stamp-label-ja jp">{label.ja}</span>
        <span className="stamp-label-en">{label.en}</span>
      </span>
      {source && <span className="stamp-source">· {source}</span>}
    </span>
  );
}
