"use client";
import { useLang } from "@/components/providers/lang-provider";
import { useT } from "@/hooks/use-t";

/**
 * SYSTEM CONSTELLATION™ — the signature asset layer.
 * A lightweight SVG mesh of four system nodes:
 *
 *     BRAND ─→ TOKEN ─→ COMPONENT ─→ PAGE
 *
 * Each node sits on its own spring pair. A single pointermove handler
 * converts cursor position to viewBox space and applies a magnetic
 * pull with exponential-style falloff — nodes near the cursor lean
 * toward it (capped at ~26px), distant nodes barely stir. Because the
 * connecting lines consume the SAME motion values as the nodes, the
 * mesh deforms as one continuous fabric. On pointer leave, every
 * spring settles home on the house physics.
 *
 * Zero canvas, zero WebGL — ~2kb of SVG and springs.
 */
import { useCallback, useRef, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { physicsSlow } from "@/lib/motion";

/* ── Geometry ──────────────────────────────────────────────────── */
const VB = { w: 480, h: 560 } as const; // v2: extended for EXPERIENCE node

const BASE = {
  brand: { x: 130, y: 88, label: "BRAND" },
  token: { x: 352, y: 172, label: "TOKEN" },
  component: { x: 148, y: 304, label: "COMPONENT" },
  page: { x: 336, y: 412, label: "PAGE" },
  /* Terminal node — deliberately off-axis below the chain:
     experience is never a straight line from brand. */
  experience: { x: 196, y: 508, label: "EXPERIENCE" },
} as const;


/* ── Bilingual node labels ─────────────────────────────────────── */
const NODES_EN = {
  brand:      "BRAND",
  token:      "TOKEN",
  component:  "COMPONENT",
  page:       "PAGE",
  experience: "EXPERIENCE",
} as const;

const NODES_AR = {
  brand:      "العلامة",
  token:      "المتغيّرات",
  component:  "المكوّنات",
  page:       "الصفحات",
  experience: "التجربة",
} as const;

type NodeKey = keyof typeof BASE;

const EDGES: readonly [NodeKey, NodeKey][] = [
  /* Spine — compilation order */
  ["brand", "token"],
  ["token", "component"],
  ["component", "page"],
  ["page", "experience"],
  /* Cross-links — systemic reach */
  ["brand", "component"],   // identity feeds system directly
  ["token", "page"],        // tokens reach the surface directly
  ["component", "experience"], // components shape what's felt
];

/* Magnetic field tuning */
const FIELD_RADIUS = 240; // px (viewBox units) — pull range
const MAX_PULL = 26;      // px — hard cap on displacement
const SPRING = { stiffness: 160, damping: 22, mass: 1 } as const;

/* ── Per-node spring rig ───────────────────────────────────────── */
interface NodeRig {
  x: MotionValue<number>;
  y: MotionValue<number>;
  pull: (px: number, py: number) => void;
  rest: () => void;
}

function useMagneticNode(bx: number, by: number): NodeRig {
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const sx = useSpring(dx, SPRING);
  const sy = useSpring(dy, SPRING);

  const x = useTransform(sx, (v) => bx + v);
  const y = useTransform(sy, (v) => by + v);

  const pull = useCallback(
    (px: number, py: number) => {
      const vx = px - bx;
      const vy = py - by;
      const d = Math.hypot(vx, vy);
      const falloff = Math.max(0, 1 - d / FIELD_RADIUS); // 1 → 0 across field
      const strength = falloff * falloff;                 // soft quadratic edge
      const mag = Math.min(d * 0.22 * strength, MAX_PULL);
      const inv = d === 0 ? 0 : mag / d;
      dx.set(vx * inv);
      dy.set(vy * inv);
    },
    [bx, by, dx, dy],
  );

  const rest = useCallback(() => {
    dx.set(0);
    dy.set(0);
  }, [dx, dy]);

  return { x, y, pull, rest };
}

/* ── Visual atoms ────────────────────────────────────────────────
   Every colour here resolves through a semantic token, so the mesh keeps
   its contrast in BOTH themes. The core used to be a hardcoded #F8F8FA,
   which is near-invisible on the Alabaster canvas. */
function Node({
  rig,
  label,
  delay,
  origin = false,
}: {
  rig: NodeRig;
  label: string;
  delay: number;
  /** The identity origin — the one node allowed an authorial accent. */
  origin?: boolean;
}) {
  const labelX = useTransform(rig.x, (v) => v + 24);
  const labelY = useTransform(rig.y, (v) => v + 4);
  const reduceMotion = useReducedMotion();

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...physicsSlow, delay }}
    >
      {/* Origin ring — the brand anchor, before anything is compiled */}
      {origin ? (
        <motion.circle
          cx={rig.x}
          cy={rig.y}
          r={26}
          className="fill-none"
          style={{ stroke: "var(--color-accent-40)" }}
          strokeWidth={1}
          strokeDasharray="2 5"
        />
      ) : null}
      {/* Halo */}
      <motion.circle
        cx={rig.x}
        cy={rig.y}
        r={16}
        className="fill-none"
        style={{ stroke: "var(--color-border-strong)" }}
        strokeWidth={1}
      />
      {/* Core */}
      <motion.circle
        cx={rig.x}
        cy={rig.y}
        r={4}
        style={{ fill: "var(--color-text-primary)" }}
      />
      {/* Breath */}
      <motion.circle
        cx={rig.x}
        cy={rig.y}
        r={4}
        style={{ fill: "var(--color-text-primary)" }}
        animate={{ opacity: [0.35, 0], scale: [1, 3] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: delay + 1,
          ease: "easeOut",
        }}
      />
      {/* Label */}
      <motion.text
        x={labelX}
        y={labelY}
        className="fill-text-tertiary font-mono"
        style={{ fontSize: 10, letterSpacing: "0.1em" }}
      >
        {label}
      </motion.text>
    </motion.g>
  );
}

