"use client";

import { useLang } from "@/components/providers/lang-provider";
import {
  AGREEMENT_REVISED,
  AGREEMENT_TERMS,
  DISCOVERY_CTA_LABEL,
  PRODUCTION_MENU_NOTE,
  type AlaCarteGroup,
  type Bi,
  type Tier,
} from "@/lib/offers";
import {
  SectionHead,
  TierGrid,
  AlaCarteTables,
  PaymentBlock,
  CtaBand,
  pick,
} from "@/features/offers/offer-blocks";
import { Heading } from "@/components/ui/Heading";
import { PanelCard } from "@/components/ui/PanelCard";

const PHASES: readonly { n: string; days: Bi; name: Bi; body: Bi; out: Bi }[] = [
  { n: "01", days: ["Day 1", "اليوم 1"], name: ["Contact & Initial Understanding", "التواصل والفهم المبدئي"], body: ["A focused conversation to hear the idea, the business goal, and the timeline before any commitment.", "محادثة مركّزة لسماع الفكرة والهدف التجاري والجدول الزمني قبل أي التزام."], out: ["Initial Fit", "توافق مبدئي"] },
  { n: "02", days: ["Days 1–2", "اليومان 1–2"], name: ["Discovery Questions", "أسئلة الاكتشاف"], body: ["Initial questions to align on vision, audience, and competitors — followed by a detailed questionnaire after signing.", "أسئلة مبدئية لتوحيد الرؤية والجمهور والمنافسين، يليها استبيان تفصيلي بعد التعاقد."], out: ["Signed Brief", "موجز معتمد"] },
  { n: "03", days: ["Days 2–3", "اليومان 2–3"], name: ["Proposal & Kickoff Deposit", "العرض الفني ودفعة البدء"], body: ["Written scope, deliverables, and fixed quote. Kickoff begins once the 50% deposit lands.", "نطاق مكتوب ومخرجات محددة وعرض سعر ثابت. يبدأ العمل فور وصول دفعة البدء (50%)."] , out: ["50% Kickoff", "دفعة 50%"] },
  { n: "04", days: ["Days 3–9", "الأيام 3–9"], name: ["Research & Strategy", "البحث والاستراتيجية"], body: ["Competitor audit, positioning, audience persona, and visual direction approved on paper before sketching.", "مراجعة المنافسين، والتموضع، وشخصية الجمهور المستهدف، والاتجاه البصري، وتُعتمد كلها كتابيًا قبل الرسم."], out: ["Strategy Sign-off", "اعتماد الاستراتيجية"] },
  { n: "05", days: ["Days 9–20", "الأيام 9–20"], name: ["Concept Presentation", "عرض المفاهيم"], body: ["2–3 strategic directions presented in real-world context with clear rationale.", "عرض اتجاهين أو ثلاثة اتجاهات استراتيجية في سياق الاستخدام الفعلي، مع شرح منطقها البصري."], out: ["Concept Selection", "اختيار المفهوم"] },
  { n: "06", days: ["Days 20–27", "الأيام 20–27"], name: ["Refinement & Revisions", "التطوير والمراجعات"], body: ["Two structured revision rounds on the selected direction until every detail is locked in.", "جولتا مراجعة منظَّمتان للاتجاه المختار حتى تُثبَّت كل التفاصيل."], out: ["Final Approval", "الاعتماد النهائي"] },
  { n: "07", days: ["Days 27–35", "الأيام 27–35"], name: ["Applications & Guidelines", "التطبيقات ودليل الهوية"], body: ["Building out color, typography, stationery/social applications, and the Brand Guidelines PDF.", "استكمال الألوان والخطوط والتطبيقات (المطبوعات ووسائل التواصل)، وإعداد دليل الهوية بصيغة PDF."], out: ["System Ready", "جهوزية النظام"] },
  { n: "08", days: ["Days 35–38", "الأيام 35–38"], name: ["Final Payment & Handover", "الدفعة النهائية والتسليم"], body: ["After the final balance clears, all open source files and full IP rights transfer in writing.", "بعد سداد الدفعة النهائية تُسلَّم كل الملفات المفتوحة، وتنتقل الملكية الفكرية كتابيًا."], out: ["IP Transfer", "نقل الملكية"] },
];

const QUESTIONS: readonly { head: Bi; items: readonly Bi[] }[] = [
  {
    head: ["01 · The Business", "01 · النشاط التجاري"],
    items: [
      ["What does the company do, and what is the story behind the name?", "ما طبيعة نشاط الشركة، وما القصة وراء الاسم؟"],
      ["What products or services are most important right now?", "ما أهم المنتجات أو الخدمات حاليًا؟"],
      ["What sets you apart from competitors?", "ما الذي يميزكم عن المنافسين؟"],
    ],
  },
  {
    head: ["02 · Audience & Market", "02 · الجمهور والسوق"],
    items: [
      ["Who is your ideal customer (age, location, mindset)?", "من هو عميلك المثالي (العمر، والمكان، وطريقة التفكير)؟"],
      ["Who are the top 3 local or international competitors?", "من أبرز ثلاثة منافسين محليًا أو دوليًا؟"],
      ["Is the brand Arabic-first, English-first, or equally bilingual?", "هل العلامة عربية بالأساس، أم إنجليزية، أم ثنائية اللغة بالتساوي؟"],
    ],
  },
  {
    head: ["03 · Visual Direction", "03 · الاتجاه البصري"],
    items: [
      ["Which 3 adjectives should describe the brand's personality?", "ما الصفات الثلاث التي يجب أن تصف شخصية العلامة؟"],
      ["Are there colors, symbols, or styles to keep or strictly avoid?", "هل هناك ألوان أو رموز أو أساليب يجب الحفاظ عليها أو تجنبها تمامًا؟"],
    ],
  },
  {
    head: ["04 · Touchpoints & Timeline", "04 · نقاط التواصل والجدول"],
    items: [
      ["Where will the identity appear first (packaging, web, social, signage)?", "أين ستظهر الهوية أولًا (التغليف، الموقع، وسائل التواصل، اللافتات)؟"],
      ["What is the target launch date and preferred tier?", "ما موعد الإطلاق المستهدف والفئة المفضلة؟"],
    ],
  },
];

