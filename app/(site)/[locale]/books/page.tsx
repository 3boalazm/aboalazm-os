import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { BooksView } from "./books-view";
import { JsonLd } from "@/components/seo/json-ld";
import { getBookListSchema } from "@/lib/structured-data";
import { BOOKS } from "@/lib/books";

const pageMetadata: Metadata = {
  title: "Library — Interactive Design Books",
  description:
    "Books and references on design and branding, rebuilt as a staged, interactive reading experience.",
};

export default function BooksPage() {
  return (
    <>
      {/* Overhaul S6: the shelf as a structured ItemList (QA #48) */}
      <JsonLd data={getBookListSchema(BOOKS)} />
      <BooksView />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/books');
}
