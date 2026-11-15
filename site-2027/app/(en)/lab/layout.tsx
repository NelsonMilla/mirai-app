import type { Metadata } from 'next';

// Design rounds only. Delete app/lab/ and components/lab/ before deploying.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
