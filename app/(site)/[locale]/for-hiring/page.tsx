import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ForHiringView } from "./for-hiring-view";

const pageMetadata: Metadata = {
  title: { absolute: "Hire Mustafa Aboalazm — Senior Brand Identity Designer" },
  alternates: { canonical: "/for-hiring" },
  description:
    "Mustafa Aboalazm: Senior Brand Identity Designer with 9+ years in design. Explore roles, project contributions and CV. Gulf and remote opportunities.",
};

export default function ForHiringPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "For hiring teams", path: "/for-hiring" }])} />
      <ForHiringView />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/for-hiring');
}
