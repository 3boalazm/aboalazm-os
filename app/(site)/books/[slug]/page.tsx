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

export async function generateMetadata({
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
