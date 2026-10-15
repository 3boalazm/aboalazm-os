"use client";

/**
 * FEATURED CASES — the proof layer.
 * Two or three story-led cards (image, challenge, outcome, CTA) sit in
 * front of the compact ledger. Hover preview is never required to
 * understand the work.
 */
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { MediaCard } from "@/components/ui/MediaCard";
import { Section, SectionLabel } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/Button";
import { joinClasses } from "@/lib/utils";
import { BEHANCE } from "./projects.data";
import type { Project } from "./types";

const FEATURED_SLUGS = {
  design: ["gad-institute", "reflection", "nile-pharma"],
  development: ["momo-collective", "zad", "farm-console"],
} as const;

const STORIES: Record<string, { challenge: string; challengeAr: string }> = {
  "gad-institute": {
    challenge: "A specialized cardiac and pulmonary institute needed an authoritative yet warm bilingual identity to govern architectural signage and patient care.",
    challengeAr: "معهد رعاية قلب ورئة تخصصي احتاج هوية ثنائية اللغة تجمع بين الثقة الطبية والدفء الإنساني لتطبيقها عبر اللافتات والمنصات الرقمية.",
  },
  "reflection": {
    challenge: "An art and print studio needed a warm, airy editorial identity distinct from cheap poster shops and sterile art galleries.",
    challengeAr: "استوديو فنون ومطبوعات احتاج هوية تحريرية دافئة تميزه عن متاجر البوسترات الشعبية وصالات العرض الباردة المنعزلة.",
  },
  "nile-pharma": {
    challenge: "A pharma-food brand operating without visual governance that needed consumer packaging authority and bilingual shelf impact.",
    challengeAr: "شركة مكملات غذائية وأدوية كانت تعمل دون حوكمة بصرية، فاحتاجت معمارية تغليف موحدة وحضوراً قوياً على أرفف الصيدليات.",
  },
  "ahmed-bedeer": {
    challenge: "A healthcare IT leader needed a personal brand with gravitas, not corporate stiffness.",
    challengeAr: "قائد في تكنولوجيا المعلومات الصحية احتاج براند شخصي بوقار، من غير جمود مؤسسي.",
  },
  "code-canvas": {
    challenge: "A studio that had to prove it could run on the same system it sells.",
    challengeAr: "استوديو احتاج يثبت إنه بيشتغل على نفس النظام اللي بيبيعه.",
  },
};

export function pickFeatured(projects: readonly Project[], count = 3): Project[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const category = projects[0]?.category ?? "design";
  const preferred = FEATURED_SLUGS[category].map((slug) => bySlug.get(slug)).filter((p): p is Project => Boolean(p));
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
  contained?: boolean;
}

export function FeaturedCases({
  projects,
  heading = "home",
  variant = "identity",
  sectionId,
  showIndexLink = true,
  contained = true,
}: FeaturedCasesProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const featured = pickFeatured(projects, 3);

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
                ? ar ? "منتجات رقمية" : "Digital products"
                : ar ? "أعمال مختارة" : "Selected work"}
            </SectionLabel>
            <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
              {variant === "digital" ? (
                ar ? (
                  <>منتجات رقمية <em className="text-accent">جاهزة للتجربة.</em></>
                ) : (
                  <>Digital products <em className="text-accent">ready to explore.</em></>
                )
              ) : heading === "home" ? (
                ar ? (
                  <>هويات بصرية مختارة: <em className="text-accent">أعمال حقيقية ونتائج موثقة.</em></>
                ) : (
                  <>Selected Brand Identities: <em className="text-accent">real systems in production.</em></>
                )
              ) : ar ? (
                <>قصص تقدر تقيس عليها <em className="text-accent">مشروعك.</em></>
              ) : (
                <>Cases you can map to <em className="text-accent">your brief.</em></>
              )}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {variant === "digital"
                ? ar
                  ? "منصات وأدوات وتجارب رقمية — افتح أي مشروع لزيارة نسخته المنشورة واستكشافه مباشرة."
                  : "Platforms, tools, and digital experiences — open a project to explore its production version."
                : ar
                  ? "التحدي، ما تم تصميمه، والنتيجة — عبر الرعاية الصحية، الفنون والمطبوعات، والمنتجات الاستهلاكية."
                  : "The challenge, what was designed, and the outcome — across healthcare, editorial art & print, and consumer goods."}
            </p>
          </div>
          {showIndexLink ? (
            <Link
              href={variant === "digital" ? "/work#digital-products" : "/work"}
              className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
            >
              {variant === "digital"
                ? ar ? "كل المنتجات الرقمية" : "All digital products"
                : ar ? "كل الأعمال" : "See all work"}
              <span aria-hidden className="ms-1 inline-flex">
                <Icon name="arrow-right" />
              </span>
            </Link>
          ) : null}
        </div>
      )}

      {/* /work suppresses the visible section heading ("heading: none"), which
          left the page as h1 "Selected Work" followed straight by h3 case
          titles — a skipped level, and no name for the group itself. The
          heading is restored for assistive tech only; the visual composition
          is unchanged. */}
      {heading === "none" ? (
        <h2 className="sr-only">
          {variant === "digital"
            ? ar ? "منتجات رقمية مختارة" : "Featured digital products"
            : ar ? "هويات مختارة" : "Featured identity work"}
        </h2>
      ) : null}

      {/* /work (heading "none") opens on these cards, so its first thumbnail is
          the LCP image and loads eagerly; on home the block sits far below the
          hero and every thumbnail stays lazy. */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <FeaturedCard
            key={project.slug}
            project={project}
            ar={ar}
            priority={heading === "none" && i === 0}
          />
        ))}
      </div>
    </Section>
  );
}

