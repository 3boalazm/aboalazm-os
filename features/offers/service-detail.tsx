"use client";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";
import { bookHref, DEPOSIT_CTA_LABEL, localizePrice, STORE_72H_OFFER } from "@/lib/offers";
import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import { PROJECTS } from "@/features/work/projects.data";
import { SocialProof } from "@/components/shared/social-proof";
import { Icon } from "@/components/ui/Icon";

export function ServiceDetail({ kind }: { kind: "identity" | "web" }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const identity = kind === "identity";
  const source = identity ? "/services/brand-identity" : "/services/websites";
  const service = identity ? "brand-identity" : "website";
  const defaultPlanId = identity ? "brand-identity" : "bilingual-site";
  const slugs = identity
    ? ["gad-institute", "nile-pharma", "reflection"]
    : ["code-canvas-dev", "ummah-academy", "nile-pharma-erp"];
  const examples = slugs
    .map((slug) => PROJECTS.find((p) => p.slug === slug)!)
    .filter(Boolean);
  const title = identity
    ? ar
      ? "هويات بالعربية والإنجليزية، جاهزة للاستخدام."
      : "Arabic & English identities, ready to use."
    : ar
      ? "موقع واضح. وتجربة مفهومة. وأداة تخدم عملك."
      : "A clear website. A usable product. A tool for your team.";
  const intro = identity
    ? ar
      ? "إن كنت تطلق علامة أو تجدّد صورتها، نبدأ بالجمهور وحالات الاستخدام، ثم نحوّل الاتجاه إلى شعار وألوان وخطوط وتطبيقات يستطيع فريقك العمل بها."
      : "Launching a brand or refreshing its identity? We start with the audience and use cases, then develop the logo, colour, typography and practical applications your team needs."
    : ar
      ? "من صفحة هبوط إلى موقع شركة أو أداة تشغيل: نحدد المستخدم والمهمة، ثم نبني واجهة متجاوبة مرتبطة بهويتك. وتُحدَّد التقنية بحسب المحتوى والتكاملات والصيانة."
      : "From a landing page to a company site or business tool: we define the user and task, then build a responsive experience aligned with your brand. Content, integrations and maintenance guide the technology choice.";
  const deliverables = identity
    ? ar
      ? [
          "بحث واتجاه بصري يناسبان الباقة.",
          "شعار ونسخ استخدام، وألوان وخطوط محددة.",
          "التطبيقات المتفق عليها: مطبوعات أو تغليف أو قوالب رقمية.",
          "ملفات مصدر وتصدير، وإرشادات بحسب نطاق الباقة.",
        ]
      : [
          "Discovery and visual direction matched to the package.",
          "Logo versions, colour specifications and typography.",
          "Agreed applications: print, packaging or digital templates.",
          "Source and export files, with guidance appropriate to the scope.",
        ]
    : ar
      ? [
          "نطاق محدد ورحلة مستخدم وهيكل محتوى.",
          "تصميم متجاوب للعربية والإنجليزية بحسب الاتفاق.",
          "تنفيذ بـ Next.js أو ووردبريس، وإدارة محتوى عند الحاجة.",
          "أساس لتحسين محركات البحث (SEO)، واختبار المسارات، والتسليم والتشغيل وفق الاتفاق.",
        ]
      : [
          "A defined scope, user journey and content structure.",
          "Responsive Arabic/English design as agreed.",
          "Next.js or WordPress implementation, with content management when needed.",
          "SEO foundations, flow verification and an agreed deployment handover.",
        ];

  return (
    <main className="container-content flex flex-col gap-6 pb-8">
      <header className="flex max-w-[70ch] flex-col gap-3">
        <Link href="/services" className="text-caption text-text-tertiary">
          {ar ? "كل الخدمات" : "All services"} ←
        </Link>
        <h1 className="font-display text-title">{title}</h1>
        <p className="text-body text-text-secondary">{intro}</p>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={bookHref(defaultPlanId)}
            className="w-fit rounded-pill bg-accent px-3.5 py-1.5 font-mono text-label text-obsidian"
          >
            {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]}<Icon name="arrow-right" className="ms-1.5" />
          </Link>
          <Link
            href={contactHref({ service, source })}
            className="w-fit rounded-pill border border-border-default bg-surface-1 px-3.5 py-1.5 font-mono text-label text-text-primary transition-colors hover:border-accent"
          >
            {ar ? "ناقش مشروعك" : "Discuss your project"}<Icon name="arrow-right" className="ms-1.5" />
          </Link>
        </div>
      </header>

      <section>
        <h2 className="mb-3 font-display text-subtitle">
          {ar ? "أعمال ذات صلة" : "Relevant work"}
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {examples.map((p) => (
            <Link
              key={p.slug}
              href={`/case-studies/${p.slug}`}
              className="overflow-hidden rounded-card border border-border-default bg-surface-1"
            >
              <Image
                src={p.thumbnail}
                width={1280}
                height={800}
                alt={ar ? p.nameAr ?? p.name : p.name}
                sizes="(max-width:768px) 100vw, 33vw"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="p-2">
                <h3 className="font-display font-display-sm text-body">
                  {ar ? p.nameAr ?? p.name : p.name}
                </h3>
                <p className="mt-1 text-caption text-text-secondary">
                  {ar ? p.outcomeAr ?? p.outcome : p.outcome}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="font-display text-subtitle">
            {ar ? "نطاقات العمل الممكنة" : "What we can scope"}
          </h2>
          <ul className="mt-2 list-disc space-y-1 ps-3 text-body-sm text-text-secondary">
            {deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
            {!identity ? (
              <li>
                <strong className="text-text-primary">
                  {ar
                    ? "المتاجر والكتالوجات الإلكترونية: "
                    : "Online stores & catalogues: "}
                </strong>
                <Link
                  href="/services/store-72h"
                  className="text-accent underline underline-offset-4"
                >
                  {ar
                    ? `متجر أو كتالوج ثنائي اللغة جاهز خلال 72 ساعة (${localizePrice(STORE_72H_OFFER.price, "ar")}) ←`
                    : `Bilingual online store or catalogue, ready in 72 hours (${STORE_72H_OFFER.price}) →`}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="rounded-card border border-border-default bg-surface-1 p-3">
          <h2 className="font-display text-subtitle">
            {ar ? "التكلفة والمدة" : "Cost and timing"}
          </h2>
          <p className="mt-2 text-body-sm text-text-secondary">
            {identity
              ? ar
                ? "الشعار: من 7 إلى 10 أيام؛ الهوية: من 3 إلى 4 أسابيع؛ النظام المتكامل: من 5 إلى 7 أسابيع. تُحدَّد لغة الشعار في الباقات الأصغر، ويشمل النظام المتكامل العربية والإنجليزية. ويُحدَّد الموعد النهائي بعد الاتفاق على النطاق والاعتمادات."
                : "Logo: 7–10 days; identity: 3–4 weeks; full system: 5–7 weeks. Smaller tiers specify the logo language; the full system includes Arabic and English. Final dates follow scope and approval milestones."
              : ar
                ? "يعتمد السعر والجدول على الصفحات والأدوار والتكاملات وجاهزية المحتوى. وتُحدَّد رسوم الاستضافة والنطاق والخدمات الخارجية وتكاملات الخلفية كبنود مستقلة في العرض."
                : "The quote and schedule depend on pages, user roles, integrations and content readiness. Hosting, domain, third-party services and backend integrations are itemised in the proposal."}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href={bookHref(defaultPlanId)}
              className="inline-block text-body-sm font-medium text-accent underline underline-offset-4"
            >
              {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]}<Icon name="arrow-right" className="ms-1.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-block text-body-sm text-text-secondary underline underline-offset-4 hover:text-text-primary"
            >
              {ar ? "راجع الباقات ونطاقات الأسعار" : "Review packages and price ranges"}<Icon name="arrow-right" className="ms-1.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="text-body-sm text-text-secondary">
        <h2 className="font-display text-subtitle text-text-primary">
          {ar ? "ما الذي أحتاجه منك في البداية؟" : "What do I need from you?"}
        </h2>
        <p className="mt-2">
          {ar
            ? "فكرة عن المشروع وجمهوره وأهم استخدام أو مهمة. شارك أي أمثلة أو موعدًا مستهدفًا إن وُجد؛ وإن لم يتضح النطاق بعد، نحدده معًا قبل عرض السعر."
            : "An idea of the project, its audience and the main use case. Share references or a target date if available; if the scope is unclear, we define it together before quoting."}
        </p>
      </section>

      <SocialProof />

      <ProjectEnquiry service={service} source={source} />
    </main>
  );
}
