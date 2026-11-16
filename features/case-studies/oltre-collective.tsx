"use client";

/**
 * OLTRÈ COLLECTIVE — Product case file / 006
 *
 * A full-stack urban streetwear store: storefront, cart, wishlist, loyalty
 * and an admin dashboard. This file is deliberately conservative about
 * evidence: everything under "What the live site shows" was read off the
 * public storefront (momo-shop.vercel.app) — the three-product drop, the
 * prices in EGP, the free-shipping threshold, the three payment rails and
 * the /shop · /product/[slug] · /about routes. The dashboard, loyalty and
 * analytics scope comes from the project's own declared stack in
 * projects.data.ts, and is labelled as such rather than presented as an
 * audited screenshot.
 */
import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";

const layers = [
  {
    no: "01",
    name: "Storefront",
    tech: "React + Vite",
    detail: "A fast client-rendered shop: drop landing, catalogue, product detail and brand story.",
    detailAr: "متجر سريع يُعرض من جهة العميل: صفحة الدروب، والكتالوج، وتفاصيل المنتج، وقصة العلامة.",
  },
  {
    no: "02",
    name: "Commerce & data",
    tech: "Drizzle ORM · PostgreSQL",
    detail: "Typed schema and migrations for products, variants, orders, customers and stock.",
    detailAr: "مخطط مكتوب الأنواع وترحيلات للمنتجات والمتغيّرات والطلبات والعملاء والمخزون.",
  },
  {
    no: "03",
    name: "Payments",
    tech: "Card · MEEZA · Vodafone Cash",
    detail: "Local rails first — the checkout was designed around how Egyptian shoppers actually pay.",
    detailAr: "المسارات المحلية أولًا: صُمّم إتمام الشراء حول الطريقة التي يدفع بها المتسوق المصري فعلًا.",
  },
  {
    no: "04",
    name: "Operations",
    tech: "Loyalty & roles · Admin analytics",
    detail: "Customer tiers, staff permissions and a dashboard that reads the same database the store writes to.",
    detailAr: "مستويات العملاء وصلاحيات الفريق ولوحة إدارة تقرأ قاعدة البيانات نفسها التي يكتب فيها المتجر.",
  },
] as const;

const journeys = [
  ["Discovery", "Drop landing · announcement bar · new-arrival rail", "الاكتشاف", "صفحة الدروب · شريط الإعلانات · صف الوصولات الجديدة"],
  ["Product", "Colour/alternate views · price · quick add", "المنتج", "صور بديلة · السعر · إضافة سريعة"],
  ["Consideration", "Wishlist · size and fit copy · brand story", "الاهتمام", "المفضلة · دليل المقاسات · قصة العلامة"],
  ["Purchase", "Cart · checkout · local payment rails", "الشراء", "السلة · إتمام الطلب · وسائل دفع محلية"],
  ["Retention", "Account · loyalty tiers · Instagram loop", "الاحتفاظ", "الحساب · مستويات الولاء · حلقة إنستغرام"],
] as const;

