"use client";

/**
 * FARM CONSOLE — Product case file / 007
 *
 * A livestock management PWA: herd tracking, health, breeding and finance.
 *
 * Evidence note — read before editing this file:
 *   · VERIFIED: the production deployment is code-gated. The public URL
 *     serves a login screen ("كود الدخول" — access code, with a documented
 *     privacy rule that no usernames or roles are shown before the code
 *     verifies, and a keyboard contract for numeric entry, Backspace, Esc
 *     and Enter). That screen is the only surface reachable without a code.
 *   · DECLARED: the module set (herd, health, breeding, finance) and the
 *     stack (PWA, Firebase, Realtime DB, Chart.js) come from the project
 *     record in projects.data.ts.
 *   · NOT CLAIMED: user counts, herd counts, revenue, time saved — there is
 *     no reviewed source for any of them, so this file states none.
 */
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";

const modules = [
  {
    no: "01",
    name: "Herd",
    nameAr: "القطيع",
    detail: "Every animal as a record: identity, age, weight and status, grouped by pen or purpose instead of a paper notebook.",
    detailAr: "كل رأس كسجل: الهوية والعمر والوزن والحالة، مجمّعة بالحظيرة أو الغرض بدل دفتر ورقي.",
  },
  {
    no: "02",
    name: "Health",
    nameAr: "الصحة",
    detail: "Vaccinations, treatments and vet visits attached to the animal — so a course of treatment is never half-remembered.",
    detailAr: "التحصينات والعلاجات وزيارات الطبيب مرتبطة بالرأس نفسه — فالعلاج مبيتقطعش في النص.",
  },
  {
    no: "03",
    name: "Breeding",
    nameAr: "التلقيح",
    detail: "Mating, pregnancy and calving timelines, with the next expected date surfaced rather than calculated by hand.",
    detailAr: "مواعيد التلقيح والحمل والولادة، والتاريخ المتوقع الجاي ظاهر مش محسوب يدويًا.",
  },
  {
    no: "04",
    name: "Finance",
    nameAr: "الحسابات",
    detail: "Costs and revenue per animal and per cycle, so a season can be read as a number and not a guess.",
    detailAr: "التكاليف والإيرادات لكل رأس، عشان الموسم يتقرأ برقم مش بتقدير.",
  },
] as const;

const decisions = [
  [
    "01",
    "The gate is part of the product",
    "This is operational data about someone's livelihood, not a brochure. The deployment opens on a code screen and states, in the interface itself, that no name or role is rendered before the code verifies. Privacy is a visible rule, not a policy page.",
    "البوابة جزء من المنتج",
    "دي بيانات تشغيل على مصدر رزق حد، مش بروشور. الموقع بيفتح على شاشة كود وبيقول في الواجهة نفسها إن مفيش اسم أو دور بيتعرض قبل التحقق من الكود. الخصوصية قاعدة ظاهرة مش صفحة سياسة.",
  ],
  [
    "02",
    "Built for a barn, not an office",
    "It ships as an installable PWA: one tap from the home screen, no app store, no update queue. The person holding the phone is standing in a shed, often with weak connectivity.",
    "مبني لحظيرة مش لمكتب",
    "بيتثبت كـPWA: ضغطة من الشاشة الرئيسية، من غير متجر تطبيقات ولا انتظار تحديث. اللي ماسك الموبايل واقف في عنبر، وغالبًا الاتصال ضعيف.",
  ],
  [
    "03",
    "The record is the unit",
    "Every module hangs off the animal record rather than off a screen. A vaccination, a weighing and a sale are events on the same animal, which is why the numbers can be trusted later.",
    "السجل هو الوحدة",
    "كل وحدة مربوطة بسجل الرأس مش بشاشة. التحصين والوزن والبيعة أحداث على نفس الرأس، وعشان كده الأرقام بتتساقد بعدين.",
  ],
  [
    "04",
    "Charts answer a question",
    "Chart.js is used for the trend that changes a decision — weight gain, cost per cycle, due dates — not for decorating the dashboard with sparklines.",
    "الرسوم بتجاوب على سؤال",
    "Chart.js مستخدم للاتجاه اللي بيغيّر قرار — زيادة الوزن، تكلفة الدورة، المواعيد الجاية — مش لتزيين اللوحة برسومات.",
  ],
  [
    "05",
    "Realtime where it matters",
    "Firebase Realtime DB keeps two devices on the same herd in sync without a manual refresh, which is the difference between one shared record and two conflicting ones.",
    "مزامنة فورية حيث تهم",
    "Firebase Realtime DB بيخلّي جهازين على نفس القطيع متزامنين بدون تحديث يدوي — وده الفرق بين سجل واحد مشترك وسجلين متعارضين.",
  ],
  [
    "06",
    "Arabic first, with the data",
    "The interface is Arabic — including the login screen, the error states and the keyboard hints — because the operator's vocabulary is Arabic, and a translated-after-the-fact console slows down daily entry.",
    "عربي أولًا، مع البيانات",
    "الواجهة عربية — بما فيها شاشة الدخول وحالات الخطأ وتلميحات الكيبورد — لأن قاموس المشغّل عربي، ولوحة مترجمة بعد التنفيذ بتبطّئ الإدخال اليومي.",
  ],
] as const;

