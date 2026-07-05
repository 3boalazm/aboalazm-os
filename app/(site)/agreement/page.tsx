import type { Metadata } from "next";
import { AgreementView } from "./agreement-view";

export const metadata: Metadata = {
  title: "Agreement — Work-Flow",
  description: "Eight phases, transparent terms, 50/50 payment structure — the full work-flow agreement, stated upfront.",
};

export default function AgreementPage() {
  return <AgreementView />;
}
