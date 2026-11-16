import { residency } from '@/content/residency';

// The one call to action on blog pages (Craig Mod / Works in Progress): end of index, end of every story.
export function NotifyStrip() {
  return (
    <aside className="notifyStrip">
      <div>
        <p className="eyebrow">{residency.final.eyebrow}</p>
        <p className="ns-h">{residency.final.headline}</p>
      </div>
      <a className="btn accent" href={residency.applyHref} target="_blank" rel="noopener">{residency.apply}</a>
    </aside>
  );
}
