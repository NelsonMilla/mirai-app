'use client';

import Link from 'next/link';

interface InviteCodeLinkProps {
  variant?: 'nav' | 'inline' | 'footer';
  className?: string;
}

/**
 * Discreet "Have an invite code?" link — subtle enough not to imply
 * anyone is missing out, findable for those who do hold a code.
 */
export function InviteCodeLink({ variant = 'inline', className = '' }: InviteCodeLinkProps) {
  return (
    <Link
      href="/invite"
      className={`invite-code-link invite-code-link--${variant} ${className}`}
      data-testid="invite-code-link"
    >
      <span className="invite-code-dot" aria-hidden="true" />
      <span className="invite-code-text mono">Have an invite code?</span>
    </Link>
  );
}
