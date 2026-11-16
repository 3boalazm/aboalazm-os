"use client";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";
import { Badge } from "@/components/ui/Badge";

/**
 * PROJECT LEDGER — "Engineering Ledger Layout"
 * ─────────────────────────────────────────────────────────────────
 * A high-density project index in the Linear/Stripe/Vercel idiom:
 * no hero cards, no thumbnails at rest — a systematic table where
 * every row is a record:
 *
 *   №  PROJECT        DISCIPLINE        STACK            OUTCOME           ACTION
 *
 * Interaction system (three coordinated layers per hover):
 *   1. Row physics — background lifts to surface-1, the index number
 *      ignites to accent, name shifts 8px right on ease-physics, and
 *      "Case File // Open" completes its underline draw.
 *   2. Floating Thumbnail Reveal — pointer coords stream into a ref
 *      (zero re-renders); the FloatingPreview's GSAP quickTo engine
 *      trails the cursor with fluid inertia and crossfades records.
 *   3. Ambient Accent Shift — the row's palette pair overrides the
 *      global --glow-* tokens via useAmbientGlowControls; the whole
 *      page atmosphere tints toward the project. Release on leave.
 *
 * Spacing: 8px scale only. Pills: Geist Mono. Canvas: Obsidian.
 */
import { useCallback, useRef, useState } from "react";
import Link from "@/components/ui/localized-link";
import { Icon } from "@/components/ui/Icon";
import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "@/lib/motion";
import { useAmbientGlowControls } from "@/hooks/use-ambient-glow";
import { FloatingPreview } from "./floating-preview";
import { BEHANCE } from "./projects.data";
import type { Project } from "./types";

/* Shared column template — header & rows must never drift apart.
   Below sm the outcome drops under the name (single content column), so a
   long word like "Collective" gets the full row instead of a 1.6fr sliver. */
const GRID_FULL =
  "grid-cols-[2rem_minmax(0,1fr)] gap-x-2 gap-y-1 sm:grid-cols-[2rem_1.6fr_1fr] sm:gap-2 md:grid-cols-[2.5rem_1.5fr_1fr_1.3fr_1fr_auto] md:gap-3";
const GRID_COMPACT =
  "grid-cols-[2rem_minmax(0,1fr)] gap-x-2 gap-y-1 sm:grid-cols-[2rem_1.6fr_1fr] sm:gap-2 md:grid-cols-[2.5rem_1.6fr_1fr_auto] md:gap-3";

interface ProjectLedgerProps {
  /** Now sourced from Payload upstream (see lib/content.ts) — no static fallback. */
  projects: readonly Project[];
  /** Optional cap — lets Home reuse the component as "Selected Work" */
  limit?: number;
  /** Compact index under featured cases — stack is enhancement, not the story. */
  compact?: boolean;
}

export function ProjectLedger({
  projects,
  limit,
  compact = false,
}: ProjectLedgerProps) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const rows = limit ? projects.slice(0, limit) : projects;
  const grid = compact ? GRID_COMPACT : GRID_FULL;

  const [active, setActive] = useState<Project | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { engage, release } = useAmbientGlowControls();
  const reduceMotion = useReducedMotion();

  /* Pointer stream — ref write only, never state. 60fps-safe. */
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    pointer.current.x = e.clientX;
    pointer.current.y = e.clientY;
  }, []);

  const onRowEnter = useCallback(
    (project: Project) => {
      setActive(project);
      engage(project.accent, 0.7); // ambient accent shift — soft, low-opacity
    },
    [engage],
  );

  const onLedgerLeave = useCallback(() => {
    setActive(null);
    release(); // atmosphere settles home on --duration-cinematic
  }, [release]);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 border-y border-border-subtle py-5 text-center">
        <p className="font-display text-title text-text-tertiary">
          {ar ? "لا توجد ملفات هنا بعد" : "Nothing filed here yet"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "تُضاف المشاريع فور إطلاقها" : "Projects are added as they ship"}
        </p>
      </div>
    );
  }

  return (
    <section onPointerMove={onPointerMove} onPointerLeave={onLedgerLeave}>
      {/* ── Column header ── */}
      <div
        className={`grid ${grid} border-b border-border-default px-2 pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost`}
      >
        <span>№</span>
        <span>{t.workProject}</span>
        {compact ? null : <span className="hidden md:block">{t.workDiscipline}</span>}
        {compact ? null : <span className="hidden md:block">{t.workStack}</span>}
        <span className="hidden sm:block">{t.workOutcome}</span>
        <span className="hidden text-right md:block">{t.workAction}</span>
      </div>

      {/* ── Records ── */}
      <motion.ol
        variants={reveal.container}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="relative"
      >
        {rows.map((project, i) => (
          <LedgerRow
            key={project.slug}
            project={project}
            index={i}
            isActive={active?.slug === project.slug}
            isDimmed={active !== null && active.slug !== project.slug}
            onEnter={onRowEnter}
            ar={ar}
            compact={compact}
          />
        ))}
      </motion.ol>

      {/* ── Floating thumbnail layer ── */}
      <FloatingPreview active={active} pointer={pointer} />
    </section>
  );
}

/* ── Row record ─────────────────────────────────────────────────── */

interface LedgerRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: (p: Project) => void;
  ar?: boolean;
  compact?: boolean;
}

