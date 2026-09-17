"use client";

import { useLang } from "@/components/providers/lang-provider";
import type { Bi, Tier, AlaCarteGroup } from "@/lib/offers";
import { SectionHead, TierGrid, TierCompare, AlaCarteTables, PaymentBlock, Faq, CtaBand } from "@/features/offers/offer-blocks";
import { InvestmentValue } from "@/features/offers/investment-value";
import { Heading } from "@/components/ui/Heading";

const FAQ: readonly { q: Bi; a: Bi }[] = [
  { q: ["Are prices negotiable?", "هل الأسعار قابلة للتفاوض؟"], a: ["Yes, within reason — final pricing depends on scope, timeline, number of applications, and whether it's a one-off or a longer relationship. The ranges shown are honest starting points.", "نعم في حدود معقولة — السعر النهائي يعتمد على النطاق والجدول وعدد التطبيقات وطبيعة العلاقة. النطاقات المعروضة نقاط بداية صادقة."] },
  { q: ["What if my project doesn't fit a tier exactly?", "ماذا لو لم يناسب مشروعي فئة بعينها؟"], a: ["Most don't — tiers are starting templates. After the Discovery Call, you get a custom proposal that adds, removes, or adjusts items to your actual needs.", "أغلب المشاريع كذلك — الفئات قوالب بداية. بعد مكالمة الاكتشاف يصلك عرض مخصص يضيف أو يحذف أو يعدّل البنود حسب احتياجك الفعلي."] },
  { q: ["Can I upgrade tiers during the project?", "هل يمكن الترقية أثناء المشروع؟"], a: ["Yes — I quote the upgrade delta and adjust the timeline. No re-doing finished work.", "نعم — أسعّر فرق الترقية ونعدّل الجدول، دون إعادة أي عمل منجز."] },
  { q: ["Is there a discount for full prepayment?", "هل يوجد خصم للدفع الكامل مقدمًا؟"], a: ["Yes — 10% off the total invoice when paid upfront in full at kickoff.", "نعم — خصم ١٠٪ من إجمالي الفاتورة عند الدفع الكامل مقدمًا عند البدء."] },
  { q: ["Do you work with international clients? What currency?", "العملاء الدوليون؟ وبأي عملة؟"], a: ["Yes, frequently. Quoted in USD by default; paid via Wise, PayPal, or international transfer. EGP equivalent for Egyptian clients on request.", "نعم باستمرار. التسعير بالدولار افتراضيًا، والدفع عبر Wise أو PayPal أو تحويل دولي — والمعادل بالجنيه متاح للعملاء المصريين."] },
  { q: ["What about revisions beyond the included rounds?", "ماذا عن التعديلات بعد الجولات المشمولة؟"], a: ["Each tier includes 2 structured rounds; additional revisions are billed hourly and logged in writing.", "كل فئة تشمل جولتين منظمتين، وما بعدهما يُحاسب بالساعة ويوثَّق كتابيًا."] },
  { q: ["Are source files (AI / PSD) included?", "هل ملفات المصدر (AI/PSD) مشمولة؟"], a: ["Final vector source files ship with every tier after the final payment clears — that's the IP transfer moment.", "ملفات المصدر النهائية تُسلَّم مع كل فئة بعد سداد الدفعة الأخيرة — وهي لحظة انتقال الملكية."] },
];

interface PricingData {
  tiers: Tier[];
  investmentValue: { value: string; en: string; ar: string; subEn?: string | null; subAr?: string | null; pending?: boolean | null }[];
  alaCarte: AlaCarteGroup[];
}

