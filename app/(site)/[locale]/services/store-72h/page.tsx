import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import { Store72hView } from "./store-72h-view";

// Same window as /pricing and /services. Without it this page was cached for a
// year, so an expired EGP/SAR rate would have kept showing until the next deploy.
export const revalidate = 60;

const originalMetadata: Metadata = {
  title: "Bilingual Online Store or Catalogue in 72 Hours — From $197",
  description:
    "Bilingual Arabic (RTL) + English (LTR) online store or catalogue ready in 72 hours once content is received. Up to ~30 products, Order on WhatsApp, COD + InstaPay instructions, shipping link, and custom domain — from $197 (50% deposit).",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(originalMetadata, locale, "/services/store-72h");
}

export default function Store72hPage() {
  return <Store72hView />;
}
