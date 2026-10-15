"use client";

/**
 * OFFER BLOCKS — shared bilingual building blocks for
 * /services, /pricing, /agreement. All read useLang().
 */
import { useLang } from "@/components/providers/lang-provider";
import { trackEvent } from "@/lib/analytics";
import { PAYMENT, type Bi, type Tier, type AlaCarteGroup } from "@/lib/offers";
import { buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PanelCard } from "@/components/ui/PanelCard";

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
    <PanelCard
      emphasis={tier.recommended ? "accent" : "dimmed"}
      className="flex flex-col gap-2 rounded-panel p-3"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {pick(tier.tag, lang)}
        </span>
        {tier.recommended && (
          <span className="inline-flex items-center gap-1 font-mono text-micro uppercase tracking-[0.10em] text-accent">
            <Icon name="star-solid" size="0.9em" />
            {lang === "ar" ? "الأكثر طلبًا" : "Recommended"}
          </span>
        )}
      </div>
      <p className="font-display text-title tracking-[-0.015em]">{pick(tier.name, lang)}</p>
      <p className="font-geist text-lead text-accent">{tier.price}</p>
      <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">{pick(tier.priceNote, lang)}</p>

      {/* Label and value stack on a phone instead of sitting side by side.
          At 390px the inline `flex gap-1` split "Best for:" onto two lines
          ("Best" / "for:") next to a too-narrow value column, which read as
          broken rather than dense. */}
      <dl className="flex flex-col gap-1 border-y border-border-subtle py-2 font-mono text-micro sm:gap-0.5">
        {(
          [
            [lang === "ar" ? "الأنسب لـ:" : "Best for:", pick(tier.bestFor, lang)],
            [lang === "ar" ? "المدة:" : "Duration:", pick(tier.duration, lang)],
            [lang === "ar" ? "الدفع:" : "Payment:", tier.payment],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0 sm:flex-row sm:gap-1">
            <dt className="shrink-0 text-text-ghost">{label}</dt>
            <dd className="text-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
        {pick(tier.includesHead, lang)}
      </p>
      <ul className="flex flex-col gap-1">
        {tier.includes.map((item) => (
          <li key={item[0]} className="flex gap-1 text-body-sm text-text-secondary">
            <Icon name="check" className="text-success" />
            {pick(item, lang)}
          </li>
        ))}
        {/* Both glyphs are aria-hidden decoration, which meant an excluded
            item ("Brand strategy") read exactly like an included one — and
            under the Tier 02/03 heading "Everything in Tier 01, plus" that
            reads as a promise rather than a deduction. The excluded rows now
            carry their own label in text. */}
        {tier.excludes?.map((item) => (
          <li key={item[0]} className="flex gap-1 text-body-sm text-text-ghost">
            <Icon name="x" className="text-text-ghost" />
            <span className="sr-only">{lang === "ar" ? "غير مشمول: " : "Not included: "}</span>
            {pick(item, lang)}
          </li>
        ))}
      </ul>
      <a
        href="/contact"
        className={buttonVariants({
          variant: tier.recommended ? "primary" : "ghost",
          className: tier.recommended
            ? "mt-auto w-fit px-3 py-1.5 font-mono text-label tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5"
            : "mt-auto w-fit border border-border-default px-3 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary",
        })}
      >
        {lang === "ar" ? `ناقش ${pick(tier.name, lang)}` : `Discuss ${pick(tier.name, lang)}`}
      </a>
    </PanelCard>
  );
}

/**
 * Decision aid — read this before the three detailed cards.
 *
 * TWO PRESENTATIONS FROM ONE DATA SOURCE, not one squeezed table:
 * the comparison carries three tiers × three fields, which at 390px is a
 * ~584px table inside a ~342px wrapper. `overflow-x-auto` hid the third
 * tier off-screen entirely — "Full Brand System" simply could not be
 * compared on a phone. Below `md` the same rows stack into one card per
 * tier; from `md` up the table returns unchanged.
 *
 * The `RECOMMENDED` signal lives in exactly one place here. The column
 * header used to repeat it as "Best for most projects" while the tier
 * card below said "★ Recommended" — two recommendation signals on one
 * screen read as hesitation, so the header now carries a quiet star only.
 */
export function TierCompare({ tiers }: { tiers: readonly Tier[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const FIELDS = [
    { label: ar ? "الأنسب لـ" : "Best for", value: (t: Tier) => pick(t.bestFor, lang) },
    { label: ar ? "يبدأ من" : "From", value: (t: Tier) => t.price },
    { label: ar ? "المدة" : "Duration", value: (t: Tier) => pick(t.duration, lang) },
  ] as const;

  return (
    <>
      {/* ── Mobile / tablet: stacked cards ──
          Mirrors the table's <caption> as a named group, so the stacked
          presentation is announced as "Tier comparison" instead of arriving
          as three unlabelled cards in the reading order. */}
      <div
        role="group"
        aria-label={ar ? "مقارنة الفئات" : "Tier comparison"}
        className="grid gap-2 md:hidden"
      >
        {tiers.map((t) => (
          <div
            key={t.tag[0]}
            className={[
              "rounded-card border p-3",
              t.recommended
                ? "border-accent/40 bg-accent-08"
                : "border-border-subtle bg-surface-1/40",
            ].join(" ")}
          >
            <p className="flex items-baseline gap-2 font-display font-display-sm text-body tracking-[-0.015em] text-text-primary">
              {pick(t.name, lang)}
              {t.recommended ? (
                <>
                  <Icon name="star-solid" size="0.9em" className="text-accent" />
                  {/* The star is the only recommendation signal left in the
                      comparison (see the note above TierCompare). aria-hidden
                      keeps it out of the accessible name, so the same fact is
                      carried by text — otherwise the decision aid recommends
                      nothing at all for a non-visual reader. */}
                  <span className="sr-only">{ar ? "الأكثر طلبًا" : "Recommended"}</span>
                </>
              ) : null}
            </p>
            <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-x-2 gap-y-1">
              {FIELDS.map((f) => (
                <div key={f.label} className="contents">
                  <dt className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
                    {f.label}
                  </dt>
                  <dd className="text-body-sm text-text-secondary">{f.value(t)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* ── Desktop: the comparison table ── */}
      <div className="hidden overflow-x-auto rounded-card border border-border-subtle md:block">
        <table className="w-full text-start text-body-sm">
          <caption className="sr-only">{ar ? "مقارنة الفئات" : "Tier comparison"}</caption>
          <thead>
            <tr className="border-b border-border-subtle bg-surface-1">
              <th className="px-3 py-2 font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
                {ar ? "المعيار" : "Fit"}
              </th>
              {tiers.map((t) => (
                <th key={t.tag[0]} className="px-3 py-2 font-display font-display-sm text-body tracking-[-0.015em] text-text-primary">
                  {pick(t.name, lang)}
                  {t.recommended ? (
                    <>
                      <Icon name="star-solid" size="0.9em" className="ms-2 text-accent" />
                      {/* Lives inside the <th>, so screen readers announce the
                          recommendation with the column header of every cell
                          in that column. */}
                      <span className="sr-only">{ar ? "الأكثر طلبًا" : "Recommended"}</span>
                    </>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((f) => (
              <tr key={f.label} className="border-b border-border-subtle last:border-0">
                <th className="px-3 py-2 font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
                  {f.label}
                </th>
                {tiers.map((t) => (
                  <td key={t.tag[0]} className="px-3 py-2 text-text-secondary">
                    {f.value(t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
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
        <a href={primaryHref} onClick={() => trackEvent("cta_start_project", { placement: "cta_band", href: primaryHref })} className={buttonVariants({ className: "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-label tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5" })}>
          {pick(primary, lang)}
          <Icon name="sparkle" size="0.9em" />
        </a>
        <a href={secondaryHref} className={buttonVariants({ variant: "ghost", className: "glass inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary" })}>
          {pick(secondary, lang)}
          <Icon name="arrow-right" />
        </a>
      </div>
    </section>
  );
}
