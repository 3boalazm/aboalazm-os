"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "@/components/ui/localized-link";
import { useLang } from "@/components/providers/lang-provider";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PanelCard } from "@/components/ui/PanelCard";
import { Section, SectionLabel } from "@/components/ui/Section";
import { useAmbientGlow } from "@/hooks/use-ambient-glow";
import { cardArt } from "@/features/work/card-art";
import { projectEnquiryService } from "@/features/work/project-enquiry-service";
import { contactHref } from "@/lib/contact-context";
import type { Project } from "@/features/work/types";
import type { BusinessCaseData, Bilingual } from "./business-case.types";
import { ClientOriginStamp } from "./client-origin-stamp";

/* A slash between two words is not a line-break opportunity, so on a phone a compound such as
   "WooCommerce/WordPress" or "speaker/instructor" either cannot wrap (and pushed the page sideways at
   320px) or, once the card is clamped, is cut in the middle of a word. Below sm a zero-width space
   after the slash lets the line break there. It sits in a span that is display:none from sm up, so
   tablet and desktop wrapping is exactly what it was. */
function SlashBreaks({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\p{L}\/)(?=\p{L})/u).map((part, i) =>
        i % 2 === 1 ? (
          <Fragment key={i}>
            {part}
            <span aria-hidden className="sm:hidden">
              {"\u200b"}
            </span>
          </Fragment>
        ) : (
          part
        ),
      )}
    </>
  );
}

const pick = (text: Bilingual, ar: boolean) => <SlashBreaks text={ar ? text.ar : text.en} />;

export interface BusinessCaseViewProps {
  data: BusinessCaseData;
  project?: Project;
  fallbackName?: string;
  fallbackNameAr?: string;
  fallbackYear?: string;
  fallbackThumbnail?: string;
  onSwitchToTechnical?: () => void;
}

