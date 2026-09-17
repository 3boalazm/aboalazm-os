import type { Metadata } from "next";
import { WorkFilter } from "@/features/work";
import { getProjects } from "@/lib/content";
import { WorkHeader } from "./work-header";

export const revalidate = 60;


export const metadata: Metadata = {
  title: "Work — Selected cases",
  description: "Identity systems and digital products — the problem, what shipped, and the outcome.",
};

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-16">
      <WorkHeader />
      <WorkFilter projects={projects} />
    </main>
  );
}
