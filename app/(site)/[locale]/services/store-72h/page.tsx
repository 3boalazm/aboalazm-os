import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import { Store72hView } from "./store-72h-view";

// Same window as /pricing and /services. Without it this page was cached for a
// year, so an expired EGP/SAR rate would have kept showing until the next deploy.
export const revalidate = 60;

const originalMetadata: Metadata = {
  title: "Bilingual Store or Catalogue in 72 Hours — From $197",
  description:
    "Bilingual Arabic (RTL) + English store or catalogue ready 72 hours after content: up to ~30 products, WhatsApp ordering, COD + InstaPay, shipping and domain — from $197.",
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
