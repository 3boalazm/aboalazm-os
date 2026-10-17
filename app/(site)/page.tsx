import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { pickHeroWall } from "@/features/hero/hero-wall-data";
import { getProjects, getPosts } from "@/lib/content";
import { AboutTeaser, HomeCta, ClientJourneyBand, HomeFaq } from "@/features/home/home-bands";
import { StatementBand } from "@/features/home/statement-band";
import { ServicesSnapshot } from "@/features/home/services-snapshot";
import { InsightsTeaser } from "@/features/home/insights-teaser";
import { FeaturedCases } from "@/features/work/featured-cases";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionMarker } from "@/components/ui/section-marker";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { PwaInstallButton } from "@/components/pwa/pwa-install-button";

export const revalidate = 60;

export const metadata: Metadata = {
  // ≤ ~60 chars so Google shows the whole title; the name leads because it is the query
  title: "Mustafa Aboalazm — Senior Brand Identity Designer",
  description:
    "Mustafa Aboalazm — senior brand identity designer and digital product developer in Egypt. Explore identity systems and production-ready web experiences.",
  alternates: { canonical: "/" },
};

/**
 * HOME — portfolio-first hero followed by distinct identity and development
 * showcases, then the rest of the studio story.
 *
 *   Hero → 01 Identity → 02 Digital products → Statement band → 03 Offer →
 *   04 Method → 05 Practice → 06 Thinking → 07 FAQ → 08 Next
 */
export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const identityProjects = projects.filter((project) => project.category === "design");
  const developmentProjects = projects.filter((project) => project.category === "development");

  return (
    <main>
      <ScrollProgress />
      <PwaInstallButton />

      {/* 00 · Portfolio-first hero and project proof */}
      <Hero wall={pickHeroWall(projects)} />

      {/* Install the OS itself; the floating control below handles the native prompt. */}
      <section className="narrative-section narrative-section--cta" aria-labelledby="install-os-title">
        <div className="container-wide">
          <div className="rounded-card border border-border-default bg-surface-1/80 p-6 shadow-card backdrop-blur-xl sm:p-8">
            <p className="font-mono text-micro uppercase tracking-[0.16em] text-accent">TAKE THE OS WITH YOU</p>
            <div className="mt-3 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <h2 id="install-os-title" className="font-display text-heading text-text-primary sm:text-display">Install Aboalazm OS</h2>
                <p className="mt-2 max-w-2xl text-body-sm leading-relaxed text-text-secondary">
                  Keep your personal workspace one tap away. Add Aboalazm OS to your device for a focused, app-like experience.
                </p>
              </div>
              <a href="#pwa-install-control" className="inline-flex min-h-11 items-center justify-center rounded-pill bg-accent px-5 py-3 text-sm font-semibold text-obsidian transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Install Aboalazm OS ↗
              </a>
            </div>
            <p className="mt-4 border-t border-border-subtle pt-3 text-caption text-text-tertiary">
              Opens in its own app window; previously visited pages may remain available offline.
            </p>
          </div>
        </div>
      </section>

      {/* 01 · Identity work */
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="01" label="IDENTITY / SELECTED WORK" />
        </div>
        <ScrollReveal>
          <FeaturedCases
            projects={identityProjects}
            heading="home"
            variant="identity"
            sectionId="selected-work"
          />
        </ScrollReveal>
      </section>

      {/* 02 · Development work has its own showcase and production links */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="02" label="DEVELOPMENT / DIGITAL PRODUCTS" />
        </div>
        <ScrollReveal>
          <FeaturedCases
            projects={developmentProjects}
            heading="home"
            variant="digital"
            sectionId="home-digital-products"
          />
        </ScrollReveal>
      </section>

      {/* Manifesto beat — breaks the rhythm deliberately, no marker */}
      <StatementBand />

      {/* 03 · The offer */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="03" label="SERVICES / OFFER" />
        </div>
        <div className="container-wide">
          <ServicesSnapshot />
        </div>
      </section>

      {/* 04 · Process & Methodology */}
      <section className="narrative-section narrative-section--process">
        <div className="container-wide">
          <SectionMarker index="04" label="METHOD / PROCESS" />
        </div>
        <ScrollReveal>
          <ClientJourneyBand />
        </ScrollReveal>
      </section>

      {/* 05 · Background & Practice (skills live here now — marquee retired) */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="05" label="PRACTICE / BACKGROUND" />
        </div>
        <ScrollReveal>
          <AboutTeaser />
        </ScrollReveal>
      </section>

      {/* 06 · The thinking — journal teaser inside the funnel */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="06" label="WRITING / THINKING" />
        </div>
        <div className="container-wide">
          <InsightsTeaser posts={posts} />
        </div>
      </section>

      {/* 07 · FAQ / objection handling */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="07" label="FAQ / BEFORE START" />
        </div>
        <ScrollReveal>
          <HomeFaq />
        </ScrollReveal>
      </section>

      {/* 08 · One canonical next step */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="08" label="NEXT / START" />
        </div>
        <ScrollReveal>
          <HomeCta />
        </ScrollReveal>
      </section>
    </main>
  );
}
