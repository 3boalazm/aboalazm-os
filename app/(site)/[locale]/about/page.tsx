import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { AboutView } from "./about-view";
import { getSettings } from "@/lib/content";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema, getProfilePageSchema } from "@/lib/structured-data";

export const revalidate = 60;

const pageMetadata: Metadata = {
  title: { absolute: "About Mustafa Aboalazm — Senior Brand Identity Designer" },
  description:
    "Mustafa Aboalazm: senior brand identity designer and Code & Canvas co-founder in Al Obour, Egypt. Bilingual Arabic / English identity systems.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { cvUrl } = await getSettings();
  return (
    <>
      <JsonLd data={getProfilePageSchema()} />
      <JsonLd data={getBreadcrumbSchema([{ name: "About", path: "/about" }])} />
      <AboutView cvUrl={cvUrl} />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/about');
}
