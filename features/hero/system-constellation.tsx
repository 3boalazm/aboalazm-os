"use client";

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
import { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
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

/* ── Visual atoms ──────────────────────────────────────────────── */
function Node({
  rig,
  label,
  delay,
}: {
  rig: NodeRig;
  label: string;
  delay: number;
}) {
  const labelX = useTransform(rig.x, (v) => v + 24);
  const labelY = useTransform(rig.y, (v) => v + 4);

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...physicsSlow, delay }}
    >
      {/* Halo */}
      <motion.circle
        cx={rig.x}
        cy={rig.y}
        r={16}
        className="fill-none stroke-border-subtle"
        strokeWidth={1}
      />
      {/* Core */}
      <motion.circle cx={rig.x} cy={rig.y} r={4} fill="#F8F8FA" />
      {/* Breath */}
      <motion.circle
        cx={rig.x}
        cy={rig.y}
        r={4}
        fill="#F8F8FA"
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
}: {
  a: NodeRig;
  b: NodeRig;
  delay: number;
}) {
  return (
    <motion.line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      className="stroke-border-default"
      strokeWidth={1}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeInOut", delay }}
    />
  );
}

/* ── Component ─────────────────────────────────────────────────── */
export function SystemConstellation() {
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
    <div className="relative aspect-[480/560] w-full max-w-[480px]">
      {/* Soft containment field */}
      <div className="absolute inset-0 rounded-panel border border-border-subtle bg-surface-1/40" />

      <svg
        ref={ref}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="relative size-full touch-none"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        role="img"
        aria-label="System constellation: brand compiles into tokens, tokens into components, components into pages, pages into experience."
      >
        {EDGES.map(([a, b], i) => (
          <Edge
            key={`${a}-${b}`}
            a={rigs[a]}
            b={rigs[b]}
            delay={0.4 + i * 0.12}
          />
        ))}
        {(Object.keys(BASE) as NodeKey[]).map((k, i) => (
          <Node
            key={k}
            rig={rigs[k]}
            label={BASE[k].label}
            delay={0.2 + i * 0.14}
          />
        ))}
      </svg>

      {/* Caption */}
      <p className="absolute bottom-2 left-3 font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
        SYSTEM CONSTELLATION™ · LIVE
      </p>
    </div>
  );
}
