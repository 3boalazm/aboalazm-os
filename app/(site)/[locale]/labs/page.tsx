import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { LabsView } from "./labs-view";

const pageMetadata: Metadata = {
  title: "Labs — R&D Behind Aboalazm OS",
  description:
    "The R&D layer behind Aboalazm OS: AI workflows, brand-OS experiments, design systems and internal tools, tested before they become frameworks.",
};

export default function LabsPage() {
  return <LabsView />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/labs');
}
