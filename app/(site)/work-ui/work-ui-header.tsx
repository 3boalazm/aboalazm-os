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
            ? "معاينات تفاعلية لمشاريع مختارة. بعض المواقع بتمنع العرض داخل الصفحة؛ افتح الكارت لمشاهدة المشروع مباشرة."
            : "Interactive previews from selected projects. Some sites block embedding; open a card to inspect the live project."
        }
        subtitleClassName="max-w-[52ch]"
      />
    </header>
  );
}
