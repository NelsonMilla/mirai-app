import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/hooks/useScrollState";
import { TrackProvider } from "@/components/tracks/TrackContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackgroundParticles } from "@/components/ui/BackgroundParticles";
import LoadingScreen from "@/components/ui/LoadingScreen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mirai Tech PopUp City — Kobe Port Island · October 2026",
  description:
    "Three tracks. One month. Kobe's Port Island. Biomedical devices, therapeutic pathways, and the builder community — culminating in the Frontier Human Fashion Show.",
  keywords: [
    "biotech",
    "popup city",
    "Kobe",
    "Port Island",
    "medical devices",
    "regenerative medicine",
    "longevity",
    "human enhancement",
    "Japan",
    "SAKIGAKE",
    "residency",
    "biomedical",
    "fashion show",
    "frontier humans",
  ],
  authors: [{ name: "Frontier Humans" }],
  creator: "Frontier Humans",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mirai.tech",
    siteName: "Mirai Tech PopUp City",
    title: "Mirai Tech PopUp City — Build the Future of Biotech in 4 Weeks",
    description:
      "Three tracks. One month. Kobe's Port Island. Biomedical devices, therapeutic pathways, and the builder community — culminating in the Frontier Human Fashion Show. October 2026.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mirai Tech PopUp City — Kobe Port Island · October 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirai Tech PopUp City — Kobe · October 2026",
    description:
      "Three tracks. One month. Biomedical devices, therapeutic pathways, and the builder community on Kobe's Port Island.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://mirai.tech"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Fraunces + Noto Serif JP loaded via Google Fonts link
            - Fraunces needs variable axes (SOFT, WONK, opsz) not supported by next/font
            - Noto Serif JP is a large CJK font that triggers a Turbopack resolver bug */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Noto+Serif+JP:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ScrollProvider>
          <TrackProvider>
            <ScrollProgress />
            <CustomCursor />
            <GrainOverlay />
            <BackgroundParticles />
            <LoadingScreen />
            {children}
          </TrackProvider>
        </ScrollProvider>
      </body>
    </html>
  );
}
