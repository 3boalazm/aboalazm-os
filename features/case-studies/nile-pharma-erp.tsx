"use client";

import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { contactHref } from "@/lib/contact-context";

/* The hero shows the owner's overview board of the real interface (the five
   screens below, plus the headline figures read off them). It replaces an
   illustration drawn from the seeded demo: nothing in the hero is mocked up.
   The alt only names the board, so the link's accessible name stays short; the
   figures live in a separate description the link points at (aria-describedby).
   "360" is the Accounts 360 feature on the board, not a count of anything. */
const overview = {
  src: "/images/work/nile-erp/nile-erp-00-overview.webp",
  width: 2000,
  height: 1578,
  altEn: "Overview board of five real Nile ERP screens: command center, invoicing, accounts 360, inventory and notifications.",
  altAr: "لوحة عرض لخمس شاشات حقيقية من Nile ERP: لوحة التحكم والفواتير والعملاء والمخزون والإشعارات.",
  figuresEn: "Headline figures on the board: 10 core modules, a 360° client-account view, 6 quick workflows, 50 operational notifications and EGP 3.06M of stock value.",
  figuresAr: "أرقام اللوحة: 10 وحدات رئيسية، عرض حساب العميل 360، 6 مسارات عمل سريعة، 50 إشعارًا تشغيليًا، وقيمة مخزون 3.06 مليون ج.م.",
} as const;

const servicesGrouped = [
  {
    group: "العمليات التجارية",
    groupEn: "Commercial Operations",
    items: [
      ["01", "Sales", "أوامر البيع والتسعير والتنسيق", "Orders, pricing & orchestration"],
      ["02", "Inventory", "المخزون وFEFO والكونساينمنت", "Stock, FEFO & consignment"],
      ["03", "Products", "الأصناف والتشغيلات", "Products & batches"],
    ],
  },
  {
    group: "العملاء والتحفيز",
    groupEn: "Customer & Incentives",
    items: [
      ["04", "CRM", "الحسابات والزيارات والعملاء", "Accounts, visits & leads"],
      ["05", "Incentives", "محرك الحوافز وسجله", "Incentive engine & ledger"],
    ],
  },
  {
    group: "الحوكمة والمالية",
    groupEn: "Governance & Finance",
    items: [
      ["06", "Accounting", "الفواتير والمدفوعات ودفتر الأستاذ", "Invoices, payments & ledger"],
      ["07", "IAM", "الهوية والصلاحيات", "Identity & access"],
      ["08", "Organization", "الهيكل والبيانات الرئيسية", "Org & master data"],
      ["09", "Audit", "سجل أحداث موحد", "Unified audit trail"],
    ],
  },
] as const;


