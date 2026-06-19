import type { Metadata } from "next";
import Link from "next/link";
import { SystemConstellation } from "@/features/hero";

export const metadata: Metadata = {
  title: "Why Mustafa — Systems, Not Logos",
  description:
    "Most designers deliver logos. I build identity systems that scale across teams, products, campaigns, and the web they ship to — strategy, identity architecture, and design-system thinking under one doctrine.",
};

/* Six reasons clients hire — title + body, site voice (condensed) */
const REASONS = [
  [
    "Strategy before design",
    "Every visual decision carries a strategic reason: business goals, market position, audience behavior, brand perception, competitive landscape. Strong identities are built on clarity — not aesthetics alone.",
  ],
  [
    "Systems, not deliverables",
    "Most projects end when files are delivered. Mine produce systems that let teams scale consistently, cut design debt, collaborate better, decide faster, and hold brand integrity. A brand should be usable, not just beautiful.",
  ],
  [
    "Bilingual identity architecture",
    "Arabic and English is more than translation: typography systems, cultural context, reading patterns, visual hierarchy, cross-language consistency. Identities that work across both worlds without compromising either.",
  ],
  [
    "Across complex industries",
    "Healthcare, pharmaceuticals, education, government initiatives, nonprofits, digital products — each with different constraints, audiences, and communication challenges. The role stays the same: translate complexity into clarity.",
  ],
  [
    "Design-systems thinking",
    "Great brands behave like products. I apply product-grade discipline to identity: tokens, components, rules, documentation, governance — so the brand stays itself as it grows.",
  ],
  [
    "AI-augmented operations",
    "AI integrated into research, strategy, content workflows, documentation, and design ops — so projects move faster while keeping quality and strategic depth. Not replacing creativity; amplifying it.",
  ],
] as const;

/* The engagement chain — six movements */
const APPROACH = [
  ["Discover", "Understand the business, audience, and opportunity."],
  ["Define", "Set strategic foundations and positioning."],
  ["Architect", "Design the structure connecting strategy to execution."],
  ["Build", "Develop the visual identity system and assets."],
  ["Systemize", "Document rules, components, and governance."],
  ["Scale", "Enable teams to run the system with confidence over time."],
] as const;

/* By the numbers — REAL FIGURES TO BE FILLED IN by Mustafa.
   Placeholders are intentional; no invented metrics. */
const NUMBERS = [
  ["BRANDS DESIGNED", "—"],
  ["YEARS OF EXPERIENCE", "—"],
  ["INDUSTRIES SERVED", "—"],
  ["DESIGN ASSETS DELIVERED", "—"],
  ["IDENTITY SYSTEMS BUILT", "—"],
  ["WEBSITES & DIGITAL EXPERIENCES", "—"],
] as const;

export default function WhyPage() {
  return (
    <main className="container-content flex flex-col gap-16 py-16">
      {/* Band 1 — the claim */}
      <header className="flex flex-col gap-4">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          WHY MUSTAFA
        </p>
        <h1 className="max-w-[20ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
          I don't design brands. <em>I build systems.</em>
        </h1>
        <p className="max-w-[56ch] text-lead text-text-secondary">
          Most designers deliver logos. Most agencies deliver visuals. I help
          organizations build identity systems that scale across teams,
          products, campaigns, and digital experiences — work that sits at the
          intersection of strategy, identity architecture, and operational
          thinking. The goal isn't something that looks good today; it's
          something that stays consistent, recognizable, and useful years from
          now.
        </p>
      </header>

      {/* Band 2 — why clients hire */}
      <section aria-label="Why clients hire" className="flex flex-col">
        <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          WHY CLIENTS HIRE ME
        </p>
        {REASONS.map(([title, body], i) => (
          <div
            key={title}
            className="border-t border-border-subtle py-3 last:border-b"
          >
            <p className="font-display text-title tracking-[-0.015em] text-text-primary">
              <span className="mr-2 font-mono text-label text-accent">
                0{i + 1}
              </span>
              {title}
            </p>
            <p className="mt-1 max-w-[64ch] text-body-sm text-text-secondary">
              {body}
            </p>
          </div>
        ))}
      </section>

      {/* Band 3 — the approach */}
      <section aria-label="Approach">
        <p className="pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          THE APPROACH
        </p>
        {APPROACH.map(([phase, body], i) => (
          <div
            key={phase}
            className="grid grid-cols-[6rem_1fr] items-baseline gap-2 border-b border-border-subtle py-2 md:grid-cols-[6rem_12rem_1fr]"
          >
            <span className="font-mono text-label text-text-tertiary">
              {String(i + 1).padStart(2, "0")} /
            </span>
            <span className="text-body text-text-primary">{phase}</span>
            <span className="col-span-2 text-body-sm text-text-secondary md:col-span-1">
              {body}
            </span>
          </div>
        ))}
      </section>

      {/* Band 4 — by the numbers (figures to be filled) */}
      <section aria-label="By the numbers" className="flex flex-col gap-2">
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          BY THE NUMBERS
        </p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border-subtle py-5 md:grid-cols-3">
          {NUMBERS.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <dd className="font-display text-display leading-[1] tracking-[-0.025em] text-text-primary">
                {value}
              </dd>
              <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                {label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Band 5 — what makes it different */}
      <section
        aria-label="What's different"
        className="flex flex-col gap-3 border-s-2 border-accent ps-5"
      >
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          WHAT MAKES THE WORK DIFFERENT
        </p>
        <p className="max-w-[60ch] text-lead text-text-secondary">
          Many designers focus on visuals. Many strategists focus on ideas.
          Many developers focus on implementation. This work connects all
          three — bridging business strategy, brand identity, and digital
          execution into systems that are easier to manage, easier to scale,
          and more effective in the real world.
        </p>
      </section>

      {/* Band 6 — Aboalazm OS + constellation */}
      <section
        aria-label="Aboalazm OS"
        className="flex flex-col items-center gap-4"
      >
        <p className="max-w-[56ch] text-center text-lead text-text-secondary">
          Aboalazm OS is the culmination of years of work in branding, systems
          thinking, design operations, and AI-assisted workflows — not a
          methodology, an operating system for building, managing, and evolving
          modern brands.
        </p>
        <SystemConstellation />
      </section>

      {/* Band 7 — CTA */}
      <section className="flex flex-col items-start gap-3 border-t border-border-subtle pt-8">
        <h2 className="max-w-[20ch] font-display text-title tracking-[-0.02em]">
          Build a brand that behaves like a system.
        </h2>
        <Link
          href="/contact"
          className="group font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
        >
          START A PROJECT
          <span
            aria-hidden
            className="ms-1 inline-block transition-transform duration-base ease-physics group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </section>
    </main>
  );
}
