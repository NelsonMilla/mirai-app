import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

// Unknown addresses land here (Next serves it with a 404 status and noindex).
export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <section className="notFound">
          <p className="eyebrow">404 · ページが見つかりません</p>
          <h1 className="big">This page is not here</h1>
          <p className="lead">The 2026 pages have moved into the recap. Start from the homepage or the stories.</p>
          <div className="nfLinks">
            <Link className="btn accent" href="/">Homepage</Link>
            <Link className="btn ghost" href="/blog">Stories</Link>
            <Link className="btn ghost" href="/jp" lang="ja">日本語</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
