import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { TrackArchive } from "@/features/work";
import { getGalleryData, getProjects } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Design Track — Brand Identity & Visual Systems",
  description:
    "Explore every brand identity, packaging architecture, signage system, and design governance project by Mustafa Aboalazm.",
  alternates: { canonical: "/work/design" },
};

export default async function DesignTrackPage() {
  const [projects, gallery] = await Promise.all([
    getProjects(),
    getGalleryData(),
  ]);

  const designProjects = projects.filter((p) => p.category === "design");
  const developmentCount = projects.filter((p) => p.category === "development").length;

  return (
    <main className="container-wide flex min-h-[calc(100svh-var(--nav-clearance))] flex-col gap-8 pb-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Work", path: "/work" },
          { name: "Design Track", path: "/work/design" },
        ])}
      />
      <TrackArchive
        track="design"
        projects={designProjects}
        siblingCount={developmentCount}
        galleryProjects={gallery.projects}
        galleryImages={gallery.images}
      />
    </main>
  );
}
