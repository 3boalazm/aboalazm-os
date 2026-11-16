import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { pickHeroWall } from "@/features/hero/hero-wall-data";
import { getProjects } from "@/lib/content";
import { HomeCta } from "@/features/home/home-bands";
import "@/features/home/home-rhythm.css";
import { FeaturedCases } from "@/features/work/featured-cases";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionMarker } from "@/components/ui/section-marker";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { DisciplinesBand } from "@/features/offers/disciplines";


export const revalidate = 60;

const pageMetadata: Metadata = {
  // The studio leads; the founder's name follows because it is also a search query.
  title: "Aboalazm OS — Brand, Digital & Business Systems Studio",
  description:
    "A founder-led studio building brand identity, bilingual digital experiences and business systems for ambitious companies. Discovery call first, written scope before any payment.",
  alternates: { canonical: "/" },
};

/** A short introduction, services, selected work and one clear next step.
 * Detailed process, pricing, writing and FAQs live on their own pages. */
export default async function Home() {
  const projects = await getProjects();
  const identityProjects = projects.filter((project) => project.category === "design");
  const developmentProjects = projects.filter((project) => project.category === "development");

  return (
    <main>
      <ScrollProgress />

      {/* 00 · Who you are buying, and what the studio does */}
      <Hero wall={pickHeroWall(projects)} />

      {/* 01 · The three disciplines — read before the proof */}
      <section className="narrative-section narrative-section--cta narrative-raise">
        <div className="container-wide">
          <SectionMarker index="01" label="WHAT WE DO" labelAr="اللي بنعمله" />
        </div>
        <div className="container-wide">
          <DisciplinesBand highlight="brand" className="max-md:[&_ul]:hidden" />
        </div>
      </section>

      {/* 02 · Identity work */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="02" label="BRAND IDENTITY / SELECTED WORK" labelAr="الهوية / أعمال مختارة" />
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

      {/* 04 · Development work has its own showcase and production links */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="03" label="DIGITAL PRODUCTS & SYSTEMS" labelAr="المنتجات الرقمية والأنظمة" />
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

      {/* 04 · One canonical next step */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="04" label="NEXT / START" labelAr="التالي / ابدأ" />
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
