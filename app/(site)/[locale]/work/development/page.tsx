import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { TrackArchive } from "@/features/work";
import { getProjects } from "@/lib/content";

export const revalidate = 86400; // daily safety net; CMS saves invalidate on demand (lib/revalidate.ts). Keep >= 3600.

const pageMetadata: Metadata = {
  title: "Development Track — Digital Products & Engineering",
  description:
    "Explore all shipped digital products, web applications, AI tools, and bilingual interfaces built by Mustafa Aboalazm.",
  alternates: { canonical: "/work/development" },
};

export default async function DevelopmentTrackPage() {
  const projects = await getProjects();

  const developmentProjects = projects.filter((p) => p.category === "development");
  const designCount = projects.filter((p) => p.category === "design").length;

  return (
    <main className="container-wide flex min-h-[calc(100svh-var(--nav-clearance))] flex-col gap-8 pb-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Work", path: "/work" },
          { name: "Development Track", path: "/work/development" },
        ])}
      />
      <TrackArchive
        track="development"
        projects={developmentProjects}
        siblingCount={designCount}
      />
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/work/development');
}
