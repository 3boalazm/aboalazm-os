import type { Metadata } from "next";
import { SystemConstellation } from "@/features/hero";

export const metadata: Metadata = {
  title: "About — The Architect",
  description: "Seven years turning identity into infrastructure.",
};

const DOCTRINE = [
  "A brand is a system, or it is a liability.",
  "Strategy is the standard every pixel answers to.",
  "Arabic deserves design, not translation.",
] as const;

const TIMELINE = [
  ["2024 →", "Co-Founder & Creative Lead", "Code & Canvas — end-to-end identity systems"],
  ["2020–25", "Media Director", "Nile Pharma Food — identity from zero, +40% visibility"],
  ["2018 →", "Brand Consultant", "20+ systems across pharma, food, education, government"],
] as const;

export default function AboutPage() {
  return (
    <main className="container-content flex flex-col gap-16 py-16">
      {/* Band 1 — statement */}
      <header className="flex flex-col gap-4">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          THE ARCHITECT
        </p>
        <h1 className="max-w-[18ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
          Seven years turning identity <em>into infrastructure.</em>
        </h1>
        <p className="max-w-[52ch] text-lead text-text-secondary">
          Mustafa Aboalazm is a systemic identity architect — co-founder of
          Code & Canvas, working from Cairo for teams worldwide. The practice
          spans brand strategy, design systems, and the web they ship to,
          in two languages, under one doctrine.
        </p>
      </header>

      {/* Band 2 — doctrine */}
      <section aria-label="Doctrine" className="flex flex-col">
        <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          DOCTRINE
        </p>
        {DOCTRINE.map((line, i) => (
          <p
            key={line}
            className="border-t border-border-subtle py-3 font-display text-title tracking-[-0.015em] text-text-primary last:border-b"
          >
            <span className="mr-2 font-mono text-label text-text-ghost">
              0{i + 1}
            </span>
            {line}
          </p>
        ))}
      </section>

      {/* Band 3 — career ledger */}
      <section aria-label="Career">
        <p className="pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          CAREER LEDGER
        </p>
        {TIMELINE.map(([year, role, note]) => (
          <div
            key={role}
            className="grid grid-cols-[6rem_1fr] items-baseline gap-2 border-b border-border-subtle py-2 md:grid-cols-[6rem_16rem_1fr]"
          >
            <span className="font-mono text-label text-text-tertiary">{year}</span>
            <span className="text-body text-text-primary">{role}</span>
            <span className="col-span-2 text-body-sm text-text-secondary md:col-span-1">
              {note}
            </span>
          </div>
        ))}
      </section>

      {/* Band 4 — constellation interlude */}
      <section aria-label="The system" className="flex flex-col items-center gap-4">
        <p className="max-w-[52ch] text-center text-lead text-text-secondary">
          Every engagement runs the same chain: brand compiles into tokens,
          tokens into components, components into pages, pages into experience.
        </p>
        <SystemConstellation />
      </section>
    </main>
  );
}
