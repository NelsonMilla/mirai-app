import type { Metadata } from 'next';

// Design rounds only. Delete app/(en)/lab/ and components/lab/ before merging.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
