import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * (PRINT) ROOT LAYOUT — dedicated chrome-free root for the landscape
 * 16:9 portfolio deck (/portfolio). Deliberately separate from (site):
 * no nav, no footer, no Lenis, no ambient canvas, and crucially NO import
 * of the site's globals.css — the slides carry their own self-contained
 * stylesheet (features/portfolio/portfolio.css, scoped under #folio), so
 * print/PDF fidelity can never drift with site-theme changes.
 */
export const metadata: Metadata = {
  // This root layout has no metadataBase of its own — without it the og:image /
  // canonical URLs resolved against the per-deployment URL instead of the site.
  metadataBase: new URL(SITE_URL),
  title: "Mustafa Aboalazm — Portfolio 2026 (Selected Works)",
  description:
    "Portfolio deck of Mustafa Aboalazm, senior brand identity designer — 14 slides, 5 bilingual identity chapters. View online, print, or download as a 16:9 PDF.",
  alternates: { canonical: "/portfolio" },
  icons: { icon: "/images/work/portrait-256.png" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: "Mustafa Aboalazm" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0c0a07",
  colorScheme: "dark",
};

export default function PrintRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="folio-body">{children}</body>
    </html>
  );
}