const screens = [
  {
    n: "01",
    src: "/images/work/nile-erp/nile-erp-01-command-center.webp",
    titleEn: "Operations Command Center",
    titleAr: "لوحة التحكم",
    summaryEn: "The landing screen: the day’s sales, the most-used actions and every module a click away.",
    summaryAr: "شاشة البداية: مبيعات اليوم وأكثر الإجراءات استخدامًا وكل الوحدات على بعد نقرة.",
    points: [
      "Quick actions — invoice, collection and return in one click",
      "Today’s sales, live — total value and number of sales orders",
      "Six ready workflows — field day, invoice, collection, return, inventory, assistant",
      "An AI operations assistant — a guide to operations, by permission",
      "Ten core modules — field, sales, purchasing, inventory, finance, incentives, HR, reports, administration",
    ],
  },
  {
    n: "02",
    src: "/images/work/nile-erp/nile-erp-02-invoicing.webp",
    titleEn: "Invoicing",
    titleAr: "الفواتير",
    summaryEn: "The sales document, end to end: create, track collection and export — all from one list.",
    summaryAr: "وثيقة البيع من أولها لآخرها: إنشاء وتتبّع تحصيل وتصدير — من قائمة واحدة.",
    points: [
      "Quick shortcuts — new invoice, new client, follow up an order",
      "Create an invoice in four steps — client → document type → items → review",
      "Collection-status filters — all, unpaid, partial, overdue",
      "Excel export, with the columns you choose",
      "Auto-numbered invoices — total, collected, remaining, colour-coded status",
    ],
  },
  {
    n: "03",
    src: "/images/work/nile-erp/nile-erp-03-accounts-360.webp",
    titleEn: "Accounts 360",
    titleAr: "العملاء",
    summaryEn: "Every client account in one database, with the signals a rep needs. Client names are blurred for privacy.",
    summaryAr: "كل حسابات العملاء في قاعدة واحدة، مع المؤشرات التي يحتاجها المندوب. أسماء العملاء مطموسة حفاظًا على الخصوصية.",
    points: [
      "A 360° client account in one place",
      "Client actions — add, log a visit, import, refresh",
      "Five performance indicators — new clients, today’s visits, inactive clients, clients with a balance, conversion rate",
      "Advanced search and filters — name, code, phone, category, rep",
      "A data-rich table — code, category, city, status, rep, current balance",
    ],
  },
  {
    n: "04",
    src: "/images/work/nile-erp/nile-erp-04-inventory.webp",
    titleEn: "Inventory Overview",
    titleAr: "المخزون",
    summaryEn: "Stock value, availability and quality at a glance, across more than one warehouse.",
    summaryAr: "قيمة المخزون والمتاح والجودة في نظرة واحدة، عبر أكثر من مخزن.",
    points: [
      "Receive stock — one press, recorded in the movement log",
      "Stock value, shown at a glance",
      "Units available against units reserved",
      "Quality and movement indicators — health reserve, reserved, damaged/rejected, today’s movements",
      "Multiple warehouses, with transfers between them",
      "Search and expiry tracking — name or code, status, expiry window",
    ],
  },
  {
    n: "05",
    src: "/images/work/nile-erp/nile-erp-05-notifications.webp",
    titleEn: "Notification Center",
    titleAr: "الإشعارات",
    summaryEn: "An internal notification center for operational alerts — approvals, credit, shipping and announcements.",
    summaryAr: "مركز إشعارات داخلي للتنبيهات التشغيلية: اعتمادات وائتمان وشحن وإعلانات.",
    points: [
      "Notification management — mark all as read, send a notice, announce to a group",
      "Live counters — unread, received in the last 24 hours, total shown",
      "Search and filters — by category, unread only",
      "Automatic operational alerts — e.g. exchange rates not updated, with a one-click ‘open and follow up’",
    ],
  },
] as const;

const stack = ["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL / Neon", "Redpanda / Kafka", "Turborepo", "Docker Compose"];

