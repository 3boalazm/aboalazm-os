"use client";

/**
 * UMMAH ACADEMY — Product case file / 005
 * A live 1-on-1 Qur'an, Tajweed, Arabic and Islamic studies academy.
 * Claims in this file are grounded in the project's own README and the
 * published site: 5 locales × 23 routes (195 pages per build), the
 * "Sakinah Glass" hand-written CSS system, ~2 KB of JS per page, the
 * installable PWA, and the four-stage teacher vetting. The ledger keeps
 * the project `in-progress` — the marketing site is live while the
 * operations portal and the WordPress cut-over continue.
 */
import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Link from "@/components/ui/localized-link";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/providers/lang-provider";

const programmes = [
  {
    name: "Quran & Tajweed",
    nameAr: "القرآن والتجويد",
    meta: "Recitation · Tajweed · Hifz · Ijazah",
    metaAr: "التلاوة · التجويد · الحفظ · الإجازة",
    body: "Recite as it was revealed — Tajweed correction, memorisation through the Itqan method, and a documented path towards Ijazah.",
    bodyAr: "التلاوة كما أُنزلت — تصحيح التجويد، والحفظ بطريقة الإتقان، ومسار موثق نحو الإجازة.",
  },
  {
    name: "Arabic Language",
    nameAr: "اللغة العربية",
    meta: "Noor Al-Bayan · Grammar · Conversation",
    metaAr: "نور البيان · القواعد · المحادثة",
    body: "From reading the Mushaf correctly to understanding it — reading foundations, classical grammar and spoken fluency.",
    bodyAr: "من قراءة المصحف قراءة صحيحة إلى فهمه: أساسيات القراءة، وقواعد النحو، والطلاقة في الحديث.",
  },
  {
    name: "Ummah Cubs",
    nameAr: "أكاديمية الجِراء",
    meta: "Ages 5–14 · 30-minute sessions",
    metaAr: "من 5 إلى 14 سنة · حصص 30 دقيقة",
    body: "Qur'an, Arabic and Islamic values through games and stories — short lessons children actually look forward to.",
    bodyAr: "القرآن والعربية والقيم الإسلامية عبر القصص والألعاب — دروس قصيرة ينتظرها الأطفال فعلًا.",
  },
  {
    name: "Islamic Studies",
    nameAr: "العلوم الإسلامية",
    meta: "Aqeedah · Fiqh · Tafseer · Seerah",
    metaAr: "العقيدة · الفقه · التفسير · السيرة",
    body: "A real curriculum for understanding the deen — taught by scholars who answer the questions learners actually have.",
    bodyAr: "منهج حقيقي لفهم الدين — يدرّسه علماء يجيبون على أسئلة المتعلمين الحقيقية.",
  },
] as const;

const journey = [
  {
    step: "01",
    title: "Tell us about you",
    titleAr: "أخبرنا عنك",
    desc: "Choose the learner, the programme and the lesson times that fit your day — female teachers available for women and girls.",
    descAr: "اختر المتعلم والبرنامج وأوقات الدروس المناسبة — مع إتاحة معلمات للنساء والبنات.",
  },
  {
    step: "02",
    title: "We match your teacher",
    titleAr: "نختار معلمك",
    desc: "The team confirms a matched Al-Azhar teacher and available slots over WhatsApp — replies within minutes, not days.",
    descAr: "يؤكد الفريق معلمًا أزهريًا مناسبًا ومواعيد متاحة عبر واتساب — ردود في دقائق لا أيام.",
  },
  {
    step: "03",
    title: "Two free live lessons",
    titleAr: "حصتان مجانيتان مباشرة",
    desc: "Real 1-on-1 sessions on Zoom or Meet. The teacher assesses the level and builds a plan around the goal — no card needed.",
    descAr: "حصتان حقيقيتان فردية على Zoom أو Meet. يقيّم المعلم المستوى ويبني خطة حول الهدف — بلا بطاقة أو التزام.",
  },
  {
    step: "04",
    title: "Learn and see progress",
    titleAr: "تعلّم وتابع التقدّم",
    desc: "A report after every session, a certificate for every level, and WhatsApp reminders 15 minutes before each lesson.",
    descAr: "تقرير بعد كل حصة، وشهادة لكل مستوى، وتذكير عبر واتساب قبل كل درس بـ 15 دقيقة.",
  },
] as const;

