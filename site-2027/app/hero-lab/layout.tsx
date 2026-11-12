import type { Metadata } from 'next';

// Design round only — delete app/hero-lab/ and components/hero-variants/ before deploying.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function HeroLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
