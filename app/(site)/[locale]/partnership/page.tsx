import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/localized-metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { PartnershipView } from "./partnership-view";

const pageMetadata: Metadata = {
  title: "Partnership & Ongoing Support — After the Handover",
  description:
    "What happens after launch: 30 days of support included, brand stewardship from $247/month, and scoped digital partnerships with a written monthly work list.",
  alternates: { canonical: "/partnership" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Partnership", path: "/partnership" }])} />
      <PartnershipView />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, "/partnership");
}
