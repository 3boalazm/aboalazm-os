import { BUILT_IN_CASE_SLUGS, PROJECT_OVERVIEW_SLUGS } from "@/lib/case-registry";
import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import { ProjectOverview } from "@/features/case-studies/project-overview";
import { PROJECTS } from "@/features/work/projects.data";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScrollyCaseStudy } from "@/features/case-studies";
import { NextCaseLink } from "@/features/case-studies/next-case-link";
import {
  getCaseStudy as fetchCaseStudy,
  getCaseStudyGallery,
  getAllCaseStudySlugs,
} from "@/lib/content";
import { truncateAtWord } from "@/lib/seo";
import { GadBrandBook } from "@/features/gad-brand-book";
import { ZadCaseStudy } from "@/features/case-studies/zad";
import { NilePharmaERPCaseStudy } from "@/features/case-studies/nile-pharma-erp";
import { MahtoolCaseStudy } from "@/features/case-studies/mahtool";
import { NilePharmaStorefrontCaseStudy } from "@/features/case-studies/nile-pharma-storefront";
import { UmmahAcademyCaseStudy } from "@/features/case-studies/ummah-academy";
import { OltreCollectiveCaseStudy } from "@/features/case-studies/oltre-collective";
import { FarmConsoleCaseStudy } from "@/features/case-studies/farm-console";
import { MiniExamCaseStudy } from "@/features/case-studies/mini-exam";
import { StemForgeCaseStudy } from "@/features/case-studies/stemforge";
import { PharmacyWebCaseStudy } from "@/features/case-studies/pharmacy-web";
import { ContinuumCaseStudy } from "@/features/case-studies/continuum";
import { CodeCanvasDevCaseStudy } from "@/features/case-studies/code-canvas-dev";

export const revalidate = 60;

// Shared by generateMetadata and the page so a lookup costs one DB hit.
const getCaseStudy = cache(fetchCaseStudy);

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return [...new Set([...slugs, ...BUILT_IN_CASE_SLUGS])].map((slug) => ({ slug }));
}

