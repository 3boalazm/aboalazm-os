/**
 * LOADING STATE — app/(site)/loading.tsx
 *
 * Shown automatically by Next.js while a page's async Server Component
 * (getProjects, getCaseStudy, etc. in lib/content.ts) is still resolving
 * — e.g. a Neon cold start taking an extra second. Without this file,
 * the browser just shows a blank tab until the fetch resolves.
 *
 * Server Component, no "use client" needed — it's static markup with a
 * pure-CSS pulse, no interactivity.
 */
export default function Loading() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-surface-0">
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
      <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-tertiary">
        Loading
      </p>
    </main>
  );
}
