"use client";
import { useLang } from "@/components/providers/lang-provider";
import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "@/lib/motion";
import { LivePreviewCard } from "./live-preview-card";
import type { Project } from "@/features/work/types";

export function LivePreviewGrid({ projects }: { projects: readonly Project[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const reduced = useReducedMotion();

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 border-y border-border-subtle py-5 text-center">
        <p className="font-display text-title text-text-tertiary">
          {ar ? "لا توجد معاينات حية بعد" : "No live previews yet"}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
          {ar ? "علّم مشروع كـ UI/UX من الداشبورد وضيف رابطه" : "Tag a project as UI/UX in the dashboard and add its live URL"}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={reveal.container}
      initial={reduced ? false : "hidden"}
      animate="visible"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((p) => (
        <motion.div key={p.slug} variants={reveal.item}>
          <LivePreviewCard project={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
