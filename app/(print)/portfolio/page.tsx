import type { Metadata } from "next";
import { PortfolioView } from "@/features/portfolio";

export const metadata: Metadata = {
  title: "Portfolio 2026 — Fixed A4 Edition · بورتفوليو",
  description:
    "29 fixed A4 pages — identity systems, 13 projects, case files, process, and offers. Export to exact-size PDF or print 1:1.",
};

/**
 * /portfolio — the fixed A4 edition.
 * Static render (no DB involvement): every number and image is compiled
 * from features/portfolio/data.ts, which is ported from the repo's own
 * content files. Safe to build anywhere, offline or on.
 */
export default function PortfolioPage() {
  return <PortfolioView />;
}
