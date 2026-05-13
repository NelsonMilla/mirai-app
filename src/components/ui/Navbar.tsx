'use client';

import React from 'react';
import { InviteCodeLink } from '@/components/ui/InviteCodeLink';
import { LUMA_EVENT_URL } from '@/lib/constants';

export function Navbar() {
  return (
    <nav>
      <a className="nav-logo" href="/">
        <div className="nav-mark">未</div>
        <span className="nav-name">Mirai Tech</span>
      </a>
      <div className="nav-links">
        <a href="/#tracks">Tracks</a>
        <a href="/#month">Program</a>
        <a href="/#kobe">Kobe</a>
        <InviteCodeLink variant="nav" />
        <a className="btn btn-primary" href={LUMA_EVENT_URL} target="_blank" rel="noopener noreferrer">Apply Now</a>
      </div>
    </nav>
  );
}
