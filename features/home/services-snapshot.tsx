"use client";

/**
 * SERVICES SNAPSHOT — the offer in one glance (overhaul S2, spec §4.3-05).
 * Three tiers, reads from the single source of truth (lib/offers TIERS) so
 * the home page can never drift from /pricing. Recommended tier carries the
 * accent edge; every card includes a primary "Book with a deposit" CTA.
 */
import Image from "next/image";
import { ServicePaths } from "@/features/offers/service-paths";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { buttonVariants } from "@/components/ui/Button";
import { FxSubline } from "@/components/ui/fx-price";
import { Icon } from "@/components/ui/Icon";
import { PanelCard } from "@/components/ui/PanelCard";
import { BOOKING_CTA_LABEL, BOOKING_URL } from "@/lib/contact-details";
import {
  DISCOVERY_CTA_LABEL,
  TIERS,
} from "@/lib/offers";

/* One authored plate per tier. These used to be project thumbnails, which made
   a published price look like it buys that one client's artefact; the tiers are
   now pictured as what they are — a mark, an identity kit, a full system. */
const TIER_ART: Record<string, string> = {
  "logo-design": "/images/generated/creative-orb.jpg",
  "brand-identity": "/images/generated/creative-paper-arc.jpg",
  "full-brand-system": "/images/generated/creative-type-texture.jpg",
};

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
              <>
                لو البداية هوية. <em className="text-accent">دي الفئات والنطاق.</em>
              </>
            ) : (
              <>
                If the starting point is brand. <em className="text-accent">Here is the range.</em>
              </>
            )}
          </h2>
          <p className="text-body-sm text-text-secondary">
            {ar
              ? "باقات هوية بأسعار معلنة ونطاق مكتوب. التجربة الرقمية وأنظمة التشغيل تُسعَّر لكل مشروع حسب النطاق — والتفاصيل الكاملة في صفحة التسعير."
              : "Brand packages with published prices and a written scope. Digital experience and business systems are scoped per project — full detail on the pricing page."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className={buttonVariants({
              variant: "primary",
              className:
                "inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-label tracking-[0.06em]",
            })}
          >
            {ar ? DISCOVERY_CTA_LABEL[1] : lang === "ms" ? "Tempah panggilan penemuan" : DISCOVERY_CTA_LABEL[0]} →
          </Link>
          <Link
            href="/pricing"
            className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
          >
            {ar ? "التسعير الكامل" : lang === "ms" ? "Harga penuh" : "Full pricing"}
            <span aria-hidden className="ms-1 inline-flex">
              <Icon name="arrow-right" />
            </span>
          </Link>
        </div>
      </div>

      {/* phones: swipe between the three packages instead of a three-screen stack */}
      <div className="grid gap-4 max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:gap-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:pt-3 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden lg:grid-cols-3">
        {TIERS.map((tier) => {
          const recommended = Boolean(tier.recommended);
          return (
            <PanelCard
              key={tier.name[0]}
              emphasis={recommended ? "accent" : "default"}
              className="relative flex flex-col gap-3 rounded-panel p-3 max-md:w-[84%] max-md:shrink-0 max-md:snap-start md:p-4"
            >
              {recommended ? (
                <span className="absolute -top-2.5 start-4 z-elevated rounded-pill bg-accent px-2 py-0.5 font-mono text-micro uppercase tracking-[0.10em] text-obsidian">
                  {ar ? "موصى بها" : lang === "ms" ? "Disyorkan" : "Recommended"}
                </span>
              ) : null}
              {/* The tier's own deliverable, with its tag painted on it. */}
              <div className="relative aspect-[16/8] overflow-hidden rounded-card">
                <Image
                  src={TIER_ART[tier.id] ?? "/images/generated/creative-type-texture.jpg"}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 84vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-transparent"
                />
                <span className="absolute bottom-2.5 start-3 font-mono text-micro uppercase tracking-[0.10em] text-alabaster">
                  {ar ? tier.tag[1] : tier.tag[0]}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">
                  {ar ? tier.name[1] : tier.name[0]}
                </h3>
                <p dir="ltr" className="font-display text-title tracking-[-0.02em] text-text-primary">
                  {tier.price}
                </p>
                <FxSubline usdOrPrice={tier.price} lang={lang} />
                <p className="text-body-sm text-text-tertiary">
                  {ar ? tier.priceNote[1] : tier.priceNote[0]} ·{" "}
                  {ar ? tier.duration[1] : tier.duration[0]} · {tier.payment}
                </p>
              </div>
              <p className="text-body-sm text-text-secondary">
                <span className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                  {ar ? "الأنسب لـ: " : lang === "ms" ? "Sesuai untuk: " : "Best for: "}
                </span>
                {ar ? tier.bestFor[1] : tier.bestFor[0]}
              </p>
              <ul className="flex flex-col gap-1.5 border-t border-border-subtle pt-3">
                {tier.includes.slice(0, 4).map((inc, n) => (
                  <li key={inc[0]} className={`flex items-start gap-2 text-body-sm text-text-secondary ${n >= 3 ? "max-sm:hidden" : ""}`}>
                    <span className="mt-[0.55em] size-1 shrink-0 rounded-pill bg-accent" aria-hidden />
                    {ar ? inc[1] : inc[0]}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 pt-2">
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: recommended ? "primary" : "ghost",
                    className: recommended
                      ? "w-full justify-center px-3 py-1.5 font-mono text-label tracking-[0.06em]"
                      : "w-full justify-center border border-accent/50 bg-accent/10 px-3 py-1.5 font-mono text-label tracking-[0.06em] text-accent hover:bg-accent/20",
                  })}
                >
                  {ar ? DISCOVERY_CTA_LABEL[1] : lang === "ms" ? "Tempah panggilan penemuan" : DISCOVERY_CTA_LABEL[0]} →
                </Link>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href="/pricing"
                    className="inline-flex w-fit items-center gap-1 font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
                  >
                    {ar ? "كل التفاصيل" : lang === "ms" ? "Semua yang termasuk" : "Everything it includes"}
                    <span aria-hidden className="inline-flex">
                      <Icon name="arrow-right" />
                    </span>
                  </Link>
                  {BOOKING_URL && (tier.hasDiscoveryCall ?? true) ? (
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-booking-click="true"
                      className="font-mono text-micro text-accent underline underline-offset-4"
                    >
                      {ar ? BOOKING_CTA_LABEL[1] : BOOKING_CTA_LABEL[0]} ↗
                    </a>
                  ) : null}
                </div>
              </div>
            </PanelCard>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 border-t border-border-subtle pt-3">
        <p className="text-body-sm text-text-tertiary">
          {ar ? "محتاج حاجة واحدة بس (كارت، بروشور، بوست)؟ " : lang === "ms" ? "Perlukan satu item sahaja (kad, brosur, siaran)? " : "Need just one production item (a card, a brochure, a post)? "}
          <Link
            href="/pricing"
            className="underline decoration-border-default underline-offset-4 transition-colors hover:text-text-primary"
          >
            {ar ? "قائمة الإنتاج المنفصلة" : lang === "ms" ? "Menu pengeluaran berasingan" : "The separate production menu"}
          </Link>
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.08em] leading-[1.7] text-text-ghost">
          {ar
            ? "— بنود الإنتاج لبراند عنده نظامه بالفعل، ومش بديل عن شغل الهوية أو الأنظمة —"
            : "— PRODUCTION ITEMS ARE FOR A BRAND THAT ALREADY HAS ITS SYSTEM, NOT A SUBSTITUTE FOR IT —"}
        </p>
      </div>
    </div>
  );
}
