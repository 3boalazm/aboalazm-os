import type { Metadata } from "next";
import { PricingView } from "./pricing-view";

export const metadata: Metadata = {
  title: "Pricing — No Hidden Fees",
  description: "Three transparent tiers from $199 logo design to full brand systems, plus à la carte services. USD, negotiable, stated upfront.",
};

export default function PricingPage() {
  return <PricingView />;
}
