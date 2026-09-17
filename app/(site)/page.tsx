import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { getProjects } from "@/lib/content";
import { SkillsMarquee, AboutTeaser, StatsBand, HomeCta, ClientJourneyBand } from "@/features/home/home-bands";
import { GithubBand } from "@/features/home/github-band";
import { FeaturedCases } from "@/features/work/featured-cases";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mustafa Aboalazm — Systemic Identity Architect",
  description: "Brand identity, design systems, and digital infrastructure for SaaS founders, AI startups, and design-driven teams. Nine years across pharma, education, and government.",
};

export default async function Home() {
  const projects = await getProjects();
  return (
    <main>
      {/* Promise */}
      <Hero />

      {/* Proof — one strong evidence layer before method, stats, or GitHub */}
      <FeaturedCases projects={projects} heading="home" />

      {/* Method */}
      <ClientJourneyBand />

      {/* Who + atmosphere, after the decision path has started */}
      <AboutTeaser />
      <SkillsMarquee />
      <StatsBand />
      <GithubBand />

      {/* Action */}
      <HomeCta />
    </main>
  );
}
