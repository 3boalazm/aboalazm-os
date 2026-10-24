"use client";

import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";

const stack = [
  "HTML · CSS · Vanilla JS",
  "PWA · Service Worker · Manifest",
  "Firebase Auth · Realtime DB · FCM",
  "Express 4 · TypeScript 5 · PostgreSQL 16",
  "Vercel · workbox · Serwist concepts",
  "IBM Plex Arabic · Tajawal · Amiri · ThmanyahSans",
];

const capabilities = [
  [
    "01",
    "مواقيت دقيقة حسب موقعك",
    "صلاة GPS مع قِبلة بالبوصلة وتقويم هجري وعدّ تنازلي ليوم عرفة. المواقيت تُحفظ محليًا وتُحدَّث عند توفر الموقع.",
    "Prayer times by your location",
    "GPS-based prayer times with Hijri calendar, Qibla compass and Arafah countdown. Timings cached locally and refreshed when location is available.",
  ],
  [
    "02",
    "مصحف 604 صفحات مع ورد يومي",
    "قراءة صفحة-صفحة، خطة ختمة 10 أيام، تسميع بالذكاء وحفظ التقدم، وراديو قرآن مدمج.",
    "604-page Mushaf + daily wird",
    "Page-by-page Mushaf, 10-day khatma plan, AI-assisted memorization and integrated Quran radio.",
  ],
  [
    "03",
    "مسبحة وتكبير لا تنقطع",
    "عداد رقمي مع اهتزاز اختياري، مفتاح المسافة يُسبّح، مسبحة عائمة في كل الصفحات وإحصاء يومي.",
    "Tasbih that follows you",
    "Digital counter with haptics, spacebar to count, floating FAB on every page and daily totals.",
  ],
  [
    "04",
    "أذكار وحصن كامل",
    "أذكار الصباح والمساء، حصن المسلم، الأربعون النووية، رقية شرعية، أدعية عرفة وأدلة فضائل من القرآن والسنة.",
    "Adhkar & Hisn library",
    "Morning/evening adhkar, Hisn al-Muslim, 40 Nawawi, Ruqyah, Arafah duas and virtues backed by Quran & Sunnah references.",
  ],
  [
    "05",
    "ثُريّا وغرس للأطفال",
    "قصص أنبياء، رحلة الحج، أناشيد، اختبارات، مدرسة جميلة وشاشة مرح — كلها داخل نفس التطبيق.",
    "Thuraya & Ghars for kids",
    "Prophet stories, Hajj journey, nasheeds, quizzes, kids school and fun — inside the same app, not a separate download.",
  ],
  [
    "06",
    "تدبّر بالذكاء + مجتمع خفيف",
    "اسأل عن آية أو حكم، مجموعة عائلية للتنافس، أوسمة وحصاد العشر — بدون إعلانات أو اشتراكات.",
    "AI reflection + light social",
    "Ask about a verse or ruling, join a family group challenge, earn badges and harvest — no ads, no subscriptions.",
  ],
] as const;

const journey = [
  {
    step: "01",
    title: "افتح — يعمل فورًا",
    titleEn: "Open — works instantly",
    desc: "PWA يفتح كتطبيق مستقل. localStorage zad_v2 هو مصدر الحقيقة الافتراضي، حتى بدون حساب.",
    descEn: "PWA opens as standalone app. localStorage zad_v2 is the default source of truth, even as guest.",
  },
  {
    step: "02",
    title: "حدّد موقعك — دقة المواقيت",
    titleEn: "Locate — accurate timings",
    desc: "الـ GPS يحسب الصلوات والقِبلة والتقويم الهجري ويخزّنها. بدون موقع، الواجهة تظل مقروءة.",
    descEn: "GPS derives prayer times, Qibla and Hijri, then caches them. UI stays readable without location.",
  },
  {
    step: "03",
    title: "تابع وردك اليومي",
    titleEn: "Follow your daily wird",
    desc: "جدول عبادات، ورد قرآن، تكبير، أذكار وحصاد — كلها تُحفظ محليًا مع شريط تقدّم واضح.",
    descEn: "Worship tracker, Quran reading, takbeer and adhkar — all saved locally with clear progress.",
  },
  {
    step: "04",
    title: "مزامنة اختيارية",
    titleEn: "Optional sync",
    desc: "تسجيل دخول معزول: إنشاء حساب لا يُفعّل مزامنة تلقائية. الدفع والسحب يدويان عبر /api/v1/sync.",
    descEn: "Isolated auth: registration does not auto-sync. Push/pull via /api/v1/sync are manual.",
  },
  {
    step: "05",
    title: "خلفية موثوقة",
    titleEn: "Trusted backend",
    desc: "Express + PostgreSQL لبيانات العبادة، Firebase Realtime للمجموعات والإشعارات — نفس الأصل، بدون CORS.",
    descEn: "Express + PostgreSQL for worship data, Firebase Realtime for groups & push — same-origin, no CORS.",
  },
] as const;

