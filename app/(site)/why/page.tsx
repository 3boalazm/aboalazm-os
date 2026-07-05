"use client";
import Link from "next/link";
import { SystemConstellation } from "@/features/hero";
import { SingleSourceDiagram } from "@/features/why";
import { AnchorNav } from "@/features/navigation";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";

const REASONS = {
  en: [
    ["Strategy before design","Every visual decision carries a strategic reason: business goals, market position, audience behavior, brand perception, competitive landscape. Strong identities are built on clarity — not aesthetics alone."],
    ["Systems, not deliverables","Most projects end when files are delivered. Mine produce systems that let teams scale consistently, cut design debt, collaborate better, decide faster, and hold brand integrity. A brand should be usable, not just beautiful."],
    ["Bilingual identity architecture","Arabic and English is more than translation: typography systems, cultural context, reading patterns, visual hierarchy, cross-language consistency. Identities that work across both worlds without compromising either."],
    ["Across complex industries","Healthcare, pharmaceuticals, education, government initiatives, nonprofits, digital products — each with different constraints, audiences, and communication challenges. The role stays the same: translate complexity into clarity."],
    ["Design-systems thinking","Great brands behave like products. I apply product-grade discipline to identity: tokens, components, rules, documentation, governance — so the brand stays itself as it grows."],
    ["AI-augmented operations","AI integrated into research, strategy, content workflows, documentation, and design ops — so projects move faster while keeping quality and strategic depth. Not replacing creativity; amplifying it."],
  ],
  ar: [
    ["الاستراتيجية قبل التصميم","كل قرار بصري يحمل سببًا استراتيجيًا: أهداف الأعمال، الموضع التنافسي، سلوك الجمهور، الإدراك، المشهد المنافس. الهويات القوية مبنية على الوضوح لا الجماليات وحدها."],
    ["أنظمة لا مخرجات","معظم المشاريع تنتهي عند تسليم الملفات. ما أقدّمه هو أنظمة تُمكّن الفرق من التوسع باتساق وتقليل الديون التصميمية والتعاون الأفضل. البراند يجب أن يكون قابلًا للاستخدام لا جميلًا فحسب."],
    ["هندسة هوية ثنائية اللغة","العربية والإنجليزية أكثر من مجرد ترجمة: أنظمة الطباعة والسياق الثقافي وأنماط القراءة والتسلسل الهرمي البصري. هويات تعمل في العالمين دون التفريط بأيٍّ منهما."],
    ["عبر قطاعات معقدة","الرعاية الصحية، الصيدلة، التعليم، المبادرات الحكومية، المنظمات غير الربحية — كل واحدة بقيود وجماهير وتحديات مختلفة. الدور واحد دائمًا: تحويل التعقيد إلى وضوح."],
    ["تفكير أنظمة التصميم","العلامات العظيمة تتصرف كمنتجات. أطبّق انضباطًا من مستوى المنتج على الهوية: توكنز وكومبوننتس وقواعد وتوثيق وحوكمة."],
    ["عمليات معززة بالذكاء الاصطناعي","الذكاء الاصطناعي مدمج في البحث والاستراتيجية وسير المحتوى والتوثيق — لتتحرك المشاريع بسرعة مع الحفاظ على العمق الاستراتيجي. لا يحل محل الإبداع؛ يضخّمه."],
  ],
} as const;

const APPROACH = {
  en: [["Discover","Understand the business, audience, and opportunity."],["Define","Set strategic foundations and positioning."],["Architect","Design the structure connecting strategy to execution."],["Build","Develop the visual identity system and assets."],["Systemize","Document rules, components, and governance."],["Scale","Enable teams to run the system with confidence over time."]],
  ar: [["الاكتشاف","فهم الأعمال والجمهور والفرصة."],["التحديد","وضع الأسس الاستراتيجية والتموضع."],["الهندسة","تصميم البنية التي تربط الاستراتيجية بالتنفيذ."],["البناء","تطوير نظام الهوية البصرية والأصول."],["التنظيم","توثيق القواعد والكومبوننتس والحوكمة."],["التوسع","تمكين الفرق من تشغيل النظام بثقة على المدى البعيد."]],
} as const;

const NUMBERS = {
  en: [["BRANDS DESIGNED","20+"],["YEARS OF EXPERIENCE","7+"],["INDUSTRIES SERVED","6+"],["DESIGN ASSETS DELIVERED","500+"],["IDENTITY SYSTEMS BUILT","15+"],["WEBSITES & DIGITAL EXPERIENCES","10+"]],
  ar: [["براند مُصمَّم","20+"],["سنوات خبرة","7+"],["قطاعات تم خدمتها","6+"],["أصول تصميم مسلّمة","500+"],["نظام هوية مبني","15+"],["موقع وتجربة رقمية","10+"]],
} as const;

/* Jargon → plain-value translation — each technical term paired with
   what it actually buys the client, in business terms. */
