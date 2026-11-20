import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
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

// Static on purpose (CPU GUARD, lib/cpu-guard.test.ts): this page must not read `searchParams`, cookies or headers.
// The funnel context in the URL is read in the browser (contact-from-url.tsx, used by <ContactView>); until it has
// hydrated, and for crawlers, the HTML is the complete view without a context.
export default function ContactPage() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <ContactView />
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
