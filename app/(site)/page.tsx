import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { pickHeroWall } from "@/features/hero/hero-wall-data";
import { getProjects } from "@/lib/content";
import { SkillsMarquee, AboutTeaser, HomeCta, ClientJourneyBand, WhyValueBand, HomeFaq } from "@/features/home/home-bands";
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

export default async function Home() {
  const projects = await getProjects();

  return (
    <main>
      <ScrollProgress />

      {/* 01 · Immediate clarity */}
      <Hero wall={pickHeroWall(projects)} />

      {/* 02 · Proof first */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="01" label="SELECTED WORK" labelAr="أعمال مختارة" />
        </div>
        <ScrollReveal>
          <FeaturedCases projects={projects} heading="home" />
        </ScrollReveal>
      </section>

      {/* 02.5 · Why this approach */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="02" label="WHY / VALUE" labelAr="لماذا / القيمة" />
        </div>
        <ScrollReveal>
          <WhyValueBand />
        </ScrollReveal>
      </section>

      {/* 03 · Process & Methodology */}
      <section className="narrative-section narrative-section--process">
        <div className="container-wide">
          <SectionMarker index="03" label="METHOD / PROCESS" labelAr="المنهج / العملية" />
        </div>
        <ScrollReveal>
          <ClientJourneyBand />
        </ScrollReveal>
      </section>

      {/* 04 · Background & Practice */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="04" label="PRACTICE / BACKGROUND" labelAr="الممارسة / الخلفية" />
        </div>
        <ScrollReveal>
          <AboutTeaser />
        </ScrollReveal>
        <div className="section-divider" aria-hidden="true" />
        <ScrollReveal delay={0.05}>
          <SkillsMarquee />
        </ScrollReveal>
      </section>

      {/* 05 · FAQ / objection handling */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="05" label="FAQ / BEFORE START" labelAr="أسئلة / قبل البدء" />
        </div>
        <ScrollReveal>
          <HomeFaq />
        </ScrollReveal>
      </section>

      {/* 06 · Call to Action */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="06" label="NEXT / CONTACT" labelAr="التالي / تواصل" />
        </div>
        <ScrollReveal>
          <HomeCta />
        </ScrollReveal>
      </section>
    </main>
  );
}
