import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/localized-metadata";
import { ServiceDetail } from "@/features/offers/service-detail";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata({ title: "Arabic & English Brand Identity Design", description: "Brand identity for a launch or refresh: logos, typography, guidelines and practical applications. Explore real work, compare packages and discuss your scope." }, locale, "/services/brand-identity");
}
export default function Page() { return <ServiceDetail kind="identity" />; }
