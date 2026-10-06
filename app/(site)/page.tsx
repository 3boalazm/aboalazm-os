import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { getProjects } from "@/lib/content";
import { SkillsMarquee, AboutTeaser, HomeCta, ClientJourneyBand } from "@/features/home/home-bands";
import { FeaturedCases } from "@/features/work/featured-cases";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mustafa Aboalazm — Senior Brand Identity Designer & Visual Systems Specialist",
  description:
    "Brand identities and visual systems for Arabic- and English-speaking brands. Nine years of practice across healthcare, food supplements, and consumer goods.",
};

export default async function Home() {
  const projects = await getProjects();
  return (
    <main>
      {/* 01 · Immediate clarity: who Mustafa is, what he designs, CV download, and separate hiring/client paths */}
      <Hero />

      {/* 02 · Proof first: top 3 diverse identity systems (Healthcare, Warm Editorial Art & Print, Consumer Packaging) */}
      <FeaturedCases projects={projects} heading="home" />

      {/* 03 · Process & Methodology */}
      <ClientJourneyBand />

      {/* 04 · Background & Practice */}
      <AboutTeaser />
      <SkillsMarquee />

      {/* 05 · Call to Action */}
      <HomeCta />
    </main>
  );
}