export function PricingView({ tiers, investmentValue, alaCarte }: PricingData) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <main className="container-content flex flex-col gap-16 py-16">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "التسعير / التكلفة" : "PRICING / WHAT IT COSTS"}
          eyebrowMeta={
            <p className="hidden font-mono text-micro uppercase tracking-[0.10em] text-text-ghost sm:block">
              {ar ? "بالدولار · شفاف · قابل للتفاوض" : "USD · TRANSPARENT · NEGOTIABLE"}
            </p>
          }
          title={
            <>
              {ar ? "بلا رسوم " : "No hidden "}
              <em className="text-accent">{ar ? "خفية." : "fees."}</em>
            </>
          }
          subtitleClassName="max-w-[52ch]"
          subtitle={
            ar
              ? "ثلاث فئات من الشعار إلى النظام الكامل، وخدمات منفردة للأعمال المستقلة. التسعير يتغير مع النطاق — ومُعلن مقدمًا."
              : "Three tiers from logo to full system, plus à la carte services for stand-alone work. Pricing varies with scope — and that's stated upfront."
          }
        />
        <dl className="grid grid-cols-3 gap-2 border-y border-border-subtle py-2">
          {([["STARTS AT", "يبدأ من", "$199"], ["TIERS", "الفئات", "3"], ["À LA CARTE ITEMS", "خدمات منفردة", "15+"]] as const).map(([en, arr, v]) => (
            <div key={en}>
              <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{ar ? arr : en}</dt>
              <dd className="font-display text-title text-text-primary">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="flex flex-col gap-3">
        <SectionHead label={["01 / SERVICE TIERS", "٠١ / فئات الخدمة"]} title={["Pick the", "اختر"]} italic={["scope that fits.", "النطاق المناسب."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar
            ? "معظم المشاريع تبدأ من الفئة ٢. الفئة ١ للقيد الميزاني، والفئة ٣ للإطلاق الكامل."
            : "Most projects start at Tier 2. Tier 1 is the budget constraint; Tier 3 is a full launch system."}
        </p>
        <TierCompare tiers={tiers} />
        <TierGrid tiers={tiers} />
        <p className="text-center font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "— كل الفئات قابلة للتخصيص · البنود تُضاف أو تُحذف بعد النقاش · التسعير قابل للتفاوض حسب النطاق والجدول والعلاقة —" : "— All tiers are customizable · Items can be added or removed after discussion · Pricing is negotiable based on scope, timeline, and long-term relationship —"}
        </p>
      </section>

      {/* Investment value — reframes price as an asset (systemic positioning) */}
      <section className="rounded-panel border border-border-subtle bg-surface-1/30 p-5 md:p-7">
        <InvestmentValue metrics={investmentValue} />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["02 / PRODUCTION MENU", "٠٢ / قائمة الإنتاج"]} title={["Stand-alone", "خدمات"]} italic={["services.", "مستقلة."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar
            ? "قائمة إنتاج منفصلة عن استثمار نظام الهوية. لمشاريع لا تحتاج فئة كاملة — أو لعملاء حاليين يحتاجون تطبيقات إضافية."
            : "A production menu, separate from brand-system investment. For projects that don't need a full tier — or for existing clients needing additional applications."}
        </p>
        <details className="group rounded-card border border-border-subtle bg-surface-1/40 p-3">
          <summary className="cursor-pointer font-mono text-label uppercase tracking-[0.08em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary">
            {ar ? "فتح قائمة الخدمات المنفردة (١٥+ بند)" : "Open the à la carte list (15+ items)"}
          </summary>
          <div className="mt-3">
            <AlaCarteTables alaCarte={alaCarte} />
          </div>
        </details>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["03 / PAYMENT", "٠٣ / الدفع"]} title={["How &", "كيف"]} italic={["when you pay.", "ومتى تدفع."]} />
        <PaymentBlock />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["04 / PRICING FAQ", "٠٤ / أسئلة التسعير"]} title={["Common", "أسئلة"]} italic={["questions.", "متكررة."]} />
        <Faq items={FAQ} />
      </section>

      <CtaBand kicker={["HAVE A PROJECT IN MIND?", "عندك مشروع؟"]} title={["Let's", "خلّينا"]} italic={["scope it.", "نحدد نطاقه."]} primary={["Start a Project", "ابدأ مشروعًا"]} primaryHref="/contact" secondary={["Read Full Agreement", "اقرأ الاتفاقية"]} secondaryHref="/agreement" />
    </main>
  );
}
