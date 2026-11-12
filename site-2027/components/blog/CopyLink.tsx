'use client';
// Rauno's copy-confirm: the label swaps to "Copied" for 1.5s. Replaces a share widget.
import { useState } from 'react';

export function CopyLink({ className = '' }: { className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href.split('#')[0]);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch { /* clipboard blocked: leave the label as is */ }
  };
  return (
    <button type="button" className={`copyLink ${className}`} onClick={copy} aria-live="polite">
      {done ? 'Copied ✓' : 'Copy link'}
    </button>
  );
}
