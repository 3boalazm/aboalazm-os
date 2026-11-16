"use client";

/**
 * PARTNERSHIP — what happens after launch (2026-11 repositioning, P2 · point 12).
 *
 * The audit's question from a large-company buyer was blunt: "can you carry the
 * work after handover?" The site answered it nowhere. This page states the
 * support window, the maintenance retainer, what each month actually covers,
 * the response promise and how to end the arrangement — priced, not vague.
 */
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";
import { BOOKING_CTA_LABEL, RESPONSE_PROMISE } from "@/lib/contact-details";
import { StartFunnel } from "@/features/offers/start-funnel";

const COPY = {
  en: {
    eyebrow: "Partnership / after launch",
    title: "The brand is handed over. The relationship does not have to end.",
    intro:
      "Every engagement ships with 30 days of post-delivery support at no extra cost: fixes, file questions, and the small adjustments a real team always needs in the first month of using a new system. After that, ongoing support is optional and priced — not assumed, not hidden inside a retainer you did not ask for.",
    tiersLabel: "Three ways to continue",
    tiers: [
      {
        name: "Included — 30 days",
        price: "No extra cost",
        body: "Included in every engagement. Corrections to delivered files, guideline clarification, and up to two working hours of team support.",
        best: "Everyone, automatically.",
      },
      {
        name: "Brand stewardship",
        price: "From $247 / month",
        body: "Monthly oversight so the system does not drift: template updates, new applications built on the existing system, light edits, and a written check that public material still matches the guidelines.",
        best: "Companies producing campaigns or content in-house.",
      },
      {
        name: "Digital & systems partnership",
        price: "Scoped monthly",
        body: "Continuous improvement on the digital layer — new pages, store or dashboard changes, automation additions, performance and accessibility fixes — with a monthly written summary of what shipped.",
        best: "Companies running a site, store or internal system in production.",
      },
    ],
    coverLabel: "What a month actually includes",
    cover: [
      "A written work list agreed at the start of each month — you always know what is being done.",
      "A fixed number of hours or items; anything beyond it is quoted before it starts.",
      "One monthly review call and a written summary of what changed.",
      "Cancel or pause with 14 days' notice; no exit fee, no unused months billed.",
    ],
    responseLabel: "Response promise",
    response: RESPONSE_PROMISE.en,
    whoLabel: "How the work is staffed",
    who:
      "Stewardship and digital partnership work is led by Mustafa directly. Larger builds inside a partnership follow the same model as a project: named specialists, one written scope, studio quality control.",
    ctaLabel: "Discuss a partnership",
  },
  ar: {
    eyebrow: "الشراكة / بعد الإطلاق",
    title: "تُسلَّم الهوية، أما العلاقة فلا يلزم أن تنتهي.",
    intro:
      "يأتي كل مشروع بدعم مدته 30 يومًا بعد التسليم دون تكلفة إضافية: تصحيحات، وأسئلة عن الملفات، والتعديلات الصغيرة التي يحتاجها أي فريق حقيقي في الشهر الأول من استخدام نظام جديد. بعد ذلك يصبح الدعم المستمر اختياريًا ومسعّرًا، لا مفترضًا ولا مخفيًا داخل عقد شهري لم تطلبه.",
    tiersLabel: "ثلاث طرق للاستمرار",
    tiers: [
      {
        name: "مشمول: 30 يومًا",
        price: "دون تكلفة إضافية",
        body: "مشمول في كل مشروع: تصحيح الملفات المسلّمة، وتوضيح الدليل، وحتى ساعتي عمل من دعم الفريق.",
        best: "لكل عميل، تلقائيًا.",
      },
      {
        name: "رعاية الهوية",
        price: "من $247 شهريًا",
        body: "إشراف شهري يمنع انحراف النظام: تحديث القوالب، وتطبيقات جديدة على النظام القائم، وتعديلات خفيفة، ومراجعة مكتوبة للتأكد من أن المواد المنشورة ما زالت مطابقة للدليل.",
        best: "الشركات التي تنتج حملات أو محتوى داخليًا.",
      },
      {
        name: "شراكة رقمية وأنظمة",
        price: "يُسعَّر شهريًا",
        body: "تطوير مستمر للطبقة الرقمية: صفحات جديدة، وتعديلات على المتجر أو لوحة التحكم، وإضافات أتمتة، وإصلاحات للأداء وسهولة الوصول، مع ملخص شهري مكتوب لما أُنجز.",
        best: "الشركات التي لديها موقع أو متجر أو نظام تشغيلي يعمل في بيئة الإنتاج.",
      },
    ],
    coverLabel: "ماذا يشمل الشهر فعليًا",
    cover: [
      "قائمة عمل مكتوبة تُعتمد في بداية كل شهر، فتعرف دائمًا ما الذي يجري.",
      "عدد ثابت من الساعات أو البنود؛ وأي زيادة تُسعَّر قبل أن تبدأ.",
      "مكالمة مراجعة شهرية وملخص مكتوب للتغييرات.",
      "إلغاء أو إيقاف بإشعار قبل 14 يومًا؛ بلا رسوم خروج، وبلا محاسبة على أشهر لم تُستخدم.",
    ],
    responseLabel: "وعد الرد",
    response: RESPONSE_PROMISE.ar,
    whoLabel: "من ينفّذ العمل",
    who:
      "يقود مصطفى أعمال الرعاية والشراكة الرقمية بنفسه. أما الأعمال الأكبر داخل الشراكة فتتبع نموذج المشروع نفسه: متخصصون بعينهم، ونطاق مكتوب واحد، ومراجعة جودة من الاستوديو.",
    ctaLabel: "تحدّث عن شراكة",
  },
} as const;

