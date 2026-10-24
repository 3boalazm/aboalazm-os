"use client";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";

export function ServicePaths() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return <section className="grid gap-3 md:grid-cols-2" aria-label={ar ? "اختار نوع مشروعك" : "Choose your project type"}>
    {[{
      service: "brand-identity" as const, href: "/services/brand-identity", work: "/work/design",
      title: ar ? "هوية بصرية بالعربي والإنجليزي" : "Arabic & English brand identity",
      body: ar ? "للبراندات الجديدة أو اللي بتجدد صورتها: شعار، ألوان، خطوط، تطبيقات ودليل استخدام حسب النطاق." : "For a launch or refresh: logo, colour, typography, practical applications and usage guidance matched to your scope.",
    }, {
      service: "website" as const, href: "/services/websites", work: "/work/development",
      title: ar ? "مواقع ومنتجات رقمية" : "Websites & digital products",
      body: ar ? "صفحات هبوط، مواقع شركات، متاجر وأدوات تشغيل. نختار التقنية والنطاق حسب المستخدمين والمشكلة." : "Landing pages, company sites, storefronts and business tools. Scope and technology follow the users and the problem.",
    }].map((p) => <article key={p.service} className="flex flex-col gap-2 rounded-panel border border-border-default bg-surface-1 p-3 md:p-4">
      <h2 className="font-display text-subtitle">{p.title}</h2><p className="text-body-sm text-text-secondary">{p.body}</p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-body-sm"><Link href={p.href} className="text-accent underline underline-offset-4">{ar ? "النطاق والتفاصيل" : "Scope & details"} →</Link><Link href={p.work} className="underline underline-offset-4">{ar ? "أعمال مشابهة" : "Relevant work"}</Link><Link href={contactHref({ service: p.service, source: "/services" })} className="underline underline-offset-4">{ar ? "ابدأ استفسار" : "Start an enquiry"}</Link></div>
    </article>)}
  </section>;
}
