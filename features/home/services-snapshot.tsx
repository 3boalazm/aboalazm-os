"use client";

/**
 * SERVICES SNAPSHOT — the offer in one glance (overhaul S2, spec §4.3-05).
 * Three tiers, reads from the single source of truth (lib/offers TIERS) so
 * the home page can never drift from /pricing. Recommended tier carries the
 * accent edge; every card ends on /pricing, not a fake checkout.
 */
import { ServicePaths } from "@/features/offers/service-paths";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { PanelCard } from "@/components/ui/PanelCard";
import { TIERS } from "@/lib/offers";

export function ServicesSnapshot() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <div className="flex flex-col gap-6">
      <ServicePaths />
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-[46ch] flex-col gap-1">
          <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
            {ar ? (
              <>باقات الهوية البصرية. <em className="text-accent">نختار البداية المناسبة.</em></>
            ) : (
              <>Identity packages. <em className="text-accent">Choose your starting point.</em></>
            )}
          </h2>
          <p className="text-body-sm text-text-secondary">
            {ar
              ? "باقات واضحة بأسعار معلنة — تختار على مقاس المشروع، والتفاصيل الكاملة في صفحة التسعير."
              : "Published, transparent packages. Pick the one sized for your project — full detail lives on the pricing page."}
          </p>
        </div>
        <Link
          href="/pricing"
          className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
        >
          {ar ? "التسعير الكامل" : "Full pricing"}
          <span aria-hidden className="ms-1 inline-flex">
            <Icon name="arrow-right" />
          </span>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const recommended = "recommended" in tier && tier.recommended;
          return (
            <PanelCard
              key={tier.name[0]}
              emphasis={recommended ? "accent" : "default"}
              className="relative flex flex-col gap-3 rounded-panel p-3 md:p-4"
            >
              {recommended ? (
                <span className="absolute -top-2.5 start-4 rounded-pill bg-accent px-2 py-0.5 font-mono text-micro uppercase tracking-[0.10em] text-obsidian">
                  {ar ? "موصى بها" : "Recommended"}
                </span>
              ) : null}
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{ar ? tier.tag[1] : tier.tag[0]}</p>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">{ar ? tier.name[1] : tier.name[0]}</h3>
                <p className="font-display text-title tracking-[-0.02em] text-text-primary">{tier.price}</p>
                <p className="text-body-sm text-text-tertiary">
                  {ar ? tier.priceNote[1] : tier.priceNote[0]} · {ar ? tier.duration[1] : tier.duration[0]} · {tier.payment}
                </p>
              </div>
              <p className="text-body-sm text-text-secondary">
                <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{ar ? "الأنسب لـ: " : "Best for: "}</span>
                {ar ? tier.bestFor[1] : tier.bestFor[0]}
              </p>
              <ul className="flex flex-col gap-1.5 border-t border-border-subtle pt-3">
                {tier.includes.slice(0, 4).map((inc) => (
                  <li key={inc[0]} className="flex items-start gap-2 text-body-sm text-text-secondary">
                    <span className="mt-[0.55em] size-1 shrink-0 rounded-pill bg-accent" aria-hidden />
                    {ar ? inc[1] : inc[0]}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-auto inline-flex w-fit items-center gap-1 pt-1 font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
              >
                {ar ? "كل التفاصيل" : "Everything it includes"}
                <span aria-hidden className="inline-flex">
                  <Icon name="arrow-right" />
                </span>
              </Link>
            </PanelCard>
          );
        })}
      </div>

      <p className="text-body-sm text-text-tertiary">
        {ar ? "محتاج حاجة واحدة بس؟ " : "Need just one thing? "}
        <Link href="/services" className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary">
          {ar ? "القائمة الفردية (À la carte) والخدمات بالتفصيل" : "À la carte menu and services in detail"}
        </Link>
      </p>
    </div>
  );
}
