"use client";

import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";
import { SECTIONS } from "./tokens";

/** Label, title and a jump-list for the brand-book panel — follows the site's EN/AR switch. */
export function BrandBookPanelHeader() {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <>
      <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{t.brandBook}</p>
      <h2 className="max-w-[24ch] font-display text-title tracking-[-0.015em]">
        {ar ? "دليل الهوية V2.0 — النظام كامل" : "The brand book, V2.0 — the whole system"}
      </h2>
      <p className="max-w-[60ch] text-body-sm text-text-secondary">
        {ar
          ? "الدليل الذي سُلِّم للعميل: الاستراتيجية، الشخصية، منظومة الشعار، الألوان، الخطوط، والمقاسات — في مكان واحد."
          : "The guidelines document delivered to the client — strategy, persona, logo system, colour, typography and formats, in one place."}
      </p>
      <nav aria-label={ar ? "أقسام دليل الهوية" : "Brand book sections"} className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-pill border border-border-default px-3 py-1 font-mono text-micro uppercase tracking-[0.10em] text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {s.label}
          </a>
        ))}
      </nav>
    </>
  );
}
