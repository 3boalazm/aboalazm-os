import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
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

const pageMetadata: Metadata = {
  // ≤ ~60 chars so Google shows the whole title; the name leads because it is the query
  title: "Mustafa Aboalazm — Senior Brand Identity Designer",
  description:
    "Mustafa Aboalazm — senior brand identity designer and web developer in Egypt. Explore brand systems, production-ready digital products and applied AI workflows.",
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

      {/* 00 · Portfolio-first hero and project proof */}
      <Hero wall={pickHeroWall(projects)} />

      {/* 01 · Identity work */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="01" label="IDENTITY / SELECTED WORK" labelAr="الهوية / أعمال مختارة" />
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
          <SectionMarker index="02" label="DEVELOPMENT / DIGITAL PRODUCTS" labelAr="التطوير / المنتجات الرقمية" />
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
          <SectionMarker index="03" label="SERVICES / OFFER" labelAr="الخدمات / العرض" />
        </div>
        <div className="container-wide">
          <ServicesSnapshot />
        </div>
      </section>

      {/* 04 · Process & Methodology */}
      <section className="narrative-section narrative-section--process">
        <div className="container-wide">
          <SectionMarker index="04" label="METHOD / PROCESS" labelAr="المنهج / العملية" />
        </div>
        <ScrollReveal>
          <ClientJourneyBand />
        </ScrollReveal>
      </section>

      {/* 05 · Background & Practice (skills live here now — marquee retired) */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="05" label="PRACTICE / BACKGROUND" labelAr="الممارسة / الخلفية" />
        </div>
        <ScrollReveal>
          <AboutTeaser />
        </ScrollReveal>
      </section>

      {/* 06 · The thinking — journal teaser inside the funnel */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="06" label="WRITING / THINKING" labelAr="مقالات / التفكير" />
        </div>
        <div className="container-wide">
          <InsightsTeaser posts={posts} />
        </div>
      </section>

      {/* 07 · FAQ / objection handling */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="07" label="FAQ / BEFORE START" labelAr="أسئلة / قبل البدء" />
        </div>
        <ScrollReveal>
          <HomeFaq />
        </ScrollReveal>
      </section>

      {/* 08 · One canonical next step */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="08" label="NEXT / START" labelAr="التالي / ابدأ" />
        </div>
        <ScrollReveal>
          <HomeCta />
        </ScrollReveal>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/');
}
