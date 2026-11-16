import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { Hero } from "@/features/hero";
import { pickHeroWall } from "@/features/hero/hero-wall-data";
import { getProjects } from "@/lib/content";
import { ClientJourneyBand } from "@/features/home/home-bands";
import { LanguageBand } from "@/features/home/language-band";
import { PhotoStrip } from "@/features/home/photo-strip";
import "@/features/home/home-rhythm.css";
import { ReelsShortcuts } from "@/features/reels/reels-shortcuts";
import { BootRail } from "@/features/home/boot-rail";
import { HomeStart, ModuleIndex } from "@/features/home/module-index";
import { FeaturedCases } from "@/features/work/featured-cases";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionMarker } from "@/components/ui/section-marker";
import { ScrollProgress } from "@/components/ui/scroll-progress";
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
 *   REDESIGN V2 (2026-11): seven modules on four grounds, down from thirteen
 *   sections on one.
 *
 *   00 BOOT (cinematic hero) → 01 OFFER (ember) → 02 WORK (obsidian) →
 *   03 WATCH (ink) → 04 METHOD (ember) → 05 STUDIO (obsidian) →
 *   06 START (glow, with the index of what moved off the page)
 *   Dark theme: every ground is dark (lib/theme-tokens.ts, contrast-tested).
 *
 *   Moved, not deleted: the services snapshot and social proof live on
 *   /services and /pricing; practice/background on /about; writing on
 *   /writing; the FAQ on /contact. The START module links to each.
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
  const projects = await getProjects();
  const identityProjects = projects.filter((project) => project.category === "design");
  const developmentProjects = projects.filter((project) => project.category === "development");

  return (
    <main>
      <ScrollProgress />

      {/* 00 · BOOT — who you are buying, and what the studio does */}
      <div id="boot">
        <Hero wall={pickHeroWall(projects)} />
      </div>

      {/* The boot rail: the page read as an OS loading module by module. */}
      <BootRail />

      {/* 01 · OFFER — ember ground. The three disciplines, colour-coded. */}
      <section id="offer" className="narrative-section narrative-section--proof ground ground-ember ground-sheet">
        <div className="container-wide">
          <SectionMarker index="01" label="OFFER / WHAT WE DO" labelAr="العرض / اللي بنعمله" />
        </div>
        <div className="container-wide">
          <DisciplinesBand highlight="brand" />
        </div>
      </section>

      {/* 02 · WORK — obsidian. Identity, the files, then digital: one module. */}
      <section id="work" className="narrative-section narrative-section--proof ground ground-base ground-sheet">
        <div className="container-wide">
          <SectionMarker index="02" label="WORK / PROOF" labelAr="الأعمال / الدليل" />
        </div>
        <ScrollReveal>
          <FeaturedCases
            projects={identityProjects}
            heading="home"
            variant="identity"
            sectionId="selected-work"
          />
        </ScrollReveal>
        <div className="mt-8">
          <PhotoStrip />
        </div>
        <ScrollReveal>
          <div className="mt-8">
            <FeaturedCases
              projects={developmentProjects}
              heading="home"
              variant="digital"
              sectionId="home-digital-products"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* 03 · WATCH — ink ground. Exactly three reel shortcuts. */}
      <section id="watch" className="narrative-section narrative-section--proof ground ground-ink ground-sheet">
        <div className="container-wide">
          <SectionMarker index="03" label="WATCH / REELS" labelAr="شاهد / ريلز" />
        </div>
        <div className="container-wide">
          <ReelsShortcuts />
        </div>
      </section>

      {/* 04 · METHOD — ember ground. How a project runs, then how it starts. */}
      <section id="method" className="narrative-section narrative-section--process ground ground-ember ground-sheet">
        <div className="container-wide">
          <SectionMarker index="04" label="METHOD / HOW IT RUNS" labelAr="المنهج / إزاي بيمشي" />
        </div>
        <ScrollReveal>
          <ClientJourneyBand />
        </ScrollReveal>
        <div className="container-wide mt-8">
          <ScrollReveal>
            <StartFunnel />
          </ScrollReveal>
        </div>
      </section>

      {/* 05 · STUDIO — obsidian. Who you are buying, and the three scripts.
          The language band stays on the home page on purpose: it is what makes
          the third locale believable (lib/discoverability.test.ts). */}
      <section id="studio" className="narrative-section narrative-section--about ground ground-base ground-sheet">
        <div className="container-wide">
          <SectionMarker index="05" label="STUDIO / WHO YOU WORK WITH" labelAr="الاستوديو / مين هتشتغل معاه" />
        </div>
        <div className="container-wide">
          <ScrollReveal>
            <StudioModelBand />
          </ScrollReveal>
        </div>
        <div className="mt-8">
          <LanguageBand />
        </div>
      </section>

      {/* 06 · START — glow ground (near-black under a coral sun). One next step, then the index of
          everything that left the home page (pricing, writing, FAQ, about):
          six sections became six lines. */}
      <section id="start" className="narrative-section narrative-section--cta ground ground-glow ground-sheet">
        <div className="container-wide">
          <SectionMarker index="06" label="START / NEXT STEP" labelAr="ابدأ / الخطوة الجاية" />
        </div>
        <div className="container-wide flex flex-col gap-8">
          <HomeStart />
          <ModuleIndex />
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/');
}
