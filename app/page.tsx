import Link from "next/link";
import { Hero } from "@/features/hero";
import { ProjectLedger } from "@/features/work";
import { SkillsMarquee, AboutTeaser, StatsBand, HomeCta, ClientJourneyBand } from "@/features/home/home-bands";

export default function Home() {
  return (
    <main>
      <Hero />
      <SkillsMarquee />
      <AboutTeaser />
      <StatsBand />

      {/* ── Client Journey Band — "how we work" redirect to /start ── */}
      <ClientJourneyBand />

      {/* 02 / Selected Work */}
      <section className="container-wide flex flex-col gap-4 py-16">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-micro uppercase tracking-[0.10em] text-text-ghost">
            02 / SELECTED WORK
          </p>
          <h2 className="font-display text-title tracking-[-0.015em]">
            A handful of brands I've <em className="text-accent">shaped.</em>
          </h2>
        </div>
        <ProjectLedger />
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
      </section>

      <HomeCta />
    </main>
  );
}
