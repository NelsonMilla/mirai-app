// Unmatched URLs anywhere in the app (two root layouts, so Next needs one global 404).
// It bypasses the layouts, so it brings its own <html> through the shared shell.
import type { Metadata } from 'next';
import { Html } from './shell';
import { NotFoundBody } from '@/components/NotFoundBody';

export const metadata: Metadata = { title: 'Page not found · Mirai Tech City', robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <Html lang="en">
      <NotFoundBody />
    </Html>
  );
}
