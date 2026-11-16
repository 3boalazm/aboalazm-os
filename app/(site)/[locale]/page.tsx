import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { HomeRedesignPreview } from "@/features/home/home-redesign-preview";

export const revalidate = 60;

const pageMetadata: Metadata = {
  title: "Aboalazm OS — Brand, Digital & Business Systems Studio",
  description: "A founder-led studio connecting brand systems, digital experiences and business tools for ambitious teams.",
  alternates: { canonical: "/" },
};

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const [{ locale }, projects] = await Promise.all([params, getProjects()]);
  return <HomeRedesignPreview locale={locale} projects={projects} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, "/");
}
