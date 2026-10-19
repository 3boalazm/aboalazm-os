"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";

const services = [
  ["01", "IAM", "Identity, access & permissions", "الهوية والصلاحيات والتحكم في الوصول"],
  ["02", "Organization", "Organization & master data", "الهيكل التنظيمي والبيانات الرئيسية"],
  ["03", "Products", "Pharmaceutical products & batches", "المنتجات الدوائية والتشغيلات"],
  ["04", "Inventory", "Stock, FEFO & consignment", "المخزون وFEFO والكونساينمنت"],
  ["05", "CRM", "Accounts, visits & leads", "الحسابات والزيارات والعملاء المحتملون"],
  ["06", "Sales", "Orders, pricing & orchestration", "الطلبات والتسعير وتنسيق العمليات"],
  ["07", "Accounting", "Invoices, payments & ledger", "الفواتير والمدفوعات ودفتر الأستاذ"],
  ["08", "Incentives", "Incentive engine & ledger", "محرك الحوافز وسجلها"],
  ["09", "Audit", "Unified business-event audit trail", "سجل موحد لأحداث الأعمال والتدقيق"],
] as const;

const stack = ["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL / Neon", "Redpanda / Kafka", "Turborepo", "Docker Compose"];

export function NilePharmaERPCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <main className="overflow-hidden">
      <section className="container-wide relative flex min-h-[78svh] flex-col justify-between gap-16 py-12 md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-orange-500/[0.09] blur-[100px]" />
          <div className="absolute -left-24 top-56 h-72 w-72 rounded-full bg-teal-400/[0.07] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">← {ar ? "كل الأعمال" : "All work"}</Link>
          <span>{ar ? "ملف هندسي / 001" : "Engineering case file / 001"}</span>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-orange-400/30 bg-orange-400/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-orange-300">
                {ar ? "منظومة مؤسسية" : "Enterprise system"}
              </span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
                {ar ? "قيد التطوير والتحسين" : "Active engineering"}
              </span>
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-300/80">NILE PHARMA FOOD / DIGITAL OPERATIONS</p>
            <h1 className="max-w-5xl font-display text-[clamp(3.4rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.065em] text-text-primary">
              Nile Pharma <span className="text-text-tertiary">ERP</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar
                ? "منظومة تشغيل مترابطة لتوزيع المنتجات الدوائية — من إدارة المخزون والطلبات إلى المحاسبة والتدقيق."
                : "An interconnected operating system for pharmaceutical distribution — from inventory and orders to accounting and audit."}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-5 backdrop-blur-xl md:p-6">
            <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? "نظرة على النظام" : "System snapshot"}</span>
              <span className="text-orange-300">NPF / ERP</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl tracking-tight text-text-primary">09</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "خدمات خلفية" : "Backend services"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl tracking-tight text-text-primary">01</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "طبقة عقود مشتركة" : "Shared contracts layer"}</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "النمط المعماري" : "Architecture pattern"}</p>
                <p className="mt-2 text-sm text-text-primary">Domain services <span className="text-orange-300">→</span> Events <span className="text-orange-300">→</span> Audit trail</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-text-tertiary">
              {ar ? "النطاقات والأعداد مستندة إلى بنية المستودع؛ لا تمثل ادعاءً بمؤشرات أداء تجارية." : "Scope and counts reflect the repository architecture, not claimed business-performance metrics."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? "الدور: قيادة المنتج والمنصة" : "Role: Product & Platform Lead"}</span>
            <span>{ar ? "المجال: توزيع دوائي" : "Domain: Pharma distribution"}</span>
            <span>2025—2026</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/3boalazm/nile-pharma-erp" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm text-text-primary transition-colors hover:border-orange-400/60 hover:bg-orange-400/[0.06]">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href="/showcase/nile-erp/index.html" className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">
              {ar ? "استكشف العرض" : "Explore showcase"} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-[0.55fr_1fr] md:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">01 / {ar ? "السياق" : "Context"}</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "العمليات لا تعيش في جداول منفصلة." : "Operations don't live in isolated tables."}
            </h2>
          </div>
          <div className="max-w-3xl space-y-5 text-base leading-8 text-text-secondary">
            <p>{ar
              ? "توزيع المنتجات الدوائية يجمع بيانات المنتجات والتشغيلات والمخزون والعملاء والطلبات والفواتير والتحصيل والحوافز. تصميم النظام يحتاج إلى ضبط العلاقات بين هذه النطاقات، وليس مجرد جمعها في لوحة تحكم واحدة."
              : "Pharmaceutical distribution connects product and batch records, stock, customers, orders, invoices, collections and incentives. The challenge is to govern the relationships between these domains—not simply place them in one dashboard."}</p>
            <p>{ar
              ? "لذلك بُني المشروع كمجموعة خدمات متخصصة بعقود مشتركة وتكامل قائم على الأحداث، مع فصل واجهة الويب عن منطق الأعمال وقواعد البيانات."
              : "The system is organized as specialized services with shared contracts and event-driven integration, while keeping the web interface separate from business logic and data stores."}</p>
            <div className="rounded-xl border-s-2 border-orange-400 bg-orange-400/[0.04] p-5">
              <p className="text-sm leading-7 text-text-primary">{ar
                ? "المبدأ: كل عملية تجارية مهمة يجب أن تترك حالة واضحة، وأثرًا يمكن تتبعه، وحدودًا صريحة للصلاحيات."
                : "Design principle: important business operations should leave an explicit state, a traceable record, and clear permission boundaries."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">02 / {ar ? "خريطة الخدمات" : "Service map"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "تسعة نطاقات. مسؤوليات واضحة." : "Nine domains. Clear responsibilities."}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-text-tertiary">{ar
            ? "كل خدمة خلفية لها نطاق وظيفي مستقل، وتتشارك العقود والأحداث بدل ربط كل شيء داخل تطبيق واحد."
            : "Each backend service owns a distinct responsibility, sharing contracts and events instead of coupling every workflow inside one application."}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([number, name, description, descriptionAr]) => (
            <article key={name} className="group rounded-xl border border-border-subtle bg-surface-1/35 p-5 transition-colors hover:border-orange-400/40 hover:bg-surface-1/75">
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{number}</span>
                <span className="h-2 w-2 rounded-full bg-orange-400/70 transition-shadow group-hover:shadow-[0_0_18px_rgba(251,146,60,0.6)]" />
              </div>
              <h3 className="font-display text-2xl text-text-primary">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{ar ? descriptionAr : description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-16 md:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">03 / {ar ? "كيف تتصل الأجزاء" : "How the system connects"}</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "واجهة واحدة. خدمات متخصصة. تدفق يمكن تتبعه." : "One interface. Specialized services. Traceable flow."}</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-text-secondary">{ar
                ? "واجهة Next.js تتعامل مع مسارات API من نفس النطاق، ثم يوجّهها الخادم إلى خدمات NestJS. قاعدة البيانات موزعة حسب الخدمة، وRedpanda يوفر قناة الأحداث الداخلية."
                : "The Next.js web app uses same-origin API routes, which forward requests to NestJS services. Data is separated by service, while Redpanda carries internal events."}</p>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-background/70 p-4 md:p-6">
              <div className="mx-auto max-w-sm rounded-xl border border-orange-400/40 bg-orange-400/[0.07] p-4 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-orange-300">Presentation</p>
                <p className="mt-1 font-medium text-text-primary">Next.js Web Dashboard</p>
                <p className="mt-1 text-xs text-text-tertiary">Same-origin /api/* routes</p>
              </div>
              <div className="py-3 text-center font-mono text-xl text-orange-300">↓</div>
              <div className="grid grid-cols-3 gap-2">
                {["IAM", "Organization", "Products", "Inventory", "CRM", "Sales", "Accounting", "Incentives", "Audit"].map((name) => (
                  <div key={name} className="flex min-h-14 items-center justify-center rounded-lg border border-border-subtle bg-surface-1 px-2 py-3 text-center text-xs text-text-secondary">{name}</div>
                ))}
              </div>
              <div className="py-3 text-center font-mono text-xl text-orange-300">↕</div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-border-subtle p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">Event backbone</p>
                  <p className="mt-1 text-sm text-text-primary">Redpanda / Kafka-compatible events</p>
                </div>
                <div className="rounded-lg border border-border-subtle p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">Data layer</p>
                  <p className="mt-1 text-sm text-text-primary">Neon PostgreSQL · per-service databases</p>
                </div>
              </div>
              <p className="mt-4 text-[10px] leading-5 text-text-tertiary">{ar ? "مخطط مفاهيمي مبسط، وليس مخطط نشر كاملًا." : "Simplified conceptual diagram, not a complete deployment diagram."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">04 / {ar ? "قرارات هندسية" : "Engineering decisions"}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "التفاصيل التي تمنع الفوضى." : "The details that prevent chaos."}</h2>
          </div>
          <div className="divide-y divide-border-subtle border-y border-border-subtle">
            {[
              [ar ? "العقود المشتركة" : "Shared contracts", ar ? "حزمة @nile/contracts توحّد DTOs وأنواع الأحداث بين الخدمات، ويُولّد جزء الأحداث من AsyncAPI." : "The @nile/contracts package shares DTOs and event types across services; event types are generated from AsyncAPI."],
              [ar ? "تنسيق العمليات" : "Workflow orchestration", ar ? "عمليات البيع تستخدم نمط Saga لتنسيق الخطوات عبر الخدمات، بدل افتراض أن الطلب والمخزون والمحاسبة عملية واحدة ذرية." : "Sales workflows use a Saga orchestrator to coordinate steps across services rather than treating order, stock and accounting as one atomic operation."],
              [ar ? "انضباط المخزون" : "Inventory discipline", ar ? "منطق FEFO والتشغيلات والتتبع والـ consignment يجعل صلاحية المنتج ومصدر المخزون جزءًا من قواعد العمل." : "FEFO, batch traceability and consignment make expiry and stock ownership part of the business rules."],
              [ar ? "موثوقية الأحداث" : "Event reliability", ar ? "طبقة الأحداث تتعامل مع idempotency وDead Letter Queue، ويجمع Audit Aggregator الأحداث في سجل موحد." : "The event layer accounts for idempotency and a dead-letter queue; the audit aggregator consolidates business events into a unified trail."],
              [ar ? "نشر آمن" : "Controlled deployment", ar ? "في الإنتاج، تنفذ مهمة ترحيل واحدة migrations للخدمات التسع قبل تشغيلها، مع قواعد بيانات Neon منفصلة وعدم نشر وسيط الأحداث للعامة." : "In production, one migration job applies service migrations before the backends start; services use separate Neon databases and the event broker is not publicly exposed."],
            ].map(([title, body]) => (
              <div key={title} className="grid gap-2 py-5 sm:grid-cols-[190px_1fr] sm:gap-6">
                <h3 className="text-sm font-medium text-text-primary">{title}</h3>
                <p className="text-sm leading-7 text-text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-[0.55fr_1fr] md:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">05 / {ar ? "مجموعة التقنيات" : "Technology stack"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">{ar ? "الأدوات تخدم المعمارية." : "Tools in service of the architecture."}</h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => <span key={item} className="rounded-full border border-border-subtle bg-background/60 px-3 py-2 font-mono text-xs text-text-secondary">{item}</span>)}
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-text-secondary">{ar
              ? "المستودع Monorepo باستخدام pnpm وTurborepo. لكل خدمة Dockerfile ومخطط Prisma خاص بها، وتُستخدم اختبارات ومراجعات للمسارات والصلاحيات والترحيلات."
              : "The repository is a pnpm/Turborepo monorepo. Services have their own Dockerfiles and Prisma schemas, with checks around routes, permissions and database migrations."}</p>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">06 / {ar ? "الدور وحدود الحالة" : "Role & project status"}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "المنتج الحقيقي أهم من الادعاءات الكبيرة." : "Evidence over inflated claims."}</h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-text-secondary">
            <p>{ar
              ? "يشمل العمل قيادة المنتج والمنصة، وتوجيه التجربة الرقمية، والمشاركة في تصميم وتنفيذ البنية البرمجية والتنسيق بين احتياجات التشغيل والقرارات التقنية."
              : "The work spans product and platform leadership, digital-experience direction, software architecture and implementation, and translating operational needs into technical decisions."}</p>
            <p>{ar
              ? "هذه الصفحة تصف البنية والخصائص الظاهرة في المصدر. لا تعرض أرقامًا مختلقة عن المستخدمين أو الإيرادات أو توفير الوقت، ولا تدّعي أن كل مسار موثق هنا خضع لاعتماد إنتاجي نهائي."
              : "This page describes architecture and capabilities visible in source. It does not invent user, revenue or time-saved metrics, or claim every documented workflow has completed final production sign-off."}</p>
            <div className="rounded-xl border border-border-subtle p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">{ar ? "الحالة" : "Status"}</p>
              <p className="mt-2 text-text-primary">{ar ? "مشروع حي قيد التطوير والتحقق المستمر" : "Live project · ongoing development and verification"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-400/[0.10] via-surface-1/70 to-teal-400/[0.05] p-6 md:p-10">
          <div aria-hidden="true" className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-orange-400/[0.12] blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">END OF FILE / 001</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "من سير العمل إلى النظام." : "From workflows to systems."}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-text-secondary">{ar
                ? "افتح مستودع المصدر لقراءة التنفيذ، أو انتقل إلى العرض لاستكشاف واجهة المنتج."
                : "Open the source repository to inspect implementation, or explore the product showcase."}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/3boalazm/nile-pharma-erp" target="_blank" rel="noreferrer" className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary transition-colors hover:border-orange-400/60">Source repository ↗</a>
              <a href="/showcase/nile-erp/index.html" className="rounded-full bg-orange-400 px-5 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">{ar ? "عرض المنتج" : "Product showcase"} ↗</a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-text-ghost">
          <Link href="/work" className="hover:text-text-primary">← {ar ? "العودة إلى الأعمال" : "Back to work"}</Link>
          <span>Mustafa Aboalazm / 2026</span>
        </div>
      </section>
    </main>
  );
}