export function PartnershipView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const copy = ar ? COPY.ar : COPY.en;

  return (
    <main className="container-content flex flex-col gap-8 pb-8">
      <header className="flex max-w-[70ch] flex-col gap-3">
        <Link href="/services" className="text-caption text-text-tertiary">
          {ar ? "كل الخدمات" : "All services"} ←
        </Link>
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">{copy.eyebrow}</p>
        <h1 className="font-display text-display tracking-[-0.025em] text-text-primary">{copy.title}</h1>
        <p className="text-lead text-text-secondary">{copy.intro}</p>
      </header>

      <section aria-label={copy.tiersLabel} className="flex flex-col gap-3">
        <h2 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">{copy.tiersLabel}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {copy.tiers.map((tier) => (
            <article
              key={tier.name}
              className="flex flex-col gap-2 rounded-panel border border-border-default bg-surface-1 p-3 md:p-4"
            >
              <h3 className="font-display text-subtitle text-text-primary">{tier.name}</h3>
              <p dir="ltr" className="font-display text-title text-accent">
                {tier.price}
              </p>
              <p className="text-body-sm text-text-secondary">{tier.body}</p>
              <p className="mt-auto border-t border-border-subtle pt-2 text-body-sm text-text-tertiary">
                <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-ghost">
                  {ar ? "الأنسب لـ: " : "Best for: "}
                </span>
                {tier.best}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label={copy.coverLabel} className="flex flex-col gap-2">
        <h2 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">{copy.coverLabel}</h2>
        <ul className="flex flex-col">
          {copy.cover.map((item) => (
            <li key={item} className="border-t border-border-subtle py-2 text-body-sm text-text-secondary last:border-b">
              — {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="border-t border-border-default pt-2">
          <h2 className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{copy.responseLabel}</h2>
          <p className="mt-1 text-body-sm text-text-secondary">{copy.response}</p>
        </div>
        <div className="border-t border-border-default pt-2">
          <h2 className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{copy.whoLabel}</h2>
          <p className="mt-1 text-body-sm text-text-secondary">{copy.who}</p>
        </div>
      </section>

      <StartFunnel
        showSteps={false}
        primaryLabel={[copy.ctaLabel, copy.ctaLabel]}
      />

      <p className="text-body-sm text-text-tertiary">
        <Link
          href={contactHref({ service: "brand-support", source: "/partnership" })}
          className="text-accent underline underline-offset-4"
        >
          {ar ? BOOKING_CTA_LABEL[1] : BOOKING_CTA_LABEL[0]}
        </Link>
      </p>
    </main>
  );
}
