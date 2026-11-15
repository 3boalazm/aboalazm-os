import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { ReelsView } from "./reels-view";

const pageMetadata: Metadata = {
  title: "Reels — The Method Behind Aboalazm OS, on Video",
  description:
    "Short reels on how the studio thinks and builds — grounded research, real execution plans, AI-assisted delivery and independent audits.",
};

export default function ReelsPage() {
  return <ReelsView />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, "/reels");
}
