import Link from "next/link";
import { Hero } from "@/features/hero";
import { ProjectLedger } from "@/features/work";
import { getProjects } from "@/lib/content";
import { SkillsMarquee, AboutTeaser, StatsBand, HomeCta, ClientJourneyBand } from "@/features/home/home-bands";
import { PersonaPickerBand } from "@/features/persona";

export const revalidate = 60;

import { PersonaSection } from "@/features/persona/persona-section";

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
            className="glass rounded-pill px-3 py-1.5 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors duration-base ease-physics hover:text-text-primary"
          >
            VIEW FULL PORTFOLIO ON BEHANCE ↗
          </a>
        </div>
      </PersonaSection>

      <HomeCta />
    </main>
  );
}
