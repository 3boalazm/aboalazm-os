import type { Metadata } from "next";
import { ProjectLedger } from "@/features/work";

export const metadata: Metadata = {
  title: "Work — Engineering Ledger",
  description:
    "A systematic index of identity systems, product architecture, and design infrastructure.",
};

/**
 * WORK — the Engineering Ledger.
 * No hero cards. A high-density record table where every project is
 * an entry: hover a row and the page atmosphere tints toward the
 * project while its preview trails the cursor.
 */
export default function WorkPage() {
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          Index · {String(new Date().getFullYear())}
        </p>
        <h1 className="max-w-[14ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
          The Engineering Ledger
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">
          Every engagement, recorded as a system: discipline, stack,
          and the outcome it shipped.
        </p>
      </header>

      <ProjectLedger />
    </main>
  );
}
