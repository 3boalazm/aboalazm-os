import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ContactView } from "./contact-view";

export const metadata: Metadata = {
  title: "Contact — Start the Conversation",
  description: "Reach out by email, WhatsApp, LinkedIn, or Behance — or send a project brief directly. Replies within two working days, Cairo time, worldwide work.",
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <ContactView />
    </>
  );
}
