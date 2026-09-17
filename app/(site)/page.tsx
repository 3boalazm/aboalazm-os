import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/features/hero";
import { ProjectLedger } from "@/features/work";
import { getProjects } from "@/lib/content";
import { SkillsMarquee, AboutTeaser, StatsBand, HomeCta, ClientJourneyBand } from "@/features/home/home-bands";
import { GithubBand } from "@/features/home/github-band";
import { PersonaPickerBand } from "@/features/persona";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mustafa Aboalazm — Systemic Identity Architect",
  description: "Brand identity, design systems, and digital infrastructure for SaaS founders, AI startups, and design-driven teams. Nine years across pharma, education, and government.",
};

import { PersonaSection } from "@/features/persona/persona-section";
import { buttonVariants } from "@/components/ui/Button";

export default async function Home() {
  const projects = await getProjects();
  const designProjects = projects.filter((p) => p.category === "design");
  return (
    <main>
      <Hero />

      {/* ── Choose Your Path — non-blocking, right after the promise ── */}
      <PersonaPickerBand />

      {/* ── Client Journey Band — FIRST after hero, highest priority ── */}
      <ClientJourneyBand />

      <SkillsMarquee />
      <AboutTeaser />

      {/* ── Designer × AI Builder — the GitHub argument, mid-page ── */}
      <GithubBand />

      <StatsBand />

      {/* 02 / Selected Work */}
      <PersonaSection
        className="container-wide flex flex-col gap-4 py-16"
        kicker="02 / SELECTED WORK"
        title={{
          base: <>A handful of brands I&apos;ve <em className="text-accent">shaped.</em></>,
          founder: <>Results, not just <em className="text-accent">renders.</em></>,
          technical: <>Systems shipped, not just <em className="text-accent">screens.</em></>,
        }}
      >
        <ProjectLedger projects={designProjects} />
        <div className="flex justify-center">
          <a
            href="https://www.behance.net/aboalazm"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", className: "glass px-3 py-1.5 font-mono text-label tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary" })}
          >
            VIEW FULL PORTFOLIO ON BEHANCE ↗
          </a>
        </div>
      </PersonaSection>

      <HomeCta />
    </main>
  );
}
