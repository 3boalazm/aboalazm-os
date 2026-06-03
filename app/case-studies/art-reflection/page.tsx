import type { Metadata } from "next";
import { ScrollyCaseStudy, ART_REFLECTION } from "@/features/case-studies";

export const metadata: Metadata = {
  title: "Art Reflection — Case File",
  description:
    "Problem → Research → System → Impact: how a five-deck brand became a zero-drift operating system in 38 days.",
};

export default function ArtReflectionCaseStudy() {
  return (
    <main>
      <ScrollyCaseStudy record={ART_REFLECTION} />
    </main>
  );
}