const JARGON = {
  en: [
    ["Brand Tokens", "The colors, fonts, and spacing values defined once — used to keep every file, every developer, and every future designer in sync automatically."],
    ["Token-Driven Handoff", "Developers receive exact values instead of guessing from a picture — fewer back-and-forth messages, fewer mismatched colors in production."],
    ["Single Source of Truth", "One approved file feeds design, docs, and code. Nobody works from an outdated version by accident."],
    ["0% Design Drift", "What gets approved is what ships — no surprise differences between the mockup and the live product."],
  ],
  ar: [
    ["Brand Tokens", "قيم الألوان والخطوط والمسافات تُعرَّف مرة واحدة — تُبقي كل ملف وكل مطوّر وكل مصمم مستقبلي متزامنين تلقائيًا."],
    ["Token-Driven Handoff", "المطورون يستلمون قيمًا دقيقة بدل التخمين من صورة — رسائل أقل ذهابًا وإيابًا، وألوان أقل اختلافًا في الإنتاج."],
    ["Single Source of Truth", "ملف واحد معتمد يغذّي التصميم والتوثيق والكود. لا أحد يعمل من نسخة قديمة بالخطأ."],
    ["0% Design Drift", "ما يُعتمد هو ما يُنفَّذ — بلا فروقات مفاجئة بين الموك-أب والمنتج الفعلي."],
  ],
} as const;

const SECTIONS_EN = [
  { id: "reasons", label: "Reasons" },
  { id: "jargon", label: "In Plain Terms" },
  { id: "approach", label: "Approach" },
  { id: "numbers", label: "Numbers" },
  { id: "different", label: "Different" },
  { id: "os", label: "The OS" },
] as const;
const SECTIONS_AR = [
  { id: "reasons", label: "الأسباب" },
  { id: "jargon", label: "بلغة بسيطة" },
  { id: "approach", label: "المنهج" },
  { id: "numbers", label: "الأرقام" },
  { id: "different", label: "الفرق" },
  { id: "os", label: "النظام" },
] as const;

