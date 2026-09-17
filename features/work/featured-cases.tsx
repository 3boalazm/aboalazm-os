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
              <span aria-hidden className="ms-1">
                →
              </span>
            </Link>
          ) : null}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <FeaturedCard key={project.slug} project={project} ar={ar} />
        ))}
      </div>
    </Section>
  );
}

function FeaturedCard({ project, ar }: { project: Project; ar: boolean }) {
  const story = STORIES[project.slug];
  const internal = project.hasCaseStudy;
  const href = internal ? `/case-studies/${project.slug}` : (project.externalUrl ?? BEHANCE);
  const name = ar && project.nameAr ? project.nameAr : project.name;
  const outcome = ar && project.outcomeAr ? project.outcomeAr : project.outcome;
  const challenge = story ? (ar ? story.challengeAr : story.challenge) : outcome;
  const kind = project.category === "development"
    ? ar ? "منتج رقمي" : "Digital product"
    : ar ? "هوية" : "Identity";

  return (
    <article className="flex flex-col gap-3">
      <MediaCard className="relative aspect-[16/10] bg-surface-1">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 120% at 20% 0%, ${project.accent.primary}, transparent 60%),
                         radial-gradient(120% 120% at 90% 100%, ${project.accent.secondary}, transparent 65%)`,
          }}
        />
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
      </MediaCard>

      <div className="flex flex-col gap-2">
        <Badge tone="outline">{kind}</Badge>
        <h3 className="font-display text-[1.35rem] leading-[1.15] tracking-[-0.015em] text-text-primary">
          {name}
        </h3>
        <p className="text-body-sm text-text-secondary">{challenge}</p>
        <p className="font-mono text-micro uppercase tracking-[0.06em] text-text-tertiary">
          {outcome}
        </p>
        <Link
          href={href}
          {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className={buttonVariants({
            variant: "ghost",
            className:
              "mt-1 w-fit font-mono text-label tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary",
          })}
        >
          {internal ? (ar ? "اقرأ دراسة الحالة" : "Read the case") : project.externalUrl ? (ar ? "الموقع المباشر" : "Live site") : "Behance"}
          <span aria-hidden className="ms-1">
            ↗
          </span>
        </Link>
      </div>
    </article>
  );
}
