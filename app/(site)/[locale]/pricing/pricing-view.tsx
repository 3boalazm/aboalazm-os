"use client";

import { useState } from "react";
import { PagePlate } from "@/components/ui/page-plate";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import {
  DISCOVERY_CTA_LABEL,
  PRODUCTION_MENU_NOTE,
  type AlaCarteGroup,
  type Bi,
  type Tier,
} from "@/lib/offers";
import { BOOKING_CTA_LABEL, BOOKING_URL } from "@/lib/contact-details";
import { resolveFxState } from "@/lib/fx";
import {
  pick,
  SectionHead,
  TierGrid,
  TierCompare,
  AlaCarteTables,
  PaymentBlock,
  Faq,
  CtaBand,
} from "@/features/offers/offer-blocks";
import { InvestmentValue } from "@/features/offers/investment-value";
import { buttonVariants } from "@/components/ui/Button";
import { FxSubline } from "@/components/ui/fx-price";
import { Heading } from "@/components/ui/Heading";
import { SocialProof } from "@/components/shared/social-proof";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { Icon } from "@/components/ui/Icon";

const PRICING_MOOD = {
  primary: "rgb(255 107 71 / 0.10)",
  secondary: "rgb(163 230 53 / 0.05)",
} as const;

export function buildPricingFaq(fxActive = resolveFxState().active): readonly { q: Bi; a: Bi }[] {
  return [
    { q: ["Are prices negotiable?", "هل الأسعار قابلة للتفاوض؟"], a: ["Yes, within reason — final pricing depends on scope, timeline, number of applications, and whether it's a one-off or a longer relationship. The ranges shown are honest starting points.", "نعم، ضمن حدود معقولة. يعتمد السعر النهائي على النطاق والجدول الزمني وعدد التطبيقات، وعلى كون العمل مرة واحدة أو علاقة أطول. والنطاقات المعروضة نقاط بداية صادقة."] },
    { q: ["What if my project doesn't fit a tier exactly?", "ماذا لو لم يناسب مشروعي فئة بعينها؟"], a: ["Most don't — tiers are starting templates. After the Discovery Call, you get a custom proposal that adds, removes, or adjusts items to your actual needs.", "أغلب المشاريع لا تناسب فئة بعينها، فالفئات قوالب للبداية. بعد المكالمة الاستكشافية يصلك عرض مخصص يضيف البنود أو يحذفها أو يعدّلها بحسب احتياجك الفعلي."] },
    { q: ["Can I upgrade tiers during the project?", "هل يمكن الانتقال إلى فئة أعلى أثناء المشروع؟"], a: ["Yes — I quote the upgrade delta and adjust the timeline. No re-doing finished work.", "نعم. أحسب فرق السعر وأعدّل الجدول الزمني، دون إعادة أي عمل أُنجز."] },
    { q: ["Is there a discount for full prepayment?", "هل يوجد خصم على الدفع الكامل مقدّمًا؟"], a: ["Yes — 10% off the total invoice when paid upfront in full at kickoff.", "نعم: خصم 10% من إجمالي الفاتورة عند دفعها كاملةً مقدّمًا عند البدء."] },
    {
      q: ["Do you work with international clients? What currency?", "هل تعمل مع عملاء دوليين؟ وبأي عملة؟"],
      a: fxActive
        ? [
            "Yes, frequently across Egypt, Saudi Arabia, UAE, Qatar, and worldwide. Quoted in USD with EGP and SAR equivalents shown alongside; paid via InstaPay, Vodafone Cash, Wise, PayPal, or bank transfer.",
            "نعم، باستمرار في مصر والسعودية والإمارات وقطر وحول العالم. يكون التسعير بالدولار مع عرض المعادل بالجنيه المصري (EGP) والريال السعودي (SAR)، ويتم الدفع عبر إنستاباي أو فودافون كاش أو Wise أو PayPal أو تحويل بنكي.",
          ]
        : [
            "Yes, frequently across Egypt, Saudi Arabia, UAE, Qatar, and worldwide. Quoted in USD; EGP/SAR prices are confirmed on WhatsApp. Paid via InstaPay, Vodafone Cash, Wise, PayPal, or bank transfer.",
            "نعم، باستمرار في مصر والسعودية والإمارات وقطر وحول العالم. يكون التسعير بالدولار، وتُؤكَّد أسعار الجنيه (EGP) والريال (SAR) عبر واتساب. ويتم الدفع عبر إنستاباي أو فودافون كاش أو Wise أو PayPal أو تحويل بنكي.",
          ],
    },
    { q: ["What about revisions beyond the included rounds?", "ماذا عن التعديلات بعد الجولات المشمولة؟"], a: ["Each tier includes 2 structured rounds; additional revisions are billed hourly and logged in writing.", "تشمل كل فئة جولتَي مراجعة منظّمتين، وما بعدهما يُحاسَب بالساعة ويُوثَّق كتابةً."] },
    { q: ["Are source files (AI / PSD) included?", "هل ملفات المصدر (AI/PSD) مشمولة؟"], a: ["Final vector source files ship with every tier after the final payment clears — that's the IP transfer moment.", "تُسلَّم ملفات المصدر النهائية مع كل فئة بعد سداد الدفعة الأخيرة، وهذه لحظة انتقال الملكية."] },
  ];
}