const locales = [
  { code: "EN", where: "/", note: "Root · reference locale", noteAr: "الجذر · اللغة المرجعية" },
  { code: "AR", where: "/ar/", note: "Full RTL layout", noteAr: "تخطيط كامل من اليمين لليسار" },
  { code: "DE", where: "/de/", note: "Localised article slugs", noteAr: "مسارات مقالات مترجمة" },
  { code: "FR", where: "/fr/", note: "Localised article slugs", noteAr: "مسارات مقالات مترجمة" },
  { code: "IT", where: "/it/", note: "Localised article slugs", noteAr: "مسارات مقالات مترجمة" },
] as const;

const vetting = [
  ["01", "Credentials", "Credentials", "المؤهلات", "Every teacher's documented qualifications are reviewed before anything else.", "مراجعة مؤهلات كل معلم موثقة قبل أي خطوة أخرى."],
  ["02", "Sanad verification", "Sanad verification", "إسناد موثّق", "The chain of transmission is checked — an Ijazah is a documented link back to the Prophet ﷺ.", "يُفحص سند الإجازة — فهو حلقة موثقة تصل إلى النبي ﷺ."],
  ["03", "Live teaching demo", "Live teaching demo", "عرض تدريبي مباشر", "A real teaching session is observed — subject mastery is not enough without teaching craft.", "يُلاحظ درس حقيقي — إتقان المادة لا يكفي بدون فن التعليم."],
  ["04", "Ongoing review", "Ongoing review", "مراجعة مستمرة", "Quality does not stop at hiring: sessions and reports stay under review.", "الجودة لا تنتهي عند التوظيف: الحصص والتقارير تبقى قيد المراجعة."],
] as const;

const stack = [
  "Astro (static output)",
  "Hand-written CSS — “Sakinah Glass”",
  "Vanilla TypeScript islands",
  "Service Worker · Web Manifest",
  "Intl API — prices · dates · names",
  "Self-hosted fonts · Inlined icons",
  "hreflang · JSON-LD · Sitemap",
  "Node ≥ 20.19",
] as const;

const qaSuites = [
  ["i18n", "Locale shape parity at build; post-build checks for lang/dir, canonical, reciprocal hreflang and English leaks.", "تطابق بنية اللغات عند البناء؛ وفحص لاحق للغة والاتجاه والروابط المتبادلة وتسرب النصوص الإنجليزية."],
  ["links", "Internal link and fragment checker across all 195 pages.", "فاحص روابط ومقاطع داخلية عبر كل الصفحات الـ195."],
  ["a11y", "axe, keyboard and screen-reader passes on the flows that matter.", "فحوصات axe ولوحة المفاتيح وقارئ الشاشة على المسارات المهمة."],
  ["pwa", "Installability, offline behaviour and the install prompt on Android and iOS.", "قابلية التثبيت والعمل دون اتصال وبطاقة التثبيت على أندرويد وiOS."],
  ["theme", "Light and dark QA — the theme is applied before first paint, so no flash.", "فحص الفاتح والداكن — السمة تُطبَّق قبل أول رسم، فلا وميض."],
  ["flows", "Booking, placement test, header, popovers, overflow and touch checks.", "فحص الحجز واختبار التحديد والترويسة والنوافذ واللمس."],
] as const;

