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
            AVG. RESPONSE: UNDER 24H · SUN–THU · 10AM–7PM CAIRO
          </p>
        </div>

        {/* Four ways in — ported from the live portfolio */}
        <div className="mt-2 flex flex-col border-t border-border-subtle">
          {(
            [
              ["EMAIL", "Best for project briefs", "Mustafaaboalazm@mail.ru", "mailto:Mustafaaboalazm@mail.ru"],
              ["WHATSAPP", "Quick conversations", "+20 109 250 0454", "https://wa.me/201092500454"],
              ["LINKEDIN", "Professional network", "linkedin.com/in/aboalazm", "https://www.linkedin.com/in/aboalazm"],
              ["BEHANCE", "Full portfolio", "behance.net/aboalazm", "https://www.behance.net/aboalazm"],
            ] as const
          ).map(([tag, hint, label, href]) => (
            <a
              key={tag}
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group grid grid-cols-[6rem_1fr_auto] items-baseline gap-2 border-b border-border-subtle py-2"
            >
              <span className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
                {tag}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-body-sm text-text-primary">{label}</span>
                <span className="block font-mono text-micro text-text-ghost">{hint}</span>
              </span>
              <span
                aria-hidden
                className="text-text-tertiary transition-transform duration-base ease-physics group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Right — the form */}
      <ContactForm />
    </main>
  );
}
