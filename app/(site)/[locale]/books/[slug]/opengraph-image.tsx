import { ImageResponse } from "next/og";
import { getBook } from "@/lib/books";
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
