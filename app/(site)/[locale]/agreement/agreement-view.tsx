"use client";

import { useLang } from "@/components/providers/lang-provider";
import type { Bi } from "@/lib/offers";
import { SectionHead, TierGrid, AlaCarteTables, PaymentBlock, CtaBand, pick } from "@/features/offers/offer-blocks";
import { Heading } from "@/components/ui/Heading";
import { PanelCard } from "@/components/ui/PanelCard";

const PHASES: readonly { n: string; days: Bi; name: Bi; body: Bi; out: Bi }[] = [
  { n: "01", days: ["PRE-DAY 1", "قبل اليوم 1"], name: ["Discovery Call", "مكالمة الاكتشاف"], body: ["A short call to understand the project and confirm we're fit — before any financial commitment.", "مكالمة قصيرة لفهم المشروع والتأكد من التوافق — قبل أي التزام مالي."], out: ["FIT CONFIRMED", "تأكيد التوافق"] },
  { n: "02", days: ["DAY 1", "اليوم 1"], name: ["Kickoff & Onboarding", "البدء والتعاقد"], body: ["Contract signed, 50% deposit received, project brief approved in writing. Nothing moves before all three.", "توقيع العقد، استلام مقدّم 50%، واعتماد البريف كتابيًا. لا شيء يتحرك قبل الثلاثة."], out: ["PROJECT LIVE", "بدء المشروع"] },
  { n: "03", days: ["DAYS 2–6", "الأيام 2–6"], name: ["Discovery & Research", "الاكتشاف والبحث"], body: ["Brand audit, competitor analysis, audience persona, cultural research. No design appears in this phase — it's the foundation everything is built on.", "مراجعة البراند، تحليل المنافسين، بيرسونا الجمهور، والبحث الثقافي. لا تصميم في هذه المرحلة — هي الأساس الذي يُبنى عليه كل شيء."], out: ["RESEARCH REPORT", "تقرير بحثي"] },
  { n: "04", days: ["DAYS 5–9", "الأيام 5–9"], name: ["Brand Strategy", "استراتيجية البراند"], body: ["Purpose, positioning, personality, tone of voice — approved in writing before any concept is drawn.", "الغاية، التموضع، الشخصية، نبرة الصوت — تُعتمد كتابيًا قبل رسم أي مفهوم."], out: ["SIGNED STRATEGY", "استراتيجية موقّعة"] },
  { n: "05", days: ["DAYS 9–17", "الأيام 9–17"], name: ["Concept Development", "تطوير المفاهيم"], body: ["Dozens of sketches narrowed to 2–3 directions, presented on real mockups with the strategic logic behind each.", "عشرات الإسكتشات تُختصر إلى 2–3 اتجاهات، تُعرض على موك أب حقيقي مع المنطق الاستراتيجي وراء كل اتجاه."], out: ["DIRECTION CHOSEN", "اختيار الاتجاه"] },
  { n: "06", days: ["DAYS 17–27", "الأيام 17–27"], name: ["Full Brand Design", "تصميم الهوية الكاملة"], body: ["Logo system → colors → typography → elements → applications. The order is not negotiable.", "نظام الشعار ← الألوان ← الخطوط ← العناصر ← التطبيقات. الترتيب غير قابل للتفاوض."], out: ["FULL SYSTEM", "نظام كامل"] },
  { n: "07", days: ["DAYS 27–34", "الأيام 27–34"], name: ["Refinement & Revisions", "المراجعة والتعديلات"], body: ["Two structured revision rounds, logged in writing. Out-of-scope requests are quoted separately.", "جولتا مراجعة منظمتان موثقتان كتابيًا، وأي طلب خارج النطاق يُسعَّر على حدة."], out: ["FINAL SIGN-OFF", "اعتماد نهائي"] },
  { n: "08", days: ["DAYS 34–38", "الأيام 34–38"], name: ["Final Delivery", "التسليم النهائي"], body: ["Brand Guidelines PDF, all source files in every format, handover call, plus 30 days of post-launch support.", "دليل الهوية PDF، كل ملفات المصدر بكل الصيغ، مكالمة تسليم، ودعم 30 يومًا بعد الإطلاق."], out: ["FULL HANDOVER", "تسليم كامل"] },
];

