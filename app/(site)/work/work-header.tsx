"use client";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";
export function WorkHeader() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <header className="flex flex-col gap-2">
      <Heading
        eyebrow={ar ? `الفهرس · ${new Date().getFullYear()}` : `Index · ${new Date().getFullYear()}`}
        title={ar ? <>أعمال <em>مختارة</em></> : <>Selected <em>Work</em></>}
        titleClassName="max-w-[14ch] text-balance-pretty"
        subtitle={
          ar
            ? "أنظمة هوية ومنتجات رقمية — المشكلة، ما الذي بُني، والنتيجة."
            : "Identity systems and digital products — the problem, what shipped, and the outcome."
        }
        subtitleClassName="max-w-[52ch]"
      />
    </header>
  );
}
