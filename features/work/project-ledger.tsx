"use client";
import { useT } from "@/hooks/use-t";
import { useLang } from "@/components/providers/lang-provider";

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
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "@/lib/motion";
import { useAmbientGlowControls } from "@/hooks/use-ambient-glow";
import { FloatingPreview } from "./floating-preview";
import { BEHANCE } from "./projects.data";
import type { Project } from "./types";

/* Shared column template — header & rows must never drift apart */
const GRID_FULL =
  "grid-cols-[2rem_1.6fr_1fr] gap-2 md:grid-cols-[2.5rem_1.5fr_1fr_1.3fr_1fr_auto] md:gap-3";
const GRID_COMPACT =
  "grid-cols-[2rem_1.6fr_1fr] gap-2 md:grid-cols-[2.5rem_1.6fr_1fr_auto] md:gap-3";

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
      <div className="flex flex-col items-center gap-1 border-y border-border-subtle py-12 text-center">
        <p className="font-display text-title text-text-tertiary">
          {ar ? "لا توجد ملفات هنا بعد" : "Nothing filed here yet"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "المشاريع بتتضاف أول بأول" : "Projects are added as they ship"}
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
        <span>{t.workOutcome}</span>
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
  const grid = compact ? GRID_COMPACT : GRID_FULL;
  /* No-404 rule: rows without a written case file open a fallback link
     in a new tab — the project's externalUrl if set (e.g. a live dev
     site), otherwise the Behance portfolio (design default). */
  const internal = project.hasCaseStudy;
  const href = internal ? `/case-studies/${project.slug}` : (project.externalUrl ?? BEHANCE);

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

        {/* Project name — serif, slides 8px on the physics curve */}
        <span className="overflow-hidden">
          <span
            className={[
              "block font-display text-title leading-[1.15] tracking-[-0.015em] text-text-primary",
              "transition-transform duration-base ease-physics",
              isActive ? "translate-x-1" : "translate-x-0",
            ].join(" ")}
          >
            {ar && project.nameAr ? project.nameAr : project.name}
          </span>
          {/* Mobile-only: discipline shown inline since the desktop column is hidden below md */}
          <span className="mt-0.5 block font-mono text-micro text-text-tertiary md:hidden">
            {project.discipline}
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

        {/* Strategic outcome */}
        <span className="flex items-center gap-1.5 font-mono text-label text-text-secondary">
          {ar && project.outcomeAr ? project.outcomeAr : project.outcome}
          {/* Mobile-only open indicator — the row is a full-width Link, this makes the affordance visible */}
          <span
            aria-hidden
            className="ms-auto inline-block shrink-0 text-text-ghost transition-transform duration-base ease-physics group-hover:translate-x-1 group-hover:text-accent md:hidden"
          >
            ↗
          </span>
        </span>

        {/* Action call — underline draw + arrow nudge */}
        <span className="relative hidden justify-self-end font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics group-hover:text-text-primary md:block">
          {internal ? (ar ? "ملف المشروع" : "Case File") : project.externalUrl ? (ar ? "الموقع المباشر" : "Live Site") : "Behance"}
          <span className="text-text-ghost"> // </span>
          {ar ? "افتح" : "Open"}
          <span
            aria-hidden
            className="ml-1 inline-block transition-transform duration-base ease-physics group-hover:translate-x-1"
          >
            ↗
          </span>
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-slow ease-physics group-hover:scale-x-100" />
        </span>
      </Link>
    </motion.li>
  );
}