const QUESTIONS: readonly { head: Bi; items: readonly Bi[] }[] = [
  { head: ["About the project", "عن المشروع"], items: [["Is this a brand-new identity or a rebrand?", "هوية جديدة من الصفر أم إعادة بناء لبراند قائم؟"], ["What are your core services or products?", "ما خدماتك أو منتجاتك الأساسية؟"], ["When is the planned launch? Tied to any event?", "متى الإطلاق المخطط؟ وهل مرتبط بحدث؟"]] },
  { head: ["About decision makers", "عن أصحاب القرار"], items: [["Who has final approval on the identity?", "من يملك الاعتماد النهائي للهوية؟"], ["Who reviews before them — the full circle?", "من يراجع قبله — الدائرة كاملة؟"]] },
  { head: ["About brand & audience", "عن البراند والجمهور"], items: [["What are the 3 core values of the brand?", "ما القيم الثلاث الجوهرية للبراند؟"], ["Who is the target audience? Demographics + pain points.", "من الجمهور المستهدف؟ ديموغرافيا ونقاط ألم."], ["Top 3 competitors — what do you like / dislike about their identities?", "أهم 3 منافسين — ما يعجبك وما يزعجك في هوياتهم؟"]] },
  { head: ["About visual direction", "عن التوجه البصري"], items: [["Bilingual brand (Arabic / English)?", "براند ثنائي اللغة (عربي / إنجليزي)؟"], ["Colors or styles you prefer or want to avoid — and why?", "ألوان أو أساليب تفضلها أو تتجنبها — ولماذا؟"], ["Required applications — website, packaging, uniform, signage?", "التطبيقات المطلوبة — موقع، تغليف، يونيفورم، لافتات؟"]] },
];

/* Fine print — ported from the original Work-Flow Agreement (invoice A0026) */
const TERMS: readonly { n: string; head: Bi; body: Bi }[] = [
  { n: "01", head: ["Scope of Work", "نطاق العمل"], body: ["The attached terms apply per signed invoice; deliverables and scope are listed in the proposal approved before kickoff.", "البنود المرفقة تخص الفاتورة الموقّعة، وتُحدَّد التسليمات والنطاق في العرض المعتمد قبل البدء."] },
  { n: "02", head: ["Commitment & Content Standards", "الالتزام والمعايير"], body: ["The designer commits to delivering the agreed designs within the agreed period, and refrains from including any material deemed religiously or socially inappropriate.", "يلتزم المصمم بتنفيذ التصاميم المتفق عليها خلال المدة المتفق عليها، مع الامتناع عن إدخال أي مواد غير لائقة دينيًا أو اجتماعيًا."] },
  { n: "03", head: ["Confidentiality", "السرية"], body: ["No project information is shared with third parties before completion — except seeking professional opinion or assistance.", "لا تُقدَّم أي معلومات لأطراف ثالثة حول التصاميم وبنود العمل قبل إتمامه — باستثناء طلب رأي أو مساعدة مهنية."] },
  { n: "04", head: ["Portfolio Rights", "حقوق العرض"], body: ["Portfolio publication, its timing and any confidentiality requirements are agreed in writing before kickoff. Any commercial adjustment is itemised in the proposal; there is no automatic publication or confidentiality fee.", "بنتفق كتابيًا قبل البدء على السماح بعرض المشروع وتوقيته وأي متطلبات سرية. أي تعديل تجاري يتذكر كبند واضح في العرض؛ لا توجد رسوم عرض أو سرية تلقائية."] },
  { n: "05", head: ["Payment Structure", "نظام الدفع"], body: ["Payments are received in two installments (50% / 50%) of the total invoice — before work begins and before final files are delivered. Tier 2 & 3 follow 50/25/25.", "تُستلم المستحقات على دفعات (50%/50%) من إجمالي الفاتورة — قبل البدء وقبل تسليم الملفات النهائية. والفئتان 2 و3 بنظام 50/25/25."] },
  { n: "06", head: ["Payment Methods", "وسائل الدفع"], body: ["EGP or USD — cash, bank transfer, electronic wallets, or Vodafone Cash (01092500454). A 1% service fee may apply.", "بالجنيه أو الدولار — كاش، تحويل بنكي أو إلكتروني، أو فودافون كاش (01092500454) مع إضافة تكلفة خدمة 1% من قيمة المبلغ."] },
  { n: "07", head: ["Revisions", "التعديلات"], body: ["Each tier includes its stated revision rounds; revisions that don't alter the overall design substantially. Beyond the included rounds, each additional revision is billed as stated per tier.", "كل فئة تشمل جولات المراجعة المذكورة بها — تعديلات لا تغيّر التصميم العام كثيرًا. وما بعدها يُحاسب كل تعديل إضافي كما هو موضح بكل فئة."] },
  { n: "08", head: ["Additional Terms", "بنود إضافية"], body: ["Further terms may be added at the client's request upon mutual agreement.", "تُضاف أي بنود أخرى في حال طلب العميل ذلك بعد الاتفاق بين الطرفين."] },
  { n: "09", head: ["IP Transfer", "نقل الملكية"], body: ["Full design rights transfer to the client in writing after the final payment clears.", "تنتقل حقوق التصميم كاملة للعميل كتابيًا بعد سداد الدفعة الأخيرة."] },
  { n: "10", head: ["Good Faith", "حسن التعامل"], body: ["The designer guarantees flexibility and good conduct within a framework that protects both parties' rights.", "يضمن المصمم للعميل مرونة وحسن التعامل في إطار حفظ حقوق الطرفين."] },
];

