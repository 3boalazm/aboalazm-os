import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { Portal } from "@/features/x/portal";
import { Manifesto } from "@/features/x/manifesto";
import { Disciplines } from "@/features/x/disciplines";
import { WorkTrack } from "@/features/x/work-track";
import { Reels } from "@/features/x/reels";
import { Proof } from "@/features/x/proof";
import { Method } from "@/features/x/method";
import { Close } from "@/features/x/close";
import { Tape } from "@/features/x/tape";

export const revalidate = 86400; // daily safety net; CMS saves invalidate on demand (lib/revalidate.ts). Keep >= 3600.

const pageMetadata: Metadata = {
  // The studio leads; the founder's name follows because it is also a search query.
  title: "Aboalazm OS — Brand, Digital & Business Systems Studio",
  description:
    "A founder-led studio building brand identity, bilingual digital experiences and business systems for ambitious companies. Discovery call first, written scope before any payment.",
  alternates: { canonical: "/" },
};

/**
 * HOME — the new site (2026-11-16), built from zero. Eight frames, read as
 * one film:
 *
 *   00 PORTAL     the figure walks into the sun; the claim splits around it
 *   01 MANIFESTO  one sentence, lit word by word
 *   02 DOORS      three disciplines as portals (prices from lib/offers)
 *   03 WORK       pinned horizontal reel, provenance on every card
 *   04 REELS      three phones — directly under the work (owner's rule)
 *   05 PROOF      one bento: documented numbers, the founder-led studio
 *                 model (STUDIO_MODEL), the three authored languages
 *   06 METHOD     talk first, pay last — four gates + the three tiers
 *   07 CLOSE      the sun rises again; a one-line brief; the page index
 *
 * Dark theme: every room is dark (tested grounds, lib/theme-tokens.ts).
 * The portal and the close are dark film frames in both themes.
 */
export default async function Home() {
  const projects = await getProjects();
  const identity = projects.filter((project) => project.category === "design");
  const digital = projects.filter((project) => project.category === "development");

  return (
    <main id="main">
      <Portal />
      <Manifesto />
      <Disciplines />
      <Tape
        a={["Brand identity", "Digital experience", "Business systems"]}
        b={["English", "العربية", "Bahasa Melayu", "Built to run"]}
      />
      <WorkTrack identity={identity} digital={digital} />
      <Reels />
      <Proof />
      <Method />
      <Close />
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, "/");
}
