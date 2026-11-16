import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { ResourcesView } from "./resources-view";

const pageMetadata: Metadata = {
  title: "Resources — The Aboalazm OS Knowledge Base",
  description:
    "Eight connected frameworks for building brands with clarity and scale — from Brand OS Canvas and Audit to Governance and AI Operations.",
};

export default function ResourcesPage() {
  return <ResourcesView />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/resources');
}
