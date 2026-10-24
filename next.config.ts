import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withPayload } from "@payloadcms/next/withPayload";

/**
 * Security headers for every response (pages, /admin, /api, public files).
 * HSTS is already sent by Vercel, so it is not repeated here.
 *
 * The CSP is deliberately partial — it only carries directives that can't
 * break the site: no script-src/style-src. The root layout relies on inline
 * scripts (theme anti-flash, JSON-LD) and Payload's admin needs inline +
 * eval, so a full script-src needs per-request nonces (middleware) and a
 * Report-Only rollout first.
 *
 * frame-ancestors 'self' + X-Frame-Options: the site may only be framed by
 * itself (the /books reader and Payload live preview are same-origin).
 * Embedding *other* sites (/work-ui previews) is unaffected — that is
 * governed by those sites' headers, not ours.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

/**
 * Cache policy for self-hosted static files (public/ is served with
 * max-age=0 otherwise). Fonts and the /books reader assets are only ever
 * replaced by renaming/new uuid file names, so they can be immutable;
 * /images keeps a day of freshness plus a week of stale-while-revalidate.
 *
 * RULE: `immutable` for a year relies on these files never being replaced in
 * place. The font names are not hashed (Gc_Epicpro.woff2,
 * thmanyahserifdisplay-*.otf): if a font file ever changes it must be
 * RENAMED (and its references updated), or visitors keep the old file. The
 * same goes for /images, which also sets /_next/image's cache lifetime (a
 * day instead of its 60 s default): a changed image needs a new file name.
 */
const cacheControl = (value: string) => [{ key: "Cache-Control", value }];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // withPayload re-adds its own "X-Powered-By: Payload" unless this is false.
  poweredByHeader: false,
  // lib/og.tsx reads the display fonts with readFile(process.cwd()/public/fonts/<var>)
  // at request time. The file name is a variable so the tracer can't see it,
  // and the dynamic per-slug share cards (writing / case-studies / books) ran
  // in a serverless function without the fonts → HTTP 500. Force-include them.
  outputFileTracingIncludes: {
    "/**/opengraph-image*": [
      "./public/fonts/Gc_Epicpro.otf",
      "./public/fonts/thmanyahserifdisplay-Bold.otf",
      "./public/fonts/noto-sans-latin-400.ttf",
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/fonts/:path*", headers: cacheControl("public, max-age=31536000, immutable") },
      { source: "/images/:path*", headers: cacheControl("public, max-age=86400, stale-while-revalidate=604800") },
      { source: "/books/:slug/assets/:path*", headers: cacheControl("public, max-age=31536000, immutable") },
    ];
  },
  // The brand book used to live at its own URL; it is now a panel of the case study.
  async redirects() {
    const redirects = [
      {
        source: "/case-studies/gad-institute/brand-book",
        destination: "/case-studies/gad-institute#brand-book",
        permanent: false,
      },
      {
        // Overhaul S3 (ABO-26): /start's journey content is absorbed into
        // /contact (fit check + kickoff expectations + canonical terms).
        // The route is gone; its inbound links/bookmarks land on the form.
        source: "/start",
        destination: "/contact",
        permanent: true,
      },
      {
        // Overhaul S4 (ABO-27): /gallery merged into /work as the "Wall"
        // view toggle — same wall, one canonical home.
        source: "/gallery",
        destination: "/work",
        permanent: true,
      },
      {
        // OLTRÈ's slug is the legacy "momo-collective" (the deployment host
        // name, pinned by project-curation.test.ts). People — and the owner —
        // look for the brand name, so the readable slug forwards to it.
        source: "/case-studies/oltre-collective",
        destination: "/case-studies/momo-collective",
        permanent: true,
      },
      {
        source: "/work/identity",
        destination: "/work/design",
        permanent: true,
      },
      {
        source: "/work/digital-products",
        destination: "/work/development",
        permanent: true,
      },
    ];
    return [...redirects, ...redirects.map((entry) => ({ ...entry, source: `/ar${entry.source}`, destination: `/ar${entry.destination}` }))];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/api/media/file/**" },
      { pathname: "/images/**" },
    ],
    // Media now lives on Vercel Blob (see payload.config.ts) — its URLs
    // look like https://<store-id>.public.blob.vercel-storage.com/...
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // Own the document for unmatched URLs — see app/global-not-found.tsx.
    globalNotFound: true,
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

const withMDX = createMDX({});
export default withPayload(withMDX(nextConfig), { devBundleServerPackages: false });
