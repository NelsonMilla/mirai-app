import React from 'react';

/**
 * BilingualBar — footer-pinned EN/JA completion indicator.
 *
 * Tells JP readers that the page is bilingual-ready and what state it is in.
 * Today reads "EN 100% · JA 0% — Translation in progress · 翻訳作業中".
 * When JA copy lands, update the percentages by hand.
 */
export function BilingualBar() {
  return (
    <div className="bilingual-bar mono" role="status" aria-live="polite">
      <span className="bilingual-bar-status">EN 100% · JA 0%</span>
      <span className="bilingual-bar-note">
        Translation in progress · <span className="jp">翻訳作業中</span>
      </span>
    </div>
  );
}
