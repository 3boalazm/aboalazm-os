import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import { parseContactContext } from "@/lib/contact-context";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ContactView } from "./contact-view";

const pageMetadata: Metadata = {
  title: "Contact — Start the Conversation",
  description: "Reach out by email or WhatsApp, or send a project enquiry directly. Replies within two working days, Cairo time, worldwide work.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const context = parseContactContext(await searchParams);
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <ContactView context={context} />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/contact');
}
