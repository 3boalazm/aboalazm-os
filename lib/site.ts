/**
 * Canonical origin of the site — the single source for sitemap.xml,
 * robots.txt, metadataBase (canonical + og:image URLs) and JSON-LD.
 *
 * Canonical public origin: https://aboalazm-os.vercel.app
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — the stable public origin, set in Vercel.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel (host only).
 *   3. The same stable project-domain fallback.
 */
const FALLBACK = "https://aboalazm-os.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "")}`.replace(/\/+$/, "");

  return FALLBACK;
}

export const SITE_URL = resolveSiteUrl();
