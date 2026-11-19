"use client";
import Link from "@/components/ui/localized-link";
import { Icon } from "@/components/ui/Icon";
import { SystemConstellation } from "@/features/hero";
import { SingleSourceDiagram } from "@/features/why";
import { AnchorNav } from "@/features/navigation";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";
import { Heading } from "@/components/ui/Heading";

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
    ["الاستراتيجية قبل التصميم","لكل قرار بصري سبب استراتيجي: أهداف العمل، والمكانة في السوق، وسلوك الجمهور، وصورة العلامة في الأذهان، وطبيعة المنافسين. الهويات القوية تقوم على الوضوح لا على الجماليات وحدها."],
    ["أنظمة لا ملفات","تنتهي معظم المشاريع بتسليم الملفات. أما ما أقدّمه فأنظمة تمكّن الفرق من التوسع باتساق، وتقلّل الدين التصميمي، وتحسّن التعاون. يجب أن تكون العلامة قابلة للاستخدام لا جميلة فحسب."],
    ["هندسة هوية ثنائية اللغة","العربية والإنجليزية أكثر من ترجمة: أنظمة الخط، والسياق الثقافي، وأنماط القراءة، والتسلسل البصري، والاتساق بين اللغتين. هويات تعمل في العالمين دون أن تتنازل عن أيٍّ منهما."],
    ["في قطاعات معقدة","الرعاية الصحية، والصناعات الدوائية، والتعليم، والمبادرات الحكومية، والمنظمات غير الربحية، والمنتجات الرقمية: لكل قطاع قيوده وجمهوره وتحدياته. أما الدور فواحد: تحويل التعقيد إلى وضوح."],
    ["تفكير أنظمة التصميم","العلامات الكبرى تتصرف كالمنتجات. أطبّق على الهوية انضباط المنتجات: متغيّرات التصميم والمكوّنات والقواعد والتوثيق والحوكمة، لتبقى العلامة على حالها وهي تنمو."],
    ["عمليات معزّزة بالذكاء الاصطناعي","الذكاء الاصطناعي حاضر في البحث والاستراتيجية وسير عمل المحتوى والتوثيق وعمليات التصميم، لتتحرك المشاريع أسرع دون أن تفقد جودتها أو عمقها الاستراتيجي. لا يحلّ محلّ الإبداع، بل يضاعف أثره."],
  ],
} as const;

const APPROACH = {
  en: [["Discover","Understand the business, audience, and opportunity."],["Define","Set strategic foundations and positioning."],["Architect","Design the structure connecting strategy to execution."],["Build","Develop the visual identity system and assets."],["Systemize","Document rules, components, and governance."],["Scale","Enable teams to run the system with confidence over time."]],
  ar: [["الاكتشاف","فهم العمل والجمهور والفرصة."],["التحديد","وضع الأسس الاستراتيجية والتموضع."],["الهندسة","تصميم البنية التي تربط الاستراتيجية بالتنفيذ."],["البناء","تطوير نظام الهوية البصرية وأصوله."],["التنظيم","توثيق القواعد والمكوّنات والحوكمة."],["التوسع","تمكين الفرق من تشغيل النظام بثقة على المدى البعيد."]],
} as const;

const NUMBERS = {
  en: [["CLIENTS & ORGANIZATIONS","20+"],["YEARS OF DESIGN PRACTICE","9+"],["INDUSTRIES SERVED","6+"],["DESIGN ASSETS DELIVERED","500+"],["YEARS FOCUSED ON IDENTITY","4+"],["WEBSITES & DIGITAL EXPERIENCES","10+"]],
  ar: [["عملاء وفرق","20+"],["سنوات من ممارسة التصميم","9+"],["قطاعات عملت فيها","6+"],["أصول تصميمية مُسلَّمة","500+"],["سنوات من التركيز على الهوية","4+"],["مواقع وتجارب رقمية","10+"]],
} as const;

/* Jargon → plain-value translation — each technical term paired with
   what it actually buys the client, in business terms. */
