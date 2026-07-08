"use client";
import { useLang } from "@/components/providers/lang-provider";

export function WorkUiHeader() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <header className="flex flex-col gap-2">
      <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
        {ar ? `معاينة حية · ${new Date().getFullYear()}` : `Live Preview · ${new Date().getFullYear()}`}
      </p>
      <h1 className="max-w-[14ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
        {ar ? <>واجهات <em>شغّالة فعليًا</em></> : <>UI/UX <em>Showcase</em></>}
      </h1>
      <p className="max-w-[52ch] text-lead text-text-secondary">
        {ar
          ? "مش صور — دي المواقع الحقيقية شغالة لايف دلوقتي. دوس على أي واحدة تفتحها كاملة."
          : "Not screenshots — these are the real sites, live right now. Click any card to open it in full."}
      </p>
    </header>
  );
}
