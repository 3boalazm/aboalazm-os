import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScrollyCaseStudy, CaseGallery } from "@/features/case-studies";
import { getCaseStudy, getCaseStudyGallery, getAllCaseStudySlugs } from "@/lib/content";

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
  if (!record) return {};
  return {
    title: `${record.name} — Case File`,
    description: record.problem.slice(0, 155),
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

  const gallery = await getCaseStudyGallery(slug);

  return (
    <main>
      <ScrollyCaseStudy
        record={record}
        gallery={gallery.length > 0 ? <CaseGallery items={gallery} /> : undefined}
      />
    </main>
  );
}
