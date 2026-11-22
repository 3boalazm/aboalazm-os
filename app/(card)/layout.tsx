import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./card.css";

/**
 * (CARD) ROOT LAYOUT — the page a printed smart card's QR opens (/c/<token>).
 * Its own chrome-free document, like (print) and /studio: no nav, no providers,
 * no site globals.css. It is opened once, on a phone, often on mobile data,
 * so it ships one small stylesheet and three font files.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // A contact page reached from a physical card: not a search landing page.
  robots: { index: false, follow: false },
  icons: { icon: "/images/work/portrait-256.png" },
};

export const viewport: Viewport = {
  themeColor: "#080710",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function CardRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/Gc_Epicpro.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/montserrat-latin-500-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="sc-body">
        {children}
        {/* Page views of /c/<token> are the scan count until the card system has its own analytics. */}
        <Analytics />
      </body>
    </html>
  );
}
