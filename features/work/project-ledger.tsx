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
import { motion } from "framer-motion";
import { reveal } from "@/lib/motion";
import { useAmbientGlowControls } from "@/hooks/use-ambient-glow";
import { FloatingPreview } from "./floating-preview";
import { PROJECTS, BEHANCE } from "./projects.data";
import type { Project } from "./types";

/* Shared column template — header & rows must never drift apart */
const GRID =
  "grid-cols-[2rem_1.6fr_1fr] gap-2 md:grid-cols-[2.5rem_1.5fr_1fr_1.3fr_1fr_auto] md:gap-3";

interface ProjectLedgerProps {
  projects?: readonly Project[];
  /** Optional cap — lets Home reuse the component as "Selected Work" */
  limit?: number;
}

export function ProjectLedger({
  projects = PROJECTS,
  limit,
}: ProjectLedgerProps) {
  const t = useT();
  const { lang } = useLang();
  const ar = lang === "ar";
  const rows = limit ? projects.slice(0, limit) : projects;

  const [active, setActive] = useState<Project | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { engage, release } = useAmbientGlowControls();

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

  return (
    <section onPointerMove={onPointerMove} onPointerLeave={onLedgerLeave}>
      {/* ── Column header ── */}
      <div
        className={`grid ${GRID} border-b border-border-default px-2 pb-1 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost`}
      >
        <span>№</span>
        <span>{t.workProject}</span>
        <span className="hidden md:block">{t.workDiscipline}</span>
        <span className="hidden md:block">{t.workStack}</span>
        <span>{t.workOutcome}</span>
        <span className="hidden text-right md:block">{t.workAction}</span>
      </div>

      {/* ── Records ── */}
      <motion.ol
        variants={reveal.container}
        initial="hidden"
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
}

function LedgerRow({
  project,
  index,
  isActive,
  isDimmed,
  onEnter,
  ar = false,
}: LedgerRowProps) {
  /* No-404 rule: rows without a written case file open the Behance
     portfolio in a new tab until their case study ships. */
  const internal = project.hasCaseStudy;
  const href = internal ? `/case-studies/${project.slug}` : BEHANCE;

  return (
    <motion.li variants={reveal.item}>
      <Link
        href={href}
        {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        onPointerEnter={() => onEnter(project)}
        className={[
          "group grid items-center border-b border-border-subtle px-2 py-3",
          GRID,
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
        </span>

        {/* Discipline */}
        <span className="hidden text-body-sm text-text-secondary md:block">
          {project.discipline}
        </span>

        {/* Stack — Geist Mono micro-pills */}
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

        {/* Strategic outcome */}
        <span className="font-mono text-label text-text-secondary">
          {ar && project.outcomeAr ? project.outcomeAr : project.outcome}
        </span>

        {/* Action call — underline draw + arrow nudge */}
        <span className="relative hidden justify-self-end font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics group-hover:text-text-primary md:block">
          {internal ? (ar ? "ملف المشروع" : "Case File") : "Behance"}
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
