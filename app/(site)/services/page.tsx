import type { Metadata } from "next";
import { ServicesView } from "./services-view";

export const metadata: Metadata = {
  title: "Services — Strategy, Identity, Systems",
  description: "Five services, one studio, no handoff gaps — brand identity & strategy, design systems, web, print & packaging, art direction.",
};

export default function ServicesPage() {
  return <ServicesView />;
}
