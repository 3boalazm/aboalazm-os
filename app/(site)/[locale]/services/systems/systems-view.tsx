"use client";

/**
 * BUSINESS SYSTEMS — the third discipline, which the site previously only
 * implied (the audit's section 4, segment 3: "capability present, commercial
 * offer missing"). Written for an operations or founder-level reader: the
 * symptom, what gets built, what changes, and how it is scoped — not a
 * technology list.
 */
import Link from "@/components/ui/localized-link";
import Image from "next/image";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";
import { DISCOVERY_CTA_LABEL } from "@/lib/offers";
import { PROJECTS } from "@/features/work/projects.data";
import { cardArt } from "@/features/work/card-art";
import { evidenceOf, EVIDENCE_COPY } from "@/features/work/project-evidence";
import { StartFunnel } from "@/features/offers/start-funnel";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

const SYSTEM_SLUGS = [
  "nile-pharma-erp",
  "farm-console",
  "nile-pharma-storefront",
  "clinic-appointment-system",
  "speech-to-text-studio",
];

const COPY = {
  en: {
    eyebrow: "Services / Business systems",
    title: "When the business runs on spreadsheets and memory.",
    intro:
      "Most operating problems look like people problems until you draw the process. Orders in WhatsApp, stock in one sheet, collections in another, and a monthly report someone rebuilds by hand every month. The studio builds the system that replaces that — scoped to the process you actually run, Arabic-first, and usable by the team you already have.",
    symptomsLabel: "Sound familiar?",
    symptoms: [
      "Orders arrive on WhatsApp and get re-typed into a sheet by hand.",
      "Nobody can answer \"how much stock is left?\" without calling someone.",
      "Collections, incentives and rep performance live in three different files.",
      "The monthly report takes two days and is out of date the moment it lands.",
      "A tool was bought, but the team still works around it.",
    ],
    buildLabel: "What gets built",
    build: [
      ["An operations console", "One screen for orders, stock, collections and exceptions — with the numbers the owner actually asks for."],
      ["Role-based access", "Sales sees their own book; operations sees everything; the owner sees margin. Arabic RTL interface as the default, not a translation."],
      ["A workflow, not a form", "Approvals, statuses and handoffs written to match how the business already works, so the team does not have to relearn its job."],
      ["Automation where it pays", "Repetitive steps replaced with rules and, where useful, AI-assisted extraction or drafting — measured after launch, not promised before it."],
    ],
    scopeLabel: "How it is scoped",
    scope: [
      ["01 · Process map (paid, fixed)", "A short paid engagement that documents the current process, the exceptions and the data you already have. You keep the document even if you build elsewhere."],
      ["02 · Build proposal", "Fixed scope, milestones, price and a launch date in writing — the same agreement model as every other engagement."],
      ["03 · Build & training", "Built in stages against your real data, with team training and 30 days of support after handover."],
    ],
    proofLabel: "Systems already built",
    proofNote:
      "Labels are explicit: a client system is a paid engagement; a studio build is the studio's own product. Where no measured operational result exists, none is claimed.",
    cta: "Talk through the process",
  },
  ar: {
    eyebrow: "الخدمات / أنظمة الأعمال",
    title: "حين يعتمد عملك على الجداول والذاكرة.",
    intro:
      "أغلب مشكلات التشغيل تبدو مشكلة أشخاص إلى أن ترسم العملية. طلبات عبر واتساب، ومخزون في جدول، وتحصيل في جدول آخر، وتقرير شهري يعيد أحدهم بناءه يدويًا كل شهر. يبني الاستوديو النظام الذي يحلّ محل هذا كله، على مقاس العملية التي تعملون بها فعلًا، بالعربية أولًا، وبما يناسب الفريق الموجود لديك.",
    symptomsLabel: "هل الأعراض مألوفة؟",
    symptoms: [
      "تصل الطلبات عبر واتساب، ثم يعيد أحدهم كتابتها يدويًا في جدول.",
      "لا أحد يستطيع الإجابة عن «كم تبقّى في المخزن؟» دون أن يتصل بشخص آخر.",
      "التحصيل والحوافز وأداء المندوبين موزّعة على ثلاثة ملفات مختلفة.",
      "يستغرق التقرير الشهري يومين، ويصل قديمًا.",
      "أداة اشتُريت، لكن الفريق ما زال يدور حولها.",
    ],
    buildLabel: "ما الذي يُبنى",
    build: [
      ["لوحة تشغيل", "شاشة واحدة للطلبات والمخزون والتحصيل والاستثناءات، بالأرقام التي يسأل عنها المالك فعلًا."],
      ["صلاحيات بحسب الدور", "يرى فريق المبيعات حصته، ويرى فريق التشغيل كل شيء، ويرى المالك الهامش. وواجهة عربية RTL منذ الأساس لا كترجمة لاحقة."],
      ["مسار عمل لا استمارة", "الموافقات والحالات والتسليمات مكتوبة على طريقة عملكم الحالية، حتى لا يضطر الفريق إلى تعلّم عمله من جديد."],
      ["أتمتة حيث تستحق", "الخطوات المتكررة تتحول إلى قواعد، ومعها استخراج أو صياغة بالذكاء الاصطناعي عند اللزوم. نقيس أثرها بعد الإطلاق، ولا نعد بها قبله."],
    ],
    scopeLabel: "كيف يُحدَّد النطاق",
    scope: [
      ["01 · خريطة العملية (مدفوعة، بسعر ثابت)", "ارتباط قصير مدفوع يوثّق العملية الحالية والاستثناءات والبيانات الموجودة. ويبقى المستند ملكك حتى لو نفّذت مع جهة أخرى."],
      ["02 · عرض البناء", "نطاق ثابت ومراحل وسعر وموعد إطلاق مكتوبة، بنموذج الاتفاقية نفسه المستخدم في كل المشاريع."],
      ["03 · البناء والتدريب", "بناء على مراحل باستخدام بياناتك الحقيقية، مع تدريب للفريق و30 يومًا من الدعم بعد التسليم."],
    ],
    proofLabel: "أنظمة بُنيت فعلًا",
    proofNote:
      "التسميات واضحة: نظام العميل يعني تعاقدًا مدفوعًا، والبناء الداخلي منتج للاستوديو نفسه. وأي نتيجة تشغيلية لم تُقَس لا ندّعيها.",
    cta: "لنتحدث عن العملية",
  },
} as const;

