"use client";
import { useLang } from "@/components/providers/lang-provider";
export function WorkHeader() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <header className="flex flex-col gap-2">
      <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
        {ar ? `الفهرس · ${new Date().getFullYear()}` : `Index · ${new Date().getFullYear()}`}
      </p>
      <h1 className="max-w-[14ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
        {ar ? <>سجل <em>الهندسة البصرية</em></> : <>The Engineering <em>Ledger</em></>}
      </h1>
      <p className="max-w-[52ch] text-lead text-text-secondary">
        {ar
          ? "كل مشروع مسجّل كنظام: التخصص والأدوات والمخرج الذي وصل."
          : "Every engagement, recorded as a system: discipline, stack, and the outcome it shipped."}
      </p>
    </header>
  );
}
