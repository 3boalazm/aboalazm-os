import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { WorkFilter } from "@/features/work";
import { getProjects, getGalleryData } from "@/lib/content";
import { WorkHeader } from "./work-header";

export const revalidate = 60;


const pageMetadata: Metadata = {
  title: "Work — Identity & Digital Products",
  description: "Explore brand identity and digital products in separate streams. Digital projects include visual previews and direct links to their production demos.",
};

export default async function WorkPage() {
  /* Overhaul S4: the standalone /gallery page merged here as the "Wall"
     view (301'd) — fetch both datasets once, the toggle stays client-side. */
  const [projects, gallery] = await Promise.all([getProjects(), getGalleryData()]);
  return (
    <main className="container-wide flex min-h-[calc(100svh-var(--nav-clearance))] flex-col gap-8 pb-6">
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

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/work');
}
