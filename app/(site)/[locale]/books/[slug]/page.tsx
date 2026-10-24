import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOOKS, getBook } from "@/lib/books";
import { ReaderView } from "./reader-view";
import { JsonLd } from "@/components/seo/json-ld";
import { getBookSchema } from "@/lib/structured-data";

// Books are a static list — any other slug is a hard 404, not a rendered shell.
export const dynamicParams = false;

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

async function originalMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  return {
    title: `${book.titleEn} — Interactive Reader`,
    description: book.blurbEn,
  };
}

export default async function BookReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  return (
    <>
      {/* Overhaul S6: Book JSON-LD (QA #48) */}
      <JsonLd data={getBookSchema(book)} />
      <ReaderView book={book} />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: Locale }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const book = getBook(slug);
  return localizedMetadata(await originalMetadata({ params }), locale, `/books/${slug}`, book ? { title: `${book.title} — القارئ التفاعلي`, description: book.blurb } : undefined);
}
