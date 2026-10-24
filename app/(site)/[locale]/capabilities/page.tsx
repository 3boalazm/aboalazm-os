import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { CapabilitiesView } from "./capabilities-view";

const pageMetadata: Metadata = {
  title: "Capabilities — Live Token Playground",
  description: "Drag the studio\'s actual design tokens and watch a real layout recalculate. Zero design drift, demonstrated.",
};

export default function CapabilitiesPage() {
  return <CapabilitiesView />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/capabilities');
}
