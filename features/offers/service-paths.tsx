"use client";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";
import { bookHref, DEPOSIT_CTA_LABEL } from "@/lib/offers";

export function ServicePaths() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section
      className="grid gap-3 max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:grid-cols-3"
      aria-label={ar ? "اختار نوع مشروعك" : "Choose your project type"}
    >
      {[
        {
          key: "brand-identity",
          service: "brand-identity" as const,
          planId: "brand-identity" as const,
          href: "/services/brand-identity",
          work: "/work/design",
          title: ar ? "هوية بصرية بالعربي والإنجليزي" : "Arabic & English brand identity",
          body: ar
            ? "للبراندات الجديدة أو اللي بتجدد صورتها: شعار، ألوان، خطوط، تطبيقات ودليل استخدام حسب النطاق."
            : "For a launch or refresh: logo, colour, typography, practical applications and usage guidance matched to your scope.",
        },
        {
          key: "website",
          service: "website" as const,
          planId: "bilingual-site" as const,
          href: "/services/websites",
          work: "/work/development",
          title: ar ? "مواقع ومنتجات رقمية" : "Websites & digital products",
          body: ar
            ? "صفحات هبوط، مواقع شركات، متاجر وأدوات تشغيل. نختار التقنية والنطاق حسب المستخدمين والمشكلة."
            : "Landing pages, company sites, storefronts and business tools. Scope and technology follow the users and the problem.",
        },
        {
          key: "store-72h",
          service: "website" as const,
          planId: "store-72h" as const,
          href: "/services/store-72h",
          work: "/work/development",
          title: ar
            ? "متجر أو كتالوج إلكتروني ثنائي اللغة خلال 72 ساعة"
            : "Bilingual online store or catalogue, ready in 72 hours",
          body: ar
            ? "حتى ~30 منتجاً بالعربي والإنجليزي، زر الطلب عبر واتساب، الدفع عند الاستلام + إنستاباي، وربط الشحن والدومين — يبدأ من $197."
            : "Up to ~30 products in AR + EN, Order on WhatsApp, COD + InstaPay instructions, shipping link & custom domain — from $197.",
        },
      ].map((p) => (
        <article
          key={p.key}
          className="flex flex-col gap-2 rounded-panel border border-border-default bg-surface-1 p-3 max-md:w-[84%] max-md:shrink-0 max-md:snap-start md:p-4"
        >
          <h2 className="font-display text-subtitle">{p.title}</h2>
          <p className="text-body-sm text-text-secondary">{p.body}</p>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-body-sm">
            <Link href={p.href} className="text-accent underline underline-offset-4">
              {ar ? "النطاق والتفاصيل" : "Scope & details"} →
            </Link>
            <Link href={bookHref(p.planId)} className="underline underline-offset-4 max-sm:hidden">
              {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]}
            </Link>
            <Link href={p.work} className="underline underline-offset-4 max-sm:hidden">
              {ar ? "أعمال مشابهة" : "Relevant work"}
            </Link>
            <Link
              href={contactHref({ service: p.service, source: "/services" })}
              className="underline underline-offset-4"
            >
              {ar ? "ابدأ استفسار" : "Start an enquiry"}
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