const decisions = [
  [
    "01",
    "The drop is the homepage",
    "Streetwear sells in waves, not a permanent catalogue. The landing page leads with one drop, a countdown/announcement bar and a short new-arrival rail; the full catalogue is one tap away at /shop. Merchandising follows the release calendar instead of a department-store grid.",
    "الدروب هو الصفحة الرئيسية",
    "يُباع الستريت وير على موجات لا من كتالوج دائم. تبدأ الصفحة الرئيسية بدروب واحد، وشريط عدّ تنازلي وإعلانات، ورفّ قصير للوصولات الجديدة؛ والكتالوج الكامل على بُعد نقرة في /shop. ويتبع ترتيب العرض تقويم الإصدارات لا شبكة المتاجر الكبرى.",
  ],
  [
    "02",
    "Prices are a first-class number",
    "Every product carries an explicit EGP price, and discounted items show both the old and the new figure (1100 instead of 1300) rather than a percentage badge. Nothing is priced in a foreign currency and converted at checkout.",
    "السعر رقم أساسي",
    "لكل منتج سعر صريح بالجنيه، وتعرض المنتجات المخفّضة السعرين القديم والجديد (1100 بدل 1300) لا نسبة الخصم. ولا يوجد سعر بعملة أجنبية يُحوَّل وقت الدفع.",
  ],
  [
    "03",
    "Payment matches the market",
    "Card, MEEZA and Vodafone Cash sit together in the same reassurance strip. Supporting the wallet rail is not an afterthought — for a large share of Egyptian buyers it is the primary way to pay.",
    "الدفع يناسب السوق",
    "الكارت وميزة وفودافون كاش في شريط الطمأنة نفسه. ودعم المحفظة ليس أمرًا ثانويًا: فهي وسيلة الدفع الأساسية لنسبة كبيرة من المشترين المصريين.",
  ],
  [
    "04",
    "Shipping thresholds are stated, not discovered",
    "“Free shipping over 2,000 LE” is announced in the marquee before the first product is seen. A shopper can plan a basket instead of finding the threshold at checkout.",
    "حدّ الشحن معلن لا مفاجأة",
    "يُعلَن «شحن مجاني فوق 2000 جنيه» في الشريط قبل أن ترى أول منتج. فيستطيع المتسوق أن يخطّط سلته بدل أن يكتشف الحدّ عند الدفع.",
  ],
  [
    "05",
    "One database, two faces",
    "The storefront and the admin dashboard are two views of the same PostgreSQL schema through Drizzle. Stock and order state edited in the dashboard are the same rows the shop reads — no nightly export, no second source of truth.",
    "قاعدة بيانات واحدة، وواجهتان",
    "المتجر ولوحة الإدارة واجهتان لمخطط PostgreSQL نفسه عبر Drizzle. والمخزون وحالة الطلب اللذان يُعدَّلان في اللوحة هما السجلات نفسها التي يقرؤها المتجر.",
  ],
  [
    "06",
    "Identity carries the shop",
    "The brand is editorial rather than template-commerce: a heavy condensed wordmark, black-on-amber palette and product photography on concrete. The UI stays quiet so the garments lead.",
    "الهوية هي المتجر",
    "الهوية تحريرية لا قالب جاهز: ووردمارك ثقيل، وأسود على عنبري، وتصوير للمنتجات على خرسانة. وتصمت الواجهة لتتكلّم الملابس.",
  ],
] as const;

const verified = [
  ["03", "Products in the live drop", "منتجات في الدروب المعروض"],
  ["03", "Payment rails offered", "وسائل دفع متاحة"],
  ["05", "Shoppable surfaces (/shop, /product, /about, /)", "مسارات الشراء المتاحة"],
  ["2,000 LE", "Free-shipping threshold", "حد الشحن المجاني"],
] as const;

const stack = [
  "React", "Vite", "TypeScript", "Drizzle ORM", "PostgreSQL",
  "Payments", "Loyalty & roles", "Admin analytics", "Tailwind CSS",
];

