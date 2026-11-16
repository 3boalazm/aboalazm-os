"use client";

/**
 * PersonaToggleCompact — 3-way segmented control for the Nav.
 *
 * ALL (default/general) · FOUNDER (business framing) · TECH (systems
 * framing). Non-blocking, always visible, one click to switch or clear.
 * Clicking the already-active option returns to General.
 */

import { usePersona, type Persona } from "@/components/providers/persona-provider";
import { useLang } from "@/components/providers/lang-provider";

const OPTIONS: { value: Persona; en: string; ar: string; titleEn: string; titleAr: string }[] = [
  { value: null,        en: "ALL",  ar: "الكل",  titleEn: "General — speaks to everyone", titleAr: "عام: يخاطب الجميع" },
  { value: "founder",   en: "FND",  ar: "مؤسس",  titleEn: "Founder — ROI & timeline focus", titleAr: "مؤسس: تركيز على العائد والجدول الزمني" },
  { value: "technical", en: "TECH", ar: "تقني",  titleEn: "Technical — systems & architecture focus", titleAr: "تقني: تركيز على الأنظمة والبنية" },
];

export function PersonaToggleCompact({ className }: { className?: string }) {
  const { persona, setPersona } = usePersona();
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div
      className={["persona-toggle", className].filter(Boolean).join(" ")}
      role="group"
      aria-label={ar ? "خاطبني بوصفي" : "Speak to me as"}
    >
      {OPTIONS.map((o) => {
        const active = persona === o.value;
        return (
          <button
            key={o.en}
            type="button"
            onClick={() => setPersona(active && o.value !== null ? null : o.value)}
            aria-pressed={active}
            title={ar ? o.titleAr : o.titleEn}
            className={["persona-toggle__btn", active ? "persona-toggle__btn--active" : ""].join(" ")}
          >
            {ar ? o.ar : o.en}
          </button>
        );
      })}
    </div>
  );
}