const verified = [
  ["Code-gated", "No route is public before the access code verifies", "كل المسارات مقفولة قبل التحقق من الكود"],
  ["AR / RTL", "Arabic interface, including login and error states", "واجهة عربية، بما فيها الدخول وحالات الخطأ"],
  ["PWA", "Installable from the browser, no app store", "قابل للتثبيت من المتصفح، من غير متجر تطبيقات"],
  ["04", "Operational modules in the declared scope", "وحدات تشغيل في نطاق المشروع المعلن"],
] as const;

const stack = ["PWA", "Firebase", "Realtime DB", "Chart.js", "JavaScript", "Service Worker", "RTL / Arabic"];

export function FarmConsoleCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <main className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="container-wide relative flex min-h-[68svh] flex-col justify-between gap-7 py-5 md:py-7">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-emerald-500/[0.10] blur-[100px]" />
          <div className="absolute -left-20 top-56 h-72 w-72 rounded-full bg-cyan-500/[0.08] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">← {ar ? "كل الأعمال" : "All work"}</Link>
          <span>{ar ? "ملف منتج / 007" : "Product case file / 007"}</span>
        </div>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/[0.08] px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-emerald-300">{ar ? "نظام تشغيل مزرعة" : "Livestock operations"}</span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">PWA</span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "عربي أولًا" : "Arabic-first"}</span>
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/80">BEYAN EL-MAZRAA / FARM CONSOLE</p>
            <h1 className="max-w-5xl font-display text-[clamp(3.3rem,9vw,8.3rem)] leading-[0.86] tracking-[-0.06em] text-text-primary">
              Farm<span className="text-emerald-400">.</span>{" "}
              <span className="text-text-tertiary">Console</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar
                ? "نظام إدارة مزرعة مواشي: القطيع، الصحة، التلقيح والحسابات — في تطبيق واحد بيتثبت على الموبايل ويفتح بكود."
                : "A livestock operation in one place: herd, health, breeding and finance — installed on a phone and opened with a code."}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-4 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? "لقطة النظام" : "System snapshot"}</span>
              <span className="text-emerald-300">FARM / PWA</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl text-text-primary">04</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "وحدات تشغيل" : "Operational modules"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl text-text-primary">00</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "مسارات مفتوحة بدون كود" : "Routes open without a code"}</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "مسار البيانات" : "Data path"}</p>
                <p className="mt-2 text-sm leading-7 text-text-primary">PWA <span className="text-emerald-300">→</span> Realtime DB <span className="text-emerald-300">→</span> Charts <span className="text-emerald-300">→</span> Decision</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">
              {ar
                ? "أعداد بنيوية، مش مؤشرات أداء — والتطبيق مقفول بكود، فالملف بيوصف النظام مش بيقيس نتايجه."
                : "Structural counts, not performance metrics — and since the app is code-gated, this file describes the system rather than measuring its results."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? "الدور: منتج + تطوير" : "Role: Product & build"}</span>
            <span>{ar ? "المجال: زراعة وثروة حيوانية" : "Domain: Agri-tech"}</span>
            <span>2025–26</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://farm-project-puce.vercel.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">
              {ar ? "افتح التطبيق (بكود)" : "Open the app (code required)"} ↗
            </a>
          </div>
        </div>
      </section>

      {/* ═══ COVER ═══ */}
      <section className="container-wide pb-2">
        <figure className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1/40">
          <Image
            src="/images/case-studies/farm-console/cover.jpg"
            alt={ar ? "لوحة إدارة المزرعة — القطيع والصحة والحسابات" : "Farm Console dashboard — herd, health and finance"}
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle px-4 py-3 font-mono text-[12px] uppercase tracking-[0.1em] text-text-tertiary">
            <span>{ar ? "لوحة التشغيل — القطيع، المؤشرات، الحسابات" : "Operations dashboard — herd, indicators, finance"}</span>
            <span className="text-emerald-300">GATED / 2026</span>
          </figcaption>
        </figure>
      </section>

      {/* ═══ 01 · CHALLENGE ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-300">01 / {ar ? "التحدي" : "The challenge"}</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "المزرعة بتتدار بالذاكرة — والذاكرة مش دفتر." : "The farm runs on memory. Memory is not a ledger."}
            </h2>
          </div>
          <div className="max-w-3xl space-y-3 text-base leading-8 text-text-secondary">
            <p>
              {ar
                ? "في معظم المزارع، سجل الرأس موجود في دفتر، أو رسالة واتساب، أو دماغ صاحب المزرعة. التحصين بيتنسى، التلقيح بيتحسب بالتقريب، وتكلفة الدورة مبتتحسبش أصلًا — فالقرر بيتاخد بالإحساس."
                : "On most farms the animal's record lives in a notebook, a WhatsApp thread, or the owner's head. A vaccination is missed, a due date is estimated, and the cost of a cycle is never totalled — so the decision is made by feel."}
            </p>
            <p>
              {ar
                ? "الفرق بين «حاسس إن الموسم كسب» و«الموسم كسب كذا» هو سجل واحد بيتكتب مرة وبيرجع منه كل حاجة: الصحة والتلقيح والفلوس."
                : "The difference between “the season felt profitable” and “the season made this much” is one record, written once, that everything else can be read back from: health, breeding and money."}
            </p>
            <div className="rounded-xl border-s-2 border-emerald-400 bg-emerald-400/[0.04] p-4">
              <p className="text-sm leading-7 text-text-primary">
                {ar
                  ? "القرار الأساسي: السجل هو الوحدة، وكل شاشة هي عرض مختلف على نفس الرأس."
                  : "The core decision: the animal record is the unit, and every screen is a different view of the same animal."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 02 · MODULES ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-300">02 / {ar ? "الوحدات" : "Modules"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "أربع وحدات، على سجل واحد." : "Four modules, on one record."}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-text-tertiary">
            {ar
              ? "كل حدث — تحصين، وزن، تلقيح، بيعة — مربوط بالرأس، وعشان كده بيظهر في كل وحدة تخصه."
              : "Every event — a jab, a weighing, a mating, a sale — is attached to the animal, so it surfaces in every module that cares."}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {modules.map((mod) => (
            <article key={mod.no} className="rounded-xl border border-border-subtle bg-surface-1/40 p-4">
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{mod.no}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <h3 className="font-display text-2xl text-text-primary">{ar ? mod.nameAr : mod.name}</h3>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{ar ? mod.detailAr : mod.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <div className="rounded-xl border border-border-subtle p-4">
              <p className="font-mono text-[12px] uppercase text-text-tertiary">Animal record</p>
              <p className="mt-2 text-sm text-text-primary">{ar ? "المخزون الحي" : "The live stock"}</p>
            </div>
            <div className="text-center text-emerald-300">→</div>
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/[0.05] p-4">
              <p className="font-mono text-[12px] uppercase text-emerald-300">Events</p>
              <p className="mt-2 text-sm text-text-primary">{ar ? "صحة · تلقيح · وزن · بيع" : "Health · breeding · weight · sale"}</p>
            </div>
            <div className="text-center text-emerald-300">→</div>
            <div className="rounded-xl border border-border-subtle p-4">
              <p className="font-mono text-[12px] uppercase text-text-tertiary">Finance</p>
              <p className="mt-2 text-sm text-text-primary">{ar ? "التكلفة والعائد" : "Cost & return"}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-6 text-text-tertiary">
            {ar ? "الرسم مبني على الوحدات المعلنة للمشروع، وليس على تصفح داخلي للتطبيق." : "The diagram follows the project's declared modules; it is not a walkthrough of the gated app."}
          </p>
        </div>
      </section>

      {/* ═══ 03 · DECISIONS ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8">
          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-300">03 / {ar ? "قرارات المنتج" : "Product decisions"}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "الأداة بتتشغّل بإيد متعبة، في مكان مزدحم." : "The tool is used by tired hands, in a crowded place."}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {decisions.map(([n, title, body, titleAr, bodyAr]) => (
              <article key={n} className="group rounded-xl border border-border-subtle bg-background/55 p-4 transition-colors hover:border-emerald-400/40">
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-xs text-text-ghost">{n}</span>
                  <span className="text-emerald-300">↗</span>
                </div>
                <h3 className="font-display text-xl text-text-primary">{ar ? titleAr : title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{ar ? bodyAr : body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 · EVIDENCE ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 md:grid-cols-[0.55fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-300">04 / {ar ? "الأدلة وحدودها" : "Evidence, and its limits"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "إيه اللي اتشاف فعلًا؟" : "What could actually be seen?"}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {verified.map(([value, label, labelAr]) => (
                <div key={label} className="rounded-xl border border-border-subtle bg-background/50 p-4">
                  <p className="font-display text-3xl text-text-primary">{value}</p>
                  <p className="mt-2 text-sm text-text-secondary">{ar ? labelAr : label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs leading-6 text-text-tertiary">
              {ar
                ? "المتصفح العام بيوصل لشاشة كود الدخول بس. الشاشة دي موثقة بالكامل: رمز الدخول، ومنع عرض الأسماء والأدوار قبل التحقق، وتلميحات الكيبورد. اللي بعد الشاشة اتوصف من نطاق المشروع المعلن وحزمة التقنيات، مش من جولة داخلية."
                : "The public URL resolves to the access-code screen and nothing else. That screen is documented in full: the code field, the rule that no names or roles are shown before it verifies, and the keyboard contract. Everything past it is described from the declared project scope and stack, not from an inside walkthrough."}
            </p>
            <p className="text-xs leading-6 text-text-tertiary">
              {ar
                ? "عشان كده مفيش في الملف ده عدد رؤوس أو مستخدمين أو أرقام توفير وقت. لما تتوفر مستندات المالك، الأرقام تتضاف من مصدرها."
                : "That is why this file states no herd count, no user count and no time-saved figure. When owner documentation exists, the numbers can be added from their source."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 05 · STACK ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-300">05 / {ar ? "التقنيات" : "Technology stack"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">
              {ar ? "خفيف، مثبّت، وبيزامن." : "Light, installable, and in sync."}
            </h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="rounded-full border border-border-subtle bg-background/60 px-3 py-2 font-mono text-xs text-text-secondary">{item}</span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              {ar
                ? "الاختيارات دي كلها بتخدم نفس القيد: التطبيق لازم يشتغل على تليفون في مزرعة، مش على لابتوب في مكتب — وده اللي خلّى الـPWA والـRealtime DB خيارات طبيعية."
                : "Every one of these choices answers the same constraint: the app has to work on a phone in a barn, not a laptop in an office — which is what makes a PWA and a realtime database the natural picks."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ HAND-OFF ═══ */}
      <section className="border-t border-border-subtle bg-surface-1/35">
        <div className="container-wide flex flex-col gap-8 py-6 md:flex-row md:items-end md:justify-between md:py-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-300">HAND-OFF / 007</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "سجل واحد يحوّل الإحساس إلى رقم." : "One record that turns a hunch into a number."}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-text-secondary">
              {ar
                ? "الخطوة التالية: تقارير موسمية لكل قطيع، وتصدير للسجلات، وتوسيع صلاحيات الفريق — على نفس قاعدة البيانات."
                : "Next: per-herd seasonal reports, record export and wider team permissions — on the same database."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/work" className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary hover:border-emerald-400/60">
              {ar ? "كل الأعمال" : "All work"}
            </Link>
            <a href="https://farm-project-puce.vercel.app/" target="_blank" rel="noreferrer" className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5">
              {ar ? "افتح التطبيق" : "Open the app"} ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
