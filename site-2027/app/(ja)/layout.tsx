import { Html, baseMetadata, baseViewport } from '../shell';

export const metadata = baseMetadata;
export const viewport = baseViewport;

export default function JapaneseLayout({ children }: { children: React.ReactNode }) {
  return <Html lang="ja">{children}</Html>;
}
