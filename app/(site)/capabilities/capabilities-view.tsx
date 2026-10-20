"use client";
import { TokenPlayground } from "@/features/playground";
import { useT } from "@/hooks/use-t";
import { Heading } from "@/components/ui/Heading";

export function CapabilitiesView() {
  const t = useT();
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-6">
      <header className="flex flex-col gap-2">
        <Heading
          eyebrow={t.capabilitiesSection}
          title={t.capabilitiesTitle}
          titleClassName="max-w-[16ch] text-balance-pretty"
          subtitle={t.capabilitiesLead}
          subtitleClassName="max-w-[52ch]"
        />
      </header>
      <TokenPlayground />
    </main>
  );
}
