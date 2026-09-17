import type { Metadata, Viewport } from "next";

/**
 * (PRINT) ROOT LAYOUT — dedicated chrome-free root for the fixed A4
 * portfolio (/portfolio). Deliberately separate from (site): no nav,
 * no footer, no Lenis, no ambient canvas, and crucially NO import of
 * the site's globals.css — the A4 sheets carry their own self-contained
 * stylesheet (features/portfolio/portfolio.css, scoped under #folio), so
 * print/PDF fidelity can never drift with site-theme changes.
 */
export const metadata: Metadata = {
  title: "Portfolio 2026 — Fixed A4 Edition",
  description:
    "The fixed-format A4 portfolio of Mustafa Aboalazm — 29 pages of brand identity systems, case files, process, and offers. Exportable to PDF, printable 1:1.",
  icons: { icon: "/images/work/icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080710",
  colorScheme: "dark",
};

export default function PrintRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="folio-body">{children}</body>
    </html>
  );
}
