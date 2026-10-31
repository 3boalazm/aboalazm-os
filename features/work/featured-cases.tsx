"use client";

/**
 * FEATURED CASES — the proof layer.
 * Story-led cards (image, challenge, outcome, CTA) sit in front of the
 * full track archive, with a direct "See more" CTA beneath each track
 * leading to its dedicated page (/work/design and /work/development).
 */
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/components/providers/lang-provider";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { MediaCard } from "@/components/ui/MediaCard";
import { Section, SectionLabel } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/Button";
import { joinClasses } from "@/lib/utils";
import { BEHANCE } from "./projects.data";
import { cardArt } from "./card-art";
import type { Project } from "./types";

const FEATURED_SLUGS = {
  design: ["gad-institute", "reflection", "nile-pharma"],
  development: [
    "nile-pharma-erp",
    "ummah-academy",
    "speech-to-text-studio",
    "stemforge",
    "momo-collective",
    "farm-console",
  ],
} as const;

export const STORIES: Record<string, { challenge: string; challengeAr: string }> = {
  // Design & Brand Identity Track (8 projects)
  "gad-institute": {
    challenge:
      "A specialized cardiac and pulmonary institute needed an authoritative yet warm bilingual identity to govern architectural signage and patient care.",
    challengeAr:
      "معهد رعاية قلب ورئة تخصصي احتاج هوية ثنائية اللغة تجمع بين الثقة الطبية والدفء الإنساني لتطبيقها عبر اللافتات والمنصات الرقمية.",
  },
  reflection: {
    challenge:
      "An art and print studio needed a warm, airy editorial identity distinct from cheap poster shops and sterile art galleries.",
    challengeAr:
      "استوديو فنون ومطبوعات احتاج هوية تحريرية دافئة تميزه عن متاجر البوسترات الشعبية وصالات العرض الباردة المنعزلة.",
  },
  "nile-pharma": {
    challenge:
      "A pharma-food brand operating without visual governance needed consumer packaging authority and cohesive bilingual shelf presence.",
    challengeAr:
      "شركة مكملات غذائية وأدوية كانت تعمل دون حوكمة بصرية، فاحتاجت معمارية تغليف موحدة وحضوراً قوياً على أرفف الصيدليات.",
  },
  "ahmed-bedeer": {
    challenge:
      "A healthcare IT leader needed a personal brand with executive gravitas, geometric monogram precision, and zero corporate stiffness.",
    challengeAr:
      "قائد في تكنولوجيا المعلومات الصحية احتاج هوية شخصية بوقار تنفيذي ومونوجرام هندسي دقيق بعيداً عن الجمود المؤسسي.",
  },
  "code-canvas": {
    challenge:
      "A two-track brand and engineering studio needed a unified visual system capable of governing strategy decks, guidelines, and digital products.",
    challengeAr:
      "استوديو يجمع بين الهوية والهندسة البرمجية احتاج نظاماً بصرياً موحداً يحكم العروض الاستراتيجية والأدلة والمنتجات الرقمية.",
  },
  esfc: {
    challenge:
      "An annual geoscience field camp needed an energetic student-led identity that unifies apparel, field guides, badges, and event media.",
    challengeAr:
      "معسكر ميداني طلابي لعلوم الأرض احتاج هوية حيوية توحّد المطبوعات الميدانية والملابس والشارات والتغطية الرقمية.",
  },
  "learn-in-arabic": {
    challenge:
      "An educational initiative needed a bold typographic mark and content system that makes technical learning in Arabic feel modern and clear.",
    challengeAr:
      "مبادرة تعليمية احتاجت علامة تايبوجرافية ونظام محتوى يجعل التعلّم التقني باللغة العربية عصرياً وواضحاً.",
  },
  "youth-scope": {
    challenge:
      "A youth community program needed a modular visual identity built for fast volunteer publishing across workshops, stages, and social channels.",
    challengeAr:
      "مبادرة شبابية احتاجت هوية بصرية مرنة تمكّن فرق المتطوعين من النشر المتسق عبر الورش والفعاليات والمنصات الاجتماعية.",
  },

  // Development & Digital Products Track (14 projects)
  "nile-pharma-erp": {
    challenge:
      "Built an Arabic RTL operations and commercial ERP console uniting sales orders, collection KPIs, inventory alerts, and rep leaderboards.",
    challengeAr:
      "تطوير لوحة عمليات ومبيعات عربية RTL توحّد أوامر البيع ونسب التحصيل وتنبيهات المخزون ولوحة صدارة المندوبين.",
  },
  "ummah-academy": {
    challenge:
      "Engineered a multilingual Astro learning platform spanning 5 languages, native RTL typography, 23 routes, and offline-ready PWA delivery.",
    challengeAr:
      "بناء منصة تعليمية متعددة اللغات بـ Astro تدعم 5 لغات وتايبوجرافيا RTL أصيلة و23 مساراً وتطبيق ويب قابل للتثبيت.",
  },
  "speech-to-text-studio": {
    challenge:
      "Designed a resilient transcription studio routing uploads and mic recordings across four STT engines with automatic server-side failover.",
    challengeAr:
      "تصميم استوديو تفريغ صوتي يوجّه التسجيلات عبر أربع محركات تعرّف على الكلام مع تبديل تلقائي على الخادم عند ضغط الطلبات.",
  },
  stemforge: {
    challenge:
      "Created a zero-upload browser audio workspace using ONNX Runtime Web and Web Workers to isolate vocals, drums, and bass locally.",
    challengeAr:
      "بناء مساحة عزل مسارات موسيقية تعمل بالكامل داخل المتصفح عبر ONNX Runtime وWeb Workers دون رفع الملفات لأي خادم.",
  },
  "momo-collective": {
    challenge:
      "Architected a bilingual urban streetwear storefront and admin dashboard pairing editorial lookbooks with cart, wishlist, loyalty, and order flows.",
    challengeAr:
      "هندسة متجر أزياء عصرية ثنائي اللغة ولوحة إدارة تجمع العرض التحريري مع السلة والمفضلة ونقاط الولاء وإدارة الطلبات.",
  },
  "farm-console": {
    challenge:
      "Shipped an offline-capable Arabic RTL livestock platform tracking herd records, breeding lineages, veterinary schedules, feed costs, and net profit.",
    challengeAr:
      "تطوير منصة عربية لإدارة المزارع الثروة الحيوانية تتابع سجلات القطيع والأنساب والتطعيمات ومصروفات الأعلاف وصافي الربح.",
  },
  "code-canvas-dev": {
    challenge:
      "Engineered a zero-dependency static studio platform generating 82 bilingual EN/AR pages for 23 fixed-scope services and transparent fee bands.",
    challengeAr:
      "بناء منصة استوديو ثابتة بدون اعتماديات تشغيلية تولّد 82 صفحة ثنائية اللغة لـ 23 خدمة محددة النطاق والتكلفة.",
  },
  "nile-pharma-storefront": {
    challenge:
      "Built a Carved Glass bilingual storefront pairing Payload CMS editorial storytelling with headless Vendure product catalog, pricing, and orders.",
    challengeAr:
      "تطوير واجهة متجر ثنائية اللغة تجمع السرد التحريري عبر Payload CMS مع محرك Vendure لإدارة الكتالوج والأسعار والطلبات.",
  },
  zad: {
    challenge:
      "Built an ad-free, offline-first Islamic worship companion covering 64 screens across prayer times, Quran completion plans, adhkar, and a kids mode.",
    challengeAr:
      "تطوير رفيق عبادة يومي يعمل بدون إنترنت وبدون إعلانات عبر 64 شاشة تشمل المواقيت والورد اليومي والأذكار وواحة الطفل.",
  },
  "mini-exam": {
    challenge:
      "Built a bilingual teacher-to-student assessment studio generating validated AI questions, grading submissions on the server, and formatting WhatsApp reports.",
    challengeAr:
      "بناء نظام اختبارات يولّد أسئلة محكومة بالمدققات ويصحح الإجابات على الخادم تلقائياً مع تجهيز تقارير النتيجة عبر واتساب.",
  },
  "ahmed-kamar": {
    challenge:
      "Crafted a bilingual executive portfolio framing restaurant and delivery-platform analytics case studies with SQL-first clarity and clean hierarchy.",
    challengeAr:
      "تصميم وتطوير بورتفوليو ثنائي اللغة يعرض دراسات حالة تحليل بيانات المطاعم ومنصات التوصيل بوضوح بصري وهيكلي.",
  },
  continuum: {
    challenge:
      "Designed a local-first personal memory operating system across 21 views to reconstruct session context, track decisions, and sync cleanly with Firebase.",
    challengeAr:
      "تصميم نظام ذاكرة شخصي محلي أولاً عبر 21 شاشة لاستعادة سياق العمل وتوثيق القرارات المعمارية والمزامنة السحابية الاختيارية.",
  },
  "pharmacy-web": {
    challenge:
      "Designed a token-driven Arabic RTL pharmacy frontend structured around 15 bounded-context modules, strict import boundaries, and precision money handling.",
    challengeAr:
      "تصميم معمارية واجهة أمامية عربية RTL لصيدلية مبنية على توكنز و15 وحدة سياق مغلق وقواعد حدود برمجية صارمة.",
  },
  "youssef-guba": {
    challenge:
      "Built a bilingual personal operating system for a mobile product engineer uniting case studies, courses, technical writing, and Sanity CMS publishing.",
    challengeAr:
      "تطوير نظام بورتفوليو شخصي ثنائي اللغة لمهندس تطبيقات يجمع دراسات الحالة والدورات والمدونة التقنية مع Sanity CMS.",
  },
  "nile-bed": {
    challenge:
      "Built a bilingual B2B industrial catalogue for a mattress spring manufacturer and supply wholesaler, organizing 69 items across 8 product groups with direct WhatsApp inquiry flows.",
    challengeAr:
      "بناء كتالوج صناعي ثنائي اللغة لمصنع سوست وتوريد خامات مراتب ينظم 69 صنفاً في 8 مجموعات منتجات مع مسارات طلب عروض أسعار عبر واتساب.",
  },
  "craft-egypt": {
    challenge:
      "Built an Arabic RTL storefront and regional craft atlas showcasing authentic Egyptian handmade copperware, textiles, pottery, and decor with a made-to-order inquiry flow.",
    challengeAr:
      "تطوير متجر وواجهة عربية RTL وأطلس ثقافي للحرف اليدوية والتراثية المصرية يجمع أقسام المنتجات وقصص الورش ودليل الطلب المخصص.",
  },
  "clinic-appointment-system": {
    challenge:
      "Built the Arabic RTL patient booking interface, installable PWA layer, and operational setup on top of the open-source Easy!Appointments (GPL-3.0) scheduling platform.",
    challengeAr:
      "تطوير طبقة واجهة حجز مرضى عربية RTL وتطبيق ويب تقدمي (PWA) وإعداد تشغيلي مبني فوق منصة الجدولة مفتوحة المصدر Easy!Appointments (برخصة GPL-3.0).",
  },
};

