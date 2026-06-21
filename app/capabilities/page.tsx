import type { Metadata } from "next";
import { CapabilitiesView } from "./capabilities-view";

export const metadata: Metadata = {
  title: "Capabilities — Live Token Playground",
  description: "Drag the studio\'s actual design tokens and watch a real layout recalculate. Zero design drift, demonstrated.",
};

export default function CapabilitiesPage() {
  return <CapabilitiesView />;
}
