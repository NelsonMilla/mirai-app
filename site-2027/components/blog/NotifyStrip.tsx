import { site } from '@/content/site';

// The one subscribe placement (Craig Mod / Works in Progress): end of index, end of every story.
export function NotifyStrip() {
  return (
    <aside className="notifyStrip">
      <div>
        <p className="eyebrow">{site.next.eyebrow}</p>
        <p className="ns-h">{site.hero.headline[1]}</p>
      </div>
      <a className="btn accent" href={site.notifyHref}>{site.next.primary}</a>
    </aside>
  );
}
