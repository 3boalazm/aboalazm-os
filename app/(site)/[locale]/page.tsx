import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { pickHeroWall } from "@/features/hero/hero-wall-data";
import { getProjects, getPosts } from "@/lib/content";
import { AboutTeaser, HomeCta, ClientJourneyBand, HomeFaq } from "@/features/home/home-bands";
import { StatementBand } from "@/features/home/statement-band";
import { LanguageBand } from "@/features/home/language-band";
import { ServicesSnapshot } from "@/features/home/services-snapshot";
import { InsightsTeaser } from "@/features/home/insights-teaser";
import { ReelsShortcuts } from "@/features/reels/reels-shortcuts";
import { FeaturedCases } from "@/features/work/featured-cases";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionMarker } from "@/components/ui/section-marker";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SocialProof } from "@/components/shared/social-proof";
import { DisciplinesBand, StudioModelBand } from "@/features/offers/disciplines";
import { StartFunnel } from "@/features/offers/start-funnel";


export const revalidate = 60;

const pageMetadata: Metadata = {
  // The studio leads; the founder's name follows because it is also a search query.
  title: "Aboalazm OS — Brand, Digital & Business Systems Studio",
  description:
    "A founder-led studio building brand identity, bilingual digital experiences and business systems for ambitious companies. Discovery call first, written scope before any payment.",
  alternates: { canonical: "/" },
};

/**
 * HOME — repositioned 2026-11: a studio that sells business outcomes, in the
 * order a decision-maker asks for them.
 *
 *   Hero (who you're buying) → 01 What we do (three disciplines) →
 *   02 Proof — brand → 03 Reels (3 shortcuts) → 04 Proof — digital →
 *   Statement → 05 How the studio runs → 06 The offer → 07 Method →
 *   08 Practice → 09 Languages (the three authored scripts) → 10 How to
 *   start → 11 Thinking → 12 FAQ → 13 Next
 *
 * Two changes from the previous order matter commercially:
 *   · "What we do" now precedes the work, so the work is read as evidence of a
 *     discipline rather than as a portfolio of unrelated artefacts.
 *   · The funnel band sits before the FAQ and the closing CTA, so the visitor
 *     learns that payment is step 04 before being offered a deposit button.
 *
 * Identity still leads inside the work sections — that is the studio's proven
 * edge — but it is no longer the whole story the home page tells.
 */
export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const identityProjects = projects.filter((project) => project.category === "design");
  const developmentProjects = projects.filter((project) => project.category === "development");

  return (
    <main>
      <ScrollProgress />

      {/* 00 · Who you are buying, and what the studio does */}
      <Hero wall={pickHeroWall(projects)} />

      {/* 01 · The three disciplines — read before the proof */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="01" label="WHAT WE DO" labelAr="اللي بنعمله" />
        </div>
        <div className="container-wide">
          <DisciplinesBand highlight="brand" />
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

      {/* 03 · Reels — directly under the selected work: exactly three video
          shortcuts into the method (see
          features/reels/reels.data.ts → pickHomeShortcuts); the full set
          lives on /reels. */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="03" label="REELS / SHORTCUTS" labelAr="ريلز / اختصارات" />
        </div>
        <div className="container-wide">
          <ReelsShortcuts />
        </div>
      </section>

      {/* 04 · Development work has its own showcase and production links */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="04" label="DIGITAL PRODUCTS & SYSTEMS" labelAr="المنتجات الرقمية والأنظمة" />
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

      {/* 05 · How the studio actually runs — the operating-model answer */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="05" label="THE STUDIO MODEL" labelAr="نموذج الاستوديو" />
        </div>
        <div className="container-wide">
          <ScrollReveal>
            <StudioModelBand />
          </ScrollReveal>
        </div>
      </section>

      {/* 06 · The offer */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="06" label="SERVICES / OFFER" labelAr="الخدمات / العرض" />
        </div>
        <div className="container-wide">
          <ServicesSnapshot />
        </div>
        <SocialProof />
      </section>

      {/* 07 · Process & Methodology */}
      <section className="narrative-section narrative-section--process">
        <div className="container-wide">
          <SectionMarker index="07" label="METHOD / PROCESS" labelAr="المنهج / العملية" />
        </div>
        <ScrollReveal>
          <ClientJourneyBand />
        </ScrollReveal>
      </section>

      {/* 08 · Background & Practice */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="08" label="PRACTICE / BACKGROUND" labelAr="الممارسة / الخلفية" />
        </div>
        <ScrollReveal>
          <AboutTeaser />
        </ScrollReveal>
      </section>

      {/* 09 · The three languages this OS is authored in.
          Placed right after Practice: the visitor has just read who the studio
          is, and "it exists in Arabic and Malay too" is part of who it is. It
          also repairs a real discoverability bug — the header used to cycle
          languages behind one button, so /ms was unreachable for anyone who
          did not guess twice. Its marker takes the slot the funnel steps down
          from, so the narrative stays one continuous count. */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="09" label="LANGUAGES / THREE SCRIPTS" labelAr="اللغات / ثلاث كتابات" />
        </div>
        <LanguageBand />
      </section>

      {/* 10 · How to start — one funnel, stated before the FAQ */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="10" label="NEXT / HOW TO START" labelAr="التالي / كيف تبدأ" />
        </div>
        <div className="container-wide">
          <ScrollReveal>
            <StartFunnel />
          </ScrollReveal>
        </div>
      </section>

      {/* 11 · The thinking — journal teaser inside the funnel */}
      <section className="narrative-section narrative-section--proof">
        <div className="container-wide">
          <SectionMarker index="11" label="WRITING / THINKING" labelAr="مقالات / التفكير" />
        </div>
        <div className="container-wide">
          <InsightsTeaser posts={posts} />
        </div>
      </section>

      {/* 12 · FAQ / objection handling */}
      <section className="narrative-section narrative-section--about">
        <div className="container-wide">
          <SectionMarker index="12" label="FAQ / BEFORE START" labelAr="أسئلة / قبل البدء" />
        </div>
        <ScrollReveal>
          <HomeFaq />
        </ScrollReveal>
      </section>

      {/* 13 · One canonical next step */}
      <section className="narrative-section narrative-section--cta">
        <div className="container-wide">
          <SectionMarker index="13" label="NEXT / START" labelAr="التالي / ابدأ" />
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