export function BusinessSystemsView() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const copy = ar ? COPY.ar : COPY.en;
  const systems = SYSTEM_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(
    (p): p is (typeof PROJECTS)[number] => Boolean(p),
  );

  return (
    <main className="container-content flex flex-col gap-8 pb-8">
      <header className="flex flex-col gap-4">
        <Link href="/services" className="x-mono w-fit text-text-tertiary transition-colors hover:text-text-primary">
          {ar ? "→ كل الخدمات" : "← All services"}
        </Link>
        <p className="x-mono x-kicker">{copy.eyebrow}</p>
        <h1 className={`x-page-title${copy.title.length > 34 ? " x-page-title--long" : ""}`}>{copy.title}</h1>
        <p className="x-page-lead">{copy.intro}</p>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={contactHref({ service: "digital-product", source: "/services/systems" })}
            className="x-btn x-btn--solid w-fit"
          >
            {ar ? DISCOVERY_CTA_LABEL[1] : DISCOVERY_CTA_LABEL[0]}<Icon name="arrow-right" flip={false} />
          </Link>
        </div>
      </header>

      <section aria-label={copy.symptomsLabel} className="flex flex-col gap-2">
        <h2 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">{copy.symptomsLabel}</h2>
        <ul className="flex flex-col">
          {copy.symptoms.map((s) => (
            <li
              key={s}
              className="border-t border-border-subtle py-2 text-body-sm text-text-secondary last:border-b"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label={copy.buildLabel} className="flex flex-col gap-2">
        <h2 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">{copy.buildLabel}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {copy.build.map(([head, body], i) => (
            <div key={head} className="rounded-card border border-border-default bg-surface-1 p-3">
              <p className="font-mono text-micro text-accent">{`0${i + 1}`}</p>
              <h3 className="mt-1 font-display text-subtitle text-text-primary">{head}</h3>
              <p className="mt-1 text-body-sm text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={copy.scopeLabel} className="flex flex-col gap-2">
        <h2 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">{copy.scopeLabel}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {copy.scope.map(([head, body]) => (
            <div key={head} className="border-t border-border-default pt-2">
              <p className="font-mono text-micro uppercase tracking-[0.08em] text-accent">{head}</p>
              <p className="mt-1 text-body-sm text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={copy.proofLabel} className="flex flex-col gap-3">
        <h2 className="font-display text-subtitle tracking-[-0.01em] text-text-primary">{copy.proofLabel}</h2>
        <p className="max-w-[62ch] text-body-sm text-text-tertiary">{copy.proofNote}</p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {systems.map((p) => {
            const evidence = evidenceOf(p);
            const ec = EVIDENCE_COPY[evidence];
            const name = ar && p.nameAr ? p.nameAr : p.name;
            return (
              <Link
                key={p.slug}
                href={p.hasCaseStudy ? `/case-studies/${p.slug}` : "/work/development"}
                className="group flex flex-col overflow-hidden rounded-card border border-border-default bg-surface-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={cardArt(p.thumbnail)}
                    alt={name}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-physics group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={evidence === "client" ? "neutral" : "creative"} size="sm">
                      {ar ? ec.ar : ec.en}
                    </Badge>
                    <span className="font-mono text-micro text-text-ghost">{p.year}</span>
                  </div>
                  <h3 className="font-display text-subtitle leading-[1.15] text-text-primary group-hover:text-accent">
                    {name}
                  </h3>
                  <p className="text-body-sm text-text-secondary">{ar && p.outcomeAr ? p.outcomeAr : p.outcome}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <StartFunnel primaryLabel={[copy.cta, copy.cta]} />

    </main>
  );
}
