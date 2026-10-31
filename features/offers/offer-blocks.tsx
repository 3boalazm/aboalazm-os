"use client";

/**
 * OFFER BLOCKS — shared bilingual building blocks for
 * /services, /pricing, /agreement. All read useLang().
 */
import Link from "@/components/ui/localized-link";
import { contactHref, tierId } from "@/lib/contact-context";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/providers/lang-provider";
import {
  alacarteWhatsappHref,
  bookHref,
  DEPOSIT_CTA_LABEL,
  PAYMENT,
  RECOMMENDED_LABEL,
  WHATSAPP_ORDER_CTA_LABEL,
  type AlaCarteGroup,
  type Bi,
  type PlanId,
  type Tier,
} from "@/lib/offers";
import { BOOKING_CTA_LABEL, BOOKING_URL, RESPONSE_PROMISE } from "@/lib/contact-details";
import { buttonVariants } from "@/components/ui/Button";
import { FxSubline } from "@/components/ui/fx-price";
import { Icon } from "@/components/ui/Icon";
import { PanelCard } from "@/components/ui/PanelCard";

export const pick = (b: Bi, lang: "en" | "ar") => (lang === "ar" ? b[1] : b[0]);

function resolveTierPlanId(tier: Tier): PlanId {
  if (tier.id) return tier.id;
  return tierId(tier.tag[0]) as PlanId;
}

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
  const ar = lang === "ar";
  const source = usePathname().replace(/^\/(?:ar|en)(?=\/|$)/, "") || "/";
  const planId = resolveTierPlanId(tier);
  const depositUrl = bookHref(planId);
  const showBookingCall = Boolean(BOOKING_URL) && (tier.hasDiscoveryCall ?? true);

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
            {pick(RECOMMENDED_LABEL, lang)}
          </span>
        )}
      </div>
      <p className="font-display text-title tracking-[-0.015em]">{pick(tier.name, lang)}</p>
      <div>
        <p dir="ltr" className="font-geist text-lead text-accent">{tier.price}</p>
        <FxSubline usdOrPrice={tier.price} lang={lang} className="mt-1" />
      </div>
      <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">{pick(tier.priceNote, lang)}</p>

      <dl className="flex flex-col gap-1 border-y border-border-subtle py-2 font-mono text-micro sm:gap-0.5">
        {(
          [
            [ar ? "الأنسب لـ:" : "Best for:", pick(tier.bestFor, lang)],
            [ar ? "المدة:" : "Duration:", pick(tier.duration, lang)],
            [ar ? "الدفع:" : "Payment:", tier.payment],
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
        {tier.excludes?.map((item) => (
          <li key={item[0]} className="flex gap-1 text-body-sm text-text-ghost">
            <Icon name="x" className="text-text-ghost" />
            <span className="sr-only">{ar ? "غير مشمول: " : "Not included: "}</span>
            {pick(item, lang)}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <Link
          href={depositUrl}
          className={buttonVariants({
            variant: tier.recommended ? "primary" : "ghost",
            className: tier.recommended
              ? "w-full justify-center px-3 py-1.5 font-mono text-label tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5"
              : "w-full justify-center border border-accent/50 bg-accent/10 px-3 py-1.5 font-mono text-label tracking-[0.06em] text-accent transition-colors duration-base ease-physics hover:bg-accent/20",
          })}
        >
          {pick(DEPOSIT_CTA_LABEL, lang)} →
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro text-text-tertiary">
          <Link
            href={contactHref({ service: "brand-identity", tier: tierId(tier.tag[0]), source })}
            className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary"
          >
            {ar ? `ناقش ${pick(tier.name, lang)}` : `Discuss ${pick(tier.name, lang)}`}
          </Link>
          {showBookingCall ? (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-booking-click="true"
              className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {pick(BOOKING_CTA_LABEL, lang)} ↗
            </a>
          ) : null}
        </div>
      </div>
    </PanelCard>
  );
}

/**
 * Decision aid — read this before the three detailed cards.
 */
export function TierCompare({ tiers }: { tiers: readonly Tier[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const FIELDS = [
    { key: "best", label: ar ? "الأنسب لـ" : "Best for", value: (t: Tier) => pick(t.bestFor, lang) },
    { key: "from", label: ar ? "يبدأ من" : "From", value: (t: Tier) => t.price },
    { key: "dur", label: ar ? "المدة" : "Duration", value: (t: Tier) => pick(t.duration, lang) },
  ] as const;

  return (
    <>
      {/* ── Mobile / tablet: stacked cards ── */}
      <div
        role="group"
        aria-label={ar ? "مقارنة الفئات" : "Tier comparison"}
        className="grid gap-2 md:hidden"
      >
        {tiers.map((t) => {
          const planId = resolveTierPlanId(t);
          return (
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
                    <span className="sr-only">{ar ? "موصى بها" : "Recommended"}</span>
                  </>
                ) : null}
              </p>
              <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-x-2 gap-y-1">
                {FIELDS.map((f) => (
                  <div key={f.key} className="contents">
                    <dt className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
                      {f.label}
                    </dt>
                    <dd className="text-body-sm text-text-secondary">
                      <div>{f.value(t)}</div>
                      {f.key === "from" ? (
                        <FxSubline
                          usdOrPrice={t.price}
                          lang={lang}
                          showValidity={false}
                          compact
                          className="mt-0.5"
                        />
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-2.5 border-t border-border-subtle pt-2">
                <Link
                  href={bookHref(planId)}
                  className="inline-flex min-h-[36px] w-full items-center justify-center rounded-pill bg-accent px-3 py-1 font-mono text-micro font-medium text-obsidian"
                >
                  {pick(DEPOSIT_CTA_LABEL, lang)} →
                </Link>
              </div>
            </div>
          );
        })}
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
                      <span className="sr-only">{ar ? "موصى بها" : "Recommended"}</span>
                    </>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((f) => (
              <tr key={f.key} className="border-b border-border-subtle last:border-0">
                <th className="px-3 py-2 font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
                  {f.label}
                </th>
                {tiers.map((t) => (
                  <td key={t.tag[0]} className="px-3 py-2 text-text-secondary">
                    <div>{f.value(t)}</div>
                    {f.key === "from" ? (
                      <FxSubline
                        usdOrPrice={t.price}
                        lang={lang}
                        showValidity={false}
                        compact
                        className="mt-0.5"
                      />
                    ) : null}
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
  const ar = lang === "ar";
  return (
    <div className="flex flex-col gap-4">
      {alaCarte.map((g) => (
        <div key={g.group[0]}>
          <p className="border-b border-border-default pb-1 font-mono text-micro uppercase tracking-[0.10em] text-accent">
            {pick(g.group, lang)}
          </p>
          {g.rows.map((r) => {
            const isDeposit = r.ctaKind === "deposit" && Boolean(r.planId);
            const isStore72h = r.id === "store-72h";
            return (
              <div
                key={r.service[0]}
                className="grid grid-cols-1 gap-2 border-b border-border-subtle py-2.5 md:grid-cols-[15rem_1fr_auto] md:items-center"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {isStore72h ? (
                    <Link
                      href="/services/store-72h"
                      className="text-body-sm font-medium text-text-primary underline decoration-accent/50 underline-offset-4 hover:text-accent"
                    >
                      {pick(r.service, lang)}
                    </Link>
                  ) : (
                    <span className="text-body-sm text-text-primary">{pick(r.service, lang)}</span>
                  )}
                </div>
                <span className="font-mono text-micro text-text-tertiary">
                  {pick(r.details, lang)}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
                  <div className="md:text-end">
                    <span dir="ltr" className="font-geist text-body-sm text-accent">{r.price}</span>
                    <FxSubline
                      usdOrPrice={r.startingUsd ?? r.price}
                      lang={lang}
                      showValidity={false}
                      compact
                    />
                  </div>
                  {isDeposit && r.planId ? (
                    <Link
                      href={bookHref(r.planId)}
                      className="inline-flex min-h-[32px] items-center rounded-pill border border-accent/50 bg-accent/15 px-2.5 py-1 font-mono text-micro font-medium text-accent transition-colors hover:bg-accent/25"
                    >
                      {pick(DEPOSIT_CTA_LABEL, lang)} →
                    </Link>
                  ) : (
                    <a
                      href={alacarteWhatsappHref(r, lang)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[32px] items-center rounded-pill border border-border-default bg-surface-1 px-2.5 py-1 font-mono text-micro text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
                    >
                      {pick(WHATSAPP_ORDER_CTA_LABEL, lang)} ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
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
    <section className="flex flex-col items-center gap-3 border-t border-border-subtle py-6 text-center">
      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        — {pick(kicker, lang)} —
      </p>
      <p className="font-display text-display tracking-[-0.025em]">
        {pick(title, lang)} <em className="text-accent">{pick(italic, lang)}</em>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link href={primaryHref} className={buttonVariants({ className: "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-label tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5" })}>
          {pick(primary, lang)}
          <Icon name="sparkle" size="0.9em" />
        </Link>
        <Link href={secondaryHref} className={buttonVariants({ variant: "ghost", className: "glass inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary" })}>
          {pick(secondary, lang)}
          <Icon name="arrow-right" />
        </Link>
      </div>
      <p className="font-mono text-micro text-text-tertiary">
        {lang === "ar" ? RESPONSE_PROMISE.ar : RESPONSE_PROMISE.en}
      </p>
    </section>
  );
}
