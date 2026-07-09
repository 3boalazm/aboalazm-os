import type { Metadata } from "next";
import { TypeView } from "./type-view";

// Internal type-system reference page — not meant to rank in search results.
export const metadata: Metadata = {
  title: "Type Specimen — GC EPICPRO & Montserrat",
  robots: { index: false, follow: true },
};

export default function TypePage() {
  return <TypeView />;
}