export function BusinessCaseView({
  data,
  project,
  fallbackName,
  fallbackNameAr,
  fallbackYear,
  fallbackThumbnail,
  onSwitchToTechnical,
}: BusinessCaseViewProps) {
  const { lang } = useLang();
  const ar = lang === "ar";

  useAmbientGlow(
    project?.accent ?? {
      primary: "rgb(255 94 26 / 0.16)",
      secondary: "rgb(139 92 246 / 0.10)",
    },
    0.55,
  );

  const name = ar
    ? (project?.nameAr ?? fallbackNameAr ?? project?.name ?? fallbackName ?? data.slug)
    : (project?.name ?? fallbackName ?? data.slug);
  const year = project?.year ?? fallbackYear;
  const isDev = project ? project.category === "development" : true;
  const service = project ? projectEnquiryService(project) : "brand-identity";
  const trackHref = isDev ? "/work/development" : "/work/design";
  const previewSrc = project ? cardArt(project.thumbnail) : fallbackThumbnail;
  const liveHref = project?.liveUrl;
  const isLocalShowcase = Boolean(liveHref && liveHref.startsWith("/"));

  return (
    <article className="flex flex-col">
      {/* ═══ 01 · BUSINESS HERO & EXECUTIVE SNAPSHOT ═══ */}
      <Section density="compact" className="container-wide flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-micro uppercase tracking-[0.12em] text-text-tertiary">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/work" className="inline-flex items-center gap-1.5 transition-colors hover:text-text-primary">
              <Icon name="arrow-left" />
              <span>{ar ? "كل الأعمال" : "All work"}</span>
            </Link>
            <span aria-hidden className="text-text-ghost">/</span>
            <Link href={trackHref} className="transition-colors hover:text-text-primary">
              {isDev
                ? ar ? "المنتجات الرقمية" : "Digital Products"
                : ar ? "الهويات البصرية" : "Brand Identity"}
            </Link>
          </div>
          <span className="text-accent">
            {ar ? "الجانب التجاري والمنتج" : "Business & Product Overview"}
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" size="sm">
                {pick(data.sector, ar)}
              </Badge>
              {year ? (
                <Badge tone="outline" size="sm">
                  {year}
                </Badge>
              ) : null}
              {project?.status === "in-progress" ? (
                <Badge tone="creative" size="sm">
                  {ar ? "قيد الاستكمال" : "In progress"}
                </Badge>
              ) : liveHref ? (
                <Badge tone="live" size="sm">
                  {isLocalShowcase
                    ? ar ? "معاينة تفاعلية" : "Interactive showcase"
                    : ar ? "منتج حيّ" : "Live product"}
                </Badge>
              ) : (
                <Badge tone="neutral" size="sm">
                  {isDev
                    ? ar ? "ملف منتج موثّق" : "Saved product file"
                    : ar ? "نظام هوية منجز" : "Delivered system"}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <h1 className="text-balance font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.03em] text-text-primary">
                {name}
              </h1>
              <p className="max-w-[46ch] font-display text-subtitle leading-[1.3] text-accent">
                {pick(data.headline, ar)}
              </p>
              {data.clientOrigin ? (
                <ClientOriginStamp origin={data.clientOrigin} ar={ar} />
              ) : null}
            </div>

            <p className="max-w-[64ch] text-body leading-[1.7] text-text-secondary">
              {pick(data.summary, ar)}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {liveHref ? (
                <a
                  href={liveHref}
                  target={isLocalShowcase ? "_blank" : "_blank"}
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "primary",
                    className:
                      "inline-flex items-center gap-2 px-5 py-2.5 font-mono text-label font-semibold tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
                  })}
                >
                  <span>
                    {isLocalShowcase
                      ? ar ? "افتح المعاينة التفاعلية" : "Open interactive showcase"
                      : ar ? "افتح المنتج الحي" : "Open live product"}
                  </span>
                  <Icon name="arrow-up-right" />
                </a>
              ) : null}

              <Link
                href={contactHref({ service, source: `/case-studies/${data.slug}` })}
                className={buttonVariants({
                  variant: liveHref ? "ghost" : "primary",
                  className: liveHref
                    ? "inline-flex items-center gap-2 border border-border-default bg-surface-1 px-5 py-2.5 font-mono text-label tracking-[0.06em] text-text-primary transition-colors duration-base ease-physics hover:border-accent hover:text-accent"
                    : "inline-flex items-center gap-2 px-5 py-2.5 font-mono text-label font-semibold tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
                })}
              >
                <span>{ar ? "اطلب مشروعًا مشابهًا" : "Build something similar"}</span>
                <Icon name="arrow-right" />
              </Link>

              {onSwitchToTechnical ? (
                <button
                  type="button"
                  onClick={onSwitchToTechnical}
                  className="cursor-pointer rounded-pill border border-border-subtle px-4 py-2.5 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary transition-colors duration-base ease-physics hover:border-border-strong hover:text-text-primary"
                >
                  {ar ? "التفاصيل التقنية والهندسية ←" : "Technical architecture →"}
                </button>
              ) : null}
            </div>
          </div>

          {previewSrc ? (
            <figure className="overflow-hidden rounded-card border border-border-default bg-surface-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
                <Image
                  src={previewSrc}
                  alt={ar ? `معاينة مشروع ${name}` : `${name} visual preview`}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 border-t border-border-subtle px-3.5 py-2.5 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary">
                <span>{ar ? "واجهة ومخرجات المشروع" : "Project surface & deliverables"}</span>
                <span className="text-accent">{data.slug.toUpperCase()}</span>
              </figcaption>
            </figure>
          ) : null}
        </div>

        {/* 4-column Business Snapshot */}
        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
          {data.snapshot.map((item) => (
            <PanelCard
              key={item.label.en}
              className="flex flex-col justify-between gap-2 rounded-card p-4"
            >
              <span className="font-mono text-micro uppercase tracking-[0.1em] text-text-tertiary">
                {pick(item.label, ar)}
              </span>
              <p className="text-body-sm font-medium leading-[1.45] text-text-primary">
                {pick(item.value, ar)}
              </p>
            </PanelCard>
          ))}
        </div>
      </Section>

      {/* ═══ 02 · PRACTICAL PROBLEM → BUSINESS SOLUTION & STAKEHOLDERS ═══ */}
      <Section className="border-y border-border-subtle bg-surface-1/45">
        <div className="container-wide flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <SectionLabel>
              01 · {ar ? "المشكلة والحل العملي" : "The Business Problem & Solution"}
            </SectionLabel>
            <h2 className="font-display text-title tracking-[-0.02em] text-text-primary">
              {ar ? "ما المشكلة الواقعية التي يحلّها هذا المشروع؟" : "What real-world problem does this solve?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Before */}
            <PanelCard emphasis="dimmed" className="flex flex-col gap-4 rounded-card p-5">
              <div className="flex flex-col gap-2 border-b border-border-subtle pb-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-subtitle text-text-primary">
                  {pick(data.problemAndShift.beforeTitle, ar)}
                </h3>
                <Badge tone="outline" size="sm">
                  {ar ? "قبل النظام" : "Before"}
                </Badge>
              </div>
              <ul className="flex flex-col gap-3">
                {data.problemAndShift.beforePoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-body-sm leading-[1.65] text-text-secondary">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-text-ghost" />
                    <span className="min-w-0 break-words">{pick(pt, ar)}</span>
                  </li>
                ))}
              </ul>
            </PanelCard>

            {/* After */}
            <PanelCard className="flex flex-col gap-4 rounded-card border-accent/35 p-5">
              <div className="flex flex-col gap-2 border-b border-border-subtle pb-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-subtitle text-text-primary">
                  {pick(data.problemAndShift.afterTitle, ar)}
                </h3>
                <Badge tone="accent" size="sm">
                  {ar ? "بعد التطبيق" : "With this project"}
                </Badge>
              </div>
              <ul className="flex flex-col gap-3">
                {data.problemAndShift.afterPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-body-sm leading-[1.65] text-text-primary">
                    <span className="mt-0.5 inline-flex shrink-0 text-accent">
                      <Icon name="check" />
                    </span>
                    <span className="min-w-0 break-words">{pick(pt, ar)}</span>
                  </li>
                ))}
              </ul>
            </PanelCard>
          </div>

          {/* Who Benefits */}
          <div className="flex flex-col gap-3 pt-1">
            <p className="font-mono text-micro uppercase tracking-[0.1em] text-text-tertiary">
              {ar ? "من يستخدمه وماذا يجني منه" : "Who uses it & what they gain"}
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {data.problemAndShift.stakeholders.map((s) => (
                <PanelCard key={s.role.en} className="flex flex-col gap-2 rounded-card p-4">
                  <h3 className="font-display text-body font-semibold text-accent">
                    {pick(s.role, ar)}
                  </h3>
                  <p className="text-body-sm leading-[1.6] text-text-secondary">
                    {pick(s.benefit, ar)}
                  </p>
                </PanelCard>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 03 · HOW IT WORKS STEP-BY-STEP ═══ */}
      <Section className="container-wide flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <SectionLabel>
            02 · {ar ? "طريقة العمل" : "How It Works"}
          </SectionLabel>
          <h2 className="font-display text-title tracking-[-0.02em] text-text-primary">
            {ar ? "كيف يعمل المشروع خطوةً بخطوة؟" : "How the project works in practice"}
          </h2>
          <p className="max-w-[62ch] text-body-sm text-text-secondary">
            {pick(data.workflowIntro, ar)}
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.workflow.map((step) => (
            <li key={step.step}>
              <PanelCard className="flex h-full flex-col gap-3 rounded-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-label font-semibold tabular-nums text-accent">
                    {ar ? `خطوة ${step.step}` : `STEP ${step.step}`}
                  </span>
                  <Badge tone="neutral" size="sm">
                    {pick(step.actor, ar)}
                  </Badge>
                </div>
                <h3 className="font-display text-subtitle leading-[1.25] text-text-primary">
                  {pick(step.title, ar)}
                </h3>
                <p className="text-body-sm leading-[1.65] text-text-secondary">
                  {pick(step.detail, ar)}
                </p>
              </PanelCard>
            </li>
          ))}
        </ol>
      </Section>

      {/* ═══ 04 · KEY FEATURES & COMMERCIAL ADVANTAGES ═══ */}
      <Section className="border-y border-border-subtle bg-surface-1/45">
        <div className="container-wide flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <SectionLabel>
              03 · {ar ? "المميزات والقيمة المضافة" : "Key Features & Advantages"}
            </SectionLabel>
            <h2 className="font-display text-title tracking-[-0.02em] text-text-primary">
              {ar ? "أهم مزايا المشروع وقيمته التجارية وللمستخدم" : "Core features and practical advantages"}
            </h2>
            <p className="max-w-[62ch] text-body-sm text-text-secondary">
              {pick(data.featuresIntro, ar)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.features.map((feat) => (
              <PanelCard
                key={feat.title.en}
                interactive
                className="flex flex-col gap-2.5 rounded-card p-5"
              >
                <span className="w-fit rounded-pill border border-border-default bg-surface-2 px-2.5 py-0.5 font-mono text-micro uppercase tracking-[0.08em] text-accent">
                  {pick(feat.tag, ar)}
                </span>
                <h3 className="font-display text-subtitle leading-[1.25] text-text-primary">
                  {pick(feat.title, ar)}
                </h3>
                <p className="text-body-sm leading-[1.65] text-text-secondary">
                  {pick(feat.body, ar)}
                </p>
              </PanelCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 05 · OPERATIONAL STATUS & SCOPE CLARITY ═══ */}
      <Section density="compact" className="container-wide">
        <PanelCard className="flex flex-col gap-4 rounded-panel p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex max-w-[64ch] flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <SectionLabel>
                04 · {ar ? "حالة التشغيل والنطاق الحالي" : "Operational Status & Scope"}
              </SectionLabel>
              {/* The label can carry a long domain (ahmed-kamar-portfolio.vercel.app) that has no space to
                  wrap at: on a 320px phone that one token was wider than the card and pushed the whole page
                  sideways. Below sm, py-1 keeps the lines off the capsule edge when it does wrap. */}
              <Badge tone="live" size="sm" className="max-w-full [overflow-wrap:anywhere] max-sm:py-1">
                {pick(data.operationalNote.statusLabel, ar)}
              </Badge>
            </div>
            <p className="text-body-sm leading-[1.65] text-text-secondary">
              {pick(data.operationalNote.summary, ar)}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1">
              {data.operationalNote.highlights.map((item, idx) => (
                <li key={idx} className="inline-flex items-center gap-1.5 font-mono text-micro text-text-primary">
                  <span className="text-accent">
                    <Icon name="check" />
                  </span>
                  <span>{pick(item, ar)}</span>
                </li>
              ))}
            </ul>
          </div>

          {liveHref ? (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "primary",
                className:
                  "inline-flex w-fit shrink-0 items-center gap-2 px-5 py-2.5 font-mono text-label font-semibold tracking-[0.06em] transition-transform duration-base ease-physics hover:-translate-y-0.5",
              })}
            >
              <span>
                {isLocalShowcase
                  ? ar ? "جرّب المعاينة التفاعلية" : "Try interactive showcase"
                  : ar ? "زُر الموقع المباشر" : "Visit live site"}
              </span>
              <Icon name="arrow-up-right" />
            </a>
          ) : null}
        </PanelCard>
      </Section>
    </article>
  );
}
