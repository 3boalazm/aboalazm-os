import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ProcessView } from "./process-view";

export const metadata: Metadata = {
  title: "Process — The 38-Day Method",
  description: "A four-phase engineering method, refined over 9+ years of design practice: Discover, Define, Architect, Build. Every task, deliverable, and gate drawn from how projects actually run.",
};

export default function ProcessPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Process", path: "/process" }])} />
      <ProcessView />
    </>
  );
}
