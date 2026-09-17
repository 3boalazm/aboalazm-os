import type { Metadata, Viewport } from "next";

/**
 * (PRINT) ROOT LAYOUT — dedicated chrome-free root for the landscape
 * 16:9 portfolio deck (/portfolio). Deliberately separate from (site):
 * no nav, no footer, no Lenis, no ambient canvas, and crucially NO import
 * of the site's globals.css — the slides carry their own self-contained
 * stylesheet (features/portfolio/portfolio.css, scoped under #folio), so
 * print/PDF fidelity can never drift with site-theme changes.
 */
export const metadata: Metadata = {
  title: "Portfolio 2026 — 16:9 Presentation Deck",
  description:
    "The landscape presentation portfolio of Mustafa Aboalazm — 14 slides, 5 identity chapters with selected frames. Exportable to 16:9 PDF, printable 1:1.",
  icons: { icon: "/images/work/icon.png" },
  robots: { index: true, follow: true },
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