export function pickFeatured(
  projects: readonly Project[],
  count = projects[0]?.category === "development" ? 6 : 3,
): Project[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const category = projects[0]?.category ?? "design";
  const preferred = FEATURED_SLUGS[category]
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Project => Boolean(p));
  if (preferred.length >= count) return preferred.slice(0, count);

  const used = new Set(preferred.map((p) => p.slug));
  const rest = [...projects]
    .filter((p) => !used.has(p.slug))
    .sort((a, b) => Number(b.hasCaseStudy) - Number(a.hasCaseStudy));
  return [...preferred, ...rest].slice(0, count);
}

interface FeaturedCasesProps {
  projects: readonly Project[];
  /** Home uses an in-page proof block; /work can hide the heading. */
  heading?: "home" | "page" | "none";
  /** Keep identity work and shipped digital products as distinct showcases. */
  variant?: "identity" | "digital";
  sectionId?: string;
  showIndexLink?: boolean;
  /** Renders the "See more" CTA button directly below the track's cards. */
  showMoreButton?: boolean;
  contained?: boolean;
}

export function FeaturedCases({
  projects,
  heading = "home",
  variant = "identity",
  sectionId,
  showIndexLink = true,
  showMoreButton = true,
  contained = true,
}: FeaturedCasesProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const featured = pickFeatured(projects);
  const trackHref = variant === "digital" ? "/work/development" : "/work/design";

  if (featured.length === 0) return null;

  return (
    <Section
      id={sectionId ?? (variant === "digital" ? "home-digital-products" : "selected-work")}
      density={contained ? "default" : "compact"}
      className={joinClasses(contained && "container-wide", "flex scroll-mt-16 flex-col gap-6")}
    >
      {heading === "none" ? null : (
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[46ch] flex-col gap-1">
            <SectionLabel>
              {variant === "digital"
                ? ar
                  ? "منتجات رقمية"
                  : "Digital products"
                : ar
                  ? "أعمال مختارة"
                  : "Selected work"}
            </SectionLabel>
            <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
              {variant === "digital" ? (
                ar ? (
                  <>
                    منتجات رقمية <em className="text-accent">جاهزة للتجربة.</em>
                  </>
                ) : (
                  <>
                    Digital products <em className="text-accent">ready to explore.</em>
                  </>
                )
              ) : heading === "home" ? (
                ar ? (
                  <>
                    هويات بصرية مختارة: <em className="text-accent">أعمال حقيقية ونتائج موثقة.</em>
                  </>
                ) : (
                  <>
                    Selected Brand Identities: <em className="text-accent">real systems in production.</em>
                  </>
                )
              ) : ar ? (
                <>
                  قصص تقدر تقيس عليها <em className="text-accent">مشروعك.</em>
                </>
              ) : (
                <>
                  Cases you can map to <em className="text-accent">your brief.</em>
                </>
              )}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {variant === "digital"
                ? ar
                  ? "منصات وأدوات وتجارب رقمية — استكشف التفاصيل والعرض المرئي، وجرّب المعاينة العامة لما تكون متاحة."
                  : "Platforms, tools and digital experiences — explore the details, visual overview and available public previews."
                : ar
                  ? "التحدي، ما تم تصميمه، والنتيجة — عبر الرعاية الصحية، الفنون والمطبوعات، والمنتجات الاستهلاكية."
                  : "The challenge, what was designed, and the outcome — across healthcare, editorial art & print, and consumer goods."}
            </p>
          </div>
          {showIndexLink ? (
            <Link
              href={trackHref}
              className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
            >
              {variant === "digital"
                ? ar
                  ? "كل مشاريع التطوير"
                  : "All development projects"
                : ar
                  ? "كل مشاريع التصميم"
                  : "All design projects"}
              <span aria-hidden className="ms-1 inline-flex">
                <Icon name="arrow-right" />
              </span>
            </Link>
          ) : null}
        </div>
      )}

      {heading === "none" ? (
        <h2 className="sr-only">
          {variant === "digital"
            ? ar
              ? "منتجات رقمية مختارة"
              : "Featured digital products"
            : ar
              ? "هويات مختارة"
              : "Featured identity work"}
        </h2>
      ) : null}

      {/* Home on a phone: one card at a time, swipe for the rest (a stacked
          grid made each showcase a five-screen scroll). */}
      <div
        className={joinClasses(
          "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
          heading === "home" &&
            "max-md:-mx-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-3 max-md:gap-3 max-md:overflow-x-auto max-md:px-3 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden",
        )}
      >
        {featured.map((project, i) => (
          <div
            key={project.slug}
            className={heading === "home" ? "max-md:w-[84%] max-md:shrink-0 max-md:snap-start md:contents" : "contents"}
          >
            <FeaturedCard project={project} ar={ar} priority={heading === "none" && i === 0} />
          </div>
        ))}
      </div>

      {showMoreButton ? (
        <div className="mt-2 flex flex-col items-center justify-between gap-4 border-t border-border-default pt-6 sm:flex-row">
          <p className="font-mono text-micro uppercase tracking-[0.1em] text-text-tertiary">
            {variant === "digital"
              ? ar
                ? `عرض ${featured.length} من أصل ${projects.length} مشروع في مسار التطوير`
                : `Showing ${featured.length} of ${projects.length} projects in Development`
              : ar
                ? `عرض ${featured.length} من أصل ${projects.length} مشروع في مسار التصميم`
                : `Showing ${featured.length} of ${projects.length} projects in Design`}
          </p>
          <Link
            href={trackHref}
            onClick={() =>
              trackEvent("track_see_more", {
                track: variant === "digital" ? "development" : "design",
              })
            }
            className={buttonVariants({
              variant: "primary",
              className:
                "inline-flex w-full items-center justify-center gap-2.5 px-7 py-3.5 font-mono text-label font-semibold tracking-[0.08em] transition-transform duration-base ease-physics hover:-translate-y-0.5 sm:w-auto",
            })}
          >
            <span>{ar ? "عرض المزيد" : "See more"}</span>
            <span className="rounded-pill bg-obsidian/15 px-2 py-0.5 text-micro font-bold text-obsidian">
              {projects.length}
            </span>
            <span aria-hidden className="inline-flex">
              <Icon name="arrow-right" />
            </span>
          </Link>
        </div>
      ) : null}
    </Section>
  );
}

