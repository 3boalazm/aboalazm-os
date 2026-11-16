import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ProcessView } from "./process-view";

const pageMetadata: Metadata = {
  title: "Process — The 38-Day Method",
  description: "A four-phase method refined over 9+ years of design practice: Discover, Define, Architect, Build — every task, deliverable and gate drawn from real projects.",
};

export default function ProcessPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Process", path: "/process" }])} />
      <ProcessView />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/process');
}
