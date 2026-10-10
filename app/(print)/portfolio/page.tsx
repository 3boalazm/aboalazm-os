import type { Metadata } from "next";
import { PortfolioView } from "@/features/portfolio";

export const metadata: Metadata = {
  title: "Mustafa Aboalazm — Portfolio 2026 (Selected Works)",
  description:
    "Portfolio deck of Mustafa Aboalazm, senior brand identity designer — 14 slides, 5 identity chapters (Code & Canvas, Ahmed Bedeer, Reflection, GAD, Nile Pharma). View, print, or download as a 16:9 PDF.",
  alternates: { canonical: "/portfolio" },
};

/**
 * /portfolio — the landscape presentation deck.
 * Static render (no DB involvement): every frame is compiled
 * from features/portfolio/data.ts. Safe to build anywhere, offline or on.
 */
export default function PortfolioPage() {
  return <PortfolioView />;
}