function Edge({
  a,
  b,
  delay,
  spine = false,
}: {
  a: NodeRig;
  b: NodeRig;
  delay: number;
  /** Spine edges are the compilation path — they carry more weight than
   *  the cross-links so the chain reads at a glance. */
  spine?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      style={{
        stroke: spine
          ? "var(--color-border-strong)"
          : "var(--color-border-default)",
      }}
      strokeWidth={spine ? 1.25 : 1}
      initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: spine ? 0.9 : 0.55 }}
      transition={{ duration: 1.1, ease: "easeInOut", delay }}
    />
  );
}

/* ── Component ─────────────────────────────────────────────────── */
export function SystemConstellation() {
  const { lang } = useLang();
  const t = useT();
  const NODES = lang === "ar" ? NODES_AR : NODES_EN;
  const ref = useRef<SVGSVGElement>(null);

  const brand = useMagneticNode(BASE.brand.x, BASE.brand.y);
  const token = useMagneticNode(BASE.token.x, BASE.token.y);
  const component = useMagneticNode(BASE.component.x, BASE.component.y);
  const page = useMagneticNode(BASE.page.x, BASE.page.y);
  const experience = useMagneticNode(BASE.experience.x, BASE.experience.y);

  const rigs: Record<NodeKey, NodeRig> = {
    brand, token, component, page, experience,
  };

  const onMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Client → viewBox space
      const px = ((e.clientX - r.left) / r.width) * VB.w;
      const py = ((e.clientY - r.top) / r.height) * VB.h;
      (Object.keys(rigs) as NodeKey[]).forEach((k) => rigs[k].pull(px, py));
    },
    // rigs are stable per render identity of their motion values
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onLeave = useCallback(() => {
    (Object.keys(rigs) as NodeKey[]).forEach((k) => rigs[k].rest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    /* The signature asset is a composed OBJECT, not a bordered box:
       a caption band, a light field, and the mesh. The caption used to be
       absolutely positioned over the SVG, which collided with the
       EXPERIENCE node's label at every size — here it owns a real band,
       so the collision is impossible by construction. */
    <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-panel border border-border-subtle bg-surface-1/40 lg:mx-0">
      {/* Expressive colour field — violet (creative) into cyan (live).
          The frame is no longer a monochrome grey box. */}
      <div
        aria-hidden
        className="atmos-field"
        style={
          {
            "--atmos-1": "var(--color-live)",
            "--atmos-2": "var(--color-creative)",
            "--atmos-x": "78%",
            "--atmos-y": "12%",
          } as CSSProperties
        }
      />
      <div aria-hidden className="grain-layer" />

      <p className="relative z-elevated border-b border-border-subtle px-3 py-2 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        SYSTEM CONSTELLATION™ · LIVE
      </p>

      <svg
        ref={ref}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="relative z-elevated block h-auto w-full touch-none"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        role="img"
        aria-label={t.heroConstellationAria}
      >
        {EDGES.map(([a, b], i) => (
          <Edge
            key={`${a}-${b}`}
            a={rigs[a]}
            b={rigs[b]}
            delay={0.4 + i * 0.12}
            spine={i < 4}
          />
        ))}
        {(Object.keys(BASE) as NodeKey[]).map((k, i) => (
          <Node
            key={k}
            rig={rigs[k]}
            label={NODES[k as keyof typeof NODES]}
            delay={0.2 + i * 0.14}
            origin={k === "brand"}
          />
        ))}
      </svg>
    </div>
  );
}
