import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/api/media/file/**" }],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

const withMDX = createMDX({});
export default withPayload(withMDX(nextConfig), { devBundleServerPackages: false });
