// Site footer for every page (homepage and blog). Static, ruled, quiet.
import { residency, type Residency } from '@/content/residency';
import s from './SiteFooter.module.css';


export function SiteFooter({ r = residency }: { r?: Residency } = {}) {
  const links: { href: string; label: string; lang?: string }[] = [
    ...r.nav,
    { href: '/blog/rss.xml', label: r.ui.rss },
    r.langSwitch,
  ];
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.top}>
          <div>
            <p className={s.mark}><a href={r.home}>Mirai Tech City</a></p>
            <p className={s.line}>{r.footerLine}</p>
          </div>
          {/* 未来 (mirai, future). Decorative: 不死 belongs to the opening only (README rule 9). */}
          <span className={s.seal} lang="ja" aria-hidden="true">
            <span>未来</span>
          </span>
        </div>
        <nav className={s.nav} aria-label={r.ui.footerNav}>
          {links.map(l => <a key={l.href} href={l.href} lang={l.lang}>{l.label}</a>)}
        </nav>
        <div className={s.bottom}>
          <a className={s.mail} href="mailto:team@miraitech.city">team@miraitech.city</a>
          <p className={s.credit}>{r.credits} <a href={r.creditLinks.source} target="_blank" rel="noopener">{r.ui.source}</a> · <a href={r.creditLinks.license} target="_blank" rel="noopener">CC BY 2.0</a></p>
        </div>
      </div>
    </footer>
  );
}
