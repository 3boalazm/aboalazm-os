import type { Metadata } from "next";
import { WorkFilter } from "@/features/work";
import { WorkHeader } from "./work-header";

export const metadata: Metadata = {
  title: "Work — Engineering Ledger",
  description: "A systematic index of identity systems, product architecture, and design infrastructure.",
};

export default function WorkPage() {
  return (
    <main className="container-wide flex min-h-svh flex-col gap-8 py-16">
      <WorkHeader />
      <WorkFilter />
    </main>
  );
}
