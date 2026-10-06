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

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

const withMDX = createMDX({});
export default withPayload(withMDX(nextConfig), { devBundleServerPackages: false });
