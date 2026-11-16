import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import type { Project } from "@/features/work/types";
import { DeveloperView } from "./developer-view";

export const revalidate = 60;

const pageMetadata: Metadata = {
  title: "The Maker — Design, Products & Systems",
  description:
    "Meet Mustafa Aboalazm: brand identity designer, product architect, and builder at Code & Canvas. Explore selected work and start a project.",
  alternates: { canonical: "/developer" },
};

const FEATURED_SLUGS = [
  "code-canvas-dev",
  "nile-pharma-erp",
  "gad-institute",
  "speech-to-text-studio",
  "zad",
  "momo-collective",
] as const;

export default async function DeveloperPage() {
  const projects = await getProjects();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const featured = FEATURED_SLUGS
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project));

  return <DeveloperView projects={featured} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/developer');
}
