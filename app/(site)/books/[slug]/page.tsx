import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOOKS, getBook } from "@/lib/books";
import { ReaderView } from "./reader-view";

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
  if (!book) return { title: "Book not found" };
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
  return <ReaderView book={book} />;
}