const JARGON = {
  en: [
    ["Brand Tokens", "The colors, fonts, and spacing values defined once — used to keep every file, every developer, and every future designer in sync automatically."],
    ["Token-Driven Handoff", "Developers receive exact values instead of guessing from a picture — fewer back-and-forth messages, fewer mismatched colors in production."],
    ["Single Source of Truth", "One approved file feeds design, docs, and code. Nobody works from an outdated version by accident."],
    ["Zero Drift Standard", "Design governance principle: what gets approved in the brand book is what ships across production touchpoints, preventing rogue divergence."],
  ],
  ar: [
    ["Brand Tokens", "قيم الألوان والخطوط والمسافات تُعرَّف مرة واحدة، فتبقى كل الملفات وكل مطوّر وكل مصمم لاحق على اتساق تلقائي."],
    ["Token-Driven Handoff", "يتسلّم المطوّرون قيمًا دقيقة بدل التخمين من صورة: مراسلات أقل ذهابًا وإيابًا، وألوان أقل اختلافًا عند الإنتاج."],
    ["Single Source of Truth", "ملف واحد معتمد يغذّي التصميم والتوثيق والكود، فلا يعمل أحد على نسخة قديمة بالخطأ."],
    ["معيار عدم الانحراف", "مبدأ حوكمة التصميم: ما يُعتمد في دليل العلامة هو ما يُنفَّذ بالضبط في جميع نقاط الاتصال الحيّة دون تفاوت."],
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

export function WhyView() {
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
        <div className="container-content flex flex-col gap-8 py-7">
          <header className="flex flex-col gap-4">
            <Heading
              eyebrow={ar ? "لماذا مصطفى" : "WHY MUSTAFA"}
              title={
                ar
                  ? <>لا أصمّم علامات تجارية. <em>أبني أنظمة.</em></>
                  : <>I don't design brands. <em>I build systems.</em></>
              }
              titleClassName="max-w-[20ch] text-balance-pretty"
              subtitle={
                ar
                  ? "يسلّم معظم المصممين شعارات. أما أنا فأساعد المؤسسات على بناء أنظمة هوية تتسع عبر الفرق والمنتجات والحملات والتجارب الرقمية، في عمل يجمع بين الاستراتيجية وهندسة الهوية والتفكير التشغيلي."
                  : "Most designers deliver logos. I help organizations build identity systems that scale across teams, products, campaigns, and digital experiences — work at the intersection of strategy, identity architecture, and operational thinking."
              }
              subtitleClassName="max-w-[56ch]"
            />
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
        <div className="container-content flex flex-col gap-4 py-7">
          <section id="jargon" className="flex flex-col gap-5">
            <div>
              <p className="pb-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
                {ar ? "بلغة بسيطة" : "IN PLAIN TERMS"}
              </p>
              <p className="hook-line">
                {ar
                  ? "المصطلحات التقنية موجودة لسبب، وكل مصطلح منها يمنحك شيئًا ملموسًا."
                  : "The technical terms exist for a reason — each one buys you something concrete."}
              </p>
              <p className="hook-sub">
                {ar
                  ? "لا يلزمك أن تفهم كل تفصيلة هندسية، يكفي أن تعرف ما الذي تدفع مقابله."
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
        <div className="container-content flex flex-col gap-8 py-7">
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
        <div className="container-content flex flex-col gap-8 py-7">
          <section id="different" aria-label={t.whyAriaWhat} className="flex flex-col gap-3 border-s-2 border-accent ps-5">
            <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "ما يميّز هذا العمل" : "WHAT MAKES THE WORK DIFFERENT"}
            </p>
            <p className="max-w-[60ch] text-lead text-text-secondary">
              {ar
                ? "كثير من المصممين يركّزون على البصريات، وكثير من الاستراتيجيين يركّزون على الأفكار. أما هذا العمل فيربط بين الثلاثة: استراتيجية العمل، والهوية البصرية، والتنفيذ الرقمي، في أنظمة أسهل إدارةً وأسرع توسعًا."
                : "Many designers focus on visuals. Many strategists focus on ideas. This work connects all three — bridging business strategy, brand identity, and digital execution into systems that are easier to manage, easier to scale, and more effective in the real world."}
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <p className="hook-line">
              {ar ? "مصدر واحد معتمد. وكل ما عداه يتبعه." : "One approved source. Everything else follows it."}
            </p>
            <p className="hook-sub">
              {ar
                ? "بدل ملفات تصميم وتوثيق وكود منفصلة تتباعد مع الوقت، تغذّي القيم المعتمدة (متغيّرات التصميم) الثلاثة في آنٍ واحد."
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
        <div className="container-content flex flex-col gap-8 py-7">
          <section id="os" aria-label={t.whyAriaOs} className="flex flex-col items-center gap-4">
            <p className="max-w-[56ch] text-center text-lead text-text-secondary">
              {ar
                ? "Aboalazm OS هو حصيلة سنوات من العمل في بناء العلامات، والتفكير بالأنظمة، وعمليات التصميم، وسير العمل بالذكاء الاصطناعي. ليس منهجية، بل نظام تشغيل لبناء العلامات التجارية الحديثة وإدارتها وتطويرها."
                : "Aboalazm OS is the culmination of years of work in branding, systems thinking, design operations, and AI-assisted workflows — not a methodology, an operating system for building, managing, and evolving modern brands."}
            </p>
            <SystemConstellation />
          </section>

          <section className="flex flex-col items-start gap-3 border-t border-border-subtle pt-8">
            <h2 className="max-w-[20ch] font-display text-title tracking-[-0.02em]">
              {ar ? "ابنِ علامة تتصرف كنظام." : "Build a brand that behaves like a system."}
            </h2>
            <Link href="/contact" className="group font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary">
              {ar ? "ابدأ مشروعًا" : "START A PROJECT"}
              <span aria-hidden className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
