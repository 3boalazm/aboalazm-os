"use client";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";

/* Route mood — the index sits on a cool violet/cyan wash so the page reads
   as a gallery rather than a list, while the individual cards keep their
   OWN project accent. Hovering a ledger row raises its project pair above
   this floor and settles back to it on release. Low opacity on purpose:
   the cards must stay the loudest colour on the page. */
const WORK_MOOD = {
  primary: "rgb(139 92 246 / 0.11)",
  secondary: "rgb(34 211 238 / 0.07)",
} as const;

export function WorkHeader() {
  const { lang } = useLang();
  const ar = lang === "ar";
  useAmbientGlow(WORK_MOOD, 0.4);
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
