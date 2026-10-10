import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { WhyView } from "./why-view";

export const metadata: Metadata = {
  title: "Why — The Case for Systemic Identity",
  description: "Why strategy before design, systems instead of one-off deliverables, and bilingual identity architecture built to scale across teams, products, and campaigns.",
};

export default function WhyPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Why", path: "/why" }])} />
      <WhyView />
    </>
  );
}
