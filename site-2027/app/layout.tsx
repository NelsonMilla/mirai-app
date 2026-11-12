import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { site } from '@/content/site';
import './globals.css';

// Switzer (Fontshare, ITF Free Font License) is self-hosted from app/fonts so it is
// preloaded with a metric-matched fallback instead of a render-blocking third-party stylesheet.
const switzer = localFont({
  src: [
    { path: './fonts/Switzer-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Switzer-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Switzer-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/Switzer-800.woff2', weight: '800', style: 'normal' },
    { path: './fonts/Switzer-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-switzer',
  display: 'swap',
  adjustFontFallback: 'Arial',
});
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: { siteName: site.name, images: [site.ogImage] },
  // Google Search Console: set GOOGLE_SITE_VERIFICATION in Vercel to the token from the HTML-tag method.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23050506'/%3E%3Ctext x='50' y='72' font-size='62' font-family='Georgia' font-weight='bold' fill='%239be8f0' text-anchor='middle'%3E未%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: '#050506' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${switzer.variable} ${plexMono.variable}`}>
      <head>
        <noscript><style>{'.rv{opacity:1;transform:none}'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