export function ZadCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="overflow-hidden">
      {/* ═══ HERO — orange glass parent, Zad green/gold inside ═══ */}
      <section className="container-wide relative flex min-h-[70svh] flex-col justify-between gap-7 py-5 md:py-7">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-orange-500/[0.10] blur-[100px]" />
          <div className="absolute -left-20 top-56 h-72 w-72 rounded-full bg-emerald-600/[0.07] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">
            ← {ar ? "كل الأعمال" : "All work"}
          </Link>
          <span>{ar ? "ملف منتج / 004" : "Product case file / 004"}</span>
        </div>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-400/30 bg-orange-400/[0.08] px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">
                {ar ? "رفيق عبادة — PWA" : "Worship companion — PWA"}
              </span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
                {ar ? "عربي أولًا · RTL" : "Arabic-first · RTL"}
              </span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
                {ar ? "بدون إعلانات · 2025—2026" : "No ads · 2025—2026"}
              </span>
            </div>

            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-300/80">ZAD / رفيق أفضل أيام الدنيا</p>

            <h1 className="max-w-5xl font-display text-[clamp(3.4rem,9vw,8.4rem)] leading-[0.86] tracking-[-0.065em] text-text-primary">
              زاد<span className="text-orange-300">.</span> <span className="text-xl font-sans font-normal tracking-normal text-text-tertiary md:text-2xl">Zad</span>
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar
                ? "رفيقك الذكي في عشر ذي الحجة — مصحف، صلاة، أذكار، أطفال وتدبّر. 64 صفحة في تطبيق واحد يعمل بدون إنترنت."
                : "Your companion in the ten best days — Quran, prayer, adhkar, kids and reflection. 64 pages in one PWA that works offline."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#0e3b2e] px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.10em] text-[#e6c97a]">PWA 2026</span>
              <span className="rounded-full bg-[#c9a14a]/15 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.10em] text-[#8a6822]">يعمل أوفلاين</span>
              <span className="rounded-full border border-border-subtle px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.10em] text-text-tertiary">64 صفحة</span>
              <span className="rounded-full border border-border-subtle px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.10em] text-text-tertiary">AR / EN / FR</span>
            </div>
          </div>

          {/* Snapshot — glass card describes the product, not invented KPIs */}
          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-4 backdrop-blur-xl md:p-4">
            <div className="mb-5 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? "لقطة المنتج" : "Product snapshot"}</span>
              <span className="text-orange-300">ZAD / PWA</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-border-subtle bg-white">
              <div className="relative aspect-[16/9] bg-[#0e3b2e]">
                <Image
                  src="/images/case-studies/zad/og-image.png"
                  alt={ar ? "زاد — رفيق أفضل أيام الدنيا" : "Zad — companion in the best days"}
                  fill
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2">
                <span className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
                  <span className="size-2 rounded-full bg-emerald-500" /> {ar ? "لقطة حقيقية من الإنتاج" : "Real production asset"}
                </span>
                <span className="font-mono text-[12px] text-zinc-400">og-image.png</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-3xl text-text-primary">64</p>
                <p className="mt-1 text-xs text-text-tertiary">{ar ? "صفحة HTML مستقلة" : "Standalone HTML pages"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-3xl text-text-primary">3</p>
                <p className="mt-1 text-xs text-text-tertiary">{ar ? "ثيمات · فاتح/داكن/OLED" : "Themes · light/dark/OLED"}</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "هوية المنتج" : "Product identity"}</p>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-primary">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-3 rounded-full bg-[#0e3b2e] ring-1 ring-black/10" /> #0e3b2e
                  </span>
                  <span className="text-orange-300">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-3 rounded-full bg-[#c9a14a] ring-1 ring-black/10" /> #c9a14a
                  </span>
                  <span className="text-orange-300">·</span> IBM Plex Arabic / Amiri
                </p>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">
              {ar ? "الأعداد تصف بنية الملفات والواجهات الحالية، وليست ادعاءً بعدد المستخدمين أو التحميلات." : "Counts describe file and UI structure, not user or download claims."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? "الدور: تصميم المنتج والهندسة" : "Role: Product design & engineering"}</span>
            <span>{ar ? "المجال: عبادة وحياة يومية" : "Domain: Worship & daily life"}</span>
            <span>2025—2026</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/3boalazm/zad"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm text-text-primary transition-colors hover:border-orange-400/60 hover:bg-orange-400/[0.06]"
            >
              GitHub ↗
            </a>
            <a
              href="https://zadullmuslim.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
            >
              {ar ? "افتح زاد" : "Open Zad"} ↗
            </a>
          </div>
        </div>
      </section>
      <div className="container-content"><ProjectEnquiry compact service="digital-product" /></div>

      {/* ═══ 01 / OVERVIEW ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">01 / {ar ? "نظرة عامة" : "Overview"}</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "تطبيق واحد يرافقك، مش يشتتك." : "One companion, not a cluster of apps."}
            </h2>
          </div>
          <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
            <p>
              {ar
                ? "زاد هو PWA عربي أولًا صُمم لعشر ذي الحجة وامتد ليغطي العبادة اليومية كاملة: الصلوات الخمس في جماعة، ورد القرآن وختمته، المسبحة والتكبير، الأذكار والأدعية، ومناسك الحج ويوم عرفة والأضحية، مع مساحة للأطفال والعائلة."
                : "Zad is an Arabic-first PWA designed for the ten days of Dhul Hijjah and extended to daily worship: congregational prayers, Quran reading and khatma, tasbih, adhkar and duas, Hajj rites, Arafah and sacrifice, plus kids and family spaces."}
            </p>
            <p>
              {ar
                ? "يخدم الفرد الذي يريد الاستمرارية بدون تشتيت، والأسرة التي تريد متابعة مشتركة، والطفل الذي يحتاج قصصًا مبسطة — كل ذلك بدون إعلانات أو اشتراكات."
                : "It serves the individual seeking continuity without switching apps, the family tracking together, and the child needing simple stories — all without ads or subscriptions."}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border-subtle bg-white p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-orange-400">{ar ? "لمن" : "Who"}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">{ar ? "مسلم يومي وعائلة" : "Daily Muslim & family"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-white p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-orange-400">{ar ? "أين" : "Where"}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">{ar ? "هاتف، مصلى، بدون نت" : "Phone, mosque, offline"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-white p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-orange-400">{ar ? "ماذا يمكّن" : "Enables"}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">{ar ? "متابعة ورد والتزام" : "Track wird & commitment"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 02 / PROBLEM ═══ */}
      <section className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">02 / {ar ? "المشكلة" : "The problem"}</p>
          <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
            {ar ? "العبادة تتقطع بين تطبيقات كثيرة." : "Worship gets fragmented across apps."}
          </h2>
        </div>
        <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
          <p>
            {ar
              ? "الواقع العملي: تطبيق للصلاة، آخر للقرآن، ثالث للأذكار، ورابع للأطفال. كل واحد يطلب تسجيلًا مختلفًا، وإشعاراته منفصلة، ولا أحد يربط التقدم اليومي بصورة واحدة."
              : "In practice: one app for prayer, another for Quran, a third for adhkar, a fourth for kids. Different logins, separate notifications, no single daily progress view."}
          </p>
          <p>
            {ar
              ? "النتيجة هي تشتت وانقطاع السلسلة الروحية، خصوصًا في عشر ذي الحجة حيث كل يوم له ورد وصيام وتكبير وذكر. الحاجة كانت لرفيق واحد يحفظ الاستمرارية حتى بدون إنترنت."
              : "Result: fragmented habits and broken streaks, especially in Dhul Hijjah where each day carries fasting, takbeer and remembrance. The need was a single companion that keeps streaks even offline."}
          </p>
          <div className="rounded-xl border-s-2 border-orange-400 bg-orange-400/[0.04] p-4">
            <p className="text-sm leading-[1.65] text-text-primary">
              {ar
                ? "ما وراء المشكلة: ليست قلة المحتوى الديني، بل غياب تجربة يومية متماسكة تحترم اللغة العربية، الخصوصية، والعمل بدون اتصال."
                : "Beyond content scarcity: the gap was a coherent daily experience respecting Arabic, privacy and offline use — not more religious content."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 03 / IDEA ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">03 / {ar ? "الفكرة والحل" : "Idea & solution"}</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "64 صفحة، روح واحدة." : "64 pages, one spirit."}
            </h2>
          </div>
          <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
            <p>
              {ar
                ? "الفكرة: بدل بناء تطبيق لكل عبادة، نبني نظامًا واحدًا بواجهات متعددة. كل صفحة HTML مستقلة لكنها تشترك في نفس الحالة (zad_v2)، نفس الشريط الجانبي، نفس المسبحة العائمة، ونفس لغة التصميم."
                : "Instead of an app per act of worship, build one system with many surfaces. Each of the 64 HTML pages stands alone yet shares the same state (zad_v2), sidebar, floating tasbih and design language."}
            </p>
            <div className="rounded-2xl border border-border-subtle bg-white p-4 md:p-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">{ar ? "مبدأ المنتج" : "Product principle"}</p>
              <p className="mt-3 text-lg font-medium leading-[1.65] text-text-primary">
                {ar
                  ? "افتح كزائر وابدأ فورًا. أنشئ حسابًا فقط إذا أردت مزامنة. لا مزامنة تلقائية، لا فقدان بيانات عند الأوفلاين."
                  : "Open as guest and start. Create an account only if you want sync. No auto-sync, no offline data loss."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#0e3b2e] px-3 py-1 text-xs text-white">وفق خيري</span>
                <span className="rounded-full border border-border-subtle px-3 py-1 text-xs text-text-tertiary">بدون إعلانات</span>
                <span className="rounded-full border border-border-subtle px-3 py-1 text-xs text-text-tertiary">PWA قابل للتثبيت</span>
              </div>
            </div>
            <p className="text-sm leading-[1.65]">
              {ar
                ? "الحل يعالج المشكلة بربط كل شيء في لوحة تحكم واحدة: عدّ تنازلي لعرفة، صلاة قادمة، آية المساء، محاضرات، أوسمة وإحصاءات — كلها تقرأ من نفس progresso المحلي."
                : "The solution ties everything into one dashboard: Arafah countdown, next prayer, evening verse, lectures, badges and stats — all reading from the same local progress."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 04 / KEY CAPABILITIES ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">04 / {ar ? "القدرات الأساسية" : "Key capabilities"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "ما يهم فعلًا، بلغة بسيطة." : "What matters, in plain language."}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-[1.65] text-text-tertiary">
            {ar
              ? "كل قدرة موثقة في السورس والصفحات الحية. لا ميزات متخيلة."
              : "Every capability is in the source and live pages. No imagined features."}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(([no, title, desc, titleEn, descEn]) => (
            <article
              key={no}
              className="group rounded-xl border border-border-subtle bg-background/55 p-4 transition-colors hover:border-orange-400/40 md:p-4"
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{no}</span>
                <span className="text-orange-300 transition-transform group-hover:translate-x-1">↗</span>
              </div>
              <h3 className="font-display text-xl leading-tight text-text-primary">{ar ? title : titleEn}</h3>
              <p className="mt-3 text-sm leading-[1.65] text-text-secondary">{ar ? desc : descEn}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ 05 / PRODUCT EXPERIENCE ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">05 / {ar ? "التجربة والهوية" : "Product experience"}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
            {ar ? "أخضر عميق، ذهبي هادئ، وعربي يُقرأ." : "Deep green, quiet gold, Arabic that reads."}
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Real screenshot — og-image + icon */}
            <div className="rounded-2xl border border-border-subtle bg-white p-4 md:p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "لقطة حقيقية" : "Verified asset"}</p>
                <span className="rounded-full border border-border-subtle px-2 py-1 font-mono text-[12px] text-text-ghost">og-image.png</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
                <Image
                  src="/images/case-studies/zad/og-image.png"
                  alt="Zad og-image"
                  width={1200}
                  height={630}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Image src="/images/case-studies/zad/icon-192.svg" alt="Zad icon" width={36} height={36} className="rounded-lg" />
                <div>
                  <p className="text-sm font-medium text-text-primary">زاد — أفضل أيام الدنيا</p>
                  <p className="text-xs text-text-tertiary">{ar ? "أيقونة SVG حقيقية من الـ manifest" : "Real SVG icon from manifest.json"}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-[1.65] text-text-tertiary">
                {ar
                  ? "صورة الـ OG مأخوذة مباشرة من https://zadullmuslim.vercel.app/og-image.png — ليست صورة مولدة."
                  : "OG image is directly from https://zadullmuslim.vercel.app/og-image.png — not AI generated."}
              </p>
            </div>

            {/* Visual identity & UX decisions */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">{ar ? "الهوية البصرية" : "Visual identity"}</p>
                <div className="mt-4 flex gap-2">
                  <span className="flex-1 rounded-lg bg-[#0e3b2e] p-3 text-center text-xs font-medium text-white">#0e3b2e</span>
                  <span className="flex-1 rounded-lg bg-[#c9a14a] p-3 text-center text-xs font-medium text-white">#c9a14a</span>
                  <span className="flex-1 rounded-lg bg-[#faf9f6] p-3 text-center text-xs font-medium text-zinc-700 border">#faf9f6</span>
                </div>
                <p className="mt-3 text-sm leading-[1.65] text-text-secondary">
                  {ar
                    ? "أخضر عميق للثقة والسكينة، ذهبي للاحتفاء، ورمل فاتح للقراءة الطويلة. كلها معرفة كـ CSS variables."
                    : "Deep green for trust, gold for celebration, light sand for long reading — all as CSS variables."}
                </p>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">{ar ? "العربية أولًا" : "Arabic-first"}</p>
                <ul className="mt-3 space-y-2 text-sm leading-[1.65] text-text-secondary">
                  <li>• {ar ? "dir=\"rtl\" افتراضي مع منطق logical properties" : "dir=\"rtl\" by default with logical CSS properties"}</li>
                  <li>• {ar ? "خطوط: IBM Plex Arabic + Amiri للآيات + ThmanyahSans للعناوين" : "Type: IBM Plex Arabic + Amiri for verses + ThmanyahSans for headings"}</li>
                  <li>• {ar ? "EN/FR عبر lang.js مع تبديل dir تلقائي" : "EN/FR via lang.js with automatic dir switching"}</li>
                  <li>• {ar ? "3 ثيمات: فاتح / داكن / OLED مع حفظ التفضيل" : "3 themes: light / dark / OLED with saved preference"}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.04] p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-400">{ar ? "قرارات UX" : "UX decisions"}</p>
                <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                  {ar
                    ? "شريط جانبي ثابت + تنقل سفلي، مسبحة عائمة لا تغطي المحتوى، command palette بـ Ctrl+K، وإمكانية وصول موثقة في ACCESSIBILITY-AUDIT-2026-08-23."
                    : "Fixed sidebar + bottom nav, non-covering floating tasbih, Ctrl+K palette and audited accessibility in ACCESSIBILITY-AUDIT-2026-08-23."}
                </p>
              </div>
            </div>
          </div>

          {/* Interface preview — CSS mockup with real Arabic strings */}
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { k: ar ? "لوحة التحكم" : "Dashboard", v: ar ? "عدّ تنازلي + صلاة قادمة + آية المساء" : "Countdown + next prayer + evening verse" },
              { k: ar ? "المصحف" : "Mushaf", v: ar ? "604 صفحات مع حفظ الصفحة" : "604 pages with saved position" },
              { k: ar ? "الأطفال — ثُريّا" : "Kids — Thuraya", v: ar ? "قصص ورحلة حج وأناشيد" : "Stories, Hajj journey & nasheeds" },
            ].map((item) => (
              <div key={item.k} className="rounded-xl border border-border-subtle bg-white p-4">
                <div className="h-28 rounded-lg bg-gradient-to-br from-[#0e3b2e] to-[#1a5d47] p-3 text-white">
                  <p className="font-mono text-[12px] opacity-70">zād / {item.k}</p>
                  <div className="mt-6 h-2 w-3/4 rounded-full bg-white/20" />
                  <div className="mt-2 h-2 w-1/2 rounded-full bg-white/15" />
                </div>
                <p className="mt-3 text-sm font-medium text-text-primary">{item.k}</p>
                <p className="text-xs leading-[1.65] text-text-tertiary">{item.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-[12px] uppercase tracking-[0.10em] text-text-ghost">
            {ar ? "معاينات توضيحية بنصوص عربية حقيقية من السورس — ليست لقطات مزيفة بالذكاء" : "Illustrative previews with real Arabic strings from source — not AI screenshots"}
          </p>
        </div>
      </section>

      {/* ═══ 06 / HOW IT WORKS ═══ */}
      <section className="container-wide py-6 md:py-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">06 / {ar ? "كيف يعمل — نظرة واحدة" : "How it works — one view"}</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
          {ar ? "رحلة بسيطة، من الفتح للمزامنة." : "A simple journey, from open to sync."}
        </h2>

        <div className="mt-6 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-4">
          <div className="grid gap-3 lg:grid-cols-5">
            {journey.map((j) => (
              <div key={j.step} className="relative rounded-xl border border-border-subtle bg-white p-4">
                <p className="font-mono text-[12px] text-orange-400">{j.step}</p>
                <p className="mt-2 text-sm font-medium leading-tight text-text-primary">{ar ? j.title : j.titleEn}</p>
                <p className="mt-2 text-xs leading-[1.65] text-text-tertiary">{ar ? j.desc : j.descEn}</p>
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-orange-300 lg:block">→</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs leading-[1.65] text-text-tertiary">
            {ar
              ? "مخطط مبسط للرحلة، ليس وثيقة معمارية عميقة. كل خطوة موثقة في js/app.js و js/sync-manager.js و api/src."
              : "Simplified journey diagram, not a deep architecture doc. Each step is in js/app.js, js/sync-manager.js and api/src."}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border-subtle p-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-orange-300">{ar ? "محلي أولًا" : "Local-first"}</p>
            <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
              {ar
                ? "التقدم يُحفظ في localStorage ويُستعاد فورًا. حتى لو فشل الخادم، الورد لا يضيع."
                : "Progress lives in localStorage and restores instantly. Even if the server is down, wird is safe."}
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle p-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-orange-300">{ar ? "بدون CORS" : "Same-origin"}</p>
            <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
              {ar
                ? "الـ PWA لا يتصل مباشرة بـ Firebase من كل صفحة؛ الـ API على نفس النطاق يتولى الجلسات الآمنة."
                : "PWA does not hit third-parties from every page; same-origin API handles secure sessions."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 07 / MY CONTRIBUTION ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">07 / {ar ? "ماذا بنيت أنا" : "My contribution"}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "تصميم المنتج وهندسته، بوضوح." : "Product design & engineering, clearly attributed."}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.04] p-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-400">{ar ? "عملي الموثق" : "Verified — my work"}</p>
              <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-[1.65] text-text-secondary">
                <li>{ar ? "تصميم المفهوم: 64 صفحة كـ PWA واحدة بواجهة عربية RTL أولًا." : "Concept design: 64 pages as one PWA with Arabic RTL-first UI."}</li>
                <li>{ar ? "هندسة الواجهة: HTML/CSS/JS فانيلا مع premium-ui ودعم 3 ثيمات وRTL منطقي." : "Frontend engineering: vanilla HTML/CSS/JS with premium-ui, 3 themes and logical RTL."}</li>
                <li>{ar ? "نظام PWA: manifest، Service Worker، offline-ui وتثبيت كتطبيق مستقل." : "PWA system: manifest, Service Worker, offline-ui and standalone install."}</li>
                <li>{ar ? "تكامل Firebase: تهيئة zadullashr، مجموعات عائلية، إشعارات FCM." : "Firebase integration: zadullashr init, family groups, FCM push."}</li>
                <li>{ar ? "الـ API الخاص: Express + TypeScript + PostgreSQL (سبرنت Z0—Z11)، مصادقة بجلسات HttpOnly ومسارات /sync." : "Private API: Express + TS + PostgreSQL (sprints Z0—Z11), HttpOnly session auth and /sync routes."}</li>
                <li>{ar ? "التوثيق والتدقيق: كتابة QA-TEST-SUITE و ACCESSIBILITY-AUDIT ومعالجة 17 قضية عناوين وRTL." : "Docs & audits: authoring QA suites and a11y audits, fixing 17 heading/RTL issues."}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-white p-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "موروث / طرف ثالث — باحترام المصدر" : "Inherited / third-party — with attribution"}</p>
              <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm leading-[1.65] text-text-tertiary">
                <li>{ar ? "نصوص قرآنية وأذكار: مصادر دينية عامة، ليست تأليفي." : "Quran & adhkar texts: public religious sources, not authored."}</li>
                <li>Firebase SDK 10.12.0 · Google Fonts (IBM Plex Sans Arabic, Tajawal, Amiri) · ThmanyahSans</li>
                <li>{ar ? "محتوى خارجي: إذاعات قرآن وبثوث YouTube / SoundCloud مضمنة." : "External content: Quran radio streams & embedded YouTube/SoundCloud."}</li>
                <li>{ar ? "لا ترخيص مخصص منشور في الريبو؛ يُحترم كعمل شخصي لمصطفى." : "No custom license file; respected as personal work by Mustafa."}</li>
              </ul>
            </div>

            <p className="text-xs leading-[1.65] text-text-ghost">
              {ar
                ? "كل commits باسم 3boalazm / Mustafa Aboalazm؛ صفحة developer.html تنسب العمل لي ولـ Code & Canvas."
                : "All commits by 3boalazm / Mustafa Aboalazm; developer.html attributes work to me and Code & Canvas."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 08 / CURRENT STATE ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">08 / {ar ? "الحالة الحالية" : "Current state"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "يعمل، مُختبر، وحدوده واضحة." : "Working, tested, with clear limits."}
            </h2>
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/[0.6] p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-emerald-700">✓ {ar ? "يعمل" : "Works"}</p>
                <p className="mt-2 text-sm leading-[1.65] text-text-primary">
                  {ar ? "PWA حي على zadullmuslim.vercel.app، قابل للتثبيت، يفتح بدون حساب، 64 صفحة تُحمّل." : "Live PWA at zadullmuslim.vercel.app, installable, opens as guest, 64 pages load."}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/[0.6] p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-emerald-700">✓ {ar ? "مُختبر" : "Tested"}</p>
                <p className="mt-2 text-sm leading-[1.65] text-text-primary">
                  {ar
                    ? "تدقيق وصول 23-08-2026، مجموعة QA، وإصلاحات RTL وheadings وService Worker."
                    : "A11y audit 23-08-2026, QA suite and fixes for RTL, headings and SW."}
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-text-tertiary">{ar ? "روابط مباشرة" : "Live links"}</p>
                <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                  <a href="https://zadullmuslim.vercel.app/" target="_blank" rel="noreferrer" className="text-orange-500 underline underline-offset-4">
                    zadullmuslim.vercel.app
                  </a>{" "}
                  ·{" "}
                  <a href="https://github.com/3boalazm/zad" target="_blank" rel="noreferrer" className="text-orange-500 underline underline-offset-4">
                    github.com/3boalazm/zad
                  </a>
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-text-tertiary">{ar ? "أوفلاين حقيقي" : "Real offline"}</p>
                <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                  {ar ? "القرآن والأذكار والتكبير والورد تعمل بدون نت بعد أول تحميل." : "Quran, adhkar, tasbih and wird work offline after first load."}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-700">⚠ {ar ? "محدوديات موثقة" : "Known limitations"}</p>
              <ul className="mt-3 list-disc space-y-1 ps-5 text-sm leading-[1.65] text-amber-900/80">
                <li>{ar ? "التسجيل معزول: لا مزامنة تلقائية حتى يطلب المستخدم الدفع." : "Registration is isolated: no auto-sync until user pushes."}</li>
                <li>{ar ? "الـ API يحتاج DATABASE_URL وSESSION_SECRET — بدونها يعمل بوضع not_configured." : "API needs DATABASE_URL & SESSION_SECRET — otherwise runs as not_configured."}</li>
                <li>{ar ? "مواقيت الصلاة دقيقة فقط بعد السماح بالموقع؛ وإلا تُعرض --:--." : "Prayer times need location permission; otherwise show --:--."}</li>
                <li>{ar ? "لا أدعي أعداد مستخدمين أو تحميلات أو إيرادات — غير موجودة في السورس." : "No user, download or revenue numbers claimed — absent from source."}</li>
              </ul>
            </div>

            <p className="text-xs leading-[1.65] text-text-ghost">
              {ar
                ? "كل الادعاءات من السورس أو من instance حية تم فتحها. ما هو غير مؤكد حُذف."
                : "Every claim is from source or a live instance opened. Uncertain claims were omitted."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 09 / CLOSING ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">09 / {ar ? "الخلاصة" : "Closing"}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "لماذا زاد مفيد؟" : "Why Zad matters."}
            </h2>
          </div>
          <div className="space-y-3 text-base leading-[1.65] text-text-secondary">
            <p className="text-lg font-medium leading-[1.65] text-text-primary">
              {ar
                ? "لأنه يحوّل العبادة المتقطعة إلى عادة يومية متماسكة — بدون إعلانات، بدون تعقيد، وباحترام للغة."
                : "It turns fragmented worship into a coherent daily habit — no ads, no complexity, with language respected."}
            </p>
            <p>
              {ar
                ? "ما يثبته عني: قدرة على تحويل فكرة دينية حساسة إلى منتج رقمي متكامل — من استراتيجية المحتوى (64 صفحة مترابطة) إلى تصميم PWA عربي متقن، إلى هندسة Offline-first وAPI آمن. ليس تقريرًا تقنيًا عميقًا، بل مشروع منتج حقيقي يعمل في يد المستخدم."
                : "What it demonstrates about me: turning a sensitive religious idea into a complete digital product — from content strategy (64 interlinked pages) to refined Arabic PWA design to offline-first engineering and a secure API. Not a deep audit, but a real product in users' hands."}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#0e3b2e] px-3 py-1.5 text-xs text-white">{ar ? "تصميم منتج" : "Product design"}</span>
              <span className="rounded-full border border-border-subtle bg-white px-3 py-1.5 text-xs text-text-secondary">{ar ? "هندسة PWA" : "PWA engineering"}</span>
              <span className="rounded-full border border-border-subtle bg-white px-3 py-1.5 text-xs text-text-secondary">{ar ? "RTL & وصول" : "RTL & a11y"}</span>
              <span className="rounded-full border border-border-subtle bg-white px-3 py-1.5 text-xs text-text-secondary">{ar ? "Firebase & API" : "Firebase & API"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HAND-OFF ═══ */}
      <section className="container-wide pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-400/[0.10] via-surface-1/70 to-emerald-600/[0.05] p-4 md:p-6">
          <div aria-hidden="true" className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-orange-400/[0.12] blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">END OF FILE / 004</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">
                {ar ? "من فكرة إيمانية إلى منتج يومي." : "From faithful idea to daily product."}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-[1.65] text-text-secondary">
                {ar
                  ? "افتح زاد كزائر، جرّب المسبحة والمصحف، ثم اقرأ الكود إذا أردت العمق."
                  : "Open Zad as guest, try tasbih and Mushaf, then read the code for depth."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/3boalazm/zad"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary transition-colors hover:border-orange-400/60"
              >
                Source repository ↗
              </a>
              <a
                href="https://zadullmuslim.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-orange-400 px-5 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
              >
                {ar ? "افتح المنتج" : "Open live product"} ↗
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-5 font-mono text-[12px] uppercase tracking-[0.12em] text-text-ghost">
          <Link href="/work" className="hover:text-text-primary">
            ← {ar ? "العودة إلى الأعمال" : "Back to work"}
          </Link>
          <span>Mustafa Aboalazm / 2026</span>
        </div>
      </section>
    </div>
  );
}
