import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

// The 404 page body, used by app/global-not-found.tsx (unmatched URLs) and
// app/(en)/not-found.tsx (notFound() inside English routes, e.g. an unknown blog slug).
export function NotFoundBody() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader variant="solid" />
      <main id="main">
        <section className="notFound">
          <p className="eyebrow">404 · ページが見つかりません</p>
          <h1 className="big">This page is not here</h1>
          <p className="lead">Start from the homepage or the stories.</p>
          <div className="nfLinks">
            <Link className="btn accent" href="/">Homepage</Link>
            <Link className="btn ghost" href="/blog">Stories</Link>
            <Link className="btn ghost" href="/jp" lang="ja">日本語</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
