"use client";

import { DisciplinesBand } from "@/features/offers/disciplines";
import Link from "@/components/ui/localized-link";
import { Icon } from "@/components/ui/Icon";
import { useLang } from "@/components/providers/lang-provider";
import {
  DISCOVERY_CTA_LABEL,
  PROCESS,
  TERMS_LINE,
  type Bi,
} from "@/lib/offers";
import { SectionHead, TierGrid, Faq, CtaBand, pick } from "@/features/offers/offer-blocks";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";
import { SocialProof } from "@/components/shared/social-proof";

const FAQ: readonly { q: Bi; a: Bi }[] = [
  { q: ["How long does a full brand identity take?", "كم تستغرق الهوية البصرية الكاملة؟"], a: ["Logo Design: 7–10 days; Brand Identity: 3–4 weeks; Full Brand System: 5–7 weeks. The 38-day walkthrough illustrates the full-system scope. Final dates depend on agreed scope, feedback and approvals.", "الشعار: 7–10 أيام، والهوية: 3–4 أسابيع، ونظام العلامة المتكامل: 5–7 أسابيع. والمسار التفصيلي البالغ 38 يومًا مثال على النظام الكامل. وتتحدد المواعيد النهائية بحسب النطاق والردود والاعتمادات."] },
  { q: ['What\'s included in a "Brand Guidelines" document?', "ماذا يتضمن دليل الهوية البصرية؟"], a: ["A 20–40 page PDF covering logo usage (do's & don'ts), color codes (HEX/RGB/CMYK/Pantone), typography hierarchy, spacing rules, voice & tone, and ready-to-use templates — designed for your team to apply the brand without me.", "ملف PDF من 20–40 صفحة يغطي استخدامات الشعار (المسموح والممنوع)، وأكواد الألوان (HEX/RGB/CMYK/Pantone)، وهرمية الخطوط، وقواعد المسافات، ونبرة الصوت، وقوالب جاهزة، ليطبّق فريقك الهوية دون الحاجة إليّ."] },
  { q: ["How many revision rounds do I get?", "كم جولة مراجعة تشملها الباقة؟"], a: ["Two structured rounds are included. After that, additional revisions are billed hourly — not a limit on your input, but a structure that protects the strategy from ad-hoc erosion.", "تشمل الباقة جولتَي مراجعة منظّمتين، وما بعدهما يُحاسَب بالساعة. والغرض ليس تقييد رأيك، بل حماية الاستراتيجية من التعديلات العشوائية."] },
  { q: ["Do you work with international clients?", "هل تعمل مع عملاء دوليين؟"], a: ["Yes — most communication is over email and Notion with weekly video calls. I work in both English and Arabic, with clients across MENA and beyond.", "نعم. يجري أغلب التواصل عبر البريد الإلكتروني وNotion مع مكالمات فيديو أسبوعية، وأعمل بالعربية والإنجليزية مع عملاء في المنطقة وخارجها."] },
  { q: ["How does payment work?", "كيف تتم عملية الدفع؟"], a: [TERMS_LINE[0] + " Bank transfer, InstaPay, Vodafone Cash, or international wire.", TERMS_LINE[1] + " وسائل الدفع: تحويل بنكي أو إنستاباي أو فودافون كاش أو تحويل دولي."] },
  { q: ["Can you also build the website?", "هل تبني الموقع أيضًا؟"], a: ["Yes — company sites, landing pages, 72-hour bilingual online stores, and custom web applications. We choose Next.js or WordPress to fit your content and workflows.", "نعم: مواقع شركات، وصفحات هبوط، ومتاجر إلكترونية ثنائية اللغة خلال 72 ساعة، وتطبيقات ويب مخصصة. ونختار Next.js أو ووردبريس بما يناسب محتواك وسير عملك."] },
  { q: ["What if I just need a logo, not the full system?", "ماذا لو احتجت إلى شعار فقط دون النظام الكامل؟"], a: ["Tier 01 covers a focused logo project. We confirm the audience, use cases and design direction first; wider strategy and applications are available in the larger tiers.", "الفئة 01 مخصصة لمشروع شعار محدد النطاق. نتفق أولًا على الجمهور والاستخدامات والاتجاه التصميمي، وتتوفر الاستراتيجية الأوسع والتطبيقات في الباقات الأكبر."] },
];

