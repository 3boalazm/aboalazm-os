"use client";

import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";

const layers = [
  { no: "01", name: "Storefront", tech: "Next.js 16 · React 19", detail: "Arabic RTL + English LTR shopping experience", detailAr: "تجربة تسوق عربية RTL وإنجليزية LTR" },
  { no: "02", name: "Content CMS", tech: "Payload CMS 3 · PostgreSQL", detail: "Product copy, categories, media and customer inquiries", detailAr: "محتوى المنتجات والتصنيفات والوسائط واستفسارات العملاء" },
  { no: "03", name: "Commerce engine", tech: "Vendure 3 · Shop API", detail: "Live variants, pricing, orders, accounts and checkout", detailAr: "المتغيرات والأسعار والطلبات والحسابات وإتمام الشراء" },
  { no: "04", name: "Operations", tech: "PostgreSQL · Worker · Serwist", detail: "Persistent jobs, offline fallback, validation and recovery", detailAr: "مهام مستمرة، وتجربة دون اتصال، والتحقق والاستعادة" },
] as const;

const capabilities = [
  ["01", "Content and commerce are separate", "Payload owns the editorial product catalogue; Vendure owns transactional truth. Product pages resolve content by slug and request live SKU/price data from commerce.", "فصل المحتوى عن التجارة", "Payload مسؤول عن محتوى الكتالوج، بينما Vendure هو مصدر الحقيقة للمعاملات. صفحة المنتج تربط المحتوى بالـslug وتطلب الـSKU والسعر الحي من محرك التجارة."],
  ["02", "Never invent a live price", "Unavailable or zero-priced variants are not presented as valid offers. Demo catalogue fallback is explicit, labeled and transaction-blocked; production does not silently substitute mock prices.", "بلا أسعار وهمية", "المتغيرات التي لا يتوفر لها سعر صالح لا تظهر كعرض شراء حقيقي. وضع العرض التجريبي معلن وموسوم ويمنع المعاملات؛ الإنتاج لا يستبدل الأسعار الحية بأسعار وهمية في صمت."],
  ["03", "Commerce stays server-side", "The browser does not call Vendure directly. Server Actions mediate cart, checkout, authentication and wishlist operations, keeping the commerce boundary inside the Next application.", "عمليات التجارة من جهة الخادم", "المتصفح لا يتصل بـVendure مباشرة. Server Actions تتولى السلة والدفع وتسجيل الدخول والمفضلة، وتحافظ على حدود التجارة داخل تطبيق Next."],
  ["04", "Arabic is a first-class interface", "Locale-prefixed /ar and /en routes, locale-aware metadata and copy parity, logical CSS properties, directional asset handling and a dedicated Arabic display face.", "العربية جزء من النظام", "مسارات /ar و/en، وبيانات SEO حسب اللغة، وتكافؤ القواميس، وخصائص CSS منطقية، ومعالجة اتجاه الأصول وخط عرض عربي مخصص."],
  ["05", "Commerce flows, not just screens", "Cart, checkout, confirmation, customer accounts, addresses, order history, password recovery, email verification, wishlist and manually reconciled transfers are represented in the app.", "تدفقات شراء فعلية", "السلة والدفع والتأكيد وحساب العميل والعناوين وسجل الطلبات واستعادة كلمة السر وتأكيد البريد والمفضلة وتحويلات تُراجع يدويًا."],
  ["06", "Recover gracefully when data is down", "CMS reads can degrade to an explicit unavailable state without taking down the whole page. Missing live prices are omitted, not replaced with invented inventory or pricing.", "تدهور واضح بدل انهيار الصفحة", "يظهر تعطّل قراءة CMS كحالة «غير متاح» واضحة دون إسقاط الصفحة كلها. وتُحذف الأسعار غير المتاحة بدل اختراع سعر أو مخزون."],
  ["07", "Operations are part of the product", "Validated environment configuration, a separate Vendure worker for queues, backup/restore tooling, security headers, rate limits, health checks and automated regression suites.", "التشغيل جزء من المنتج", "التحقق من الإعدادات، وWorker منفصل لطوابير Vendure، وأدوات النسخ والاستعادة، وترويسات الأمان، وحدود معدّل الطلبات، وفحص الصحة، واختبارات الانحدار."],
] as const;

