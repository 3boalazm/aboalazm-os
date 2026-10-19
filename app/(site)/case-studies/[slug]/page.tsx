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
import { NilePharmaERPCaseStudy } from "@/features/case-studies/nile-pharma-erp";
import { MahtoolCaseStudy } from "@/features/case-studies/mahtool";

export const revalidate = 60;

// Shared by generateMetadata and the page so a lookup costs one DB hit.
const getCaseStudy = cache(fetchCaseStudy);

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "nile-pharma-erp") {
    return {
      title: "Nile Pharma ERP — Engineering Case File",
      description: "A nine-service pharmaceutical distribution ERP covering inventory, sales, CRM, accounting, incentives and auditable business workflows.",
    };
  }
  if (slug === "speech-to-text-studio") {
    return {
      title: "Mahtool — Speech-to-Text Product Case File",
      description: "A bilingual transcription workspace with four speech engines, automatic failover, live recording, large-file uploads, credential controls and transcript export.",
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
  if (slug === "nile-pharma-erp") {
    return <NilePharmaERPCaseStudy />;
  }
  if (slug === "speech-to-text-studio") {
    return <MahtoolCaseStudy />;
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
  const nextSlug = at === -1 ? null : allSlugs[(at + 1) % allSlugs.length] ?? null;
  const next = nextSlug ? await fetchCaseStudy(nextSlug) : null;

  return (
    <main>
      <ScrollyCaseStudy record={record} gallery={gallery} brandBook={brandBook} />
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
