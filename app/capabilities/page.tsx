import type { Metadata } from "next";
import { TokenPlayground } from "@/features/playground";

export const metadata: Metadata = {
  title: "Capabilities — Live Token Playground",
  description:
    "Drag the studio's actual design tokens and watch a real layout recalculate. Zero design drift, demonstrated.",
};

export default function CapabilitiesPage() {
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          CAPABILITIES // SYSTEMS
        </p>
        <h1 className="max-w-[16ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
          Hold the tokens. Watch the system hold.
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">
          Change one value — spacing, radius, motion, theme — and every
          element recalculates in concert. That coherence is the product.
        </p>
      </header>

      <TokenPlayground />
    </main>
  );
}