export default function WhyPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const t = useT();
  const reasons = ar ? REASONS.ar : REASONS.en;
  const approach = ar ? APPROACH.ar : APPROACH.en;
  const numbers = ar ? NUMBERS.ar : NUMBERS.en;
  const jargon = ar ? JARGON.ar : JARGON.en;
  const sections = ar ? SECTIONS_AR : SECTIONS_EN;

  return (
    <main className="flex flex-col">
      <AnchorNav sections={sections} />

      {/* ── Header + Reasons (chapter A) ── */}
      <div className="chapter-a">
        <div className="container-content flex flex-col gap-16 py-20">
          <header className="flex flex-col gap-4">
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary">
              {ar ? "لماذا مصطفى" : "WHY MUSTAFA"}
            </p>
            <h1 className="max-w-[20ch] font-display text-display tracking-[-0.025em] text-balance-pretty">
              {ar ? <>لا أصمّم براندات. <em>أبني أنظمة.</em></> : <>I don't design brands. <em>I build systems.</em></>}
            </h1>
            <p className="max-w-[56ch] text-lead text-text-secondary">
              {ar
                ? "معظم المصممين يسلّمون لوجوهات. أنا أساعد المؤسسات على بناء أنظمة هوية تتوسع عبر الفرق والمنتجات والحملات والتجارب الرقمية — شغل يجمع بين الاستراتيجية وهندسة الهوية والتفكير التشغيلي."
                : "Most designers deliver logos. I help organizations build identity systems that scale across teams, products, campaigns, and digital experiences — work at the intersection of strategy, identity architecture, and operational thinking."}
            </p>
          </header>

          <section id="reasons" aria-label={t.whyAriaReasons} className="flex flex-col">
            <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "لماذا يختارني العملاء" : "WHY CLIENTS HIRE ME"}
            </p>
            {reasons.map(([title, body], i) => (
              <div key={i} className="border-t border-border-subtle py-3 last:border-b">
                <p className="font-display text-title tracking-[-0.015em] text-text-primary">
                  <span className="mr-2 font-mono text-label text-accent">0{i + 1}</span>
                  {title}
                </p>
                <p className="mt-1 max-w-[64ch] text-body-sm text-text-secondary">{body}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* ── Jargon → Plain Terms (chapter B) ── */}
      <div className="chapter-b">
        <div className="container-content flex flex-col gap-4 py-20">
          <section id="jargon" className="flex flex-col gap-5">
            <div>
              <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                {ar ? "بلغة بسيطة" : "IN PLAIN TERMS"}
              </p>
              <p className="hook-line">
                {ar
                  ? "المصطلحات التقنية موجودة لسبب — وكل واحد منها بيشتري لك حاجة ملموسة."
                  : "The technical terms exist for a reason — each one buys you something concrete."}
              </p>
              <p className="hook-sub">
                {ar
                  ? "مش محتاج تفهم كل تفصيلة برمجية. محتاج بس تعرف إيه اللي بتدفع فيه."
                  : "You don't need to understand every engineering detail. You just need to know what you're paying for."}
              </p>
            </div>

            <div className="bento-grid">
              {jargon.map(([term, note], i) => (
                <div key={i} className={i === 0 ? "bento-cell bento-cell--wide bento-cell--accent" : "bento-cell"}>
                  <span className="jargon-term">{term}</span>
                  <span className="jargon-note">{note}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ── Approach (chapter A) ── */}
      <div className="chapter-a">
        <div className="container-content flex flex-col gap-16 py-20">
          <section id="approach" aria-label={t.whyAriaApproach}>
            <p className="pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "المنهجية" : "THE APPROACH"}
            </p>
            {approach.map(([phase, body], i) => (
              <div key={i} className="grid grid-cols-[6rem_1fr] items-baseline gap-2 border-b border-border-subtle py-2 md:grid-cols-[6rem_12rem_1fr]">
                <span className="font-mono text-label text-text-tertiary">{String(i + 1).padStart(2, "0")} /</span>
                <span className="text-body text-text-primary">{phase}</span>
                <span className="col-span-2 text-body-sm text-text-secondary md:col-span-1">{body}</span>
              </div>
            ))}
          </section>

          <section id="numbers" aria-label={t.whyAriaNumbers} className="flex flex-col gap-2">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "بالأرقام" : "BY THE NUMBERS"}
            </p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border-subtle py-5 md:grid-cols-3">
              {numbers.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dd className="font-display text-display leading-[1] tracking-[-0.025em] text-text-primary">{value}</dd>
                  <dt className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{label}</dt>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {/* ── Different + SSOT diagram (chapter B) ── */}
      <div className="chapter-b">
        <div className="container-content flex flex-col gap-16 py-20">
          <section id="different" aria-label={t.whyAriaWhat} className="flex flex-col gap-3 border-s-2 border-accent ps-5">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "ما يجعل الشغل مختلفًا" : "WHAT MAKES THE WORK DIFFERENT"}
            </p>
            <p className="max-w-[60ch] text-lead text-text-secondary">
              {ar
                ? "كثير من المصممين يركزون على البصريات. كثير من الاستراتيجيين يركزون على الأفكار. هذا الشغل يجمع الثلاثة — يربط استراتيجية الأعمال بالهوية البصرية والتنفيذ الرقمي في أنظمة أسهل إدارةً وأسرع توسعًا."
                : "Many designers focus on visuals. Many strategists focus on ideas. This work connects all three — bridging business strategy, brand identity, and digital execution into systems that are easier to manage, easier to scale, and more effective in the real world."}
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <p className="hook-line">
              {ar ? "مصدر واحد معتمد. كل حاجة تانية بتتبعه." : "One approved source. Everything else follows it."}
            </p>
            <p className="hook-sub">
              {ar
                ? "بدل ملفات تصميم وتوثيق وكود منفصلة تتباعد مع الوقت، القيم المعتمدة (التوكنز) تغذّي الثلاثة في آن واحد."
                : "Instead of separate design, documentation, and code files that drift apart over time, the approved values (tokens) feed all three at once."}
            </p>
            <div className="max-w-[520px]">
              <SingleSourceDiagram />
            </div>
          </section>
        </div>
      </div>

      {/* ── OS + CTA (chapter A) ── */}
      <div className="chapter-a">
        <div className="container-content flex flex-col gap-16 py-20">
          <section id="os" aria-label={t.whyAriaOs} className="flex flex-col items-center gap-4">
            <p className="max-w-[56ch] text-center text-lead text-text-secondary">
              {ar
                ? "Aboalazm OS هو تتويج لسنوات من العمل في البراندينج وتفكير الأنظمة والعمليات التصميمية وسير العمل بالذكاء الاصطناعي — ليس منهجية، بل نظام تشغيل لبناء البراندات الحديثة وإدارتها وتطويرها."
                : "Aboalazm OS is the culmination of years of work in branding, systems thinking, design operations, and AI-assisted workflows — not a methodology, an operating system for building, managing, and evolving modern brands."}
            </p>
            <SystemConstellation />
          </section>

          <section className="flex flex-col items-start gap-3 border-t border-border-subtle pt-8">
            <h2 className="max-w-[20ch] font-display text-title tracking-[-0.02em]">
              {ar ? "ابنِ براندًا يتصرف كنظام." : "Build a brand that behaves like a system."}
            </h2>
            <Link href="/contact" className="group font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary">
              {ar ? "ابدأ مشروعًا" : "START A PROJECT"}
              <span aria-hidden className="ms-1 inline-block transition-transform duration-base ease-physics group-hover:translate-x-1">→</span>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
