import type { Metadata } from "next";
import { ResourcesView } from "./resources-view";

export const metadata: Metadata = {
  title: "Resources — The Aboalazm OS Knowledge Base",
  description:
    "Eight connected frameworks for building brands with clarity, consistency, and scale — Brand OS Canvas, Audit, Discovery, Positioning, Architecture, Design System, Governance, and AI Operations.",
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