/**
 * WHERE THE BUTTON ACTUALLY GOES.
 * The audit flagged that every CTA read as a case study even when the row
 * opened Behance or a live product. The destination is now a typed value,
 * so the label, the arrow, and the meta line all agree — and the user
 * never has to press to find out what kind of thing they are opening.
 */
type Destination = "case" | "live" | "external";

function destinationOf(project: Project): Destination {
  if (project.hasCaseStudy) return "case";
  if (project.liveUrl) return "live";
  return project.externalUrl ? "external" : "external";
}

const DESTINATION_COPY: Record<
  Destination,
  { en: string; ar: string }
> = {
  case:     { en: "Read the case study", ar: "اقرأ دراسة الحالة" },
  live:     { en: "Visit the live site", ar: "زور الموقع المباشر" },
  external: { en: "Open external portfolio", ar: "افتح البورتفوليو الخارجي" },
};

function FeaturedCard({ project, ar, priority = false }: { project: Project; ar: boolean; priority?: boolean }) {
  const story = STORIES[project.slug];
  const destination = destinationOf(project);
  const internal = destination === "case";
  const href = internal ? `/case-studies/${project.slug}` : (project.liveUrl ?? project.externalUrl ?? BEHANCE);
  const name = ar && project.nameAr ? project.nameAr : project.name;
  const outcome = ar && project.outcomeAr ? project.outcomeAr : project.outcome;
  const challenge = story ? (ar ? story.challengeAr : story.challenge) : outcome;
  const kind = project.category === "development"
    ? ar ? "منتج رقمي" : "Digital product"
    : ar ? "هوية" : "Identity";
  const cta = DESTINATION_COPY[destination];

  /* The badge carries the destination, so the CTA is confirmation rather
     than a reveal. `case` is the default reading for a portfolio card and
     stays quiet; the other two are worth flagging before the click. */
  const badge =
    destination === "case"
      ? { label: kind, tone: "outline" as const }
      : destination === "live"
        ? { label: ar ? "منتج حي" : "Live product", tone: "live" as const }
        : { label: ar ? "بورتفوليو خارجي" : "External portfolio", tone: "neutral" as const };

  return (
    <article className="flex flex-col gap-3">
      {/* Project atmosphere lives on the media object only — never on the
          card chrome, so the three cards stay a set rather than a rainbow.
          The scrim sits above the image so captions keep their contrast
          while the project's own colour still reads in the static state. */}
      <MediaCard className="group relative aspect-[16/10] overflow-hidden bg-surface-1">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 120% at 20% 0%, ${project.accent.primary}, transparent 60%),
                         radial-gradient(120% 120% at 90% 100%, ${project.accent.secondary}, transparent 65%)`,
          }}
        />
        {/* Glass edge — the media object reads as a lit surface rather than
            a framed rectangle. Static, never hover-gated. */}
        <div aria-hidden className="edge-light" />
        <Image
          src={project.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-physics group-hover:scale-[1.025]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent"
        />
        {/* Outcome sits ON the image at the bottom, where a portfolio
            reads it, instead of as a mono line buried under the copy. */}
        <p className="absolute inset-x-0 bottom-0 z-elevated px-3 pb-2 font-mono text-micro uppercase tracking-[0.08em] text-alabaster/85">
          {outcome}
        </p>
      </MediaCard>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {project.status === "in-progress" ? (
            <Badge tone="creative" size="sm">{ar ? "قيد التنفيذ" : "In progress"}</Badge>
          ) : null}
          <Badge tone={badge.tone} size="sm">{badge.label}</Badge>
        </div>
        <h3 className="font-display text-subtitle leading-[1.15] tracking-[-0.015em] text-text-primary">
          {name}
        </h3>
        <p className="text-body-sm text-text-secondary">{challenge}</p>
        <Link
          href={href}
          onClick={internal ? () => trackEvent("case_study_open", { slug: project.slug, surface: "featured_card" }) : undefined}
          {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className={buttonVariants({
            variant: "ghost",
            className:
              "mt-1 w-fit font-mono text-label tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary focus-visible:text-text-primary",
          })}
        >
          {ar ? cta.ar : cta.en}
          <span aria-hidden className="ms-1 inline-flex">
            <Icon name="arrow-up-right" />
          </span>
        </Link>
      </div>
    </article>
  );
}
