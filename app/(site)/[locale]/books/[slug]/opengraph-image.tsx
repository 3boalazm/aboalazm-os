import { ImageResponse } from "next/og";
import { BOOKS, getBook } from "@/lib/books";
import { ogLocaleSlugParams } from "@/lib/og-static";
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);

  return new ImageResponse(
    <OgCard eyebrow="LIBRARY" title={book?.titleEn ?? "Aboalazm OS — Library"} />,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}

// Prerendered at build (one card per locale and book): a share-card request is a CDN hit, not a function render.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => ogLocaleSlugParams(BOOKS.map((book) => book.slug));
