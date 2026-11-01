import { BUILT_IN_CASE_SLUGS, PROJECT_OVERVIEW_SLUGS } from "@/lib/case-registry";
import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import { ProjectEnquiry } from "@/features/contact/project-enquiry";
import { ProjectOverview } from "@/features/case-studies/project-overview";
import { CaseStudyShell } from "@/features/case-studies/case-study-shell";
import { getBusinessCase } from "@/features/case-studies/business-cases.data";
import { PROJECTS } from "@/features/work/projects.data";
import { projectEnquiryService } from "@/features/work/project-enquiry-service";
import type { Project } from "@/features/work/types";
import { cache, type ReactElement } from "react";
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
import { SpeechToTextStudioCaseStudy } from "@/features/case-studies/speech-to-text-studio";
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

const CUSTOM_TECHNICAL_VIEWS: Readonly<Record<string, () => ReactElement>> = {
  "nile-pharma-erp": () => <NilePharmaERPCaseStudy />,
  "speech-to-text-studio": () => <SpeechToTextStudioCaseStudy />,
  "nile-pharma-storefront": () => <NilePharmaStorefrontCaseStudy />,
  zad: () => <ZadCaseStudy />,
  "ummah-academy": () => <UmmahAcademyCaseStudy />,
  "momo-collective": () => <OltreCollectiveCaseStudy />,
  "farm-console": () => <FarmConsoleCaseStudy />,
  "mini-exam": () => <MiniExamCaseStudy />,
  stemforge: () => <StemForgeCaseStudy />,
  "pharmacy-web": () => <PharmacyWebCaseStudy />,
  continuum: () => <ContinuumCaseStudy />,
  "code-canvas-dev": () => <CodeCanvasDevCaseStudy />,
};

function nextInTrack(current?: Project): Project | null {
  if (!current) return null;
  const peers = PROJECTS.filter((p) => p.category === current.category && p.hasCaseStudy);
  const idx = peers.findIndex((p) => p.slug === current.slug);
  if (idx === -1 || peers.length < 2) return null;
  return peers[(idx + 1) % peers.length] ?? null;
}

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
      title: "Nile Pharma ERP — Engineering & Business Case File",
      description:
        "A nine-service pharmaceutical distribution ERP covering inventory, sales, CRM, accounting, incentives and auditable business workflows.",
    };
  }

  if (slug === "speech-to-text-studio") {
    return {
      title: "Speech to Text Studio — Transcription Product Case File",
      description:
        "A bilingual transcription workspace with four speech engines, automatic failover, live recording, large-file uploads, credential controls and transcript export.",
    };
  }

  if (slug === "zad") {
    return {
      title: "Zad — Islamic Companion PWA Case File",
      description:
        "Zad is an Arabic-first Islamic PWA: 64 pages for prayer times, Quran, adhkar, kids and daily worship tracking — offline-first and installable.",
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
  if ((PROJECT_OVERVIEW_SLUGS as readonly string[]).includes(slug) && preview) {
    return {
      title: `${preview.name} — Case Study & Business Overview`,
      description: preview.outcome,
    };
  }
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
  const project = PROJECTS.find((p) => p.slug === slug);

  /* 1 · Project-overview slugs (upgraded with both Technical & Business views) */
  if ((PROJECT_OVERVIEW_SLUGS as readonly string[]).includes(slug) && project) {
    const nextPeer = nextInTrack(project);
    return (
      <CaseStudyShell
        technicalView={<ProjectOverview project={project} />}
        businessData={getBusinessCase(slug, project)}
        project={project}
        footer={
          <>
            <ProjectEnquiry
              service={projectEnquiryService(project)}
              source={`/case-studies/${slug}`}
            />
            {nextPeer ? (
              <NextCaseLink
                slug={nextPeer.slug}
                name={nextPeer.name}
                nameAr={nextPeer.nameAr}
                accent={nextPeer.accent}
              />
            ) : null}
          </>
        }
      />
    );
  }

  /* 2 · Dedicated product & engineering case studies (12 slugs) */
  const renderCustomTechnical = CUSTOM_TECHNICAL_VIEWS[slug];
  if (renderCustomTechnical) {
    const nextPeer = nextInTrack(project);
    return (
      <CaseStudyShell
        technicalView={renderCustomTechnical()}
        businessData={getBusinessCase(slug, project)}
        project={project}
        footer={
          <>
            <ProjectEnquiry
              service="digital-product"
              source={`/case-studies/${slug}`}
            />
            {nextPeer ? (
              <NextCaseLink
                slug={nextPeer.slug}
                name={nextPeer.name}
                nameAr={nextPeer.nameAr}
                accent={nextPeer.accent}
              />
            ) : null}
          </>
        }
      />
    );
  }

  /* 3 · CMS / static brand identity scrolly case studies */
  const record = await getCaseStudy(slug);
  if (!record) notFound();

  const gallery = await getCaseStudyGallery(slug);
  const brandBook = slug === "gad-institute" ? <GadBrandBook /> : undefined;

  const allSlugs = await getAllCaseStudySlugs();
  const at = allSlugs.indexOf(slug);
  const nextSlug =
    at === -1 ? null : allSlugs[(at + 1) % allSlugs.length] ?? null;
  const nextRecord = nextSlug ? await fetchCaseStudy(nextSlug) : null;
  const nextPeer = nextRecord ?? nextInTrack(project);

  return (
    <CaseStudyShell
      technicalView={
        <ScrollyCaseStudy
          record={record}
          gallery={gallery}
          brandBook={brandBook}
        />
      }
      businessData={getBusinessCase(slug, project, record)}
      project={project}
      fallbackName={record.name}
      fallbackNameAr={record.nameAr}
      fallbackYear={record.timeline}
      fallbackThumbnail={gallery[0]?.src}
      footer={
        <>
          <ProjectEnquiry
            service={project ? projectEnquiryService(project) : "brand-identity"}
            source={`/case-studies/${slug}`}
          />
          {nextPeer ? (
            <NextCaseLink
              slug={nextPeer.slug}
              name={nextPeer.name}
              nameAr={nextPeer.nameAr}
              accent={nextPeer.accent}
            />
          ) : null}
        </>
      }
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: Locale }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  return localizedMetadata(await originalMetadata({ params }), locale, `/case-studies/${slug}`);
}
