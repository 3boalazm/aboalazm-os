"use client";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";

export function WorkUiHeader() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <header className="flex flex-col gap-2">
      <Heading
        eyebrow={ar ? `معرض الواجهات · ${new Date().getFullYear()}` : `Interface gallery · ${new Date().getFullYear()}`}
        title={ar ? <>واجهات <em>من المشاريع</em></> : <>UI/UX <em>Showcase</em></>}
        titleClassName="max-w-[14ch] text-balance-pretty"
        subtitle={
          ar
            ? "صور فعلية لمشاريع مختارة. افتح تفاصيل المشروع أو جرّب المعاينة العامة المتاحة."
            : "Actual interface screenshots from selected projects. Explore the project details or open an available public preview."
        }
        subtitleClassName="max-w-[52ch]"
      />
    </header>
  );
}