type Destination = "case" | "live" | "demo" | "external";

function destinationOf(project: Project): Destination {
  if (project.hasCaseStudy) return "case";
  if (project.isDemo) return "demo";
  if (project.liveUrl) return "live";
  return project.externalUrl ? "external" : "external";
}

const DESTINATION_COPY: Record<Destination, { en: string; ar: string }> = {
  case: { en: "Read the case study", ar: "اقرأ دراسة الحالة" },
  live: { en: "Visit the live site", ar: "زور الموقع المباشر" },
  demo: { en: "Demo · Request walkthrough", ar: "عرض تجريبي · اطلب معاينة" },
  external: { en: "Open external portfolio", ar: "افتح البورتفوليو الخارجي" },
};

export interface FeaturedCardProps {
  project: Project;
  ar: boolean;
  priority?: boolean;
  showStack?: boolean;
}

export function FeaturedCard({
  project,
  ar,
  priority = false,
  showStack = false,
}: FeaturedCardProps) {
  const story = STORIES[project.slug];
  const destination = destinationOf(project);
  const internal = destination === "case" || destination === "demo";
  const href =
    destination === "case"
      ? `/case-studies/${project.slug}`
      : destination === "demo"
        ? "/contact?service=digital-product&source=/work/development"
        : (project.liveUrl ?? project.externalUrl ?? BEHANCE);
  const name = ar && project.nameAr ? project.nameAr : project.name;
  const outcome = ar && project.outcomeAr ? project.outcomeAr : project.outcome;
  const challenge = story ? (ar ? story.challengeAr : story.challenge) : outcome;
  const kind =
    project.category === "development"
      ? ar
        ? "منتج رقمي"
        : "Digital product"
      : ar
        ? "هوية"
        : "Identity";
  const cta = DESTINATION_COPY[destination];

  const badge =
    destination === "case"
      ? { label: kind, tone: "outline" as const }
      : destination === "demo"
        ? { label: ar ? "Demo · عرض تجريبي" : "Demo", tone: "creative" as const }
        : destination === "live"
          ? { label: ar ? "منتج حي" : "Live product", tone: "live" as const }
          : { label: ar ? "بورتفوليو خارجي" : "External portfolio", tone: "neutral" as const };

  const domainLabel = project.liveUrl
    ? project.liveUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "")
    : project.isDemo
      ? "Easy!Appointments · GPL-3.0"
      : project.discipline;

  return (
    <article className="flex flex-col gap-3">
      <Link
        href={href}
        aria-label={name}
        onClick={
          destination === "case"
            ? () => trackEvent("case_study_open", { slug: project.slug, surface: "card_media" })
            : undefined
        }
        {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="block rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <MediaCard className="group relative aspect-[16/10] overflow-hidden bg-surface-1">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 120% at 20% 0%, ${project.accent.primary}, transparent 60%),
                           radial-gradient(120% 120% at 90% 100%, ${project.accent.secondary}, transparent 65%)`,
            }}
          />
          <div aria-hidden className="edge-light" />
          {project.thumbnail ? (
            <Image
              src={cardArt(project.thumbnail)}
              alt={name}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-physics group-hover:scale-[1.025]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            /* Clean Name + Domain / Demo card when no preview image is stored (no mock-ups).
               The outcome line is pinned to the card bottom (2 lines, ~46px), so this block
               keeps pb-16 and clamps the name to 2 lines — a 3-word name at title size used
               to wrap onto it. The domain is shown once, under the name. */
            <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 pb-16">
              <span className="w-fit whitespace-nowrap rounded-pill border border-border-default bg-surface-1/80 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                {project.isDemo
                  ? ar
                    ? "DEMO · عرض تجريبي"
                    : "DEMO · RTL + PWA LAYER"
                  : ar
                    ? "موقع مباشر"
                    : "LIVE DEPLOYMENT"}
              </span>
              <div className="flex flex-col gap-1">
                <span className="line-clamp-2 font-display text-subtitle font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent">
                  {name}
                </span>
                <span
                  dir="ltr"
                  className="font-mono text-micro text-text-tertiary"
                >
                  {domainLabel}
                </span>
              </div>
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian/92 via-obsidian/55 to-transparent"
          />
          <p className="absolute inset-x-0 bottom-0 z-elevated line-clamp-2 px-3.5 pb-2.5 font-mono text-micro uppercase tracking-[0.08em] text-alabaster/90">
            {outcome}
          </p>
        </MediaCard>
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {project.status === "in-progress" ? (
              <Badge tone="creative" size="sm">
                {ar ? "قيد التنفيذ" : "In progress"}
              </Badge>
            ) : null}
            <Badge tone={badge.tone} size="sm">
              {badge.label}
            </Badge>
          </div>
          <span className="font-mono text-micro tracking-[0.08em] text-text-ghost">
            {project.year}
          </span>
        </div>

        <h3 className="font-display font-display-sm text-subtitle leading-[1.15] tracking-[-0.015em] text-text-primary">
          <Link
            href={href}
            onClick={
              internal
                ? () => trackEvent("case_study_open", { slug: project.slug, surface: "card_title" })
                : undefined
            }
            {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="transition-colors duration-base ease-physics hover:text-accent"
          >
            {name}
          </Link>
        </h3>

        <p className="text-body-sm text-text-secondary">{challenge}</p>

        {showStack && project.stack.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border-default bg-surface-1 px-2.5 py-0.5 font-mono text-micro text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={href}
            onClick={
              internal
                ? () => trackEvent("case_study_open", { slug: project.slug, surface: "featured_card" })
                : undefined
            }
            {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className={buttonVariants({
              variant: "ghost",
              className:
                "w-fit font-mono text-label tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary focus-visible:text-text-primary",
            })}
          >
            {ar ? cta.ar : cta.en}
            <span aria-hidden className="ms-1 inline-flex">
              <Icon name="arrow-up-right" />
            </span>
          </Link>

          {internal && project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target={project.liveUrl.startsWith("/") ? undefined : "_blank"}
              rel={project.liveUrl.startsWith("/") ? undefined : "noopener noreferrer"}
              className="font-mono text-micro uppercase tracking-[0.08em] text-accent/90 transition-colors duration-base ease-physics hover:text-accent"
            >
              {ar ? "معاينة حية ↗" : "Live preview ↗"}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