const routes = [
  ["Discovery", "Home · Product atlas · Categories", "الاكتشاف", "الرئيسية · استكشاف المنتجات · التصنيفات"],
  ["Product", "Product dossier · Leaflet PDF · Availability", "المنتج", "ملف المنتج · النشرة PDF · التوفر"],
  ["Purchase", "Cart · Checkout · Confirmation", "الشراء", "السلة · إتمام الطلب · التأكيد"],
  ["Account", "Login · Registration · Orders · Addresses", "الحساب", "تسجيل الدخول · إنشاء حساب · الطلبات · العناوين"],
  ["Trust", "Quality sourcing · About · Contact · Policies", "الثقة", "الجودة والمصادر · من نحن · التواصل · السياسات"],
] as const;

const stack = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Payload CMS 3", "Vendure 3", "PostgreSQL", "Serwist PWA", "Vitest", "Playwright", "axe-core"];

export function NilePharmaStorefrontCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="overflow-hidden">
      <section className="container-wide relative flex min-h-[68svh] flex-col justify-between gap-7 py-5 md:py-7">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-orange-500/[0.10] blur-[100px]" />
          <div className="absolute -left-20 top-56 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>
        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">← {ar ? "كل الأعمال" : "All work"}</Link>
          <span>{ar ? "ملف منتج / 003" : "Product case file / 003"}</span>
        </div>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-400/30 bg-orange-400/[0.08] px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">{ar ? "منصة تجارة إلكترونية" : "Commerce platform"}</span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "عربي / إنجليزي" : "Arabic / English"}</span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "تطوير نشط · بوابات إصدار مفتوحة" : "Active build · release gates remain"}</span>
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-300/80">NILE PHARMA FOOD / NPF STOREFRONT</p>
            <h1 className="max-w-5xl font-display text-[clamp(3.3rem,9vw,8.3rem)] leading-[0.86] tracking-[-0.07em] text-text-primary">
              NPF <span className="text-text-tertiary">Storefront</span><span className="text-orange-300">.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar ? "تجربة تجارة رقمية ثنائية اللغة لمنتجات Nile Pharma Food، مبنية على فصل المحتوى عن التجارة، وربط واجهة المنتج بالسعر الحي ومسارات الشراء الفعلية." : "A bilingual commerce experience for Nile Pharma Food, built around a clear separation between content and commerce, live product pricing and real purchase flows."}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-4 backdrop-blur-xl md:p-4">
            <div className="mb-5 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? "لقطة النظام" : "System snapshot"}</span><span className="text-orange-300">NPF / WEB</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-4xl text-text-primary">02</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "لغتان واتجاها كتابة" : "Locales / directions"}</p></div>
              <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-4xl text-text-primary">03</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "أنظمة رئيسية" : "Core platform layers"}</p></div>
              <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "مسار البيانات" : "Data path"}</p>
                <p className="mt-2 text-sm leading-[1.65] text-text-primary">Payload content <span className="text-orange-300">→</span> Next storefront <span className="text-orange-300">→</span> Vendure commerce</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">{ar ? "الأعداد تلخص بنية التطبيق وليست مؤشرات أداء أو إثباتًا لإتمام معاملات إنتاجية." : "Counts summarize the application architecture; they are not performance metrics or proof of completed production transactions."}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? "الدور: قيادة المنتج والمنصة والتجربة" : "Role: Product, platform & experience"}</span><span>{ar ? "المجال: صحة وتجارة رقمية" : "Domain: Health commerce"}</span><span>2026</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/3boalazm/NILE-VERCEL" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-sm text-text-primary transition-colors hover:border-orange-400/60 hover:bg-orange-400/[0.06]">GitHub ↗</a>
            <a href="https://nile-vercel-seven.vercel.app/ar" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">{ar ? "افتح الموقع" : "Open storefront"} ↗</a>
          </div>
        </div>
      </section>
      <div className="container-content"><ProjectEnquiry compact service="digital-product" /></div>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">01 / {ar ? "التحدي" : "The challenge"}</p><h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "واجهة واحدة. أنظمة مختلفة. مصدر حقيقة واحد لكل نوع بيانات." : "One storefront. Separate systems. One source of truth per data type."}</h2></div>
          <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
            <p>{ar ? "موقع التجارة ليس مجرد عرض صور وأسعار. فالمحتوى التحريري يحتاج إلى إدارة مرنة، بينما يجب أن يأتي السعر والـSKU والطلب والسلة من محرك تجارة مسؤول عن المعاملات." : "A commerce site is more than product images and prices. Editorial content needs a flexible CMS, while SKU, live price, cart and order state belong to a transactional commerce engine."}</p>
            <p>{ar ? "يربط المشروع هذه الطبقات دون أن يخلط مسؤولياتها: بيانات المنتج والمحتوى من Payload، وبيانات البيع من Vendure، وتنسّق واجهة Next.js التجربة وتنفّذ العمليات الحساسة من جهة الخادم." : "The project connects those layers without merging their responsibilities: product content from Payload, transactional commerce from Vendure, and Next.js coordinating the experience and server-side operations."}</p>
            <div className="rounded-xl border-s-2 border-orange-400 bg-orange-400/[0.04] p-4"><p className="text-sm leading-[1.65] text-text-primary">{ar ? "قرار أساسي: فشل محرك التجارة لا يمنح المستخدم سعرًا وهميًا، وفشل CMS لا يلزم أن يُسقط الصفحة كلها." : "Core decision: a commerce outage must not invent a price, and a CMS read failure should not automatically take down the whole page."}</p></div>
          </div>
        </div>
      </section>

      <section className="container-wide py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">02 / {ar ? "البنية" : "Architecture"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "كل طبقة لها حدود واضحة." : "Each layer has a clear boundary."}</h2></div><p className="max-w-md text-sm leading-[1.65] text-text-tertiary">{ar ? "الواجهة لا تتعامل مباشرة مع واجهة Vendure؛ عمليات التجارة تمر عبر Server Actions على الخادم." : "The browser does not call Vendure directly; commerce operations pass through server-side Server Actions."}</p></div>
        <div className="grid gap-3 md:grid-cols-2">
          {layers.map((layer) => <article key={layer.no} className="rounded-xl border border-border-subtle bg-surface-1/40 p-4 md:p-4"><div className="mb-7 flex items-center justify-between"><span className="font-mono text-xs text-text-ghost">{layer.no}</span><span className="h-2 w-2 rounded-full bg-orange-400" /></div><h3 className="font-display text-2xl text-text-primary">{layer.name}</h3><p className="mt-2 font-mono text-xs text-orange-300">{layer.tech}</p><p className="mt-4 text-sm leading-[1.65] text-text-secondary">{ar ? layer.detailAr : layer.detail}</p></article>)}
        </div>
        <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <div className="rounded-xl border border-border-subtle p-4"><p className="font-mono text-[12px] uppercase text-text-tertiary">Payload CMS</p><p className="mt-2 text-sm text-text-primary">{ar ? "المحتوى والوسائط" : "Content & media"}</p></div><div className="text-center text-orange-300">→</div>
            <div className="rounded-xl border border-orange-400/40 bg-orange-400/[0.05] p-4"><p className="font-mono text-[12px] uppercase text-orange-300">Next.js</p><p className="mt-2 text-sm text-text-primary">{ar ? "تنسيق العرض والعمليات" : "Experience & orchestration"}</p></div><div className="text-center text-orange-300">→</div>
            <div className="rounded-xl border border-border-subtle p-4"><p className="font-mono text-[12px] uppercase text-text-tertiary">Vendure</p><p className="mt-2 text-sm text-text-primary">{ar ? "الأسعار والطلبات" : "Pricing & orders"}</p></div>
          </div>
          <p className="mt-4 text-xs leading-[1.65] text-text-tertiary">{ar ? "رسم معماري مبسّط وفق README والشيفرة المصدرية، وليس مخطط نشر كاملًا لكل خدمة وقاعدة بيانات." : "A simplified architecture view based on the README and source, not a complete deployment diagram of every process and database."}</p>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8"><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">03 / {ar ? "رحلات المستخدم" : "Journey map"}</p><h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "من اكتشاف المنتج إلى ما بعد الطلب." : "From product discovery to post-purchase."}</h2>
          <div className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
            {routes.map(([name, body, nameAr, bodyAr]) => <div key={name} className="grid gap-2 py-5 sm:grid-cols-[150px_1fr] sm:gap-6"><h3 className="text-sm font-medium text-text-primary">{ar ? nameAr : name}</h3><p className="text-sm leading-[1.65] text-text-secondary">{ar ? bodyAr : body}</p></div>)}
          </div>
        </div>
      </section>

      <section className="container-wide py-6 md:py-8">
        <div className="mb-6"><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">04 / {ar ? "قرارات هندسية" : "Engineering decisions"}</p><h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "الموثوقية تبدأ من عدم اختراع البيانات." : "Reliability starts by refusing to invent data."}</h2></div>
        <div className="grid gap-3 md:grid-cols-2">
          {capabilities.map(([n, title, body, titleAr, bodyAr]) => <article key={n} className="group rounded-xl border border-border-subtle bg-background/55 p-4 transition-colors hover:border-orange-400/40 md:p-4"><div className="mb-7 flex items-center justify-between"><span className="font-mono text-xs text-text-ghost">{n}</span><span className="text-orange-300">↗</span></div><h3 className="font-display text-xl text-text-primary">{ar ? titleAr : title}</h3><p className="mt-3 text-sm leading-[1.65] text-text-secondary">{ar ? bodyAr : body}</p></article>)}
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">05 / {ar ? "نظام التصميم" : "Design system"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "Nile Glass: زجاج محسوب لا ديكور." : "Nile Glass — glass with a job to do."}</h2></div>
          <div className="space-y-3 text-sm leading-[1.65] text-text-secondary">
            <p>{ar ? "انتقل التصميم من لغات بصرية متضاربة إلى نظام واحد: أرضية فاتحة مستوحاة من ألوان عبوات المنتجات، ولمسات كحلية، وأسطح زجاجية محدودة، وعناوين عربية بخط Noto Kufi Arabic مع Manrope وBricolage Grotesque." : "The redesign consolidates previously conflicting visual languages into one system: a light ground sampled from pack photography, navy accents, restrained glass surfaces, Noto Kufi Arabic display type, Manrope and Bricolage Grotesque."}</p>
            <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border-subtle p-4"><p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">Design tokens</p><p className="mt-2 text-xl font-display text-text-primary">--ng-*</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "ألوان ومسافات وأنصاف أقطار وظلال وحركة موحدة." : "Shared color, spacing, radius, shadow and motion tokens."}</p></div><div className="rounded-xl border border-border-subtle p-4"><p className="font-mono text-[12px] uppercase tracking-[0.12em] text-orange-300">RTL / LTR</p><p className="mt-2 text-xl font-display text-text-primary">AR ↔ EN</p><p className="mt-2 text-xs text-text-tertiary">{ar ? "خصائص منطقية وتبديل الاتجاه حسب اللغة." : "Logical CSS properties and locale-aware direction."}</p></div></div>
            <p>{ar ? "الـglass مستخدم باعتدال، مع بدائل للأسطح عند عدم دعم backdrop-filter أو تفضيل تقليل الشفافية والحركة." : "Glass is used selectively, with surface fallbacks for browsers without backdrop-filter and for reduced-transparency or reduced-motion preferences."}</p>
          </div>
        </div>
      </section>

      <section className="container-wide py-6 md:py-8"><div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">06 / {ar ? "التحقق" : "Validation"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">{ar ? "النتائج الموثقة — وحدودها." : "Reported evidence — and its limits."}</h2></div><div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-3xl text-text-primary">413/413</p><p className="mt-2 text-sm text-text-secondary">{ar ? "اختبارات وحدات ناجحة حسب تقرير التسليم" : "Unit tests passing in the handoff report"}</p></div>
            <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-3xl text-text-primary">0</p><p className="mt-2 text-sm text-text-secondary">{ar ? "مخالفات axe في مجموعة المسارات والمقاسات الموثقة" : "axe violations in the documented route/viewport matrix"}</p></div>
            <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-3xl text-text-primary">80/80</p><p className="mt-2 text-sm text-text-secondary">{ar ? "مسارات اجتازت تدقيق الزحف الموثق" : "Routes passing the documented crawl audit"}</p></div>
            <div className="rounded-xl border border-border-subtle p-4"><p className="font-display text-3xl text-text-primary">0 px</p><p className="mt-2 text-sm text-text-secondary">{ar ? "تجاوز أفقي في مصفوفة المقاسات الموثقة" : "Horizontal overflow in the documented viewport matrix"}</p></div>
          </div>
          <p className="text-xs leading-[1.65] text-text-tertiary">{ar ? "الأرقام من مستند التسليم في المستودع، وليست تشغيلًا جديدًا للاختبارات في هذه المراجعة. ويذكر تقرير التسليم كذلك اختبارات متصفح مع تخطي بعض اختبارات قاعدة البيانات." : "These figures come from the repository handoff, not a fresh test run during this review. The handoff also reports browser tests with some database-gated skips."}</p>
        </div></div></section>

      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">07 / {ar ? "بوابات الإصدار" : "Release gates"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-5xl">{ar ? "نجاح البناء لا يعني أن المتجر جاهز للإطلاق." : "A passing build is not a production sign-off."}</h2></div>
          <div className="space-y-4 text-sm leading-[1.65] text-text-secondary">
            <p>{ar ? "توثيق المشروع يذكر أن تدقيق الاعتماديات الإنتاجية ما زال يحمل 25 finding، منها 16 عالية الخطورة. كما أن حسابات الإنتاج والطلبات الحية وSMTP لم تُختبر ضمن مصفوفة التحقق المشار إليها." : "The repository documentation reports 25 production dependency audit findings, including 16 high severity. Production-authenticated accounts, live orders and SMTP were not exercised in the cited validation matrix."}</p>
            <p>{ar ? "ما زالت هناك قرارات تحتاج مستندات أو اعتماد المالك: أسعار بعض المنتجات، حالة Ellamuselle، كميات المخزون الحقيقية، تأكيد ضريبة القيمة المضافة، إثباتات التسجيل والادعاءات التنظيمية، والإذن باستخدام شعار الشريك." : "Owner evidence is still needed for some retail prices, Ellamuselle availability, actual stock quantities, VAT-inclusive pricing, registration/claims documentation and permission to display the partner logo."}</p>
            <p>{ar ? "وعليه، تشرح الصفحة ما هو موجود هندسيًا وتوضح ما تبقّى؛ ولا تدّعي أن تدفقات الإنتاج أو الاعتماد التنظيمي أو بوابات الإطلاق قد أُغلقت." : "The case study therefore describes the implemented engineering and exposes what remains; it does not claim production commerce, regulatory approval or release gates are fully cleared."}</p>
          </div>
        </div>
      </section>

      <section className="container-wide py-6 md:py-8"><div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">08 / {ar ? "التقنيات" : "Technology stack"}</p><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">{ar ? "واجهة، محتوى، تجارة وتشغيل." : "Experience, content, commerce and operations."}</h2></div><div><div className="flex flex-wrap gap-2">{stack.map((item) => <span key={item} className="rounded-full border border-border-subtle bg-background/60 px-3 py-2 font-mono text-xs text-text-secondary">{item}</span>)}</div><p className="mt-6 text-sm leading-[1.65] text-text-secondary">{ar ? "المشروع يضم اختبارات منطقية ومتصفح وإتاحة، أدوات تشغيل وقواعد بيانات وعمليات نشر، وليس واجهة تسويقية مستقلة عن التجارة." : "The repository includes logic, browser and accessibility tests, operational tooling, database workflows and deployment configuration—not a marketing UI detached from commerce."}</p></div></div></section>

      <section className="border-t border-border-subtle bg-surface-1/35"><div className="container-wide flex flex-col gap-8 py-6 md:flex-row md:items-end md:justify-between md:py-7"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-300">HAND-OFF / 003</p><h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">{ar ? "تجارة رقمية موثقة، وحدودها معلنة." : "Commerce engineering with visible boundaries."}</h2><p className="mt-5 max-w-2xl text-sm leading-[1.65] text-text-secondary">{ar ? "الخطوة التالية ليست إضافة مزايا شكلية، بل إغلاق بوابات الأمان والاعتماد التجاري، والتحقق من بيانات الإنتاج والعمليات الحقيقية." : "The next step is not decorative feature work; it is closing security and commercial approval gates and validating real production data and operations."}</p></div><div className="flex shrink-0 flex-wrap gap-3"><a href="https://github.com/3boalazm/NILE-VERCEL" target="_blank" rel="noreferrer" className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary hover:border-orange-400/60">Source code ↗</a><a href="https://nile-vercel-seven.vercel.app/ar" target="_blank" rel="noreferrer" className="rounded-full bg-orange-400 px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5">{ar ? "زُر الموقع" : "Visit storefront"} ↗</a></div></div></section>
    </div>
  );
}
