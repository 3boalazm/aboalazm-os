import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { PricingView } from "./pricing-view";
import { getOffers } from "@/lib/content";

export const revalidate = 86400; // daily safety net; CMS saves invalidate on demand (lib/revalidate.ts). Keep >= 3600.


const pageMetadata: Metadata = {
  title: "Pricing — No Hidden Fees",
  description: "Three transparent tiers from $199 logo design to full brand systems, plus à la carte services. USD, negotiable, stated upfront.",
};

export default async function PricingPage() {
  const { tiers, alaCarte } = await getOffers();
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Pricing", path: "/pricing" }])} />
      <PricingView tiers={tiers} alaCarte={alaCarte} />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/pricing');
}
