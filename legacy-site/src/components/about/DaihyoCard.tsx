import React from 'react';
import { Placeholder } from './Placeholder';

/**
 * DaihyoCard — leadership card (代表者カード).
 *
 * Convention (top to bottom, fixed order — matches JP institutional reading):
 *   role (mono micro) → name (Inter 600, with optional JA gloss) →
 *   current affiliation → prior credentials → LinkedIn link.
 *
 * Photo is a 96×120 hard rectangle (object-fit: cover). No circular crops —
 * circles read as social, rectangles read as corporate.
 *
 * Name treatment:
 *   - EN-only mode: use the founder's actual public name ("Victoria Massó").
 *   - JA-present mode: render as "Massó Victoria · マッソ・ヴィクトリア"
 *     (surname-first JP convention). Pass `nameJa` to activate.
 */

export type Daihyo = {
  name: string;
  nameJa?: string | null;
  role: string;
  roleJa?: string | null;
  affiliation: string | null;
  credentials?: string | null;
  photo: string | null;
  linkedin: string | null;
  email?: string | null;
  wikipedia?: string | null;
  wikipediaLabel?: string | null; // e.g. "Wikipedia (JA)"
};

export function DaihyoCard({ d }: { d: Daihyo }) {
  return (
    <article className="daihyo-card">
      <div className="daihyo-photo">
        {d.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.photo} alt={d.name} />
        ) : (
          <Placeholder variant="image" note={`headshot — ${d.name}`} height="100%" />
        )}
      </div>
      <div className="daihyo-body">
        <div className="daihyo-role mono">
          <span>{d.role}</span>
          {d.roleJa && <span className="jp"> / {d.roleJa}</span>}
        </div>
        <div className="daihyo-name">
          <span>{d.name}</span>
          {d.nameJa && <span className="daihyo-name-ja jp">· {d.nameJa}</span>}
        </div>
        <div className="daihyo-affiliation">
          {d.affiliation ?? <Placeholder variant="inline" note={`bio — ${d.name}`} />}
        </div>
        {d.credentials && <div className="daihyo-credentials mono">{d.credentials}</div>}
        <div className="daihyo-links">
          {d.linkedin ? (
            <a className="daihyo-link mono" href={d.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          ) : (
            <Placeholder variant="inline" note={`LinkedIn — ${d.name}`} />
          )}
          {d.email && (
            <a className="daihyo-link mono" href={`mailto:${d.email}`}>
              Email ↗
            </a>
          )}
          {d.wikipedia && (
            <a className="daihyo-link mono" href={d.wikipedia} target="_blank" rel="noopener noreferrer">
              {d.wikipediaLabel ?? 'Wikipedia'} ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
