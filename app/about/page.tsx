import type { Metadata } from "next";
import { SystemConstellation } from "@/features/hero";

export const metadata: Metadata = {
  title: "About — The Architect",
  description: "Seven years turning identity into infrastructure.",
};

/* The four principles — ported verbatim in spirit from the practice */
const DOCTRINE = [
  ["Strategy before design", "No logo until positioning, audience, and personality are agreed in writing — without strategy there's no way to judge."],
  ["Systems, not artifacts", "A logo is the entry. The real work is the system that follows, so the brand stays itself across every touchpoint."],
  ["Show the work", "A logo on a white page is theory; on a business card, a package, a screen — that's the test."],
  ["Deliver, don't dump", "Final files come with guidelines, a handover call, and 30 days of support. Done means the team can run with it."],
] as const;

const TIMELINE = [
  ["2024 →", "Co-Founder & Creative Lead", "Code & Canvas — branding & web for SMEs across Egypt and the region"],
  ["2020–25", "Media Director & Account Manager", "Nile Pharma Food — identity from zero: +40% visibility, +25% engagement"],
  ["2020–21", "Studio Lead & Visual Director", "Learn in Arabic (MSP) — identity + DIY studio built from scratch"],
  ["2019–21", "Head of Media ×2 Seasons", "Youth Scope — full identity twice; Best Head, both seasons"],
  ["2018 →", "Brand Consultant (Freelance)", "20+ systems across pharma, food, education, NGOs, government"],
] as const;

const FACTS = [
  ["BASED", "Al Obour, Egypt — open to remote"],
  ["LANGUAGES", "Arabic (Native) · English (Professional)"],
  ["EDUCATION", "B.Sc. — Al-Azhar University · 2017–2024"],
  ["TRAINING", "MSP · Youth Scope · AYB · Bedaya · Resalah"],
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
          Mustafa Aboalazm started designing professionally in 2018 — and
          never stopped. Senior Brand Identity Designer, Co-founder of
          Code & Canvas, based in Al Obour, Egypt, working worldwide:
          brand strategy, design systems, and the web they ship to, in two
          languages, under one doctrine.
        </p>

        <dl className="grid grid-cols-1 gap-2 border-y border-border-subtle py-3 sm:grid-cols-2">
          {FACTS.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{k}</dt>
              <dd className="text-body-sm text-text-secondary">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Band 2 — doctrine */}
      <section aria-label="Doctrine" className="flex flex-col">
        <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          DOCTRINE
        </p>
        {DOCTRINE.map(([title, body], i) => (
          <div
            key={title}
            className="border-t border-border-subtle py-3 last:border-b"
          >
            <p className="font-display text-title tracking-[-0.015em] text-text-primary">
              <span className="mr-2 font-mono text-label text-accent">0{i + 1}</span>
              {title}
            </p>
            <p className="mt-1 max-w-[60ch] text-body-sm text-text-secondary">{body}</p>
          </div>
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
