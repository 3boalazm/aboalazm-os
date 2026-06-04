import type { Metadata } from "next";
import { ScrollyCaseStudy, NILE_PHARMA } from "@/features/case-studies";

export const metadata: Metadata = {
  title: "Nile Pharma Food — Case File",
  description:
    "Identity built from zero for a pharma & food-supplements company: +40% online visibility, +25% engagement, five years in production.",
};

export default function NilePharmaCaseStudy() {
  return (
    <main>
      <ScrollyCaseStudy record={NILE_PHARMA} />
    </main>
  );
}
