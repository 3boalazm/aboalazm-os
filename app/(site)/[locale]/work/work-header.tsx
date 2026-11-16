"use client";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Heading } from "@/components/ui/Heading";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { Icon } from "@/components/ui/Icon";
import { PagePlate } from "@/components/ui/page-plate";

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
    <PagePlate src="/images/generated/creative-grid-bloom.jpg" align="start">
    <header className="flex flex-col gap-4">
      <Heading
        eyebrow={ar ? `الفهرس · ${new Date().getFullYear()}` : `Index · ${new Date().getFullYear()}`}
        title={ar ? <>أعمال <em>مختارة</em></> : <>Selected <em>Work</em></>}
        titleClassName="max-w-[14ch] text-balance-pretty"
        subtitle={
          ar
            ? "استكشف الهوية البصرية والمنتجات الرقمية في مسارين منفصلين. المشاريع معها دراسات حالة أو عرض مرئي محفوظ، وروابط التجارب العامة لما تكون متاحة."
            : "Browse brand identity and digital products in separate streams. Projects include a case study or saved visual overview, with public preview links where available."
        }
        subtitleClassName="max-w-[56ch]"
      />

      <p className="text-body-sm text-text-tertiary">{ar ? "هل لديك مشروع مشابه؟" : "Have something similar in mind? "}<Link href="/contact" className="text-accent underline underline-offset-4">{ar ? "ناقش نطاق مشروعك معي" : "Discuss your scope"} →</Link><span className="mx-2" aria-hidden>·</span><Link href="/for-hiring" className="underline underline-offset-4">{ar ? "ملف التوظيف" : "Hiring profile"}</Link></p>
    </header>
    </PagePlate>
  );
}