interface PricingData {
  tiers: Tier[];
  alaCarte: AlaCarteGroup[];
}

export function PricingView({ tiers, alaCarte }: PricingData) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [tierView, setTierView] = useState<"cards" | "compare">("cards");
  useAmbientGlow(PRICING_MOOD, 0.3);
  return (
    <main className="container-content flex flex-col gap-8 pb-6">
      <PagePlate src="/images/generated/page-pricing.jpg" align="start">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "الأسعار / التكلفة" : lang === "ms" ? "HARGA / KOS" : "PRICING / WHAT IT COSTS"}
          eyebrowMeta={
            <p className="hidden font-mono text-micro uppercase tracking-[0.10em] text-text-ghost sm:block">
              {ar ? "بالدولار · شفاف · قابل للتفاوض" : lang === "ms" ? "USD · TELUS · BOLEH DIRUNDING" : "USD · TRANSPARENT · NEGOTIABLE"}
            </p>
          }
          title={
            <>
              {ar ? "بلا رسوم " : lang === "ms" ? "Tiada " : "No hidden "}
              <em className="text-accent">{ar ? "خفية." : lang === "ms" ? "yuran tersembunyi." : "fees."}</em>
            </>
          }
          subtitleClassName="max-w-[52ch]"
          subtitle={
            ar
              ? "ثلاث فئات تمتد من الشعار إلى النظام الكامل، إضافة إلى خدمات منفردة للأعمال المستقلة. يتغير السعر مع النطاق، ويُعلَن ذلك مقدّمًا."
              : "Three tiers from logo to full system, plus à la carte services for stand-alone work. Pricing varies with scope — and that's stated upfront."
          }
        />

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Discovery call first — the deposit page is step 04 (lib/offers FUNNEL_STEPS). */}
          <Link
            href="/contact"
            className={buttonVariants({
              variant: "primary",
              className:
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-label tracking-[0.06em]",
            })}
          >
            {ar ? DISCOVERY_CTA_LABEL[1] : lang === "ms" ? "Tempah panggilan penemuan" : DISCOVERY_CTA_LABEL[0]}<Icon name="arrow-right" flip={false} className="ms-1.5" />
          </Link>
          <Link
            href="/services/store-72h"
            className={buttonVariants({
              variant: "ghost",
              className:
                "inline-flex items-center gap-1.5 border border-border-default px-3.5 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary hover:text-text-primary",
            })}
          >
            {ar
              ? "متجر ثنائي اللغة خلال 72 ساعة (من $197) ←"
              : "72-Hour Bilingual Store (From $197) →"}
          </Link>
          {BOOKING_URL ? (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-booking-click="true"
              className="font-mono text-micro text-accent underline underline-offset-4"
            >
              {ar ? BOOKING_CTA_LABEL[1] : lang === "ms" ? "Tempah panggilan percuma 30 minit" : BOOKING_CTA_LABEL[0]} {ar ? "↖" : "↗"}
            </a>
          ) : null}
        </div>

        <dl className="grid grid-cols-3 gap-2 border-y border-border-subtle py-2">
          {([["STARTS AT", "يبدأ من", "$199"], ["TIERS", "الفئات", "3"], ["PRODUCTION ITEMS", "بنود الإنتاج", "17"]] as const).map(([en, arr, v]) => (
            <div key={en}>
              <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{ar ? arr : en}</dt>
              <dd className="font-display text-title text-text-primary">{v}</dd>
              {en === "STARTS AT" ? (
                <dd>
                  <FxSubline usdOrPrice={199} lang={lang} showValidity={false} compact />
                </dd>
              ) : null}
            </div>
          ))}
        </dl>
      </header>
      </PagePlate>

      <section className="flex flex-col gap-3">
        <SectionHead label={["01 / SERVICE TIERS", "01 / فئات الخدمة"]} title={["Pick the", "اختر"]} italic={["scope that fits.", "النطاق المناسب."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar
            ? "تبدأ معظم المشاريع من الفئة 2. والفئة 1 لمن تحكمه الميزانية، والفئة 3 لنظام إطلاق كامل."
            : "Most projects start at Tier 2. Tier 1 is the budget constraint; Tier 3 is a full launch system."}
        </p>
        {/* One view at a time: the same three tiers as full cards or as a
            side-by-side comparison. Both stacked made the section two
            screens of the same information. */}
        <div className="work-filter" role="group" aria-label={ar ? "طريقة العرض" : "View as"}>
          {(
            [
              ["cards", "Cards", "بطاقات"],
              ["compare", "Compare", "مقارنة"],
            ] as const
          ).map(([value, en, arr]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTierView(value)}
              aria-pressed={tierView === value}
              className={["work-filter__btn", tierView === value ? "work-filter__btn--active" : ""].join(" ")}
            >
              {ar ? arr : en}
            </button>
          ))}
        </div>
        {tierView === "compare" ? <TierCompare tiers={tiers} /> : <TierGrid tiers={tiers} />}
        <p className="text-center font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "— كل الفئات قابلة للتخصيص · تُضاف البنود أو تُحذف بعد النقاش · السعر قابل للتفاوض بحسب النطاق والجدول وطبيعة العلاقة —" : "— All tiers are customizable · Items can be added or removed after discussion · Pricing is negotiable based on scope, timeline, and long-term relationship —"}
        </p>
      </section>

      <section className="rounded-panel border border-border-subtle bg-surface-1/30 p-4 md:p-5">
        <InvestmentValue />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["02 / PRODUCTION MENU", "02 / قائمة الإنتاج"]} title={["Production,", "إنتاج،"]} italic={["not strategy.", "لا استراتيجية."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {pick(PRODUCTION_MENU_NOTE, lang)}
        </p>
        <p className="max-w-[60ch] text-body-sm text-text-tertiary">
          {ar
            ? "تُحدَّد الباقات الاستراتيجية (الهوية والأنظمة) بنطاق مكتوب بعد المكالمة. وتُحجز باقات الويب والباقات الشهرية بعربون، وتُطلب بنود المطبوعات ووسائل التواصل عبر واتساب."
            : "Strategic engagements (identity, systems) are scoped in writing after the call. Web packages and retainers are bookable with a deposit; print and social items are ordered on WhatsApp."}
        </p>
        <div className="rounded-card border border-border-subtle bg-surface-1/40 p-3">
          <AlaCarteTables alaCarte={alaCarte} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["03 / PAYMENT", "03 / الدفع"]} title={["How &", "كيف"]} italic={["when you pay.", "ومتى تدفع."]} />
        <PaymentBlock />
      </section>

      <SocialProof />

      <section className="flex flex-col gap-3">
        <SectionHead label={["04 / PRICING FAQ", "04 / أسئلة عن الأسعار"]} title={["Common", "أسئلة"]} italic={["questions.", "شائعة."]} />
        <Faq items={buildPricingFaq()} />
      </section>

      <CtaBand
        kicker={["NOT SURE WHICH TIER?", "لست متأكدًا من الفئة؟"]}
        title={["That's what the", "لهذا وُجدت"]}
        italic={["call is for.", "المكالمة."]}
        primary={DISCOVERY_CTA_LABEL}
        primaryHref="/contact"
        secondary={["Read Full Agreement", "اقرأ الاتفاقية كاملة"]}
        secondaryHref="/agreement"
      />
    </main>
  );
}
