import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeBoot } from "@/components/studio/interactive";
import "./studio.css";

/**
 * Studio root layout — its own <html> document, completely isolated from the
 * marketing site's layout, CSS, and providers.
 *
 * Arabic RTL operations console powered by self-hosted IBM Plex Sans Arabic
 * alongside Montserrat & JetBrains Mono for bilingual inputs and tabular figures.
 */
export const metadata: Metadata = {
  title: { default: "لوحة الاستوديو · Aboalazm OS", template: "%s · الاستوديو" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#080710",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Self-hosted fonts under /fonts — zero external network dependency. */}
        <link rel="preload" href="/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/montserrat-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/montserrat-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/jetbrains-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body
        style={{
          margin: 0,
          background: "#080710",
          fontFamily:
            '"IBM Plex Sans Arabic", "Montserrat", system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        {children}
        <ThemeBoot />
      </body>
    </html>
  );
}
