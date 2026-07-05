import type { Metadata } from "next";
import { LabsView } from "./labs-view";

export const metadata: Metadata = {
  title: "Labs — R&D Behind Aboalazm OS",
  description:
    "The research and experimentation layer behind Aboalazm OS — AI workflows, brand-OS experiments, design systems, prompt systems, and internal tools. Where systems are tested before they become frameworks.",
};

export default function LabsPage() {
  return <LabsView />;
}
