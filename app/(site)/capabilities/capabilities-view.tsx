"use client";
import { TokenPlayground } from "@/features/playground";
import { useT } from "@/hooks/use-t";

export function CapabilitiesView() {
  const t = useT();
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          {t.capabilitiesSection}
        </p>
        <h1 className="max-w-[16ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
          {t.capabilitiesTitle}
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">
          {t.capabilitiesLead}
        </p>
      </header>
      <TokenPlayground />
    </main>
  );
}