export function AgreementView({ tiers, alaCarte }: { tiers: import("@/lib/offers").Tier[]; alaCarte: import("@/lib/offers").AlaCarteGroup[] }) {
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
              ? "المنهجية والتسعير والنطاق والبنود — موضوعة بوضوح لنبدأ بثقة. هذا هو العرض الكامل: اقرأه مرة، ولا مفاجآت بعدها."
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
        <SectionHead label={["02 / DISCOVERY QUESTIONS", "02 / أسئلة الاكتشاف"]} title={["Before we", "قبل ما"]} italic={["start.", "نبدأ."]} />
        <p className="max-w-[60ch] text-body-sm text-text-secondary">
          {ar ? "ليعبّر البراند عن نشاطك بدقة، نحتاج إجابات متوافقة على هذه الأسئلة — ويلي ذلك استبيان تفصيلي بعد توقيع العقد." : "For the brand to express your business accurately, we need aligned answers to these. A detailed questionnaire follows after contract signing."}
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
        <SectionHead label={["04 / À LA CARTE", "04 / خدمات منفردة"]} title={["Stand-alone", "خدمات"]} italic={["services.", "مستقلة."]} />
        <AlaCarteTables alaCarte={alaCarte} />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["05 / PAYMENT", "05 / الدفع"]} title={["How &", "كيف"]} italic={["when.", "ومتى."]} />
        <PaymentBlock />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["06 / TERMS", "06 / البنود"]} title={["The fine", "البنود"]} italic={["print.", "التفصيلية."]} />
        <div className="flex flex-col">
          {TERMS.map((t) => (
            <div key={t.n} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2 border-t border-border-subtle py-2 last:border-b md:grid-cols-[2.5rem_14rem_1fr]">
              <span className="font-mono text-micro text-text-ghost">{t.n}</span>
              <span className="text-body text-text-primary">{pick(t.head, lang)}</span>
              <span className="col-span-2 text-body-sm text-text-secondary md:col-span-1">{pick(t.body, lang)}</span>
            </div>
          ))}
        </div>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "شكرًا لنيل ثقتكم للتعامل — نتمنى أن تكون تجربة مميزة." : "— THANK YOU FOR YOUR TRUST. WE INTEND TO MAKE IT A REMARKABLE EXPERIENCE. —"}
        </p>
      </section>

      <CtaBand kicker={["READY TO BEGIN?", "جاهز تبدأ؟"]} title={["Ready to", "يلّا"]} italic={["begin?", "نبدأ؟"]} primary={["Start a Project", "ابدأ مشروعًا"]} primaryHref="/contact" secondary={["View Pricing", "شاهد التسعير"]} secondaryHref="/pricing" />
    </main>
  );
}
