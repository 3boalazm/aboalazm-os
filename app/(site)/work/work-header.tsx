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
        title={ar ? <>سجل <em>الهندسة البصرية</em></> : <>The Engineering <em>Ledger</em></>}
        titleClassName="max-w-[14ch] text-balance-pretty"
        subtitle={
          ar
            ? "كل مشروع مسجّل كنظام: التخصص والأدوات والمخرج الذي وصل."
            : "Every engagement, recorded as a system: discipline, stack, and the outcome it shipped."
        }
        subtitleClassName="max-w-[52ch]"
      />
    </header>
  );
}
