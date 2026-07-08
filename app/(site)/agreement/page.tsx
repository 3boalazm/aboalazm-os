import type { Metadata } from "next";
import { AgreementView } from "./agreement-view";
import { getOffers } from "@/lib/content";

export const revalidate = 60;


export const metadata: Metadata = {
  title: "Agreement — Work-Flow",
  description: "Eight phases, transparent terms, 50/50 payment structure — the full work-flow agreement, stated upfront.",
};

export default async function AgreementPage() {
  const { tiers, alaCarte } = await getOffers();
  return <AgreementView tiers={tiers} alaCarte={alaCarte} />;
}
