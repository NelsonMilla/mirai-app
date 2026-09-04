import React from 'react';

/**
 * SectionHeading — 4-track bilingual scaffold for every /about section.
 *
 *   ┌──────────────────────────────┐
 *   │ § 01                         │  ← numeral (mono, pink, micro)
 *   │ 会社概要                       │  ← JA slot (empty today = hairline + JA mark)
 *   │ Corporate Outline            │  ← EN slot (visible today)
 *   │ Optional 1-sentence deck     │  ← optional deck
 *   └──────────────────────────────┘
 *
 * Pass `ja` only when the Japanese title is signed off; until then the JA
 * slot renders as a reserved-but-empty grid track with a hairline rule and
 * a faint `JA` mark visible on hover. This keeps the scaffold visible so
 * JA copy drops in without redesign.
 */

type Props = {
  number: string;
  ja?: string;
  en: string;
  deck?: string;
};

export function SectionHeading({ number, ja, en, deck }: Props) {
  return (
    <header className="about-heading">
      <div className="about-heading-num mono">§ {number}</div>
      {ja ? (
        <div className="about-heading-ja jp">{ja}</div>
      ) : (
        <div className="about-heading-ja ja-pending" aria-hidden="true" />
      )}
      <h2 className="about-heading-en">{en}</h2>
      {deck && <p className="about-heading-deck">{deck}</p>}
    </header>
  );
}
