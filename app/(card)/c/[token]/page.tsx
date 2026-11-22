import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SMART_CARDS, getSmartCard } from "@/lib/card/cards";
import { CardView } from "./card-view";

// Every card is a static file: a token that is not in the registry is a 404
// from the CDN, never a function run (lib/cpu-guard.test.ts explains why).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SMART_CARDS.map((card) => ({ token: card.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const card = getSmartCard(token);
  if (!card) return {};
  return {
    title: `${card.name[0]} — ${card.role[0]}`,
    description: `${card.tagline[0]} Contact ${card.name[0]}: WhatsApp, phone, email and portfolio.`,
  };
}

export default async function SmartCardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const card = getSmartCard(token);
  if (!card) notFound();
  return <CardView card={card} />;
}
