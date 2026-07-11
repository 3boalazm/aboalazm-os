"use client";

/**
 * OFFER BLOCKS — shared bilingual building blocks for
 * /services, /pricing, /agreement. All read useLang().
 */
import { useLang } from "@/components/providers/lang-provider";
import { PAYMENT, type Bi, type Tier, type AlaCarteGroup } from "@/lib/offers";
import { buttonVariants } from "@/components/ui/Button";

export const pick = (b: Bi, lang: "en" | "ar") => (lang === "ar" ? b[1] : b[0]);

/* ── Section header: mono label + serif statement ── */
export function SectionHead({
  label,
  title,
  italic,
}: {
  label: Bi;
  title: Bi;
  italic?: Bi;
}) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        {pick(label, lang)}
      </p>
      <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
        {pick(title, lang)}{" "}
        {italic && <em className="text-accent">{pick(italic, lang)}</em>}
      </h2>
    </div>
  );
}

/* ── Tier card ── */
export function TierCard({ tier }: { tier: Tier }) {
  const { lang } = useLang();
  return (
    <div
      className={[
        "flex flex-col gap-2 rounded-panel border p-3",
        tier.recommended
          ? "border-accent bg-surface-1 shadow-card"
          : "border-border-subtle bg-surface-1/60",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {pick(tier.tag, lang)}
        </span>
        {tier.recommended && (
          <span className="font-mono text-micro uppercase tracking-[0.10em] text-accent">
            ★ {lang === "ar" ? "الأكثر طلبًا" : "Recommended"}
          </span>
        )}
      </div>
      <p className="font-display text-title tracking-[-0.015em]">{pick(tier.name, lang)}</p>
      <p className="font-geist text-lead text-accent">{tier.price}</p>
      <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">{pick(tier.priceNote, lang)}</p>

      <dl className="flex flex-col gap-0.5 border-y border-border-subtle py-2 font-mono text-micro">
        <div className="flex gap-1">
          <dt className="text-text-ghost">{lang === "ar" ? "الأنسب لـ:" : "Best for:"}</dt>
          <dd className="text-text-secondary">{pick(tier.bestFor, lang)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-text-ghost">{lang === "ar" ? "المدة:" : "Duration:"}</dt>
          <dd className="text-text-secondary">{pick(tier.duration, lang)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-text-ghost">{lang === "ar" ? "الدفع:" : "Payment:"}</dt>
          <dd className="text-text-secondary">{tier.payment}</dd>
        </div>
      </dl>

      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
        {pick(tier.includesHead, lang)}
      </p>
      <ul className="flex flex-col gap-1">
        {tier.includes.map((item) => (
          <li key={item[0]} className="flex gap-1 text-body-sm text-text-secondary">
            <span aria-hidden className="text-[#3DDC84]">✓</span>
            {pick(item, lang)}
          </li>
        ))}
        {tier.excludes?.map((item) => (
          <li key={item[0]} className="flex gap-1 text-body-sm text-text-ghost">
            <span aria-hidden>✕</span>
            {pick(item, lang)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TierGrid({ tiers }: { tiers: readonly Tier[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
      {tiers.map((t) => (
        <TierCard key={t.tag[0]} tier={t} />
      ))}
    </div>
  );
}

/* ── À la carte tables ── */
export function AlaCarteTables({ alaCarte }: { alaCarte: readonly AlaCarteGroup[] }) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col gap-4">
      {alaCarte.map((g) => (
        <div key={g.group[0]}>
          <p className="border-b border-border-default pb-1 font-mono text-micro uppercase tracking-[0.10em] text-accent">
            {pick(g.group, lang)}
          </p>
          {g.rows.map((r) => (
            <div
              key={r.service[0]}
              className="grid grid-cols-[1fr_auto] items-baseline gap-2 border-b border-border-subtle py-2 md:grid-cols-[14rem_1fr_auto]"
            >
              <span className="text-body-sm text-text-primary">{pick(r.service, lang)}</span>
              <span className="col-span-2 font-mono text-micro text-text-tertiary md:col-span-1">
                {pick(r.details, lang)}
              </span>
              <span className="hidden font-geist text-body-sm text-accent md:block">{r.price}</span>
              <span className="font-geist text-body-sm text-accent md:hidden">{r.price}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Payment structure ── */
export function PaymentBlock() {
  const { lang } = useLang();
  const cards = [PAYMENT.t1, PAYMENT.t23];
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.split} className="rounded-card border border-border-subtle bg-surface-1 p-3">
            <p className="text-body text-text-primary">{pick(c.title, lang)}</p>
            <p className="font-geist text-micro text-accent">{c.split}</p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {c.steps.map((s) => (
                <li key={s[0]} className="text-body-sm text-text-secondary">— {pick(s, lang)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="max-w-[70ch] text-body-sm text-text-tertiary">
        <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {lang === "ar" ? "وسائل الدفع: " : "Payment methods: "}
        </span>
        {pick(PAYMENT.methods, lang)}
      </p>
    </div>
  );
}

/* ── FAQ (native details/summary — zero JS) ── */
export function Faq({ items }: { items: readonly { q: Bi; a: Bi }[] }) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col">
      {items.map((f) => (
        <details key={f.q[0]} className="group border-b border-border-subtle py-2">
          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-2 text-body text-text-primary transition-colors duration-base ease-physics hover:text-accent">
            {pick(f.q, lang)}
            <span aria-hidden className="font-mono text-label text-accent transition-transform duration-base ease-physics group-open:rotate-45">+</span>
          </summary>
          <p className="mt-1 max-w-[70ch] text-body-sm text-text-secondary">{pick(f.a, lang)}</p>
        </details>
      ))}
    </div>
  );
}

/* ── CTA band (old-site style serif moment) ── */
export function CtaBand({
  kicker, title, italic, primary, primaryHref, secondary, secondaryHref,
}: {
  kicker: Bi; title: Bi; italic: Bi;
  primary: Bi; primaryHref: string;
  secondary: Bi; secondaryHref: string;
}) {
  const { lang } = useLang();
  return (
    <section className="flex flex-col items-center gap-3 border-t border-border-subtle py-16 text-center">
      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        — {pick(kicker, lang)} —
      </p>
      <p className="font-display text-display tracking-[-0.025em]">
        {pick(title, lang)} <em className="text-accent">{pick(italic, lang)}</em>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a href={primaryHref} className={buttonVariants({ className: "px-3 py-1.5 font-mono text-label tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5" })}>
          {pick(primary, lang)} ✦
        </a>
        <a href={secondaryHref} className={buttonVariants({ variant: "ghost", className: "glass px-3 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary" })}>
          {pick(secondary, lang)} →
        </a>
      </div>
    </section>
  );
}
