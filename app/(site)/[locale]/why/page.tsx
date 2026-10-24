import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { WhyView } from "./why-view";

const pageMetadata: Metadata = {
  title: "Why — The Case for Systemic Identity",
  description: "Why strategy before design, systems instead of one-off deliverables, and bilingual identity architecture built to scale across teams, products, and campaigns.",
};

export default function WhyPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Why", path: "/why" }])} />
      <WhyView />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/why');
}
