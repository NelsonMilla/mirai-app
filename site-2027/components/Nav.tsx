'use client';
// Port of new-site/nav.js: logo left, glass pill with section links + accent CTA.
import { useEffect, useState } from 'react';
import { site, type Copy } from '@/content/site';

export function Nav({ t = site }: { t?: Copy }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => window.removeEventListener('scroll', sync);
  }, []);

  return (
    <div className="topbar">
      <nav className={`nd-nav${scrolled ? ' nd-scrolled' : ''}`} aria-label="Primary">
        <a className="nd-logo" href={t.home}>
          Mirai<span className="nd-logoTech">Tech</span>
        </a>
        <div className="nd-pill">
          <div className="nd-links">
            {t.nav.map(l => (
              <a key={l.href} className="nd-link" href={l.href}>
                <span className="nd-lbl">{l.label}</span>
              </a>
            ))}
            <a className="nd-link" href={t.langSwitch.href} lang={t.langSwitch.lang} hrefLang={t.langSwitch.lang}>
              <span className="nd-lbl">{t.langSwitch.label}</span>
            </a>
          </div>
          <a className="nd-cta" href={t.notifyHref}>{t.navCta}</a>
        </div>
      </nav>
    </div>
  );
}
