"use client";
import Link from "@/components/ui/localized-link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/providers/lang-provider";
import { contactHref, type ServiceId } from "@/lib/contact-context";

export function ProjectEnquiry({ service = "brand-identity", source, compact = false }: { service?: ServiceId; source?: string; compact?: boolean }) {
  const t = useT();
  // The lead's `source` is the page without its locale prefix (en is unprefixed).
  const pathname = usePathname().replace(/^\/(?:ar|en)(?=\/|$)/, "") || "/";
  const digital = service === "digital-product" || service === "website";
  return <section aria-label={compact ? t("Quick project enquiry", "استفسار سريع عن مشروع") : t("Discuss a similar project", "ناقش مشروعًا مشابهًا")} className={`rounded-panel border border-accent/30 bg-surface-1 p-3 ${compact ? "my-4" : "container-content my-6 p-4 md:p-5"}`}>
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div className="max-w-[55ch]">
        <h2 className={`font-display ${compact ? "text-subtitle" : "text-title"}`}>{digital
          ? t("Have a similar product or workflow in mind?", "هل لديك مشكلة تشغيل أو فكرة منتج مشابهة؟")
          : t("Need a clear identity for your brand?", "هل تحتاج علامتك إلى هوية أوضح؟")}</h2>
        <p className="mt-1 text-body-sm text-text-secondary">{t("Tell me what you need and we can define deliverables, timing and cost. A finished brief is optional.", "أخبرني بما تحتاج إليه لنحدّد المخرجات والمدة والتكلفة المناسبة. لا يلزم أن يكون لديك موجز كامل.")}</p>
      </div>
      <Link href={contactHref({ service, source: source ?? pathname })} className="inline-flex min-h-6 shrink-0 items-center justify-center rounded-pill bg-accent px-3 py-1.5 font-mono text-label text-obsidian">{t("Discuss your project →", "ناقش مشروعك ←")}</Link>
    </div>
  </section>;
}