export function ServicesView({ tiers }: { tiers: import("@/lib/offers").Tier[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <main className="container-content flex flex-col gap-8 pb-6">
      <header className="flex flex-col gap-3">
        <Heading
          eyebrow={ar ? "الخدمات / التعاقد" : "SERVICES / ENGAGEMENT"}
          title={
            <>
              {ar ? "استراتيجية، هوية، " : "Strategy, identity, "}
              <em className="text-accent">{ar ? "أنظمة." : "systems."}</em>
            </>
          }
          subtitle={
            ar
              ? "الهوية والتجربة الرقمية وأنظمة الأعمال: ثلاثة مسارات في استوديو واحد، دون فجوات في التسليم بينها."
              : "Brand, digital experience and business systems — three tracks in one studio, with no handoff gaps between them."
          }
          subtitleClassName="max-w-[52ch]"
        />
        <div className="flex flex-wrap gap-2">
          {/* Discovery call is the entry point; the deposit page is step 04. */}
          <Link
            href="/contact"
            className={buttonVariants({
              variant: "primary",
              className: "px-3.5 py-1.5 font-mono text-label tracking-[0.06em]",
            })}
          >
            {ar ? DISCOVERY_CTA_LABEL[1] : DISCOVERY_CTA_LABEL[0]}<Icon name="arrow-right" flip={false} className="ms-1.5" />
          </Link>
          <Link
            href="/services/store-72h"
            className={buttonVariants({
              variant: "ghost",
              className:
                "border border-border-default px-3.5 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary hover:text-text-primary",
            })}
          >
            {ar ? "متجر خلال 72 ساعة (من $197) ←" : "72-Hour Store (From $197) →"}
          </Link>
        </div>
      </header>

      {/* 01 · The three disciplines (replaces a flat twelve-service menu).
          Each card states who it is for, what the client walks away with,
          what is included, and a real starting point — then asks for a
          discovery call rather than a payment. */}
      <section className="flex flex-col gap-3">
        <SectionHead label={["01 / WHAT WE DO", "01 / ما نقدّمه"]} title={["Three", "ثلاثة"]} italic={["disciplines.", "تخصصات."]} />
        <DisciplinesBand highlight="brand" />
      </section>

      <section aria-label={ar ? "قدرات مساندة" : "Applied capabilities"} className="flex flex-col gap-3 border-t border-border-subtle pt-5">
        <SectionHead
          label={["02 / APPLIED CAPABILITIES", "02 / قدرات مساندة"]}
          title={["Useful beyond the", "فائدة تتجاوز"]}
          italic={["core.", "التخصص الأساسي."]}
        />
        <p className="max-w-[58ch] text-body-sm text-text-secondary">
          {ar
            ? "ليست ركائز إضافية تنافس الهوية والتطوير، بل قدرات تطبيقية أستعين بها حين تخدم حلّ المشكلة، ويُحدَّد نطاقها لكل مشروع."
            : "Not extra pillars competing with brand identity and development. These are applied capabilities I bring in when they help solve the brief, scoped to the project."}
        </p>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {([
            {
              n: "A",
              title: ["AI workflows & automation", "أتمتة وتدفقات عمل بالذكاء الاصطناعي"],
              body: ["Map repetitive work, then prototype practical automations and AI-assisted workflows around real team needs.", "رصد المهام المتكررة، ثم بناء نماذج أولية عملية للأتمتة وتدفقات العمل المدعومة بالذكاء الاصطناعي بحسب احتياج الفريق."],
            },
            {
              n: "B",
              title: ["Internal tools & dashboards", "أدوات داخلية ولوحات تحكم"],
              body: ["Lightweight dashboards, admin tools and workflow-focused web apps that make business processes easier to run.", "لوحات تحكم خفيفة وأدوات إدارية وتطبيقات ويب تركّز على سير العمل، وتسهّل إدارة العمليات."],
            },
            {
              n: "C",
              title: ["Product & market research", "بحث المنتجات والأسواق"],
              body: ["Structured competitor, user and opportunity research to support product decisions — with sources and assumptions made explicit.", "بحث منظّم عن المنافسين والمستخدمين والفرص لدعم قرارات المنتج، مع بيان المصادر والافتراضات."],
            },
          ] as const).map((item) => (
            <article key={item.n} className="rounded-card border border-border-subtle bg-surface-1 p-3">
              <p className="font-mono text-micro text-text-ghost">{item.n} / {ar ? "قدرات مساندة" : "APPLIED"}</p>
              <h3 className="mt-2 font-display text-subtitle text-text-primary">{pick(item.title, lang)}</h3>
              <p className="mt-2 text-body-sm text-text-secondary">{pick(item.body, lang)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["03 / PROCESS", "03 / المنهج"]} title={["A four-act", "منهج من أربع مراحل،"]} italic={["method, refined over 9+ years.", "صُقل على مدى أكثر من 9 سنوات."]} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.n} className="rounded-card border border-border-subtle bg-surface-1 p-3">
              <p className="font-display text-title text-accent">{p.n}</p>
              <p className="text-body text-text-primary">{pick(p.name, lang)}</p>
              <p className="mt-1 text-body-sm text-text-secondary">{pick(p.body, lang)}</p>
              <p className="mt-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">{pick(p.days, lang)}</p>
            </div>
          ))}
        </div>
        <Link href="/process" className="group mx-auto mt-1 flex w-fit items-center gap-2 font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-accent">
          {ar ? "استعرض المنهج الكامل: 38 يومًا، بوابةً بعد بوابة" : "See the full 38-day method, gate by gate"}
          <span aria-hidden className="inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><Icon name="arrow-right" /></span>
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead label={["04 / ENGAGEMENT", "04 / التعاقد"]} title={["Three ways to", "ثلاث طرق"]} italic={["work together.", "للعمل معًا."]} />
        <TierGrid tiers={tiers} />
        <p className="text-center font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "— يختلف سعر المشروع بحسب النطاق · عقود شهرية مخصصة متاحة · خصم عند الدفع الكامل مقدّمًا —" : "— Project pricing varies by scope · Custom retainers available · Discount on full prepayment —"}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/pricing" className={buttonVariants({ className: "px-3 py-1.5 font-mono text-label tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5" })}>
            <>{ar ? "الأسعار بالتفصيل" : "View Detailed Pricing"} <Icon name="sparkle" size="0.9em" /></>
          </Link>
          <Link href="/agreement" className={buttonVariants({ variant: "ghost", className: "glass px-3 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary" })}>
            <>{ar ? "اقرأ الاتفاقية كاملة" : "Read Full Agreement"} <Icon name="arrow-right" /></>
          </Link>
        </div>
      </section>

      <SocialProof />

      <section className="flex flex-col gap-3">
        <SectionHead label={["05 / FAQ", "05 / الأسئلة الشائعة"]} title={["Common", "أسئلة"]} italic={["questions.", "شائعة."]} />
        <Faq items={FAQ} />
      </section>

      <CtaBand
        kicker={["START WITH A CONVERSATION", "ابدأ بمحادثة"]}
        title={["Tell us the", "حدّثنا عن"]}
        italic={["problem.", "المشكلة."]}
        primary={DISCOVERY_CTA_LABEL}
        primaryHref="/contact"
        secondary={["See the Work", "استعرض الأعمال"]}
        secondaryHref="/work"
      />
    </main>
  );
}
