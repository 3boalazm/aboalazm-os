"use client";

import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";

/* ——— Real showcase data ——— */
const kpi = {
  totalSales: "475,950.84 ج.م",
  orders: 9,
  pending: 3,
  lowStock: 3,
};

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
            ← {ar ? "كل الأعمال" : "All work"}
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
            <h1 className="max-w-[14ch] break-words font-display text-[clamp(2rem,8vw,5.2rem)] leading-[0.92] tracking-[-0.06em] text-text-primary">
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
              <a href="/showcase/nile-erp/index.html" className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">
                {ar ? "افتح العرض التفاعلي" : "Open live showcase"} ↗
              </a>
            </div>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.10em] text-text-ghost">
              {ar ? "عرض توضيحي ببيانات تجريبية، وليس وصولًا إلى بيانات الشركة." : "Interactive demonstration with seeded sample data, not access to company records."}
            </p>
          </div>

          {/* Hero visual — real system snapshot, not illustration */}
          <div className="rounded-2xl border border-border-subtle bg-surface-1 p-2 shadow-card">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-ghost">Nile Pharma ERP / LIVE SHOWCASE</span>
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <Image
                src="/images/work/dev-cards/nile-erp-card.jpg"
                alt={ar ? "لقطة حقيقية من لوحة تحكم Nile Pharma ERP" : "Real screenshot from Nile Pharma ERP dashboard"}
                width={1280}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-2 px-2 pb-2 pt-3">
              <div className="rounded-lg bg-surface-2 p-3">
                <p className="font-mono text-[12px] uppercase text-text-tertiary">{ar ? "إجمالي المبيعات" : "Total sales"}</p>
                <p className="mt-1 font-display text-sm font-semibold text-text-primary">{kpi.totalSales}</p>
              </div>
              <div className="rounded-lg bg-surface-2 p-3">
                <p className="font-mono text-[12px] uppercase text-text-tertiary">{ar ? "أوامر / معلقة" : "Orders / pending"}</p>
                <p className="mt-1 font-display text-sm font-semibold text-text-primary">
                  {kpi.orders} / <span className="text-warning-text [html[data-theme=light]_&]:text-amber-800">{kpi.pending}</span>
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 text-amber-900 p-3 ring-1 ring-amber-200">
                <p className="font-mono text-[12px] uppercase text-amber-700">{ar ? "تنبيه نقص" : "Low stock"}</p>
                <p className="mt-1 font-display text-sm font-semibold text-amber-900">{kpi.lowStock} أصناف</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
          <span>{ar ? "الدور: قيادة المنتج والمنصة" : "Role: Product & Platform Lead"} · 2025—2026</span>
          <span className="text-text-ghost">{ar ? "اللقطة من العرض التوضيحي" : "Screenshot from the interactive demonstration"}</span>
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
                    <div key={name} className="flex gap-3 border-b border-zinc-100 py-3 last:border-0">
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
      <section className="container-wide py-6 md:py-8">
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
                  {ar ? "افتح بالحجم الكامل" : "Open full size"} ↗
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

      {/* ═══ 04 / SERVICE SNAPSHOTS — what each service tracks (illustrative cards from the demo data) ═══ */}
      <section className="container-wide py-6 md:py-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">04 / {ar ? "لقطات الخدمات" : "Service snapshots"}</p>
        <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
          {ar ? "خلف الشاشات — ماذا تتتبع كل خدمة." : "Behind the screens — what each service tracks."}
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* 01 Sales */}
          <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
            <div className="bg-[#0B1220] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">SALES · أوامر البيع</span>
                <span className="rounded-full bg-[#14B8A6]/20 px-2 py-1 font-mono text-[12px] text-[#5EEAD4]">9 أوامر</span>
              </div>
              <div className="mt-3 rounded-lg bg-white/5 p-2">
                <div className="grid grid-cols-4 gap-2 font-mono text-[12px] text-white/50">
                  <span>SO-1001</span>
                  <span>العزبي - المعادي</span>
                  <span>19,360 ج.م</span>
                  <span className="text-emerald-400">PAID</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 font-mono text-[12px] text-white/50">
                  <span>SO-1008</span>
                  <span>أبو اليزيد - سموحة</span>
                  <span>9,680 ج.م</span>
                  <span className="text-white/60">CANCELLED</span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-[#14B8A6]" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-text-primary">{ar ? "المبيعات والطلبات" : "Sales & Orders"}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                {ar ? "عرض حالات الطلب التسع: مسودة، بانتظار الموافقة، معتمد، محجوز، مفوتر، محصل، ملغي وفشل تخصيص. القرار: لا يُنشأ مخزون وهمي عند الفشل." : "Nine order states from DRAFT to PAID/CANCELLED and ALLOCATION_FAILED. Decision: no phantom stock on failure."}
              </p>
            </div>
          </article>

          {/* 02 Inventory */}
          <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
            <div className="bg-[#0B1220] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">INVENTORY · المخزون</span>
                <span className="rounded-full bg-amber-500/20 px-2 py-1 font-mono text-[12px] text-amber-300">3 تنبيه نقص</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="font-mono text-[12px] text-text-tertiary">WH-CAI · مخزن القاهرة</p>
                  <div className="mt-2 flex justify-between font-mono text-xs">
                    <span>BRX-PLUS-30</span>
                    <span className="text-success-text">3200 / 500</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-zinc-100">
                    <div className="h-full w-[92%] rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 text-amber-900 p-2 ring-1 ring-amber-200">
                  <div className="flex justify-between font-mono text-xs">
                    <span>NLV-COLD-10</span>
                    <span className="text-amber-700">60 / 100</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-amber-100">
                    <div className="h-full w-[35%] rounded-full bg-amber-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-text-primary">{ar ? "المخزون وحركاته" : "Inventory & Movements"}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                {ar ? "مخزنان (القاهرة/الإسكندرية) مع FEFO حسب تاريخ الانتهاء وتتبع التشغيلات. القرار: الصرف بأقدم انتهاء أولًا." : "Two warehouses with FEFO expiry, batch trace. Decision: oldest expiry out first."}
              </p>
            </div>
          </article>

          {/* 03 Products */}
          <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
            <div className="bg-[#0B1220] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">PRODUCTS · الأصناف</span>
                <span className="font-mono text-[12px] text-white/60">8 أصناف</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="font-mono text-[12px] text-success-text">● ok</p>
                  <p className="mt-1 text-xs font-semibold">بروكسيد بلس 30</p>
                  <p className="font-mono text-[12px] text-text-tertiary">849.12 ج.م</p>
                </div>
                <div className="rounded-lg bg-amber-50 text-amber-900 p-2 ring-1 ring-amber-200">
                  <p className="font-mono text-[12px] text-amber-800">● low</p>
                  <p className="mt-1 text-xs font-semibold">بروكس ايريكس</p>
                  <p className="font-mono text-[12px] text-text-tertiary">410 / 500</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-text-primary">{ar ? "المنتجات" : "Products & Batches"}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                {ar ? "8 أصناف بأكواد BRX وNLV، كل صنف له حد أدنى وسعر. القرار: عدم عرض سعر وهمي عند عدم توفر المتغير." : "8 SKUs with min-stock and live price. Decision: omit unavailable prices instead of inventing."}
              </p>
            </div>
          </article>

          {/* 04 CRM */}
          <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
            <div className="bg-[#0B1220] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">CRM · العملاء</span>
                <span className="font-mono text-[12px] text-white/60">8 حسابات</span>
              </div>
              <div className="mt-3 rounded-lg bg-surface-1 p-2 font-mono text-[13px] leading-[1.65]">
                <div className="flex justify-between">
                  <span>PH-0001 · صيدلية العزبي</span>
                  <span className="text-text-tertiary">4,200</span>
                </div>
                <div className="flex justify-between text-text-tertiary">
                  <span>DR-0001 · د. محمود</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span>HOSP-0001 · مستشفى دلتا</span>
                  <span className="text-warning-text [html[data-theme=light]_&]:text-amber-800">15,400</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-text-primary">{ar ? "العملاء (CRM)" : "CRM / Accounts"}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                {ar ? "صيدليات، أطباء، مراكز ومستشفيات وموزع — كل عميل مرتبط بمندوب ورصيد. القرار: وضوح المسؤولية الإقليمية." : "Pharmacies, doctors, centers, hospitals, distributors — each tied to a rep and balance."}
              </p>
            </div>
          </article>

          {/* 05 Accounting */}
          <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
            <div className="bg-[#0B1220] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">ACCOUNTING · الحسابات</span>
                <span className="rounded-full bg-white/10 px-2 py-1 font-mono text-[12px] text-white">INV-2001</span>
              </div>
              <div className="mt-3 rounded-lg bg-surface-1 p-2">
                <div className="flex justify-between font-mono text-xs">
                  <span>INV-2001 · العزبي</span>
                  <span className="text-success-text">مدفوعة بالكامل</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-text-tertiary">
                  <span>INV-2002 · الشفاء</span>
                  <span className="text-warning-text [html[data-theme=light]_&]:text-amber-800">مدفوعة جزئيًا 9,000/18,641</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-text-primary">{ar ? "الحسابات" : "Accounting & Ledger"}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                {ar ? "فواتير ومدفوعات ودفتر أستاذ. الفاتورة لا تُعتبر محصلة حتى يتأكد التحصيل." : "Invoices, payments and ledger. Invoiced ≠ collected until payment confirmed."}
              </p>
            </div>
          </article>

          {/* 06 Incentives & Audit */}
          <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
            <div className="bg-[#0B1220] p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">INCENTIVES · AUDIT</span>
                <span className="font-mono text-[12px] text-emerald-400">AUDIT ↓</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-surface-1 p-2">
                  <p className="font-mono text-[12px] text-text-tertiary">SO-1001 → 258.09</p>
                  <p className="font-mono text-[12px] text-success-text">مدفوع</p>
                </div>
                <div className="rounded-lg bg-white/10 p-2">
                  <p className="font-mono text-[12px] text-white">sales.order.created 09:12</p>
                  <p className="font-mono text-[12px] text-white/60">inventory.reserved</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-text-primary">{ar ? "الحوافز وسجل التتبع" : "Incentives & Audit Trail"}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-text-secondary">
                {ar ? "حساب عمولة تلقائي وسجل أحداث موحد. كل خطوة لها طابع زمني ومرجع." : "Auto-commission and unified audit. Every step timestamped and referenced."}
              </p>
            </div>
          </article>
        </div>
        <p className="mt-6 text-center font-mono text-[12px] uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "لقطات توضيحية مبنية على بيانات العرض الحقيقي public/showcase/nile-erp — ليست صور AI عامة." : "Illustrative cards built from real showcase data public/showcase/nile-erp — not generic AI images."}
        </p>
      </section>

      {/* ═══ 05 / OPERATIONAL FLOW — one integrated scenario ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-7">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">05 / {ar ? "التدفق التشغيلي" : "Operational flow"}</p>
          <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
            {ar ? "من الطلب إلى المخزون والمحاسبة — سيناريو واحد حقيقي." : "From order to inventory and accounting — one real scenario."}
          </h2>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle bg-surface-1">
            <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
              {/* Step 1 */}
              <div className="p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent">01 · Sales</p>
                <p className="mt-2 font-display text-base font-semibold text-text-primary">SO-1001</p>
                <p className="mt-1 text-xs leading-[1.65] text-text-secondary">{ar ? "صيدلية العزبي - المعادي · 19,360 ج.م · أحمد فتحي" : "El Ezaby - Maadi · 19,360 EGP · Ahmed Fathy"}</p>
                <p className="mt-3 rounded-lg bg-emerald-50 px-2 py-1 font-mono text-[12px] text-emerald-700">APPROVED → ALLOCATING</p>
              </div>
              <div className="hidden items-center px-2 text-accent md:flex">→</div>
              {/* Step 2 */}
              <div className="border-t border-zinc-100 p-4 md:border-l md:border-t-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent">02 · Inventory</p>
                <p className="mt-2 font-display text-base font-semibold text-text-primary">WH-CAI</p>
                <p className="mt-1 text-xs leading-[1.65] text-text-secondary">{ar ? "حجز  LOT-2025-A · تأكيد الحجز" : "Reserve LOT-2025-A · confirmed"}</p>
                <p className="mt-3 rounded-lg bg-[#0B1220] px-2 py-1 font-mono text-[12px] text-emerald-400">inventory.reservation.confirmed 09:12</p>
              </div>
              <div className="hidden items-center px-2 text-accent md:flex">→</div>
              {/* Step 3 */}
              <div className="border-t border-zinc-100 p-4 md:border-l md:border-t-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent">03 · Accounting</p>
                <p className="mt-2 font-display text-base font-semibold text-text-primary">INV-2001</p>
                <p className="mt-1 text-xs leading-[1.65] text-text-secondary">{ar ? "فاتورة 19,360 · مدفوعة بالكامل 14:30" : "Invoice 19,360 · fully paid 14:30"}</p>
                <p className="mt-3 rounded-lg bg-surface-2 px-2 py-1 font-mono text-[12px] text-text-secondary">accounting.invoice.issued</p>
              </div>
              <div className="hidden items-center px-2 text-accent md:flex">→</div>
              {/* Step 4 */}
              <div className="border-t border-zinc-100 p-4 md:border-l md:border-t-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-accent">04 · Incentives + Audit</p>
                <p className="mt-2 font-display text-base font-semibold text-text-primary">ilg-001</p>
                <p className="mt-1 text-xs leading-[1.65] text-text-secondary">{ar ? "عمولة 258.09 · سجل التتبع 14:30" : "Commission 258.09 · audit 14:30"}</p>
                <p className="mt-3 rounded-lg bg-emerald-50 px-2 py-1 font-mono text-[12px] text-emerald-700">incentives.ledger.calculated</p>
              </div>
            </div>
            <div className="border-t border-border-subtle bg-amber-50 text-amber-900/60 px-4 py-3">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-700">{ar ? "سيناريو فشل موثق أيضًا" : "Documented failure path also"}</p>
              <p className="mt-1 text-xs leading-[1.65] text-amber-900/80">
                {ar ? "SO-1007 مستشفى دلتا: فشل التخصيص ALLOCATION_FAILED — النظام لا يخترع مخزونًا ولا يولد فاتورة وهمية." : "SO-1007 Delta Hospital: ALLOCATION_FAILED — system does not invent stock nor issue a phantom invoice."}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border-subtle bg-surface-1 p-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-text-ghost">{ar ? "قيود مثبتة فقط" : "Only proven integrations"}</p>
            <p className="mt-2 text-xs leading-[1.65] text-text-secondary">
              {ar
                ? "السيناريو يعرض ما ينفذه النظام فعلًا عبر الأحداث. لا ندعي تكامل دفع خارجي أو شحن لم يُنفذ."
                : "Scenario shows what the system actually executes via events. No claim of external payment/shipment integrations not implemented."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 06 / ENGINEERING — clear architecture, implemented vs planned ═══ */}
      <section className="container-wide py-6 md:py-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">06 / {ar ? "الهندسة" : "Engineering"}</p>
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
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="font-mono text-[12px] uppercase text-emerald-700">✓ تم</p>
                  <p className="mt-1 text-xs text-text-secondary">9 خدمات، عقود، أحداث، ترحيلات، showcased data</p>
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

      {/* ═══ 07 / CONTRIBUTION ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">07 / {ar ? "دوري ومساهمتي" : "Contribution"}</p>
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
                {ar ? "حي قيد التطوير — العرض التفاعلي يعمل ببيانات البذور الحقيقية، والترحيلات لكل خدمة عبر Prisma." : "Live in development — showcase runs on real seed data, migrations per service via Prisma."}
              </p>
              <p className="mt-2 font-mono text-[12px] leading-5 text-text-ghost">
                {ar ? "بدون ادعاء أرقام مستخدمين أو إيرادات وهمية. ما هو موثق هنا هو المنفذ فقط." : "No invented user/revenue numbers. Documented here is what is actually shipped."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide pb-8 md:pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-400/[0.10] via-white to-teal-400/[0.05] p-4 md:p-5">
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
              <a href="/showcase/nile-erp/index.html" className="rounded-full bg-orange-400 px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5">
                {ar ? "استكشاف العرض الحي" : "Explore live showcase"} ↗
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-text-ghost">
          <Link href="/work" className="hover:text-text-primary">
            ← {ar ? "العودة إلى الأعمال" : "Back to work"}
          </Link>
          <span>Mustafa Aboalazm / 2026 · Enterprise Ledger</span>
        </div>
      </section>
    </div>
  );
}
