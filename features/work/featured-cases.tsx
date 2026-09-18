"use client";

/**
 * FEATURED CASES — the proof layer.
 * Two or three story-led cards (image, challenge, outcome, CTA) sit in
 * front of the compact ledger. Hover preview is never required to
 * understand the work.
 */
import Image from "next/image";
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

const FEATURED_SLUGS = ["gad-institute", "nile-pharma", "code-canvas-dev"] as const;

const STORIES: Record<string, { challenge: string; challengeAr: string }> = {
  "gad-institute": {
    challenge: "A bilingual healthcare institute needed one identity that could govern print, digital, and wayfinding.",
    challengeAr: "معهد رعاية صحية ثنائي اللغة احتاج هوية واحدة تحكم المطبوع والرقمي والإرشاد.",
  },
  "nile-pharma": {
    challenge: "A pharma-food brand that had to look as rigorous as the operation behind it.",
    challengeAr: "براند دواء وغذاء احتاج يظهر بنفس صرامة التشغيل اللي وراه.",
  },
  "code-canvas-dev": {
    challenge: "A two-track studio platform that had to feel like one ecosystem in two languages.",
    challengeAr: "منصة استوديو بمسارين احتاجت تحس كمنظومة واحدة بلغتين.",
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
  const preferred = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter((p): p is Project => Boolean(p));
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
  showIndexLink?: boolean;
  contained?: boolean;
}

export function FeaturedCases({
  projects,
  heading = "home",
  showIndexLink = true,
  contained = true,
}: FeaturedCasesProps) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const featured = pickFeatured(projects, 3);

  if (featured.length === 0) return null;

  return (
    <Section
      id="selected-work"
      density={contained ? "default" : "compact"}
      className={joinClasses(contained && "container-wide", "flex scroll-mt-16 flex-col gap-6")}
    >
      {heading === "none" ? null : (
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[46ch] flex-col gap-1">
            <SectionLabel>{ar ? "أعمال مختارة" : "Selected work"}</SectionLabel>
            <h2 className="font-display text-title tracking-[-0.015em] text-text-primary">
              {heading === "home" ? (
                ar ? (
                  <>الدليل، مش الـ <em className="text-accent">manifest.</em></>
                ) : (
                  <>The proof, not the <em className="text-accent">manifest.</em></>
                )
              ) : ar ? (
                <>قصص تقدر تقيس عليها <em className="text-accent">مشروعك.</em></>
              ) : (
                <>Cases you can map to <em className="text-accent">your brief.</em></>
              )}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {ar
                ? "المشكلة، ما الذي بُني، والنتيجة — قبل الجدول والمكدس."
                : "The problem, what shipped, and the outcome — before the stack table."}
            </p>
          </div>
          {showIndexLink ? (
            <Link
              href="/work"
              className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
            >
              {ar ? "كل الأعمال" : "See all work"}
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
        <h2 className="sr-only">{ar ? "حالات مختارة" : "Featured cases"}</h2>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <FeaturedCard key={project.slug} project={project} ar={ar} />
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
  return project.externalUrl ? "live" : "external";
}

const DESTINATION_COPY: Record<
  Destination,
  { en: string; ar: string }
> = {
  case:     { en: "Read the case study", ar: "اقرأ دراسة الحالة" },
  live:     { en: "Visit the live site", ar: "زور الموقع المباشر" },
  external: { en: "Open external portfolio", ar: "افتح البورتفوليو الخارجي" },
};

function FeaturedCard({ project, ar }: { project: Project; ar: boolean }) {
  const story = STORIES[project.slug];
  const destination = destinationOf(project);
  const internal = destination === "case";
  const href = internal ? `/case-studies/${project.slug}` : (project.externalUrl ?? BEHANCE);
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
      <MediaCard className="relative aspect-[16/10] overflow-hidden bg-surface-1">
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
          className="object-cover"
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
        <Badge tone={badge.tone} size="sm">{badge.label}</Badge>
        <h3 className="font-display text-subtitle leading-[1.15] tracking-[-0.015em] text-text-primary">
          {name}
        </h3>
        <p className="text-body-sm text-text-secondary">{challenge}</p>
        <Link
          href={href}
          {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className={buttonVariants({
            variant: "ghost",
            className:
              "mt-1 w-fit font-mono text-label tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary",
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
