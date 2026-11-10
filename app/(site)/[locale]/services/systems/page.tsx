import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/localized-metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { BusinessSystemsView } from "./systems-view";

const pageMetadata: Metadata = {
  title: "Business Systems & Automation — Dashboards, ERP, Internal Tools",
  description:
    "Dashboards, ERP modules, Arabic-first internal tools and automation for companies running operations on spreadsheets and WhatsApp. Process map first, fixed-scope build second.",
  alternates: { canonical: "/services/systems" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Services", path: "/services" },
          { name: "Business Systems", path: "/services/systems" },
        ])}
      />
      <BusinessSystemsView />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, "/services/systems");
}
