import type { Metadata } from "next";
import { StatusNode } from "@/features/hero";
import { ContactForm } from "@/features/contact";

export const metadata: Metadata = {
  title: "Contact — Start a Commission",
  description: "Selective commissions. Start with the brief, not the logo.",
};

export default function ContactPage() {
  return (
    <main className="container-wide grid min-h-svh gap-8 py-16 lg:grid-cols-[5fr_7fr]">
      {/* Left — the pitch */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
          07 / CONTACT
        </p>
        <h1 className="max-w-[14ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
          Start with the brief, <em>not the logo.</em>
        </h1>
        <p className="max-w-[46ch] text-lead text-text-secondary">
          Selective commissions only. If the timeline or budget guarantees
          mediocrity, you'll hear it on the first call — that honesty is free.
        </p>

        <div className="mt-4 flex flex-col items-start gap-2">
          <StatusNode />
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            NEXT OPENING: Q3 2026
          </p>
          <a
            href="mailto:hello@aboalazm.com"
            className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
          >
            OR: HELLO@ABOALAZM.COM
          </a>
        </div>
      </div>

      {/* Right — the form */}
      <ContactForm />
    </main>
  );
}
