import { ImageResponse } from "next/og";
import { getPost } from "@/lib/content";
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const lang = post?.lang ?? "en";
  const eyebrow = lang === "ar" ? "مقالات" : "WRITING";

  return new ImageResponse(
    <OgCard eyebrow={eyebrow} title={post?.title ?? "Aboalazm OS — Writing"} lang={lang} />,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