export function AgreementView({
  tiers,
  alaCarte,
}: {
  tiers: Tier[];
  alaCarte: AlaCarteGroup[];
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <main className="container-content flex flex-col gap-8 pb-6">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "الاتفاقية / كيف نعمل" : "AGREEMENT / HOW WE WORK"}
          title={
            <>
              {ar ? "اتفاقية " : "Work-Flow "}
              <em className="text-accent">{ar ? "سير العمل." : "Agreement."}</em>
            </>
          }
          subtitle={
            ar
              ? "المنهجية والتسعير والنطاق والبنود، موضوعة بوضوح لنبدأ بثقة. هذا هو العرض الكامل: اقرأه مرة واحدة، ولا مفاجآت بعدها."
              : "Process, pricing, scope, and terms — clearly laid out so we can build with confidence. This is the full proposal: read it once, no surprises later."
          }
          subtitleClassName="max-w-[52ch]"
        />
      </header>

      <section className="flex flex-col gap-3">
        <SectionHead label={["01 / PROCESS", "01 / المنهجية"]} title={["Eight phases.", "ثماني مراحل."]} italic={["No surprises.", "بلا مفاجآت."]} />
        <div className="flex flex-col">
          {PHASES.map((p) => (
            <div key={p.n} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2 border-t border-border-subtle py-3 last:border-b md:grid-cols-[2.5rem_7rem_14rem_1fr_auto]">
              <span className="font-display text-title text-accent">{p.n}</span>
              <span className="font-mono text-label uppercase tracking-[0.08em] text-text-tertiary">{pick(p.days, lang)}</span>
              <span className="text-body text-text-primary">{pick(p.name, lang)}</span>
              <span className="col-span-2 text-body text-text-secondary md:col-span-1">{pick(p.body, lang)}</span>
              <span className="hidden font-mono text-label uppercase tracking-[0.08em] text-accent/70 md:block">{pick(p.out, lang)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["02 / DISCOVERY QUESTIONS", "02 / أسئلة الاكتشاف"]} title={["Before we", "قبل أن"]} italic={["start.", "نبدأ."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar ? "لتعبّر العلامة عن نشاطك بدقة، نحتاج إلى إجابات واضحة عن هذه الأسئلة، يليها استبيان تفصيلي بعد توقيع العقد." : "For the brand to express your business accurately, we need aligned answers to these. A detailed questionnaire follows after contract signing."}
        </p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {QUESTIONS.map((g) => (
            <PanelCard key={g.head[0]} className="rounded-card p-3">
              <p className="font-mono text-micro uppercase tracking-[0.10em] text-accent">{pick(g.head, lang)}</p>
              <ul className="mt-1 flex flex-col gap-1">
                {g.items.map((q) => (
                  <li key={q[0]} className="text-body-sm text-text-secondary">— {pick(q, lang)}</li>
                ))}
              </ul>
            </PanelCard>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["03 / SERVICE TIERS", "03 / فئات الخدمة"]} title={["Three tiers.", "ثلاث فئات."]} italic={["One starting line.", "خط بداية واحد."]} />
        <TierGrid tiers={tiers} />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["04 / PRODUCTION MENU", "04 / قائمة الإنتاج"]} title={["Production,", "الإنتاج،"]} italic={["not strategy.", "لا الاستراتيجية."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {pick(PRODUCTION_MENU_NOTE, lang)}
        </p>
        <AlaCarteTables alaCarte={alaCarte} />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["05 / PAYMENT", "05 / الدفع"]} title={["How &", "كيف"]} italic={["when.", "ومتى."]} />
        <PaymentBlock />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["06 / TERMS", "06 / البنود"]} title={["The fine", "البنود"]} italic={["print.", "التفصيلية."]} />
        <div className="flex flex-col">
          {AGREEMENT_TERMS.map((t) => (
            <div
              key={t.n}
              className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2 border-t border-border-subtle py-2.5 last:border-b md:grid-cols-[2.5rem_16rem_1fr]"
            >
              <span className="font-mono text-micro text-text-ghost">{t.n}</span>
              <span className="flex flex-wrap items-center gap-2 text-body text-text-primary">
                <span>{pick(t.head, lang)}</span>
              </span>
              <span className="col-span-2 text-body-sm text-text-secondary md:col-span-1">
                {pick(t.body, lang)}
              </span>
            </div>
          ))}
        </div>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar
            ? `— البنود 01–12 سارية على كل اتفاق موقّع · آخر مراجعة ${AGREEMENT_REVISED} —`
            : `— CLAUSES 01–12 ARE IN FORCE ON EVERY SIGNED AGREEMENT · LAST REVISED ${AGREEMENT_REVISED} —`}
        </p>
      </section>

      <CtaBand
        kicker={["READ THE TERMS, THEN START", "اقرأ البنود، ثم ابدأ"]}
        title={["Questions about the", "هل لديك سؤال"]}
        italic={["contract?", "عن الاتفاقية؟"]}
        primary={DISCOVERY_CTA_LABEL}
        primaryHref="/contact"
        secondary={["View Pricing", "اطّلع على الأسعار"]}
        secondaryHref="/pricing"
      />
    </main>
  );
}
