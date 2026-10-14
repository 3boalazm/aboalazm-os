import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { WorkFilter } from "@/features/work";
import { getProjects, getGalleryData } from "@/lib/content";
import { WorkHeader } from "./work-header";

export const revalidate = 60;


export const metadata: Metadata = {
  title: "Work — Selected cases",
  description: "Identity systems and digital products — the problem, what shipped, and the outcome. Switch to the Wall for the full cross-project gallery.",
};

export default async function WorkPage() {
  /* Overhaul S4: the standalone /gallery page merged here as the "Wall"
     view (301'd) — fetch both datasets once, the toggle stays client-side. */
  const [projects, gallery] = await Promise.all([getProjects(), getGalleryData()]);
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-16">
      <JsonLd data={getBreadcrumbSchema([{ name: "Work", path: "/work" }])} />
      <WorkHeader />
      <WorkFilter
        projects={projects}
        galleryProjects={gallery.projects}
        galleryImages={gallery.images}
      />
    </main>
  );
}
