import type { Metadata } from "next";
import { getUiUxProjects } from "@/lib/content";
import { LivePreviewGrid } from "@/features/work-ui";
import { WorkUiHeader } from "./work-ui-header";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "UI/UX Showcase — Live Previews",
  description: "A focused index of interface and product work — each entry links straight to the real, currently-live site.",
};

export default async function WorkUiPage() {
  const projects = await getUiUxProjects();
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-16">
      <WorkUiHeader />
      <LivePreviewGrid projects={projects} />
    </main>
  );
}
