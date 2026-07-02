"use client";

/**
 * PersonaSection — a section header wrapper that swaps its heading
 * based on the active persona, while everything else (structure,
 * children, data) stays identical. This is the "reorder + highlight +
 * swap headings/CTAs, not full rewrite" pattern applied consistently.
 */

import type { ReactNode } from "react";
import { usePersona, pickFor } from "@/components/providers/persona-provider";

export function PersonaSection({
  className,
  kicker,
  title,
  children,
}: {
  className?: string;
  kicker: string;
  title: { base: ReactNode; founder?: ReactNode; technical?: ReactNode };
  children: ReactNode;
}) {
  const { persona } = usePersona();
  const heading = pickFor(persona, title);

  return (
    <section className={className}>
      <div className="flex flex-col gap-1">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {kicker}
        </p>
        <h2 className="font-display text-title tracking-[-0.015em]">
          {heading}
        </h2>
      </div>
      {children}
    </section>
  );
}