function LedgerRow({
  project,
  index,
  isActive,
  isDimmed,
  onEnter,
  ar = false,
  compact = false,
}: LedgerRowProps) {
  const t = useT();
  const grid = compact ? GRID_COMPACT : GRID_FULL;
  /* No-404 rule: rows without a written case file open a fallback link
     in a new tab — the project's externalUrl if set (e.g. a live dev
     site), otherwise the Behance portfolio (design default). */
  const internal = project.hasCaseStudy || Boolean(project.isDemo);
  const href = project.hasCaseStudy
    ? `/case-studies/${project.slug}`
    : project.isDemo
      ? "/contact?service=digital-product&source=/work/development"
      : (project.liveUrl ?? project.externalUrl ?? BEHANCE);
  /* Match the label to the actual URL, including local live showcases
     that have no externalUrl. */
  const destination = project.hasCaseStudy
    ? project.overviewOnly ? (ar ? "عرض المشروع" : "Project overview") : (ar ? "دراسة حالة" : "Case Study")
    : project.isDemo
      ? ar ? "عرض تجريبي" : "Demo"
      : project.liveUrl
        ? ar ? "منتج منشور" : "Live Product"
        : project.externalUrl === BEHANCE
          ? ar ? "ملف أعمال خارجي" : "External Portfolio"
          : project.externalUrl && project.category === "development"
            ? ar ? "منتج منشور" : "Live Product"
            : project.externalUrl
              ? ar ? "رابط خارجي" : "External Link"
              : ar ? "ملف أعمال خارجي" : "External Portfolio";

  return (
    <motion.li variants={reveal.item}>
      <Link
        href={href}
        {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        onPointerEnter={() => onEnter(project)}
        className={[
          "group grid items-center border-b border-border-subtle px-2 py-3",
          grid,
          "transition-[background-color,opacity] duration-base ease-physics",
          isActive ? "bg-surface-1" : "bg-transparent",
          isDimmed ? "opacity-40" : "opacity-100", // focus isolation
        ].join(" ")}
      >
        {/* № — ignites on hover */}
        <span
          className={[
            "font-mono text-label tabular-nums transition-colors duration-base ease-physics",
            isActive ? "text-accent" : "text-text-ghost",
          ].join(" ")}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Project name — serif, slides 8px on the physics curve. No overflow
            clip on the cell: a grid item that clips has a 0 minimum width, so
            the 1.5fr/1.6fr track could shrink below the longest word
            ("Collective") and cut it. pe-1 keeps the 8px slide inside the cell. */}
        <span className="break-words">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={[
                "font-display pe-1 text-title leading-[1.15] tracking-[-0.015em] text-text-primary",
                "transition-transform duration-base ease-physics",
                isActive ? "translate-x-1 rtl:-translate-x-1" : "translate-x-0",
              ].join(" ")}
            >
              {ar && project.nameAr ? project.nameAr : project.name}
            </span>
            {project.status === "in-progress" ? (
              <Badge tone="creative" size="sm">{ar ? "قيد التنفيذ" : "In progress"}</Badge>
            ) : null}
            {project.isDemo ? (
              <Badge tone="creative" size="sm">{ar ? "عرض تجريبي" : "Demo"}</Badge>
            ) : null}
          </span>
          {/* Mobile-only: discipline shown inline since the desktop column is hidden below md */}
          <span className="mt-0.5 block font-mono text-micro text-text-tertiary md:hidden">
            {project.discipline}
          </span>
          {/* Mobile-only destination type — replaces the bare arrow that
              used to be the only affordance on a narrow row. */}
          <span className="mt-0.5 flex items-center gap-1 font-mono text-micro uppercase tracking-[0.08em] text-text-ghost md:hidden">
            {destination}
            <Icon name="arrow-up-right" />
          </span>
        </span>

        {compact ? null : (
          <span className="hidden text-body-sm text-text-secondary md:block">
            {project.discipline}
          </span>
        )}

        {compact ? null : (
          <span className="hidden flex-wrap gap-1 md:flex">
            {project.stack.map((item) => (
              <span
                key={item}
                className={[
                  "rounded-pill border px-1 py-0.5 font-geist text-micro tracking-[0.02em]",
                  "transition-colors duration-base ease-physics",
                  isActive
                    ? "border-border-strong text-text-secondary"
                    : "border-border-subtle text-text-tertiary",
                ].join(" ")}
              >
                {item}
              </span>
            ))}
          </span>
        )}

        {/* Strategic outcome — below sm the column header is hidden, so the
            line carries its own (already translated) "Outcome" label. */}
        <span className="col-start-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 font-mono text-label text-text-secondary sm:col-auto">
          <span className="shrink-0 font-mono text-micro uppercase tracking-[0.10em] sm:hidden">
            {t.workOutcome}
          </span>
          {ar && project.outcomeAr ? project.outcomeAr : project.outcome}
        </span>

        {/* Destination type — says what actually opens BEFORE the click.
            Previously every row's affordance was a "/ / Open" string, so a
            case file, a live product, and an external portfolio all looked
            like the same destination. */}
        <span className="relative hidden justify-self-end font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics group-hover:text-text-primary md:block">
          {destination}
          <span
            className="ms-1 inline-flex transition-transform duration-base ease-physics group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
          >
            <Icon name="arrow-up-right" />
          </span>
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
        </span>
      </Link>
    </motion.li>
  );
}
