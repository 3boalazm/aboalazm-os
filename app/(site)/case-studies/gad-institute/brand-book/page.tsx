import type { Metadata } from "next";
import { GadBrandBook } from "@/features/gad-brand-book/gad-brand-book";

export const metadata: Metadata = {
  title: "GAD Heart & Lungs Institute — Brand Book",
  description:
    "Brand identity V2.0 for GAD Heart & Lungs Institute — strategy, persona, bilingual logo system, colour, typography and applications.",
  // Unlisted for now: reachable by link only (not in the sitemap, not linked from the site).
  robots: { index: false, follow: false },
  openGraph: { images: ["/images/work/gad/gad-thumb.jpg"] },
};

export default function GadBrandBookPage() {
  return (
    <main>
      <GadBrandBook />
    </main>
  );
}
