import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { TypeView } from "./type-view";

// Internal type-system reference page — not meant to rank in search results.
const pageMetadata: Metadata = {
  title: "Type Specimen — GC EPICPRO & Montserrat",
  robots: { index: false, follow: true },
};

export default function TypePage() {
  return <TypeView />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/type');
}
