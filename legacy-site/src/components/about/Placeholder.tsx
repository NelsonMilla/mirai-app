import React from 'react';

/**
 * Placeholder — visible amber-bordered slot for content that is not yet real.
 *
 * Wrap any element/data that is not real, publicly-verifiable content. Future
 * Claude instances (and the user) should grep for `PLACEHOLDER:` to find every
 * spot that still needs real content before the page can be made public.
 *
 * Variants:
 *   - block (default): wraps a section with a dashed border + "PLACEHOLDER" tag
 *   - inline: small amber pill around a single value, e.g. an EIN or address
 *   - image: stand-in tile sized for a photo, with a label
 */

type PlaceholderProps = {
  note: string;
  variant?: 'block' | 'inline' | 'image';
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
};

export function Placeholder({
  note,
  variant = 'block',
  width,
  height,
  children,
}: PlaceholderProps) {
  if (variant === 'inline') {
    return (
      <span className="ph-inline mono" title={`PLACEHOLDER: ${note}`}>
        <span className="ph-inline-tag">PLACEHOLDER</span>
        <span className="ph-inline-note">{note}</span>
      </span>
    );
  }

  if (variant === 'image') {
    return (
      <div
        className="ph-image"
        style={{ width: width ?? '100%', height: height ?? 240 }}
        title={`PLACEHOLDER: ${note}`}
      >
        <span className="ph-image-tag mono">PLACEHOLDER</span>
        <span className="ph-image-note mono">{note}</span>
      </div>
    );
  }

  return (
    <div className="ph-block" title={`PLACEHOLDER: ${note}`}>
      <span className="ph-block-tag mono">PLACEHOLDER · {note}</span>
      {children}
    </div>
  );
}
