import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { PricingView } from "./pricing-view";
import { getOffers } from "@/lib/content";

export const revalidate = 60;


export const metadata: Metadata = {
  title: "Pricing — No Hidden Fees",
  description: "Three transparent tiers from $199 logo design to full brand systems, plus à la carte services. USD, negotiable, stated upfront.",
};

export default async function PricingPage() {
  const { tiers, investmentValue, alaCarte } = await getOffers();
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Pricing", path: "/pricing" }])} />
      <PricingView tiers={tiers} investmentValue={investmentValue} alaCarte={alaCarte} />
    </>
  );
}
