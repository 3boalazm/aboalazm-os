import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import { parseContactContext } from "@/lib/contact-context";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { RESPONSE_PROMISE } from "@/lib/contact-details";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { ContactView } from "./contact-view";
import { HomeFaq } from "@/features/home/home-bands";

const pageMetadata: Metadata = {
  title: "Contact — Start the Conversation",
  description: `Reach out by email or WhatsApp, or send a project enquiry directly. ${RESPONSE_PROMISE.en}`,
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const context = parseContactContext(await searchParams);
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <ContactView context={context} />
      {/* The FAQ moved here from the home page: it answers
          the questions people have right before they write. */}
      <section id="faq" className="scroll-mt-20 py-8">
        <HomeFaq />
      </section>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(pageMetadata, locale, '/contact');
}
