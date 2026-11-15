"use client";
/**
 * SERVICE PATHS — "choose your project type", now the three disciplines.
 *
 * The three cards used to be identity / websites / 72-hour store, which told a
 * visitor the menu was organised by *deliverable*. It is organised by business
 * outcome (lib/offers DISCIPLINES), and the home page, /services and the footer
 * all read from that single list. The 72-hour store keeps its own page and its
 * place in the production menu — it is a starting offer inside digital, not a
 * fourth discipline.
 */
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";
import { DISCIPLINES, DISCOVERY_CTA_LABEL } from "@/lib/offers";

const SERVICE_FOR = {
  brand: "brand-identity",
  digital: "website",
  systems: "digital-product",
} as const;

/* Same proof frames as the discipline cards (features/offers/disciplines.tsx). */
const PATH_ART: Record<string, string> = {
  brand: "/images/work/gad/gad-card.jpg",
  digital: "/images/work/dev-cards/nile-pharma-storefront-card.jpg",
  systems: "/images/work/dev-cards/nile-erp-command-center-card.jpg",
};

export function ServicePaths() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section
      className="grid gap-3 max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid-cols-3"
      aria-label={ar ? "اختار نوع مشروعك" : "Choose your project type"}
    >
      {DISCIPLINES.map((d) => (
        <article
          key={d.id}
          className="flex flex-col overflow-hidden rounded-panel border border-border-default bg-surface-1 max-md:w-[84%] max-md:shrink-0 max-md:snap-start"
        >
          <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
            <Image
              src={PATH_ART[d.id] ?? "/images/work/cc-logo-hero.jpg"}
              alt=""
              fill
              sizes="(min-width: 768px) 30vw, 84vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-transparent"
            />
            <span className="absolute bottom-2.5 start-3 font-mono text-micro uppercase tracking-[0.08em] text-alabaster">
              {d.n}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
            <h2 className="font-display text-subtitle">{ar ? d.name[1] : d.name[0]}</h2>
            <p className="text-body-sm text-text-secondary max-md:line-clamp-3">{ar ? d.forWhom[1] : d.forWhom[0]}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-body-sm">
              <Link href={d.href} className="text-accent underline underline-offset-4">
                {ar ? "النطاق والتفاصيل" : "Scope & details"} →
              </Link>
              <Link
                href={contactHref({ service: SERVICE_FOR[d.id], source: "/services" })}
                className="underline underline-offset-4"
              >
                {ar ? DISCOVERY_CTA_LABEL[1] : DISCOVERY_CTA_LABEL[0]}
              </Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
