import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import type { Metadata } from "next";
import { getUiUxProjects } from "@/lib/content";
import { LivePreviewGrid } from "@/features/work-ui";
import { WorkUiHeader } from "./work-ui-header";

export const revalidate = 86400; // daily safety net; CMS saves invalidate on demand (lib/revalidate.ts). Keep >= 3600.

const pageMetadata: Metadata = {
  title: "UI/UX Showcase — Live Previews",
  description: "A focused index of interface and product work — each entry links straight to the real, currently-live site.",
};

export default async function WorkUiPage() {
  const projects = await getUiUxProjects();
  return (
    <main className="container-wide flex min-h-[calc(100svh-var(--nav-clearance))] flex-col gap-8 pb-6">
      <WorkUiHeader />
      <LivePreviewGrid projects={projects} />
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/work-ui');
}
