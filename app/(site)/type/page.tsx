"use client";

/**
 * /type — GC EPICPRO + Montserrat type system showcase
 * Internal reference page.
 */

const SPECIMEN_ALPHA = "ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\n0123456789";

export default function TypePage() {
  return (
    <main className="min-h-screen bg-obsidian px-6 py-16 lg:px-16">

      {/* ── Header ── */}
      <div className="mb-16 border-b border-border-subtle pb-8">
        <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-ghost">
          INTERNAL · TYPE SYSTEM
        </p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-text-primary">
          GC EPIC<span className="text-accent">PRO</span>
        </h1>
        <p className="mt-3 font-sans text-[1rem] text-text-secondary">
          Headings — GC EPICPRO Extra Bold (800) · Body — Montserrat
        </p>
      </div>

      {/* ── Alphabet ── */}
      <section className="mb-16">
        <Label>GC EPICPRO · full character set · weight 800</Label>
        <pre className="font-display mt-4 whitespace-pre-wrap text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.3] tracking-[0.01em] text-text-secondary">
          {SPECIMEN_ALPHA}
        </pre>
      </section>

      {/* ── Scale ── */}
      <section className="mb-16">
        <Label>Heading scale</Label>
        <div className="mt-6 space-y-6 border-b border-border-subtle pb-8">
          {[
            { label: "Hero  — clamp(3.5rem, 9vw, 8.5rem)", size: "clamp(3.5rem,9vw,8.5rem)", lh: "0.95", ls: "-0.03em" },
            { label: "Display — clamp(2.5rem, 5.5vw, 5rem)", size: "clamp(2.5rem,5.5vw,5rem)", lh: "1.02", ls: "-0.025em" },
            { label: "Title — clamp(1.5rem, 2.8vw, 2.25rem)", size: "clamp(1.5rem,2.8vw,2.25rem)", lh: "1.15", ls: "-0.015em" },
          ].map(({ label, size, lh, ls }) => (
            <div key={label} className="border-b border-border-subtle/40 pb-6">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-ghost">{label}</span>
              <p
                className="font-display text-text-primary"
                style={{ fontSize: size, lineHeight: lh, letterSpacing: ls }}
              >
                Brand System
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Montserrat body scale ── */}
      <section className="mb-16">
        <Label>Montserrat · body scale</Label>
        <div className="mt-6 space-y-4">
          {[
            { label: "body-lg  1.125rem / 400", text: "Senior Brand Identity Designer & Co-founder, Code & Canvas.", weight: "400", size: "1.125rem" },
            { label: "body  1rem / 400", text: "Building brands with clarity, craft, and a respect for the work.", weight: "400", size: "1rem" },
            { label: "body-sm  0.875rem / 400", text: "7+ years across pharma, food, education, and government sectors.", weight: "400", size: "0.875rem" },
            { label: "body-sm / 600 — emphasis", text: "Strategy before design. Always.", weight: "600", size: "0.875rem" },
            { label: "label  0.75rem / 500 — UI labels", text: "SELECTED WORK · 2024", weight: "500", size: "0.75rem" },
          ].map(({ label, text, weight, size }) => (
            <div key={label} className="border-b border-border-subtle/40 pb-4">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-ghost">{label}</span>
              <p
                className="mt-1 text-text-secondary"
                style={{ fontFamily: "Montserrat, system-ui", fontWeight: weight, fontSize: size, lineHeight: 1.6 }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Real-world contexts ── */}
      <section className="mb-16">
        <Label>Real-world contexts</Label>
        <div className="mt-6 space-y-8">

          {/* Hero */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Hero — index page</CtxLabel>
            <h2
              className="font-display text-text-primary"
              style={{ fontSize: "clamp(3.5rem,9vw,8.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
            >
              Systemic<br />
              <span className="text-accent">Identity.</span>
            </h2>
          </div>

          {/* Section title + body */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Section heading + Montserrat body</CtxLabel>
            <h3
              className="font-display text-text-primary"
              style={{ fontSize: "clamp(1.5rem,2.8vw,2.25rem)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
            >
              A handful of brands I&apos;ve{" "}
              <span className="text-accent">shaped.</span>
            </h3>
            <p
              className="mt-4 max-w-[52ch] text-text-secondary"
              style={{ fontFamily: "Montserrat, system-ui", fontSize: "0.9rem", lineHeight: 1.7 }}
            >
              7+ years of building visual identity systems for 20+ clients across
              pharma, food, education, and government — every project grounded in
              strategy before any pixel moves.
            </p>
          </div>

          {/* Nav preview */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Nav links — GC EPICPRO at small size</CtxLabel>
            <div className="mt-4 flex items-center gap-4">
              <span
                className="font-display text-text-primary"
                style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}
              >
                M<span className="text-accent">A</span>
              </span>
              {["ABOUT", "WORK", "SERVICES", "RESOURCES", "PRICING"].map((l) => (
                <span
                  key={l}
                  className="font-display text-text-tertiary"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
                >
                  {l}
                </span>
              ))}
              <span
                className="rounded-pill bg-accent px-2 py-0.5 font-display text-obsidian"
                style={{ fontSize: "0.65rem", letterSpacing: "0.06em" }}
              >
                CONTACT
              </span>
            </div>
          </div>

          {/* Footer MA */}
          <div className="rounded-panel border border-border-subtle bg-surface-1 p-8">
            <CtxLabel>Footer wordmark</CtxLabel>
            <p
              className="font-display text-text-primary"
              style={{ fontSize: "1.6rem", lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              M<span className="text-accent">A</span>.
            </p>
            <p
              className="mt-3 max-w-[36ch] text-text-tertiary"
              style={{ fontFamily: "Montserrat, system-ui", fontSize: "0.8rem", lineHeight: 1.65 }}
            >
              Senior Brand Identity Designer & Co-founder, Code & Canvas.
              Building brands with clarity, craft, and a respect for the work.
            </p>
          </div>

        </div>
      </section>

      {/* ── CSS reference ── */}
      <section>
        <Label>Quick reference</Label>
        <div className="mt-4 overflow-x-auto rounded-card border border-border-subtle bg-surface-1 p-6">
          <table className="w-full text-left font-mono text-[0.68rem] text-text-secondary">
            <thead>
              <tr className="border-b border-border-subtle text-text-ghost">
                <th className="pb-3 pr-8">Element</th>
                <th className="pb-3 pr-8">Font</th>
                <th className="pb-3 pr-8">Weight</th>
                <th className="pb-3">Tailwind class</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["H1 / Hero", "GC EPICPRO", "800", "font-display"],
                ["H2 / Display", "GC EPICPRO", "800", "font-display"],
                ["H3 / Title", "GC EPICPRO", "800", "font-display"],
                ["Nav links", "GC EPICPRO", "800", "font-display"],
                ["Footer MA", "GC EPICPRO", "800", "font-display"],
                ["Body / paragraph", "Montserrat", "400", "font-sans"],
                ["Body emphasis", "Montserrat", "600", "font-sans font-semibold"],
                ["UI labels / mono", "JetBrains Mono", "400", "font-mono"],
                ["AR headings", "Thmanyah Serif Display", "400–900", "font-display (auto RTL)"],
                ["AR body", "IBM Plex Sans Arabic", "400", "font-sans (auto RTL)"],
              ].map(([el, font, w, cls]) => (
                <tr key={el} className="border-b border-border-subtle/40">
                  <td className="py-2 pr-8 text-text-primary">{el}</td>
                  <td className="py-2 pr-8">{font}</td>
                  <td className="py-2 pr-8">{w}</td>
                  <td className="py-2">{cls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-text-ghost">
      {children}
    </p>
  );
}

function CtxLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-text-ghost">
      {children}
    </p>
  );
}
