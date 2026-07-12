import React from 'react';
import { Stamp } from './Stamp';

/**
 * TeikeiBlock — partner row (提携先) with permission norm visible.
 *
 * In Japan, displaying a partner name implies an active, confirmed
 * relationship. This component makes the consent state legible:
 *
 *   - `written` → logo (or name) + 確認済 stamp · "written consent on file"
 *   - `verbal`  → text-only name + 照会中 stamp · "awaiting written"
 *   - `pending` → row suppressed entirely
 *
 * Only `written` partners may render their logo. This is the JP institutional
 * norm: logo display = endorsement claim. The TeikeiCounter (rendered above
 * the list) shows "[partners ready: 3 / 7]" so the reader sees the discipline
 * of not over-claiming.
 */

export type PermissionState = 'written' | 'verbal' | 'pending';

export type Teikei = {
  name: string;
  nameJa?: string | null;
  role: string;
  permissionState: PermissionState;
  logo?: string | null; // path under /public/logos/, e.g. 'kbic.svg'
};

export function TeikeiBlock({ p }: { p: Teikei }) {
  if (p.permissionState === 'pending') return null;

  const stampState = p.permissionState === 'written' ? 'confirmed' : 'pending';
  const stampSource =
    p.permissionState === 'written'
      ? 'MoU on file'
      : 'verbal — awaiting MoU';

  const showLogo = p.permissionState === 'written' && p.logo;

  return (
    <div className="teikei-row">
      <div className="teikei-logo">
        {showLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/logos/${p.logo}`} alt={`${p.name} logo`} />
        ) : (
          <div className="teikei-name">
            <span>{p.name}</span>
            {p.nameJa && <span className="teikei-name-ja jp">{p.nameJa}</span>}
          </div>
        )}
      </div>
      <div className="teikei-role">{p.role}</div>
      <div className="teikei-stamp">
        <Stamp state={stampState} source={stampSource} />
      </div>
    </div>
  );
}

export function TeikeiCounter({ ready, total }: { ready: number; total: number }) {
  return (
    <span className="teikei-counter mono">
      partners ready: {ready} / {total}
    </span>
  );
}
