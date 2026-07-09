import type { Metadata } from "next";
import { StartView } from "./start-view";

export const metadata: Metadata = {
  title: "Start — Your Client Journey",
  description: "Thinking about starting a project? Here's who this is for, what you'll get, how the 4-phase process works, and how to book the first call.",
};

export default function StartPage() {
  return <StartView />;
}
