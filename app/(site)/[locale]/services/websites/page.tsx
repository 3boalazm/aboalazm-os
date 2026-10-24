import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/localized-metadata";
import { ServiceDetail } from "@/features/offers/service-detail";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata({ title: "Website & Digital Product Design", description: "Bilingual company websites, landing pages and business tools. Explore project examples and define the users, workflows, content and implementation scope." }, locale, "/services/websites");
}
export default function Page() { return <ServiceDetail kind="web" />; }