export function NilePharmaERPCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="overflow-hidden">
      {/* ═══ 01 / INTRODUCTION — Hero proves system scale with real asset ═══ */}
      <section className="container-wide relative flex min-h-[72svh] flex-col justify-between gap-6 py-5 md:py-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-orange-500/[0.09] blur-[100px]" />
          <div className="absolute -left-24 top-56 h-72 w-72 rounded-full bg-teal-400/[0.07] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">
            {ar ? "→ كل الأعمال" : "← All work"}
          </Link>
          <span>{ar ? "عرض منتج مؤسسي / 001" : "Enterprise showcase / 001"}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-orange-400/30 bg-orange-400/[0.08] px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-accent">
                {ar ? "منظومة مؤسسية — 9 خدمات" : "Enterprise system — 9 services"}
              </span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
                {ar ? "توزيع دوائي" : "Pharma distribution"}
              </span>
            </div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">NILE PHARMA FOOD / DIGITAL OPERATIONS</p>
            {/* ltr:lg: the English words ("OPERATIONAL") are wider than the two-column track between 1024 and ~1190px at the 8vw size, so they split mid-word there; 5.6vw fits, is within 3% of the old size at 1440px and reaches the same size (5.2rem) from ~1490px up. */}
            <h1 className="max-w-[14ch] break-words font-display text-[clamp(2rem,8vw,5.2rem)] leading-[0.92] tracking-[-0.06em] text-text-primary ltr:lg:text-[clamp(2.8rem,5.6vw,5.2rem)]">
              {ar ? "منصة تشغيل" : "An integrated"}
              <br />
              <span className="text-text-tertiary">{ar ? "متكاملة" : "operational"}</span> {ar ? "لتوزيع الدواء." : "platform."}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-[1.65] text-text-secondary">
              {ar
                ? "ليست لوحة تحكم جميلة فقط. تسع خدمات مترابطة تدير المنتج والمخزون والمبيعات والحسابات والحوافز — وكل عملية تترك أثرًا يمكن تتبعه."
                : "Not just a good-looking dashboard. Nine interconnected services run product, stock, sales, accounting and incentives — every operation leaves a traceable record."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#tour" className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">
                {ar ? "شاهد الشاشات" : "See the screens"} ↓
              </a>
            </div>
          </div>

          {/* Hero visual — the real interface (the owner's overview board), not an illustration */}
          <figure className="m-0 rounded-2xl border border-border-subtle bg-surface-1 p-2 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2">
              <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-ghost">
                Nile Pharma ERP / {ar ? "لقطات حقيقية" : "Real screens"}
              </span>
              <span className="shrink-0 rounded-full border border-border-subtle px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                {ar ? "بيانات تجريبية" : "Demo data"}
              </span>
            </div>
            <a
              href={overview.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-describedby="nile-board-figures"
              className="group relative block scroll-mb-4 scroll-mt-14 overflow-hidden rounded-xl border border-border-subtle"
            >
              <Image
                src={overview.src}
                alt={ar ? overview.altAr : overview.altEn}
                width={overview.width}
                height={overview.height}
                sizes="(min-width:1440px) 530px, (min-width:1024px) 36vw, calc(100vw - 84px)"
                className="h-auto w-full"
                priority
              />
              {/* Cue for sighted users (the board's figures are only a few px tall on a phone). A strip under the picture inside the link, so it covers nothing on the board; the new-tab hint for assistive tech is the sr-only span below. */}
              <span
                aria-hidden="true"
                className="flex items-center justify-end gap-1 bg-surface-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary transition-colors group-hover:text-text-primary"
              >
                {ar ? "افتح بالحجم الكامل" : "Open full size"} {ar ? "↖" : "↗"}
              </span>
              {/* Starts with the visible words so the accessible name contains the visible label (WCAG 2.5.3). */}
              <span className="sr-only">{ar ? " — افتح بالحجم الكامل (يُفتح في تبويب جديد)" : " — Open full size (opens in a new tab)"}</span>
            </a>
            {/* `hidden`, not sr-only: a referenced element still supplies the link's description, and it is not read a second time as page text. */}
            <span id="nile-board-figures" hidden>
              {ar ? overview.figuresAr : overview.figuresEn}
            </span>
            <figcaption className="text-balance px-3 pb-2 pt-3 font-mono text-[12px] uppercase tracking-[0.1em] text-text-tertiary">
              {ar ? "خمس شاشات من النظام وهو يعمل" : "Five screens from the running system"}
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
          <span>{ar ? "الدور: قيادة المنتج والمنصة" : "Role: Product & Platform Lead"} · 2025—2026</span>
          <span className="text-text-ghost">{ar ? "اللقطات من النظام نفسه" : "Screens captured from the system itself"}</span>
        </div>
      </section>
      <div className="container-content"><ProjectEnquiry compact service="digital-product" /></div>

      {/* ═══ 02 / THE SYSTEM — grouped by function, not long list ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-7">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">02 / {ar ? "النظام" : "The system"}</p>
          <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
            {ar ? "نظام واحد مترابط، لا تسع شاشات منفصلة." : "One connected system, not nine separate screens."}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-[1.65] text-text-secondary">
            {ar
              ? "كل خدمة لها مسؤولية واحدة واضحة. التجميع حسب الوظيفة يسهل الفهم بدل قائمة طويلة من الأسماء التقنية."
              : "Each service owns one clear responsibility. Grouping by function makes the scale readable instead of a long technical list."}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {servicesGrouped.map((g) => (
              <div key={g.group} className="rounded-2xl border border-border-subtle bg-surface-1 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{ar ? g.group : g.groupEn}</p>
                <div className="mt-4 space-y-3">
                  {g.items.map(([no, name, descAr, descEn]) => (
                    <div key={name} className="flex gap-3 border-b border-border-subtle py-3 last:border-0">
                      <span className="font-mono text-xs text-text-ghost">{no}</span>
                      <div>
                        <p className="font-display text-base font-semibold text-text-primary">{name}</p>
                        <p className="mt-1 text-xs leading-[1.65] text-text-secondary">{ar ? descAr : descEn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 / PRODUCT TOUR — real, annotated screens of the running system ═══ */}
      <section id="tour" className="container-wide scroll-mt-16 py-6 md:py-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">03 / {ar ? "جولة داخل المنصة" : "Product tour"}</p>
        <h2 className="mt-3 max-w-[16ch] font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
          {ar ? "داخل المنصة — كل شاشة لها وظيفة." : "Inside the platform — every screen has a job."}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-[1.65] text-text-secondary">
          {ar
            ? "خمس شاشات حقيقية من المنصة وهي تعمل، موسومة بأهم ما فيها. البيانات تجريبية لأغراض العرض."
            : "Five real screens of the running platform, annotated with what matters in each. The data is demo data, for presentation."}
        </p>

        <div className="mt-6 flex flex-col gap-8">
          {screens.map((sc) => (
            <article key={sc.n} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
                  {sc.n} / {ar ? sc.titleAr : sc.titleEn}
                </p>
                <a
                  href={sc.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-tertiary transition-colors hover:text-text-primary"
                >
                  {ar ? "افتح بالحجم الكامل" : "Open full size"} {ar ? "↖" : "↗"}
                </a>
              </div>
              <Image
                src={sc.src}
                alt={ar ? `شاشة ${sc.titleAr} من Nile ERP، موسومة بالنقاط الرئيسية` : `Nile ERP ${sc.titleEn} screen, annotated with its key points`}
                width={2000}
                height={1126}
                sizes="(min-width:1280px) 1280px, 100vw"
                className="h-auto w-full"
              />
              <div className="grid gap-4 border-t border-border-subtle p-4 md:grid-cols-[1fr_1.4fr]">
                <p className="text-sm leading-[1.65] text-text-secondary">{ar ? sc.summaryAr : sc.summaryEn}</p>
                {/* The image already carries the Arabic callouts; the list is for English readers. */}
                {!ar && (
                  <ol className="space-y-1.5">
                    {sc.points.map((pt, i) => (
                      <li key={pt} className="flex gap-3 text-sm leading-[1.55] text-text-secondary">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-400/15 font-mono text-[11px] text-accent">{i + 1}</span>
                        {pt}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ 04 / ENGINEERING — clear architecture, implemented vs planned ═══ */}
      <section className="container-wide py-6 md:py-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">04 / {ar ? "الهندسة" : "Engineering"}</p>
        <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
          {ar ? "مبني كنظام، لا كمجموعة شاشات." : "Built as a system, not a collection of screens."}
        </h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border-subtle bg-[#0B1220] p-4 md:p-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">ARCHITECTURE · حسب الكود الفعلي</p>
            <div className="mx-auto mt-4 max-w-sm rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/10 p-3 text-center">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5EEAD4]">Presentation</p>
              <p className="mt-1 text-sm font-semibold text-white">Next.js Web Dashboard</p>
              <p className="mt-1 font-mono text-[12px] text-white/60">Same-origin /api/*</p>
            </div>
            <div className="py-2 text-center font-mono text-lg text-[#14B8A6]">↓</div>
            <div className="grid grid-cols-3 gap-2">
              {["IAM", "Organization", "Products", "Inventory", "CRM", "Sales", "Accounting", "Incentives", "Audit"].map((n) => (
                <div key={n} className="flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center font-mono text-[13px] text-white/80">
                  {n}
                </div>
              ))}
            </div>
            <div className="py-2 text-center font-mono text-lg text-[#14B8A6]">↕</div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-mono text-[12px] uppercase text-white/50">Event backbone</p>
                <p className="mt-1 font-mono text-xs text-white">Redpanda / Kafka events</p>
                <p className="mt-1 font-mono text-[12px] text-emerald-400">✓ منفذ</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-mono text-[12px] uppercase text-white/50">Data layer</p>
                <p className="mt-1 font-mono text-xs text-white">Neon PG · per-service DB</p>
                <p className="mt-1 font-mono text-[12px] text-emerald-400">✓ منفذ</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 font-mono text-[12px] text-emerald-400">✓ منفذ: 9 خدمات + عقود مشتركة</span>
              <span className="rounded-full bg-white/5 px-2 py-1 font-mono text-[12px] text-white/50">مخطط تبسيطي</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border-subtle bg-surface-1 p-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent">{ar ? "قرارات تمنع الفوضى" : "Decisions that prevent chaos"}</p>
              <ul className="mt-3 space-y-2 text-sm leading-[1.65] text-text-secondary">
                <li>• {ar ? "عقود مشتركة @nile/contracts + AsyncAPI — منع انحراف الأنواع بين الخدمات." : "Shared @nile/contracts + AsyncAPI — prevent type drift."}</li>
                <li>• {ar ? "Saga للمبيعات — لا عملية ذرية وهمية عبر 3 قواعد بيانات." : "Saga for sales — no fake atomic across 3 DBs."}</li>
                <li>• {ar ? "FEFO + تتبع التشغيلات — الصلاحية جزء من المنطق." : "FEFO + batch trace — expiry is business logic."}</li>
                <li>• {ar ? "Idempotency + DLQ + Audit Aggregator — موثوقية الأحداث." : "Idempotency + DLQ + audit aggregator — event reliability."}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface-1 p-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-ghost">{ar ? "تنفيذ مقابل مخطط" : "Implemented vs planned"}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[var(--color-success-border)] bg-[var(--color-success-dim)] p-3">
                  <p className="font-mono text-[12px] uppercase text-[var(--color-success-text)]">✓ تم</p>
                  <p className="mt-1 text-xs text-text-secondary">9 خدمات، عقود، أحداث، ترحيلات، بيانات تجريبية</p>
                </div>
                <div className="rounded-lg bg-surface-2 p-3">
                  <p className="font-mono text-[12px] uppercase text-text-tertiary">○ لاحقًا</p>
                  <p className="mt-1 text-xs text-text-secondary">تكاملات دفع/شحن خارجية إضافية حسب احتياج العميل</p>
                </div>
              </div>
              <p className="mt-3 font-mono text-[12px] leading-5 text-text-ghost">
                {ar ? "الفصل واضح — لا نخلط المنجز بالمخطط." : "Clear separation — don't mix shipped vs planned."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <span key={s} className="rounded-full border border-border-subtle bg-surface-1 px-3 py-1.5 font-mono text-xs text-text-secondary">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05 / CONTRIBUTION ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">05 / {ar ? "دوري ومساهمتي" : "Contribution"}</p>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "ماذا صممت وبنيت فعلًا." : "What I designed and built."}
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-[1.65] text-text-secondary">
            <p>
              {ar
                ? "قيادة المنتج والمنصة: تحويل احتياجات التوزيع الدوائي إلى 9 خدمات بحدود واضحة، تصميم العقود المشتركة، اختيار Redpanda للأحداث وNeon لقواعد البيانات المنفصلة، وتوجيه تجربة الـ dashboard."
                : "Product & platform lead: translating pharma distribution needs into 9 bounded services, designing shared contracts, choosing Redpanda for events and Neon for per-service DBs, and directing the dashboard experience."}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border-subtle bg-surface-1 p-4">
                <p className="font-mono text-[12px] uppercase text-accent">{ar ? "قرار" : "Decision"}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">{ar ? "Saga بدل 2PC" : "Saga over 2PC"}</p>
                <p className="mt-1 font-mono text-[12px] text-text-ghost">{ar ? "تجنب قفل موزع" : "Avoid distributed lock"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-1 p-4">
                <p className="font-mono text-[12px] uppercase text-accent">{ar ? "قرار" : "Decision"}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">FEFO + تحفيز</p>
                <p className="mt-1 font-mono text-[12px] text-text-ghost">{ar ? "صلاحية = منطق عمل" : "Expiry = business logic"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-1 p-4">
                <p className="font-mono text-[12px] uppercase text-accent">{ar ? "قرار" : "Decision"}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">Audit أولًا</p>
                <p className="mt-1 font-mono text-[12px] text-text-ghost">{ar ? "كل حدث مسجل" : "Every event logged"}</p>
              </div>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-ghost">{ar ? "الحالة والاختبارات" : "Status & tests"}</p>
              <p className="mt-2 text-sm text-text-primary">
                {ar ? "حي قيد التطوير — الشاشات في جولة المنصة من النظام وهو يعمل ببيانات تجريبية، والترحيلات لكل خدمة عبر Prisma." : "Live in development — the product tour shows the running system on demo data, migrations per service via Prisma."}
              </p>
              <p className="mt-2 font-mono text-[12px] leading-5 text-text-ghost">
                {ar ? "بدون ادعاء أرقام مستخدمين أو إيرادات وهمية. ما هو موثق هنا هو المنفذ فقط." : "No invented user/revenue numbers. Documented here is what is actually shipped."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide pb-8 md:pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-400/[0.10] via-surface-1 to-teal-400/[0.05] p-4 md:p-5">
          <div aria-hidden="true" className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-orange-400/[0.10] blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">END OF FILE / 001 — ENTERPRISE SHOWCASE</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
                {ar ? "من سير العمل إلى النظام — بشكل مرئي." : "From workflows to systems — visibly."}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-[1.65] text-text-secondary">
                {ar ? "الزائر يرى حجم النظام وترابطه قبل قراءة التقنيات." : "Visitor grasps scale and connectivity before reading the stack."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={contactHref({ service: "digital-product", source: "/case-studies/nile-pharma-erp" })}
                className="rounded-full bg-orange-400 px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5"
              >
                {ar ? "ناقش نظامًا مشابهًا" : "Discuss a similar system"} {ar ? "←" : "→"}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-text-ghost">
          <Link href="/work" className="hover:text-text-primary">
            {ar ? "→ العودة إلى الأعمال" : "← Back to work"}
          </Link>
          <span>Mustafa Aboalazm / 2026 · Enterprise Ledger</span>
        </div>
      </section>
    </div>
  );
}
