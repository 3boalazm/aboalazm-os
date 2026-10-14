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

export const revalidate = 60;

export const metadata: Metadata = {
  // ≤ ~60 chars so Google shows the whole title; the name leads because it is the query
  title: "Mustafa Aboalazm — Senior Brand Identity Designer",
  description:
    "Mustafa Aboalazm — senior brand identity designer in Egypt. Bilingual Arabic / English identity systems, brand guidelines and strategy for MENA brands.",
  alternates: { canonical: "/" },
};

/**
 * HOME — previous portfolio-first hero restored with its case-study wall and
 * evidence row. The newer lower-page sequence remains unchanged.
 *
 *   Hero (status, name, work wall, two actions + metrics) → 01 Work →
 *   Statement band → 02 Offer → 03 Method → 04 Practice → 05 Thinking →
 *   06 FAQ → 07 Next
 */
export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  return (
    <main>
      <ScrollProgress />

      {/* 00 · Portfolio-first hero and project proof */}
      <Hero wall={pickHeroWall(projects)} />

      {/* 01 · Proof first — the work leads */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="01" label="SELECTED WORK" />
        </div>
        <ScrollReveal>
          <FeaturedCases projects={projects} heading="home" />
        </ScrollReveal>
      </section>

      {/* 01.5 · Manifesto beat — breaks the rhythm deliberately, no marker */}
      <StatementBand />

      {/* 02 · The offer */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="02" label="SERVICES / OFFER" />
        </div>
        <div className="container-wide">
          <ServicesSnapshot />
        </div>
      </section>

      {/* 03 · Process & Methodology */}
      <section className="narrative-section narrative-section--process">
        <div className="container-wide">
          <SectionMarker index="03" label="METHOD / PROCESS" />
        </div>
        <ScrollReveal>
          <ClientJourneyBand />
        </ScrollReveal>
      </section>

      {/* 04 · Background & Practice (skills live here now — marquee retired) */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="04" label="PRACTICE / BACKGROUND" />
        </div>
        <ScrollReveal>
          <AboutTeaser />
        </ScrollReveal>
      </section>

      {/* 05 · The thinking — journal teaser inside the funnel */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="05" label="WRITING / THINKING" />
        </div>
        <div className="container-wide">
          <InsightsTeaser posts={posts} />
        </div>
      </section>

      {/* 06 · FAQ / objection handling */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="06" label="FAQ / BEFORE START" />
        </div>
        <ScrollReveal>
          <HomeFaq />
        </ScrollReveal>
      </section>

      {/* 07 · One canonical next step */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="07" label="NEXT / START" />
        </div>
        <ScrollReveal>
          <HomeCta />
        </ScrollReveal>
      </section>
    </main>
  );
}
