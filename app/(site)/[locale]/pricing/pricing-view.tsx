"use client";

import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import {
  bookHref,
  DEPOSIT_CTA_LABEL,
  type AlaCarteGroup,
  type Bi,
  type Tier,
} from "@/lib/offers";
import { BOOKING_CTA_LABEL, BOOKING_URL } from "@/lib/contact-details";
import { resolveFxState } from "@/lib/fx";
import {
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

const PRICING_MOOD = {
  primary: "rgb(255 107 71 / 0.10)",
  secondary: "rgb(163 230 53 / 0.05)",
} as const;

export function buildPricingFaq(fxActive = resolveFxState().active): readonly { q: Bi; a: Bi }[] {
  return [
    { q: ["Are prices negotiable?", "هل الأسعار قابلة للتفاوض؟"], a: ["Yes, within reason — final pricing depends on scope, timeline, number of applications, and whether it's a one-off or a longer relationship. The ranges shown are honest starting points.", "نعم في حدود معقولة — السعر النهائي يعتمد على النطاق والجدول وعدد التطبيقات وطبيعة العلاقة. النطاقات المعروضة نقاط بداية صادقة."] },
    { q: ["What if my project doesn't fit a tier exactly?", "ماذا لو لم يناسب مشروعي فئة بعينها؟"], a: ["Most don't — tiers are starting templates. After the Discovery Call, you get a custom proposal that adds, removes, or adjusts items to your actual needs.", "أغلب المشاريع كذلك — الفئات قوالب بداية. بعد مكالمة الاكتشاف يصلك عرض مخصص يضيف أو يحذف أو يعدّل البنود حسب احتياجك الفعلي."] },
    { q: ["Can I upgrade tiers during the project?", "هل يمكن الترقية أثناء المشروع؟"], a: ["Yes — I quote the upgrade delta and adjust the timeline. No re-doing finished work.", "نعم — أسعّر فرق الترقية ونعدّل الجدول، دون إعادة أي عمل منجز."] },
    { q: ["Is there a discount for full prepayment?", "هل يوجد خصم للدفع الكامل مقدمًا؟"], a: ["Yes — 10% off the total invoice when paid upfront in full at kickoff.", "نعم — خصم 10% من إجمالي الفاتورة عند الدفع الكامل مقدمًا عند البدء."] },
    {
      q: ["Do you work with international clients? What currency?", "العملاء الدوليون؟ وبأي عملة؟"],
      a: fxActive
        ? [
            "Yes, frequently across Egypt, Saudi Arabia, UAE, Qatar, and worldwide. Quoted in USD with EGP and SAR equivalents shown alongside; paid via InstaPay, Vodafone Cash, Wise, PayPal, or bank transfer.",
            "نعم باستمرار في مصر والسعودية والإمارات وقطر وحول العالم. التسعير بالدولار مع عرض المعادل بالجنيه المصري (EGP) والريال السعودي (SAR)، والدفع عبر إنستاباي أو فودافون كاش أو Wise أو PayPal أو تحويل بنكي.",
          ]
        : [
            "Yes, frequently across Egypt, Saudi Arabia, UAE, Qatar, and worldwide. Quoted in USD; EGP/SAR prices are confirmed on WhatsApp. Paid via InstaPay, Vodafone Cash, Wise, PayPal, or bank transfer.",
            "نعم باستمرار في مصر والسعودية والإمارات وقطر وحول العالم. التسعير بالدولار؛ أسعار الجنيه (EGP) والريال (SAR) تُؤكَّد عبر واتساب. الدفع عبر إنستاباي أو فودافون كاش أو Wise أو PayPal أو تحويل بنكي.",
          ],
    },
    { q: ["What about revisions beyond the included rounds?", "ماذا عن التعديلات بعد الجولات المشمولة؟"], a: ["Each tier includes 2 structured rounds; additional revisions are billed hourly and logged in writing.", "كل فئة تشمل جولتين منظمتين، وما بعدهما يُحاسب بالساعة ويوثَّق كتابيًا."] },
    { q: ["Are source files (AI / PSD) included?", "هل ملفات المصدر (AI/PSD) مشمولة؟"], a: ["Final vector source files ship with every tier after the final payment clears — that's the IP transfer moment.", "ملفات المصدر النهائية تُسلَّم مع كل فئة بعد سداد الدفعة الأخيرة — وهي لحظة انتقال الملكية."] },
  ];
}

interface PricingData {
  tiers: Tier[];
  alaCarte: AlaCarteGroup[];
}

export function PricingView({ tiers, alaCarte }: PricingData) {
  const { lang } = useLang();
  const ar = lang === "ar";
  useAmbientGlow(PRICING_MOOD, 0.3);
  return (
    <main className="container-content flex flex-col gap-8 pb-6">
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

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={bookHref("brand-identity")}
            className={buttonVariants({
              variant: "primary",
              className:
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-label tracking-[0.06em]",
            })}
          >
            {ar ? DEPOSIT_CTA_LABEL[1] : DEPOSIT_CTA_LABEL[0]} →
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
              ? "متجر ثنائي اللغة خلال 72 ساعة (من $197) →"
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
              {ar ? BOOKING_CTA_LABEL[1] : BOOKING_CTA_LABEL[0]} ↗
            </a>
          ) : null}
        </div>

        <dl className="grid grid-cols-3 gap-2 border-y border-border-subtle py-2">
          {([["STARTS AT", "يبدأ من", "$199"], ["TIERS", "الفئات", "3"], ["À LA CARTE ITEMS", "خدمات منفردة", "15+"]] as const).map(([en, arr, v]) => (
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

      <section className="flex flex-col gap-3">
        <SectionHead label={["01 / SERVICE TIERS", "01 / فئات الخدمة"]} title={["Pick the", "اختر"]} italic={["scope that fits.", "النطاق المناسب."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar
            ? "معظم المشاريع تبدأ من الفئة 2. الفئة 1 للقيد الميزاني، والفئة 3 للإطلاق الكامل."
            : "Most projects start at Tier 2. Tier 1 is the budget constraint; Tier 3 is a full launch system."}
        </p>
        <TierCompare tiers={tiers} />
        <TierGrid tiers={tiers} />
        <p className="text-center font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "— كل الفئات قابلة للتخصيص · البنود تُضاف أو تُحذف بعد النقاش · التسعير قابل للتفاوض حسب النطاق والجدول والعلاقة —" : "— All tiers are customizable · Items can be added or removed after discussion · Pricing is negotiable based on scope, timeline, and long-term relationship —"}
        </p>
      </section>

      <section className="rounded-panel border border-border-subtle bg-surface-1/30 p-4 md:p-5">
        <InvestmentValue />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["02 / PRODUCTION MENU", "02 / قائمة الإنتاج"]} title={["Stand-alone", "خدمات"]} italic={["services.", "مستقلة."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar
            ? "قائمة إنتاج منفصلة عن استثمار نظام الهوية: باقات تطوير المواقع والريتينر الشهري (تُحجز بعربون)، والمطبوعات والسوشيال المفردة (تُطلب مباشرة عبر واتساب)."
            : "Production menu across web packages and monthly retainers (bookable with a deposit) and individual print/social items (ordered directly on WhatsApp)."}
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
        <SectionHead label={["04 / PRICING FAQ", "04 / أسئلة التسعير"]} title={["Common", "أسئلة"]} italic={["questions.", "متكررة."]} />
        <Faq items={buildPricingFaq()} />
      </section>

      <CtaBand
        kicker={["HAVE A PROJECT IN MIND?", "عندك مشروع؟"]}
        title={["Let's", "خلّينا"]}
        italic={["scope it.", "نحدد نطاقه."]}
        primary={DEPOSIT_CTA_LABEL}
        primaryHref={bookHref("brand-identity")}
        secondary={["Read Full Agreement", "اقرأ الاتفاقية"]}
        secondaryHref="/agreement"
      />
    </main>
  );
}
