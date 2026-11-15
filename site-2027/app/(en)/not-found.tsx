import type { Metadata } from 'next';
import { NotFoundBody } from '@/components/NotFoundBody';

export const metadata: Metadata = { title: 'Page not found · Mirai Tech City' };

export default function NotFound() {
  return <NotFoundBody />;
}
