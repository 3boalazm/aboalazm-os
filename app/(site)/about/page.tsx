import type { Metadata } from "next";
import { AboutView } from "./about-view";
import { getSettings } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About — Mustafa Aboalazm",
  description: "Senior Brand Identity Designer and Co-founder of Code & Canvas, based in Al Obour, Egypt.",
};

export default async function AboutPage() {
  const { cvUrl } = await getSettings();
  return <AboutView cvUrl={cvUrl} />;
}
