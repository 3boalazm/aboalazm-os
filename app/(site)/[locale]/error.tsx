"use client";

/**
 * ERROR BOUNDARY — app/(site)/error.tsx
 *
 * Catches render/data-fetch failures for every page under the (site)
 * route group (e.g. a Payload/Postgres timeout inside getProjects(),
 * getCaseStudy(), etc. in lib/content.ts — none of those functions
 * swallow errors, so a DB hiccup throws here instead of leaving a silent
 * blank page). Without this file, Next.js falls back to its generic,
 * unbranded error screen.
 *
 * `reset()` re-renders the segment — the standard recovery path for a
 * transient failure (e.g. a Neon cold start) without a full page reload.
 */

import { useEffect } from "react";
import Link from "@/components/ui/localized-link";
import { Icon } from "@/components/ui/Icon";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { physics, reveal } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

const COPY = {
  en: {
    status: "CONNECTION INTERRUPTED",
    headline: "Something didn't load.",
    body: "A temporary issue on our end — most likely the database taking a moment to respond. Try again, or head back to a known page.",
    retry: "Try again",
    home: "Return home",
  },
  ar: {
    status: "انقطاع مؤقت في الاتصال",
    headline: "حاجة ما اتحمّلتش.",
    body: "مشكلة مؤقتة من عندنا — غالبًا قاعدة البيانات بتاخد لحظة عشان تستجيب. جرّب تاني، أو ارجع لصفحة معروفة.",
    retry: "حاول تاني",
    home: "الرئيسية",
  },
} as const;

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const copy = ar ? COPY.ar : COPY.en;

  useEffect(() => {
    // Server-side logging hook — swap for a real error-tracking call
    // (Sentry, etc.) if one gets wired up later.
    console.error("[site error boundary]", error);
  }, [error]);

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="stage-bleed flex min-h-svh flex-col items-center justify-center gap-6 bg-surface-0 px-6 text-center"
    >
      <motion.div
        variants={reveal.container}
        initial="hidden"
        animate="visible"
        className="flex max-w-[52ch] flex-col items-center gap-4"
      >
        <motion.span
          variants={reveal.item}
          className="flex items-center gap-2 font-mono text-micro uppercase tracking-[0.10em] text-accent"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {copy.status}
        </motion.span>

        <motion.h1
          variants={reveal.item}
          className="font-display text-title tracking-[-0.02em] text-text-primary"
        >
          {copy.headline}
        </motion.h1>

        <motion.p variants={reveal.item} className="text-body-sm text-text-secondary">
          {copy.body}
        </motion.p>

        <motion.div variants={reveal.item} className="mt-2 flex items-center gap-4">
          <Button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-label tracking-[0.06em] transition-opacity duration-base ease-physics hover:opacity-90"
          >
            {copy.retry}
            <Icon name="arrow-right" />
          </Button>
          <Link
            href="/"
            className="font-mono text-label uppercase tracking-[0.06em] text-text-tertiary transition-colors duration-base ease-physics hover:text-text-primary"
          >
            {copy.home}
          </Link>
        </motion.div>

        {process.env.NODE_ENV === "development" && (
          <motion.pre
            variants={reveal.item}
            className="mt-4 max-w-full overflow-x-auto rounded-card border border-border-subtle bg-surface-1 p-3 text-left font-mono text-micro text-text-tertiary"
          >
            {error.message}
          </motion.pre>
        )}
      </motion.div>
    </main>
  );
}
