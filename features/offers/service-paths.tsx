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
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";
import { DISCIPLINES, DISCOVERY_CTA_LABEL } from "@/lib/offers";

const SERVICE_FOR = {
  brand: "brand-identity",
  digital: "website",
  systems: "digital-product",
} as const;

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
          className="flex flex-col gap-2 rounded-panel border border-border-default bg-surface-1 p-3 max-md:w-[84%] max-md:shrink-0 max-md:snap-start md:p-4"
        >
          <h2 className="font-display text-subtitle">{ar ? d.name[1] : d.name[0]}</h2>
          <p className="text-body-sm text-text-secondary">{ar ? d.forWhom[1] : d.forWhom[0]}</p>
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
        </article>
      ))}
    </section>
  );
}
