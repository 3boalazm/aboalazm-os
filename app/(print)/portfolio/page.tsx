import type { Metadata } from "next";
import { PortfolioView } from "@/features/portfolio";

export const metadata: Metadata = {
  title: "Portfolio 2026 — 16:9 Presentation Deck · بورتفوليو",
  description:
    "14 landscape slides — 5 identity chapters (Code & Canvas, Ahmed Bedeer, Reflection, GAD, Nile Pharma), selected frames, and contact. Export to 16:9 PDF or present full-screen.",
};

/**
 * /portfolio — the landscape presentation deck.
 * Static render (no DB involvement): every frame is compiled
 * from features/portfolio/data.ts. Safe to build anywhere, offline or on.
 */
export default function PortfolioPage() {
  return <PortfolioView />;
}
