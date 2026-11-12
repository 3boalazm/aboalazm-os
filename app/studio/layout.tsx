import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeBoot } from "@/components/studio/interactive";
import "./studio.css";

/**
 * Studio root layout — its own <html>, like app/(payload)/layout.tsx.
 *
 * The console is a separate document from the marketing site on purpose:
 *   · the site's global CSS (huge type ramps, scroll-reveal, ambient canvas,
 *     Lenis smooth scroll) is exactly wrong for an operations table;
 *   · the site ships JS it does not need (terminal overlay, PWA install,
 *     persona provider, analytics);
 *   · and a console bug must never be able to break a page a visitor sees.
 *
 * It is still one Next app and one deploy — isolation here is about the
 * document, not about running a second service.
 */
export const metadata: Metadata = {
  title: { default: "Studio console · Aboalazm OS", template: "%s · Studio" },
  robots: { index: false, follow: false },
  // Deliberately not linked from the marketing site's nav: the console is an
  // operator tool, discovered by URL or bookmark.
};

export const viewport: Viewport = {
  themeColor: "#080710",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Fonts are already self-hosted under /fonts and declared by the
            marketing stylesheet; the console only needs the faces it uses. */}
        <link rel="preload" href="/fonts/montserrat-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/montserrat-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/jetbrains-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body
        style={{
          margin: 0,
          background: "#080710",
          // Two type systems only: Montserrat for prose, JetBrains Mono for
          // every number and label. Numbers that do not align are numbers you
          // cannot scan.
          fontFamily:
            'var(--font-sans), Montserrat, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        {children}
        <ThemeBoot />
      </body>
    </html>
  );
}
