'use client';
// Site header for the Residency 2027 site (from the opening round winner's bar).
// Wordmark left, "Residency · March 2027" centred (wide screens), section links, 日本語 and
// the Apply pill on the right. Transparent over the hero ('overlay'); past 80px of scroll,
// or from the start with variant 'solid', it gets a blurred night backdrop and a hairline.
// Below 820px: wordmark, Apply and a Menu button that opens a full-screen overlay
// (focus kept inside, Esc closes, page scroll locked while open).
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { residency, type Residency } from '@/content/residency';
import s from './SiteHeader.module.css';


export function SiteHeader({ variant = 'overlay', r = residency }: { variant?: 'overlay' | 'solid'; r?: Residency }) {
  const NEW_TAB = <span className={s.sr}> {r.newTab}</span>;
  const ja = r.langSwitch; // the other language's homepage
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const skipRefocus = useRef(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant === 'solid') return;
    const sync = () => setScrolled(window.scrollY > 80);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, [variant]);

  // The menu: lock page scroll, move focus in, keep Tab inside, Esc closes, focus returns.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const items = () => [...(panel.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])];
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const all = items();
      const first = all[0], last = all[all.length - 1];
      if (!panel.current?.contains(document.activeElement)) { e.preventDefault(); first?.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const btn = menuBtn.current;
    return () => {
      [html.style.overflow, document.body.style.overflow] = prev;
      document.removeEventListener('keydown', onKey);
      if (!skipRefocus.current) btn?.focus({ preventScroll: true });
      skipRefocus.current = false;
    };
  }, [open]);

  // Close the menu if the window grows past the mobile layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 820px)');
    const onChange = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const solid = variant === 'solid' || scrolled;
  const close = () => setOpen(false);
  // A link click hands focus to its target; only Esc / Close return focus to the Menu button.
  const leave = () => { skipRefocus.current = true; setOpen(false); };

  return (
    <>
      <header className={`${s.bar} ${solid ? s.solid : ''}`}>
        <Link className={s.mark} href={r.home}>Mirai Tech City</Link>
        <span className={s.note}>{r.hero.eyebrow}</span>
        <div className={s.end}>
          <nav className={s.nav} aria-label={r.ui.primaryNav}>
            <ul className={s.links}>
              {r.nav.map(l => (
                <li key={l.href}><Link className={s.link} href={l.href}>{l.label}</Link></li>
              ))}
              <li>
                <a className={`${s.link} ${s.ja}`} href={ja.href} lang={ja.lang} hrefLang={ja.lang}>{ja.label}</a>
              </li>
            </ul>
          </nav>
          <a className={s.cta} href={r.applyHref} target="_blank" rel="noopener noreferrer">
            {r.navCta}{NEW_TAB}
          </a>
          <button
            ref={menuBtn} type="button" className={s.menuBtn}
            aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}
          >
            {r.ui.menu}
          </button>
        </div>
      </header>

      <div id="site-menu" ref={panel} className={s.menu} role="dialog" aria-modal="true" aria-label={r.ui.menu} hidden={!open}>
        <div className={s.menuTop}>
          <Link className={s.mark} href={r.home} onClick={leave}>Mirai Tech City</Link>
          <button type="button" className={s.menuBtn} onClick={close}>{r.ui.close}</button>
        </div>
        <p className={s.menuNote}>{r.hero.eyebrow}</p>
        <ul className={s.menuLinks}>
          {r.nav.map(l => (
            <li key={l.href}><Link className={s.menuLink} href={l.href} onClick={leave}>{l.label}</Link></li>
          ))}
          <li>
            <a className={s.menuLink} href={ja.href} lang={ja.lang} hrefLang={ja.lang} onClick={leave}>{ja.label}</a>
          </li>
        </ul>
        <a className={s.menuApply} href={r.applyHref} target="_blank" rel="noopener noreferrer" onClick={leave}>
          {r.apply}<span aria-hidden="true">↗</span>{NEW_TAB}
        </a>
      </div>
    </>
  );
}
