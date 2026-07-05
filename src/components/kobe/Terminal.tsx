'use client';

import React, { useEffect, useRef } from 'react';

interface TerminalLine {
  html: React.ReactNode;
  isBlank?: boolean;
  isSeparator?: boolean;
  isError?: boolean;
}

const terminalLines: TerminalLine[] = [
  // JP deploy
  {
    html: (
      <>
        <span className="term-prompt">$ </span>
        <span className="term-cmd">mirai deploy</span>{' '}
        <span className="term-flag">
          --trial regen-therapy --region <span className="term-time">JP</span>
        </span>
      </>
    ),
  },
  { html: '', isBlank: true },
  {
    html: (
      <>
        <span className="term-dim">scan</span> accelerated pathways found:{' '}
        <span className="term-time">4</span> <span className="term-ok">✓</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">consult</span> PMDA on-site at KBIC{' '}
        <span className="term-progress">
          <span className="term-progress-fill term-progress-fill--ok"></span>
        </span>{' '}
        <span className="term-ok">done</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">pathway</span> conditional approval — regenerative medicine{' '}
        <span className="term-ok">✓</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">approval</span> fastest cases in{' '}
        <span className="term-time">under 1 year</span>{' '}
        <span className="term-ok">✓</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">patients</span>{' '}
        <span className="term-ok">access active during review</span>{' '}
        <span className="term-ok">✓</span>
      </>
    ),
  },
  { html: '', isBlank: true },
  {
    html: (
      <>
        <span className="term-status-ok">■ DEPLOYED</span>{' '}
        <span className="term-dim">real-world evidence:</span>{' '}
        <span className="term-time">collecting</span>
      </>
    ),
  },
  { html: '', isBlank: true },
  {
    html: <span className="term-sep">────────────────────────────────────────────────</span>,
    isSeparator: true,
  },
  { html: '', isBlank: true },

  // US deploy
  {
    html: (
      <>
        <span className="term-prompt">$ </span>
        <span className="term-cmd">mirai deploy</span>{' '}
        <span className="term-flag">
          --trial regen-therapy --region <span className="term-time">US</span>
        </span>
      </>
    ),
  },
  { html: '', isBlank: true },
  {
    html: (
      <>
        <span className="term-dim">pathway</span> FDA Traditional Approval
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">filed</span> IND submitted{' '}
        <span className="term-progress">
          <span className="term-progress-fill term-progress-fill--warn"></span>
        </span>{' '}
        <span className="term-pending">reviewing...</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">Phase I</span>{' '}
        <span className="term-pending">⏱ 12–18 months</span>{' '}
        <span className="term-dim">...</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">Phase II</span>{' '}
        <span className="term-pending">⏱ 24–36 months</span>{' '}
        <span className="term-dim">...</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">Phase III</span>{' '}
        <span className="term-pending">⏱ 36–60 months</span>{' '}
        <span className="term-dim">...</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">FDA rev.</span>{' '}
        <span className="term-pending">⏱ 12–24 months</span>{' '}
        <span className="term-dim">...</span>
      </>
    ),
  },
  {
    html: (
      <>
        <span className="term-dim">patients</span>{' '}
        <span className="term-dim">pending approval...</span>
      </>
    ),
  },
  { html: '', isBlank: true },
  {
    html: (
      <>
        <span className="term-dim">ETA:</span>{' '}
        <span className="term-pending">5–7 years</span>
      </>
    ),
  },
  { html: '', isBlank: true },
  {
    html: (
      <>
        <span className="term-err">^C</span>{' '}
        <span className="term-status-err">KeyboardInterrupt</span>
      </>
    ),
    isError: true,
  },
  {
    html: (
      <>
        <span className="term-comment">
          // life's too short. come build in Japan.
        </span>
      </>
    ),
  },
];

export default function Terminal() {
  const termBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = termBodyRef.current?.querySelectorAll('.term-line');
    if (!lines) return;

    let delay = 0;
    const sepIndex = Array.from(lines).findIndex((l) =>
      l.classList.contains('term-sep-line')
    );
    const errIndex = Array.from(lines).findIndex((l) =>
      l.querySelector('.term-err')
    );

    const timeouts: NodeJS.Timeout[] = [];

    Array.from(lines).forEach((line, i) => {
      if (i < sepIndex) {
        delay += line.classList.contains('tl-blank') ? 40 : 90;
      } else if (i === sepIndex) {
        delay += 500;
      } else if (i < errIndex) {
        delay += line.classList.contains('tl-blank') ? 60 : 160;
      } else {
        delay += line.classList.contains('tl-blank') ? 40 : 90;
      }

      const timeout = setTimeout(() => {
        line.classList.add('tl-vis');
      }, delay);

      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="term-layout">
      <div className="term-window" id="termWindow">
        <div className="term-bar">
          <span className="term-dot term-dot--r"></span>
          <span className="term-dot term-dot--y"></span>
          <span className="term-dot term-dot--g"></span>
          <span className="term-bar-title">mirai — regulatory deploy</span>
        </div>

        <div className="term-body" ref={termBodyRef} id="termBody">
          {terminalLines.map((line, i) => (
            <div
              key={i}
              className={`term-line ${line.isBlank ? 'tl-blank' : ''} ${
                line.isSeparator ? 'term-sep-line' : ''
              }`}
            >
              {line.html}
            </div>
          ))}
        </div>
      </div>

      <div className="term-sidebar">
        <div className="term-aside term-aside--jp">
          <span className="term-aside-flag">🇯🇵</span>
          <span className="term-aside-big">&lt; 1 yr</span>
          <span className="term-aside-sub">
            Fastest conditional approvals.
            <br />
            Patients get access <em>during</em> review.
          </span>
        </div>
        <div className="term-aside-vs">vs</div>
        <div className="term-aside term-aside--us">
          <span className="term-aside-flag">🇺🇸</span>
          <span className="term-aside-big">5–7 yrs</span>
          <span className="term-aside-sub">
            Full Phase I–III trials required.
            <br />
            No patient access until approved.
          </span>
        </div>
        <div className="term-aside-bottom">
          Same therapy. Same evidence.
          <br />
          <em>Different starting line.</em>
        </div>
      </div>
    </div>
  );
}
