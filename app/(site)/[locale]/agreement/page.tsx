import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { AgreementView } from "./agreement-view";
import { getOffers } from "@/lib/content";

export const revalidate = 60;


const pageMetadata: Metadata = {
  title: "Agreement — Work-Flow",
  description: "Eight phases, transparent terms, tiered payment schedules (Logo 50/50; Identity Essentials & Full System 50/25/25) — the full work-flow agreement, stated upfront.",
};

export default async function AgreementPage() {
  const { tiers, alaCarte } = await getOffers();
  return <AgreementView tiers={tiers} alaCarte={alaCarte} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/agreement');
}
