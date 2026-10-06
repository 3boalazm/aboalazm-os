import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { getProjects } from "@/lib/content";
import { SkillsMarquee, AboutTeaser, HomeCta, ClientJourneyBand, WhyValueBand } from "@/features/home/home-bands";
import { FeaturedCases } from "@/features/work/featured-cases";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionMarker } from "@/components/ui/section-marker";
import { ScrollProgress } from "@/components/ui/scroll-progress";

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
      <ScrollProgress />
      {/* 01 · Immediate clarity: who Mustafa is, what he designs, CV download, and separate hiring/client paths */}
      <Hero />

      {/* 02 · Proof first: top 3 diverse identity systems (Healthcare, Warm Editorial Art & Print, Consumer Packaging) */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide"><SectionMarker index="01" label="SELECTED WORK" /></div>
        <ScrollReveal><FeaturedCases projects={projects} heading="home" /></ScrollReveal>
      </section>

      {/* 02.5 · Why this approach — trust/value bridge inspired by Blueprint's "Why us" layer */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide"><SectionMarker index="02" label="WHY / VALUE" /></div>
        <ScrollReveal><WhyValueBand /></ScrollReveal>
      </section>

      {/* 03 · Process & Methodology */
      <section className="narrative-section narrative-section--process">
        <div className="container-wide"><SectionMarker index="03" label="METHOD / PROCESS" /></div>
        <ScrollReveal><ClientJourneyBand /></ScrollReveal>
      </section>

      {/* 04 · Background & Practice */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide"><SectionMarker index="04" label="PRACTICE / BACKGROUND" /></div>
        <ScrollReveal><AboutTeaser /></ScrollReveal>
        <div className="section-divider" aria-hidden />
        <ScrollReveal delay={0.05}><SkillsMarquee /></ScrollReveal>
      </section>

      {/* 05 · Call to Action */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide"><SectionMarker index="05" label="NEXT / CONTACT" /></div>
        <ScrollReveal><HomeCta /></ScrollReveal>
      </section>
    </main>
  );
}
