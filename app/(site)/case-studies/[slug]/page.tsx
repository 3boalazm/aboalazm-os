import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScrollyCaseStudy, CaseGallery } from "@/features/case-studies";
import {
  getCaseStudy as fetchCaseStudy,
  getCaseStudyGallery,
  getAllCaseStudySlugs,
} from "@/lib/content";
import { truncateAtWord } from "@/lib/seo";
import { GadBrandBookPanel } from "@/features/gad-brand-book";

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
  const record = await getCaseStudy(slug);
  if (!record) notFound();

  // GAD ships its brand book inline (panel 04). The book already shows every
  // slide the generic gallery would, so the gallery is skipped to avoid the
  // same images twice.
  const hasBrandBook = slug === "gad-institute";
  const gallery = hasBrandBook ? [] : await getCaseStudyGallery(slug);

  return (
    <main>
      <ScrollyCaseStudy
        record={record}
        gallery={gallery.length > 0 ? <CaseGallery items={gallery} /> : undefined}
        brandBook={hasBrandBook ? <GadBrandBookPanel index="04" /> : undefined}
      />
    </main>
  );
}
