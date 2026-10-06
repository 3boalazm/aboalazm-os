/**
 * Canonical origin of the site — the single source for sitemap.xml,
 * robots.txt, metadataBase (canonical + og:image URLs) and JSON-LD.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL   — set this once the custom domain is live.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel (host only).
 *   3. The production *.vercel.app host.
 *
 * It used to be hard-coded to https://aboalazm.com, which doesn't resolve, so
 * the sitemap, canonical links and every og:image pointed at a dead host.
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
