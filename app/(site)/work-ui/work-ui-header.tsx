"use client";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";

export function WorkUiHeader() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <header className="flex flex-col gap-2">
      <Heading
        eyebrow={ar ? `معاينة حية · ${new Date().getFullYear()}` : `Live Preview · ${new Date().getFullYear()}`}
        title={ar ? <>واجهات <em>شغّالة فعليًا</em></> : <>UI/UX <em>Showcase</em></>}
        titleClassName="max-w-[14ch] text-balance-pretty"
        subtitle={
          ar
            ? "مش صور — دي المواقع الحقيقية شغالة لايف دلوقتي. دوس على أي واحدة تفتحها كاملة."
            : "Not screenshots — these are the real sites, live right now. Click any card to open it in full."
        }
        subtitleClassName="max-w-[52ch]"
      />
    </header>
  );
}
