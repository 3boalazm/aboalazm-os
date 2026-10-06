import type { Metadata } from "next";
import { ForHiringView } from "./for-hiring-view";

export const metadata: Metadata = {
  title: "Mustafa Aboalazm — For Hiring Teams | Senior Brand Identity Designer",
  description:
    "Candidate dossier for design leaders and hiring teams. Mustafa Aboalazm: Senior Brand Identity Designer with 9 years of bilingual practice across healthcare, food, and consumer brands. Open to Riyadh / Remote.",
};

export default function ForHiringPage() {
  return <ForHiringView />;
}