export function UmmahAcademyCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="overflow-hidden">
      {/* ═══ HERO — gold glass, academy teal inside ═══ */}
      <section className="container-wide relative flex min-h-[70svh] flex-col justify-between gap-7 py-5 md:py-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-amber-400/[0.10] blur-[100px]" />
          <div className="absolute -left-20 top-56 h-72 w-72 rounded-full bg-teal-500/[0.08] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">
            ← {ar ? "كل الأعمال" : "All work"}
          </Link>
          <span>{ar ? "ملف منتج / 005" : "Product case file / 005"}</span>
        </div>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-amber-300/30 bg-amber-300/[0.08] px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-amber-200">
                {ar ? "منصة تعليم مباشر" : "Live learning platform"}
              </span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
                {ar ? "5 لغات · RTL · تطبيق ويب قابل للتثبيت" : "5 languages · RTL · Installable PWA"}
              </span>
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-200/80">UMMAH ACADEMY / QURAN &amp; ARABIC</p>
            <h1 className="max-w-5xl font-display text-[clamp(3.6rem,10vw,8.5rem)] leading-[0.84] tracking-[-0.07em] text-text-primary">
              Ummah Academy<span className="text-amber-300">.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar
                ? "ليس مجرد موقع دورات. بل أكاديمية تعليم مباشر فردي مع معلمين أزهريين، وأربعة برامج، وموقع مهندس يبني الثقة بخمس لغات، من أول زيارة حتى حجز الحصة المجانية."
                : "Not a course marketplace. A live 1-on-1 academy with Al-Azhar teachers, four programmes, and a website engineered to earn trust in five languages — from the first visit to the free trial booking."}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-4 backdrop-blur-xl md:p-4">
            <div className="mb-5 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? "لوحة القدرات" : "Capability panel"}</span>
              <span className="text-amber-300">UA / EDU</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl text-text-primary">195</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "صفحة لكل لغة عند البناء" : "pages per build · 23 routes × 5"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl text-text-primary">~2 KB</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "جافاسكريبت لكل صفحة" : "JS per page (gzipped)"}</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "رحلة التحويل" : "Conversion path"}</p>
                <p className="mt-2 text-sm text-text-primary">
                  {ar ? (
                    <>تصفح <span className="text-amber-300">←</span> اختبار التحديد <span className="text-amber-300">←</span> حصّتان مجانيتان <span className="text-amber-300">←</span> خطة شهرية</>
                  ) : (
                    <>Browse <Icon name="arrow-right" className="text-amber-300" /> Placement test <Icon name="arrow-right" className="text-amber-300" /> 2 free lessons <Icon name="arrow-right" className="text-amber-300" /> Monthly plan</>
                  )}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">
              {ar
                ? "الأرقام من README المشروع والنسخة المنشورة؛ المشروع قيد التطوير — البوابة التشغيلية ونقل النطاق ما زالا جاريين."
                : "Numbers from the project README and the published site; the project is in progress — the operations portal and domain cut-over continue."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? "الدور: هندسة المنتج والويب" : "Role: Product & web engineering"}</span>
            <span>{ar ? "المجال: تعليم مباشر" : "Domain: Live education"}</span>
            <span>{ar ? "2026 ←" : "2026 →"}</span>
            <span className="text-amber-200/90">{ar ? "قيد التطوير" : "In progress"}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/3boalazm/Ummah-academy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm text-text-primary transition-colors hover:border-amber-300/60 hover:bg-amber-300/[0.06]"
            >
              GitHub ↗
            </a>
            <a
              href="https://ummah-academy.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
            >
              {ar ? "افتح الموقع" : "Open the site"} ↗
            </a>
          </div>
        </div>
      </section>
      <div className="container-content"><ProjectEnquiry compact service="digital-product" /></div>

      {/* 01 — THE PROBLEM */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">01 / {ar ? "المشكلة" : "The problem"}</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "الثقة لا تُشرح. تُبنى بالوضوح." : "Trust can’t be explained. It has to be built."}
            </h2>
          </div>
          <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
            <p>
              {ar
                ? "الأكاديمية كانت تعمل على WordPress/Elementor: تغيير لغة يعني هشاشة، وكل صفحة ثقيلة، وقصة المنتج الحقيقية — الإجازة والتحقق من السند وسلامة الأسرة — تضيع بين القوالب."
                : "The academy ran on WordPress/Elementor: every language change was fragile, pages shipped heavy, and the product’s real story — Ijazah, Sanad verification, family safety — got lost inside templates."}
            </p>
            <p>
              {ar
                ? "الأسرة التي تختار معلمًا لطفلها تتعامل مع الموقع كأول درس. لذلك أُعيد بناؤه من الصفر كموقع أصلي: ثابت وسريع، بخمس لغات، يشرح نفسه بالعربية والإنجليزية والألمانية والفرنسية والإيطالية — ويحترم من يقرأه."
                : "A family choosing a teacher for their child treats the site as the first lesson. So it was rebuilt from zero as a native website: static and fast, in five languages, explaining itself in Arabic, English, German, French and Italian — respecting whoever is reading."}
            </p>
            <div className="rounded-xl border-s-2 border-amber-300 bg-amber-300/[0.04] p-4">
              <p className="text-sm leading-[1.65] text-text-primary">
                {ar
                  ? "الفكرة الأساسية: كل قرار في الموقع — لغة، سرعة، شفافية السعر، شرح طريقة الاختيار — هو جزء من المنتج التعليمي نفسه."
                  : "Core principle: every decision in the site — language, speed, pricing clarity, how vetting works — is part of the learning product itself."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — THE MODEL */}
      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">02 / {ar ? "المنتج" : "The product"}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "أربعة برامج. مسار واحد واضح." : "Four programmes. One clear path."}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-[1.65] text-text-tertiary">
              {ar
                ? "المتعلم — طفل أو بالغ — يبدأ من هدفه، لا من قائمة محتوى. وكل مسار ينتهي بحصتين مجانيتين قبل أي التزام."
                : "The learner — child or adult — starts from a goal, not a content catalogue. And every path ends in two free lessons before any commitment."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {programmes.map((p, i) => (
              <article key={p.name} className="rounded-xl border border-border-subtle bg-surface-1/40 p-4 transition-colors hover:border-amber-300/40">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs text-text-ghost">0{i + 1}</span>
                  <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                </div>
                <h3 className="font-display text-2xl text-text-primary">{ar ? p.nameAr : p.name}</h3>
                <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.12em] text-amber-200/80">{ar ? p.metaAr : p.meta}</p>
                <p className="mt-4 text-sm leading-[1.65] text-text-secondary">{ar ? p.bodyAr : p.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((j) => (
            <div key={j.step} className="rounded-xl border border-border-subtle bg-background/55 p-4">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{j.step}</span>
                <Icon name="arrow-right" className="text-amber-300" />
              </div>
              <h3 className="text-sm font-medium text-text-primary">{ar ? j.titleAr : j.title}</h3>
              <p className="mt-2 text-xs leading-[1.65] text-text-tertiary">{ar ? j.descAr : j.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — MULTILINGUAL ARCHITECTURE */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">03 / {ar ? "العمارة اللغوية" : "Multilingual architecture"}</p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
                {ar ? "الترجمة بنية، لا إضافة." : "Translation as architecture, not a plugin."}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-[1.65] text-text-tertiary">
              {ar
                ? "كل مسار موجود بكل لغة، وكل لغة لها مسارات مقالاتها المحلية. قائمة اللغة لا تُسقطك على صفحة 404 أبدًا — تفتح الترجمة الحقيقية أو أقرب قسم منها."
                : "Every route exists in every language, and each language owns its localised article slugs. The language menu can never 404 — it opens the true translation, or the closest section to it."}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {locales.map((l) => (
              <div key={l.code} className="rounded-xl border border-border-subtle bg-background/55 p-4">
                <p className="font-display text-3xl text-text-primary">{l.code}</p>
                <p className="mt-2 font-mono text-xs text-amber-200/80">{l.where}</p>
                <p className="mt-4 text-xs leading-[1.65] text-text-tertiary">{ar ? l.noteAr : l.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {(ar
                ? ["الزائر", "تلميح لغة", "قائمة زجاجية", "الترجمة الحقيقية", "نسخة كاملة"]
                : ["Visitor", "Language hint", "Glass menu", "True translation", "Full page"]
              ).map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span
                    className={`rounded-lg border px-3 py-2 ${
                      i === 0 || i === 4
                        ? "border-amber-300/40 bg-amber-300/[0.07] text-text-primary"
                        : "border-border-subtle text-text-secondary"
                    }`}
                  >
                    {step}
                  </span>
                  {i < 4 && <Icon name="arrow-right" className="text-amber-300" />}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-[1.65] text-text-tertiary">
              {ar
                ? "الموقع لا يحوّل الزائر بلغة المتصفح أبدًا — يلمّح فقط. والبناء الإنتاجي يفشل على لغة ناقصة، وفاحص لاحق يرصد أي نص إنجليزي تسرب للنسخ المترجمة، مع روابط hreflang متبادلة و sitemap لكل اللغات."
                : "The site never redirects by browser language — it only hints. Production builds fail on a half-translated locale, a post-build checker flags any English leak on the translated pages, and reciprocal hreflang plus a five-locale sitemap keep search honest."}
            </p>
          </div>
        </div>
      </section>

      {/* 04 — DESIGN SYSTEM */}
      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[0.6fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">04 / {ar ? "نظام التصميم" : "The design system"}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "سَكينة زجاجية. سمتان ولا وميض." : "Sakinah Glass. Two themes, zero flash."}
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-[1.65] text-text-secondary">
            <p>
              {ar
                ? "نظام CSS مكتوب باليد — طبقة زجاجية واحدة تحكم كل المكوّنات، بخطوط مستضافة ذاتيًا وأيقونات مدمجة وقت البناء. الوضع الفاتح والداكن من نظام واحد، والخيار يُحفظ لكل متصفح، وعند غيابه يحترم تفضيل النظام."
                : "A hand-written CSS system — one glass layer governing every component, with self-hosted fonts and icons inlined at build time. Light and dark come from the same tokens; the choice is remembered per browser, and without one the OS preference decides."}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-300">{ar ? "قبل أول رسم" : "Before first paint"}</p>
                <p className="mt-2 text-2xl font-display text-text-primary">0 ms</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "السمة تُطبَّق قبل ظهور أي محتوى — فلا وميض أبيض" : "Theme applied before any content renders — no white flash"}</p>
              </div>
              <div className="rounded-xl border border-amber-300/30 bg-amber-300/[0.04] p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-300">{ar ? "جافاسكريبت الموقع" : "Site JavaScript"}</p>
                <p className="mt-2 text-2xl font-display text-text-primary">~2 KB</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "لكل صفحة مضغوطة — جزر TypeScript بلا إطار عمل وقت التشغيل" : "Per page, gzipped — vanilla TS islands, no runtime framework"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — PWA */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">05 / {ar ? "تطبيق بلا متجر" : "An app without a store"}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "يُثبَّت على الهاتف. ويظل يعمل دون اتصال." : "Installs on the phone. Still opens offline."}
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-[1.65] text-text-secondary">
            <p>
              {ar
                ? "Manifest وأيقونات مقنّعة و Service Worker يحوّلان الموقع إلى تطبيق ويب قابل للتثبيت على أندرويد وiOS. زر صغير يفتح بطاقة التثبيت: الطلب الأصلي على أندرويد، وخطوات «مشاركة ← إضافة إلى الشاشة الرئيسية» على iPhone — بالعربية والإنجليزية."
                : "A manifest, maskable icons and a service worker make the site installable on Android and iOS. A small pill opens the install card: the native prompt on Android, the Share → Add to Home Screen steps on iPhone — in the visitor’s own language."}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [ar ? "التثبيت" : "Install", ar ? "بلا متجر تطبيقات وبلا حساب" : "No app store, no account"],
                [ar ? "دون اتصال" : "Offline", ar ? "آخر الصفحات المزارة تُفتح مجددًا" : "Last pages visited still open"],
                [ar ? "تذكيرات" : "Reminders", ar ? "واتساب قبل الحصة بـ 15 دقيقة" : "WhatsApp 15 minutes before class"],
              ].map(([t, b]) => (
                <div key={t} className="rounded-xl border border-border-subtle p-4">
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-300">{t}</p>
                  <p className="mt-2 text-xs leading-[1.65] text-text-tertiary">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 — TRUST ENGINEERING */}
      <section className="container-wide py-6 md:py-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">06 / {ar ? "هندسة الثقة" : "Trust engineering"}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "سلسلة الإسناد، موثقة خطوة بخطوة." : "The chain of transmission, documented stage by stage."}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-[1.65] text-text-tertiary">
            {ar
              ? "كل معلم يحمل إجازة — سلسلة موثقة من التدريس تصل إلى النبي ﷺ — ويجتاز أربع مراحل قبل أول حصة وبعدها."
              : "Every teacher holds an Ijazah — a documented chain of transmission back to the Prophet ﷺ — and passes four stages, before the first class and after it."}
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {vetting.map(([n, title, titleAlt, titleAr, body, bodyAr]) => (
            <article key={n} className="group rounded-xl border border-border-subtle bg-background/55 p-4 transition-colors hover:border-amber-300/40 md:p-4">
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{n}</span>
                <span className="text-amber-300 transition-transform group-hover:translate-x-1">↗</span>
              </div>
              <h3 className="font-display text-xl text-text-primary">{ar ? titleAr : title}</h3>
              <p className="mt-3 text-sm leading-[1.65] text-text-secondary">{ar ? bodyAr : body}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {(ar ? ["أنت", "معلمك", "معلمه", "…", "النبي ﷺ"] : ["You", "Your teacher", "Their teacher", "…", "The Prophet ﷺ"]).map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className={`rounded-lg border px-3 py-2 ${
                    i === 0 || i === 4 ? "border-amber-300/40 bg-amber-300/[0.07] text-text-primary" : "border-border-subtle text-text-secondary"
                  }`}
                >
                  {step}
                </span>
                {i < 4 && <Icon name="arrow-right" className="text-amber-300" />}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-[1.65] text-text-tertiary">
            {ar
              ? "سلسلة الإسناد معروضة للمتعلم بوضوح — لأنه جزء من قيمة الدرس نفسه. ومعها: طريقة الإتقان للحفظ، وتقرير بعد كل حصة، ومعلمات للنساء والبنات، وخطط شهرية شفافة من 40 إلى 128 دولارًا مع حصتين مجانيتين أولًا."
              : "The Sanad chain is shown to the learner plainly — it is part of the lesson’s value. Alongside it: thematic Itqan memorisation, a report after every session, female teachers for women and girls, and transparent plans from $40 to $128 a month — two free lessons first."}
          </p>
        </div>
      </section>

      {/* 07 — QA & PRIVACY */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">07 / {ar ? "الجودة والخصوصية" : "Quality & privacy"}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
            {ar ? "موقع عائلي يُختبر كمنتج برمجي." : "A family website, tested like software."}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {qaSuites.map(([name, body, bodyAr]) => (
              <article key={name} className="rounded-xl border border-border-subtle bg-background/55 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-300">{name}</p>
                <p className="mt-3 text-sm leading-[1.65] text-text-secondary">{ar ? bodyAr : body}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5">
            <p className="text-sm leading-[1.65] text-text-secondary">
              {ar
                ? "الخصوصية افتراضية لا إضافية: دون أي نصوص برمجية خارجية أو ملفات تعريف ارتباط افتراضيًا. التحليلات اختيارية: Plausible دون ملفات تعريف ارتباط، أو Google Tag Manager خلف موافقة Consent Mode v2 بلغة الزائر. وبوابة العمليات (طلاب، أسر، معلمون، سجل حصص، اشتراكات، صلاحيات مفحوصة على الخادم) عملية Node منفصلة عن الموقع الثابت."
                : "Privacy is the default, not an add-on: with no analytics variables set, the site ships no third-party scripts and no cookies. Analytics stay optional — cookieless Plausible, or GTM behind Consent Mode v2 in the visitor’s language. The operations portal (students, families, teachers, session ledger, subscriptions, server-checked permissions) runs as a separate Node process beside the static site."}
            </p>
          </div>
        </div>
      </section>

      {/* 08 — STACK */}
      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">08 / {ar ? "التقنيات" : "Technology stack"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">
              {ar ? "ثابت بقدر ما يحتاج التعليم." : "Static where teaching needs stability."}
            </h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="rounded-full border border-border-subtle bg-background/60 px-3 py-2 font-mono text-xs text-text-secondary">
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-[1.65] text-text-secondary">
              {ar
                ? "خرج ثابت من Astro، وتعليمات TypeScript خفيفة، وخدمة تعمل على أي استضافة. النسخة التجريبية على Vercel، والإنتاج مستهدف على Hostinger مع بوابة العمليات كتطبيق Node. كل البناء يمر باختبارات الروابط واللغات وإمكانية الوصول والـ PWA."
                : "Static output from Astro, light TypeScript islands, and hosting that can be moved anywhere. The preview runs on Vercel; production targets Hostinger with the portal as a Node app. Every build passes the link, i18n, accessibility and PWA suites."}
            </p>
          </div>
        </div>
      </section>

      {/* HAND-OFF */}
      <section className="border-t border-border-subtle bg-surface-1/35">
        <div className="container-wide flex flex-col gap-8 py-6 md:flex-row md:items-end md:justify-between md:py-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">HAND-OFF / 005</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "منتج ثقة، مهندس كبرمجيات." : "A trust product, engineered like software."}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-[1.65] text-text-secondary">
              {ar
                ? "الموقع حي وقابل للتثبيت بخمس لغات، وقصة المنتج — من سلسلة الإسناد إلى التقارير وخطط الأسعار — مبنية في الواجهة نفسها. ما زال قيد التطوير: بوابة العمليات ونقل النطاق من WordPress مستمران — وهذا سبب علامته كمشروع جارٍ في السجل."
                : "The site is live and installable in five languages, and the product story — from the Sanad chain to session reports and pricing — is built into the interface itself. It stays in progress: the operations portal and the WordPress domain cut-over continue — which is why the ledger marks it as ongoing."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a
              href="https://github.com/3boalazm/Ummah-academy"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary hover:border-amber-300/60"
            >
              {ar ? "الكود المصدري" : "Source code"} ↗
            </a>
            <a
              href="https://ummah-academy.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-amber-300 px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5"
            >
              {ar ? "زيارة Ummah Academy" : "Visit Ummah Academy"} ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
