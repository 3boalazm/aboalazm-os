import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ServicesView } from "./services-view";
import { getOffers } from "@/lib/content";

export const revalidate = 60;


const pageMetadata: Metadata = {
  title: "Services — Strategy, Identity, Systems",
  description: "Five services, one studio, no handoff gaps — brand identity & strategy, design systems, web, print & packaging, art direction.",
};

export default async function ServicesPage() {
  const { tiers } = await getOffers();
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <ServicesView tiers={tiers} />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/services');
}