export function OltreCollectiveCaseStudy() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="container-wide relative flex min-h-[68svh] flex-col justify-between gap-7 py-5 md:py-7">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-amber-500/[0.10] blur-[100px]" />
          <div className="absolute -left-20 top-56 h-72 w-72 rounded-full bg-orange-700/[0.12] blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-text-tertiary sm:text-xs">
          <Link href="/work" className="transition-colors hover:text-text-primary">← {ar ? "كل الأعمال" : "All work"}</Link>
          <span>{ar ? "ملف منتج / 006" : "Product case file / 006"}</span>
        </div>

        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-amber-400/30 bg-amber-400/[0.08] px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-amber-300">{ar ? "متجر كامل" : "Full-stack store"}</span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "مباشر" : "Live"}</span>
              <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "دفع محلي" : "Local payments"}</span>
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-300/80">OLTRÈ COLLECTIVE / STREETWEAR</p>
            <h1 className="max-w-5xl font-display text-[clamp(3.3rem,9vw,8.3rem)] leading-[0.86] tracking-[-0.06em] text-text-primary">
              OLTRÈ<span className="text-amber-400">.</span>{" "}
              <span className="text-text-tertiary">Collective</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-text-secondary md:text-2xl">
              {ar
                ? "متجر ستريت وير مصري متكامل: دروبات وسلة ومفضلة وبرنامج ولاء ولوحة إدارة، بأسعار بالجنيه ووسائل دفع محلية."
                : "An Egyptian streetwear store, end to end: drops, cart, wishlist, loyalty and an admin dashboard — priced in EGP and paid the way people here actually pay."}
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface-1/70 p-4 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-text-tertiary">
              <span>{ar ? "لقطة النظام" : "System snapshot"}</span>
              <span className="text-amber-300">OLTRÈ / WEB</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl text-text-primary">04</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "طبقات المنصة" : "Platform layers"}</p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="font-display text-4xl text-text-primary">03</p>
                <p className="mt-2 text-xs text-text-tertiary">{ar ? "وسائل دفع" : "Payment rails"}</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border-subtle bg-background/60 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">{ar ? "مسار البيانات" : "Data path"}</p>
                <p className="mt-2 text-sm leading-[1.65] text-text-primary">Storefront <span className="text-amber-300">→</span> Drizzle <span className="text-amber-300">→</span> PostgreSQL <span className="text-amber-300">→</span> Admin</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">
              {ar
                ? "هذه الأعداد تصف بنية التطبيق، وليست مؤشرات مبيعات أو أرقام أداء."
                : "These counts describe the application's structure; they are not sales figures or performance claims."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            <span>{ar ? "الدور: منتج + تطوير" : "Role: Product & build"}</span>
            <span>{ar ? "المجال: تجارة أزياء" : "Domain: Fashion commerce"}</span>
            <span>2026</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://momo-shop.vercel.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-black transition-transform hover:-translate-y-0.5">
              {ar ? "افتح المتجر" : "Open the store"} ↗
            </a>
          </div>
        </div>
      </section>
      <div className="container-content"><ProjectEnquiry compact service="digital-product" /></div>

      {/* ═══ COVER ═══ */}
      <section className="container-wide pb-2">
        <figure className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-1/40">
          <Image
            src="/images/work/dev-cards/oltre-collective-card.jpg"
            alt={ar ? "واجهة متجر أولتري كوليكتيف" : "OLTRÈ Collective storefront"}
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle px-4 py-3 font-mono text-[12px] uppercase tracking-[0.1em] text-text-tertiary">
            <span>{ar ? "واجهة المتجر: المنتجات والسعر والإضافة السريعة" : "Storefront — products, price and quick add"}</span>
            <span className="text-amber-300">LIVE / 2026</span>
          </figcaption>
        </figure>
      </section>

      {/* ═══ 01 · CHALLENGE ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">01 / {ar ? "التحدي" : "The challenge"}</p>
            <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "علامة تبيع بالدروب تحتاج متجرًا يجاريها." : "A brand that sells in drops needs a shop that can keep up."}
            </h2>
          </div>
          <div className="max-w-3xl space-y-3 text-base leading-[1.65] text-text-secondary">
            <p>
              {ar
                ? "لا تبيع علامات الستريت وير من كتالوج ثابت. فلكل دروب كمية محدودة، ولحظة إطلاق، وزخم على وسائل التواصل الاجتماعي. وعلى المتجر أن يستقبل موجة زيارات تصل دفعة واحدة، وأن يعرض المنتجات التي نفدت بوضوح، وأن يحوّل الاهتمام إلى طلب سهل الدفع."
                : "Streetwear labels do not sell from a static catalogue. Every drop has a limited run, a launch moment and social momentum. The store has to absorb visits that arrive all at once, retire sold-out items honestly, and turn attention into an order that is easy to pay for."}
            </p>
            <p>
              {ar
                ? "والنصف الآخر من المشكلة أن العلامة ليست واجهة فحسب. فخلف الواجهة مخزون وطلبات وعملاء ومستويات ولاء وصلاحيات فريق. وإذا تكلّم المتجر واللوحة بيانات مختلفة ظهر الخلل في أول دروب ينفد."
                : "The second half of the problem is that a brand is not just a storefront. Behind it sit inventory, orders, customers, loyalty tiers and staff permissions. If the shop and the dashboard speak different data, the breakage shows up in the first drop that sells out."}
            </p>
            <div className="rounded-xl border-s-2 border-amber-400 bg-amber-400/[0.04] p-4">
              <p className="text-sm leading-[1.65] text-text-primary">
                {ar
                  ? "القرار الأساسي: متجر واحد، وقاعدة بيانات واحدة، ودفع بالطريقة التي يدفع بها الناس هنا."
                  : "The core decision: one storefront, one database, and payment in the form people here actually use."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 02 · ARCHITECTURE ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">02 / {ar ? "البنية" : "Architecture"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "أربع طبقات، ومسار واحد للبيانات." : "Four layers, one path for the data."}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-[1.65] text-text-tertiary">
            {ar
              ? "تقرأ الواجهة من الـ schema نفسه الذي تكتب فيه لوحة الإدارة، بلا تصدير ليلي ولا مصدر حقيقة ثانٍ."
              : "The shopfront reads the same schema the admin writes to — no nightly export, no second source of truth."}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {layers.map((layer) => (
            <article key={layer.no} className="rounded-xl border border-border-subtle bg-surface-1/40 p-4">
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{layer.no}</span>
                <span className="h-2 w-2 rounded-full bg-amber-400" />
              </div>
              <h3 className="font-display text-2xl text-text-primary">{layer.name}</h3>
              <p className="mt-2 font-mono text-xs text-amber-300">{layer.tech}</p>
              <p className="mt-4 text-sm leading-[1.65] text-text-secondary">{ar ? layer.detailAr : layer.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-border-subtle bg-background/50 p-4 md:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <div className="rounded-xl border border-border-subtle p-4">
              <p className="font-mono text-[12px] uppercase text-text-tertiary">React + Vite</p>
              <p className="mt-2 text-sm text-text-primary">{ar ? "واجهة المتجر" : "Storefront"}</p>
            </div>
            <div className="text-center text-amber-300">→</div>
            <div className="rounded-xl border border-amber-400/40 bg-amber-400/[0.05] p-4">
              <p className="font-mono text-[12px] uppercase text-amber-300">Drizzle ORM</p>
              <p className="mt-2 text-sm text-text-primary">{ar ? "مخطط مكتوب الأنواع" : "Typed schema"}</p>
            </div>
            <div className="text-center text-amber-300">→</div>
            <div className="rounded-xl border border-border-subtle p-4">
              <p className="font-mono text-[12px] uppercase text-text-tertiary">PostgreSQL</p>
              <p className="mt-2 text-sm text-text-primary">{ar ? "مصدر الحقيقة" : "Source of truth"}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-[1.65] text-text-tertiary">
            {ar ? "رسم مبسّط لمسار البيانات بحسب حزمة التقنيات المعلنة للمشروع." : "A simplified data-path view based on the project's declared stack."}
          </p>
        </div>
      </section>

      {/* ═══ 03 · JOURNEY ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide py-6 md:py-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">03 / {ar ? "منظومة الرحلة" : "Journey map"}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
            {ar ? "من «رأيتُ الدروب» إلى «ارتديتُه فعدتُ إلى الشراء»." : "From “saw the drop” to “wore it, came back for more”."}
          </h2>
          <div className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
            {journeys.map(([name, body, nameAr, bodyAr]) => (
              <div key={name} className="grid gap-2 py-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                <h3 className="text-sm font-medium text-text-primary">{ar ? nameAr : name}</h3>
                <p className="text-sm leading-[1.65] text-text-secondary">{ar ? bodyAr : body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 · DECISIONS ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">04 / {ar ? "قرارات المنتج" : "Product decisions"}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-0.04em] text-text-primary md:text-6xl">
            {ar ? "يتصرّف المتجر كالعلامة لا كالقالب." : "The shop behaves like the brand, not like a template."}
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {decisions.map(([n, title, body, titleAr, bodyAr]) => (
            <article key={n} className="group rounded-xl border border-border-subtle bg-background/55 p-4 transition-colors hover:border-amber-400/40">
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-xs text-text-ghost">{n}</span>
                <span className="text-amber-300">↗</span>
              </div>
              <h3 className="font-display text-xl text-text-primary">{ar ? titleAr : title}</h3>
              <p className="mt-3 text-sm leading-[1.65] text-text-secondary">{ar ? bodyAr : body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ 05 · EVIDENCE ═══ */}
      <section className="border-y border-border-subtle bg-surface-1/35">
        <div className="container-wide grid gap-5 py-6 md:grid-cols-[0.55fr_1fr] md:py-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">05 / {ar ? "الأدلة" : "Evidence"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary md:text-5xl">
              {ar ? "ما يقوله المتجر فعلًا." : "What the storefront actually shows."}
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
            <p className="text-xs leading-[1.65] text-text-tertiary">
              {ar
                ? "هذه الأرقام مقروءة من المتجر المباشر وقت كتابة الملف. أما اللوحة والولاء والتحليلات فجزء من نطاق المشروع المعلن، لكنها تحتاج إلى تسجيل دخول إداري، ولذلك لا تُعرض هنا بوصفها لقطات شاشة مُتحقَّقًا منها."
                : "These figures were read off the live storefront while writing this file. The dashboard, loyalty and analytics are part of the declared project scope, but sit behind staff authentication — so they are not presented here as verified screenshots."}
            </p>
            <p className="text-xs leading-[1.65] text-text-tertiary">
              {ar
                ? "لا توجد في هذا الملف أرقام مبيعات أو تحويل أو نمو، لأنه لا يوجد مصدر موثّق لها."
                : "No sales, conversion or growth figures appear in this file, because there is no reviewed source for them."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 06 · STACK ═══ */}
      <section className="container-wide py-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">06 / {ar ? "التقنيات" : "Technology stack"}</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-text-primary">
              {ar ? "الواجهة والبيانات والدفع والتشغيل." : "Experience, data, payments and operations."}
            </h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span key={item} className="rounded-full border border-border-subtle bg-background/60 px-3 py-2 font-mono text-xs text-text-secondary">{item}</span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-[1.65] text-text-secondary">
              {ar
                ? "المشروع متجر حيّ يمكن التصفح والشراء منه، لا واجهة تسويقية. ولهذا يتحدث هذا الملف عن قرارات الدفع والمخزون لا عن نماذج العرض (mockups)."
                : "This is a storefront you can browse and buy from, not a marketing skin. That is why this file talks about payment and inventory decisions rather than mockups."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ HAND-OFF ═══ */}
      <section className="border-t border-border-subtle bg-surface-1/35">
        <div className="container-wide flex flex-col gap-8 py-6 md:flex-row md:items-end md:justify-between md:py-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">HAND-OFF / 006</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-0.04em] text-text-primary md:text-6xl">
              {ar ? "علامة تُباع بالدروب، ومتجر جاهز لكل دروب." : "A drop-led brand with a shop that is ready for the next one."}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-[1.65] text-text-secondary">
              {ar
                ? "الخطوة التالية هي التوسّع في الكتالوج والمرتجعات، مع الإبقاء على قاعدة البيانات الواحدة نفسها التي تشغّل اللوحة."
                : "The next step is scaling catalogue and returns, without splitting the single database that already runs the dashboard."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/work" className="rounded-full border border-border-default px-5 py-3 text-sm text-text-primary hover:border-amber-400/60">
              {ar ? "كل الأعمال" : "All work"}
            </Link>
            <a href="https://momo-shop.vercel.app/" target="_blank" rel="noreferrer" className="rounded-full bg-amber-400 px-5 py-3 text-sm font-medium text-black hover:-translate-y-0.5">
              {ar ? "زُر المتجر" : "Visit the store"} ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
