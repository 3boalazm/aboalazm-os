import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ForHiringView } from "./for-hiring-view";

export const metadata: Metadata = {
  title: { absolute: "Hire Mustafa Aboalazm — Senior Brand Identity Designer" },
  alternates: { canonical: "/for-hiring" },
  description:
    "Candidate dossier for design leaders and hiring teams. Mustafa Aboalazm: Senior Brand Identity Designer with 9 years of bilingual practice across healthcare, food, and consumer brands. Open to Riyadh / Remote.",
};

export default function ForHiringPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "For hiring teams", path: "/for-hiring" }])} />
      <ForHiringView />
    </>
  );
}
