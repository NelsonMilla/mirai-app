import { Html, baseMetadata, baseViewport } from '../shell';

export const metadata = baseMetadata;
export const viewport = baseViewport;

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <Html lang="en">{children}</Html>;
}
