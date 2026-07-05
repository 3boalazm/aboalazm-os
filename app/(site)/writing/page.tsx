import type { Metadata } from "next";
import { WritingView } from "./writing-view";

export const metadata: Metadata = {
  title: "Writing — Notes from the system",
  description: "Working documents on identity, tokens, and the craft of bilingual design.",
};

export default function WritingPage() {
  return <WritingView />;
}