async function originalMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "nile-pharma-erp") {
    return {
      title: "Nile Pharma ERP — Engineering Case File",
      description:
        "A nine-service pharmaceutical distribution ERP covering inventory, sales, CRM, accounting, incentives and auditable business workflows.",
    };
  }

  if (slug === "speech-to-text-studio") {
    return {
      title: "Mahtool — Speech-to-Text Product Case File",
      description:
        "A bilingual transcription workspace with four speech engines, automatic failover, live recording, large-file uploads, credential controls and transcript export.",
    };
  }

  if (slug === "zad") {
    return {
      title: "Zad — Islamic Companion PWA Case File",
      description: "Zad is an Arabic-first Islamic PWA: 64 pages for prayer times, Quran, adhkar, kids and daily worship tracking — offline-first and installable.",
    };
  }

  if (slug === "nile-pharma-storefront") {
    return {
      title: "Nile Pharma Food Storefront — Commerce Platform Case File",
      description:
        "A bilingual Next.js storefront connecting Payload CMS content to Vendure live commerce, pricing, checkout, customer accounts and operational safeguards.",
    };
  }

  if (slug === "ummah-academy") {
    return {
      title: "Ummah Academy — Live Learning Platform Case File",
      description:
        "A live 1-on-1 Qur'an, Tajweed, Arabic and Islamic studies academy website: five languages with full RTL, 23 routes per locale, an installable PWA and documented teacher vetting.",
    };
  }

  if (slug === "momo-collective") {
    return {
      title: "OLTRÈ Collective — Streetwear Commerce Case File",
      description:
        "A full-stack Egyptian streetwear store: drop-led storefront, cart and wishlist, loyalty tiers, admin analytics, EGP pricing and card, MEEZA and Vodafone Cash checkout.",
    };
  }

  if (slug === "farm-console") {
    return {
      title: "Farm Console — Livestock Operations Case File",
      description:
        "An Arabic-first livestock management PWA for herd records, health, breeding and finance — code-gated, installable from the browser and synced in realtime.",
    };
  }

  if (slug === "mini-exam") {
    return {
      title: "Mini Exam — Exam Platform Case File",
      description:
        "A teacher-first exam builder: two generation modes, four question types, review before publish, server-side grading and WhatsApp result delivery — with no student accounts.",
    };
  }

  if (slug === "stemforge") {
    return {
      title: "StemForge — On-Device Stem Separation Case File",
      description:
        "Split a track into vocals, drums, bass and other inside the browser on WebGPU, with three engines, honest fallbacks and an opt-in server path.",
    };
  }

  if (slug === "pharmacy-web") {
    return {
      title: "Pharmacy Web — Pharmacy Frontend Case Study",
      description:
        "A multi-tenant pharmacy SaaS frontend: 15 bounded-context modules with boundary rules enforced in CI, string money, idempotent financial POSTs and a DUR gate.",
    };
  }

  if (slug === "continuum") {
    return {
      title: "Continuum — Memory OS Case File",
      description:
        "A twenty-one page personal workspace with no build step and local-first state: projects, tasks, journal, knowledge and bookmarks, with optional Firebase sync.",
    };
  }

  if (slug === "code-canvas-dev") {
    return {
      title: "Code & Canvas — Studio Platform Case File",
      description:
        "A two-practice MENA studio platform: 23 fixed-scope services across technology, creative and healthcare, with published price bands and milestone-gated delivery.",
    };
  }

  const preview = PROJECTS.find((p) => p.slug === slug);
  if ((PROJECT_OVERVIEW_SLUGS as readonly string[]).includes(slug) && preview) return { title: `${preview.name} — Project Overview`, description: preview.outcome };
  const record = await getCaseStudy(slug);

  // Throw here too: the Suspense boundary can flush a 200 before the page
  // body calls notFound(), so metadata is what makes the status a real 404.
  if (!record) notFound();

  return {
    title: `${record.name} — Case File`,
    description: truncateAtWord(record.problem),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const preview = PROJECTS.find((p) => p.slug === slug);
  if ((PROJECT_OVERVIEW_SLUGS as readonly string[]).includes(slug) && preview) return <ProjectOverview project={preview} />;

  if (slug === "nile-pharma-erp") {
    return <><NilePharmaERPCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "speech-to-text-studio") {
    return <><MahtoolCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "nile-pharma-storefront") {
    return <><NilePharmaStorefrontCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "zad") {
    return <><ZadCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "ummah-academy") {
    return <><UmmahAcademyCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "momo-collective") {
    return <><OltreCollectiveCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "farm-console") {
    return <><FarmConsoleCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }


  if (slug === "mini-exam") {
    return <><MiniExamCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "stemforge") {
    return <><StemForgeCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "pharmacy-web") {
    return <><PharmacyWebCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "continuum") {
    return <><ContinuumCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  if (slug === "code-canvas-dev") {
    return <><CodeCanvasDevCaseStudy /><ProjectEnquiry service="digital-product" /></>;
  }

  const record = await getCaseStudy(slug);
  if (!record) notFound();

  const gallery = await getCaseStudyGallery(slug);

  // GAD carries its full guidelines document inline, in the System panel.
  const brandBook = slug === "gad-institute" ? <GadBrandBook /> : undefined;

  /* Overhaul S4: every case study closes with a hand-off to the next one
     (cyclic over the published index, never a dead end). */
  const allSlugs = await getAllCaseStudySlugs();
  const at = allSlugs.indexOf(slug);
  const nextSlug =
    at === -1 ? null : allSlugs[(at + 1) % allSlugs.length] ?? null;
  const next = nextSlug ? await fetchCaseStudy(nextSlug) : null;

  return (
    <main>
      <ScrollyCaseStudy
        record={record}
        gallery={gallery}
        brandBook={brandBook}
      />
      <ProjectEnquiry service="brand-identity" source={`/case-studies/${slug}`} />
      {next ? (
        <NextCaseLink
          slug={next.slug}
          name={next.name}
          nameAr={next.nameAr}
          accent={next.accent}
        />
      ) : null}
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: Locale }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  return localizedMetadata(await originalMetadata({ params }), locale, `/case-studies/${slug}`);
}
