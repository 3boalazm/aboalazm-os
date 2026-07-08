import type { Metadata } from "next";
import { ServicesView } from "./services-view";
import { getOffers } from "@/lib/content";

export const revalidate = 60;


export const metadata: Metadata = {
  title: "Services — Strategy, Identity, Systems",
  description: "Five services, one studio, no handoff gaps — brand identity & strategy, design systems, web, print & packaging, art direction.",
};

export default async function ServicesPage() {
  const { tiers } = await getOffers();
  return <ServicesView tiers={tiers} />;
}
