/**
 * Canonical origin of the site — the single source for sitemap.xml,
 * robots.txt, metadataBase (canonical + og:image URLs), hreflang, and JSON-LD.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — the configured public origin.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel (host only).
 *   3. Default project-domain fallback when unset.
 */
const DEFAULT_SUBDOMAIN = "aboalazm-os";
const DEFAULT_PLATFORM_HOST = "vercel.app";
const DEFAULT_HOST = `${DEFAULT_SUBDOMAIN}.${DEFAULT_PLATFORM_HOST}`;
const FALLBACK = `https://${DEFAULT_HOST}`;

export function resolveSiteUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const withProtocol = /^https?:\/\//i.test(explicit)
      ? explicit
      : `https://${explicit}`;
    return withProtocol.replace(/\/+$/, "");
  }

  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost.replace(/^https?:\/\//i, "")}`.replace(
      /\/+$/,
      "",
    );
  }

  return FALLBACK;
}

export function resolveSiteHost(siteUrl: string = resolveSiteUrl()): string {
  return siteUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();
export const SITE_HOST = resolveSiteHost(SITE_URL);
