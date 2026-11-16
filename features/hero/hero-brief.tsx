"use client";

/**
 * HERO BRIEF — "describe it in a line" entry into the enquiry form.
 *
 * Privacy contract (lib/contact-context.ts): a visitor's brief never travels
 * in a URL or an analytics event. Only the service id goes in the query; the
 * sentence itself is parked in sessionStorage and picked up by the contact
 * form's brief field, then removed.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/providers/lang-provider";
import { Icon } from "@/components/ui/Icon";
import { contactHref, type ServiceId } from "@/lib/contact-context";
import { localeHref } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";

export const BRIEF_HANDOFF_KEY = "os:brief-handoff";

const CHIPS: { id: ServiceId; en: string; ar: string; ms: string }[] = [
  { id: "brand-identity", en: "Brand identity", ar: "هوية", ms: "Identiti jenama" },
  { id: "website", en: "Website / store", ar: "موقع / متجر", ms: "Laman / kedai" },
  { id: "digital-product", en: "Business system", ar: "سيستم تشغيل", ms: "Sistem perniagaan" },
  { id: "not-sure", en: "Not sure yet", ar: "لسه مش محدد", ms: "Belum pasti" },
];

export function HeroBrief() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const router = useRouter();
  const [service, setService] = React.useState<ServiceId>("not-sure");
  const [text, setText] = React.useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const brief = text.trim().slice(0, 600);
      if (brief) sessionStorage.setItem(BRIEF_HANDOFF_KEY, brief);
      else sessionStorage.removeItem(BRIEF_HANDOFF_KEY);
    } catch {
      /* storage unavailable — the form still opens with the service chosen */
    }
    trackEvent("cta_start_project", { surface: "hero_brief", service });
    router.push(localeHref(contactHref({ service, source: "/" }), lang));
  };

  return (
    <form
      onSubmit={go}
      className="glass flex w-full max-w-[36rem] flex-col gap-1.5 rounded-panel p-1.5"
      aria-label={ar ? "اوصف مشروعك" : lang === "ms" ? "Terangkan projek anda" : "Describe your project"}
    >
      <label className="sr-only" htmlFor="hero-brief">
        {ar ? "اوصف مشروعك في سطر" : lang === "ms" ? "Terangkan projek anda dalam satu baris" : "Describe your project in a line"}
      </label>
      <div className="flex items-center gap-1">
        <input
          id="hero-brief"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={600}
          autoComplete="off"
          placeholder={
            ar
              ? "اوصف مشروعك في سطر — مثلاً: هوية لعيادة جديدة"
              : lang === "ms"
                ? "Terangkan projek anda — cth. identiti klinik baharu"
                : "Describe it in a line — e.g. identity for a new clinic"
          }
          className="min-w-0 flex-1 bg-transparent px-1 py-0.5 text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-text-primary px-2 py-1 font-mono text-micro font-semibold uppercase tracking-[0.06em] text-surface-0 transition-transform duration-base ease-physics hover:-translate-y-0.5"
        >
          {ar ? "ابدأ" : lang === "ms" ? "Mula" : "Start"}
          <Icon name="arrow-right" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-t border-border-subtle pt-1.5">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={service === c.id}
            onClick={() => setService(c.id)}
            className={`whitespace-nowrap rounded-pill border px-1.5 py-[3px] font-mono text-[11px] uppercase leading-none tracking-[0.06em] transition-colors duration-base ease-physics ${
              service === c.id
                ? "border-accent bg-accent text-obsidian"
                : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary"
            }`}
          >
            {ar ? c.ar : lang === "ms" ? c.ms : c.en}
          </button>
        ))}
      </div>
    </form>
  );
}
