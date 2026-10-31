import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/localized-metadata";
import type { Locale } from "@/lib/locale";
import {
  generateBookingReference,
  isValidBookingReference,
} from "@/lib/booking";
import { BookView } from "./book-view";

const originalMetadata: Metadata = {
  title: "Book with a Deposit — Project Kickoff",
  description:
    "Select your tier or web package, choose EGP, SAR or USD, send your 50% kickoff deposit (or pay in full with -10%), and confirm on WhatsApp.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(originalMetadata, locale, "/book");
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (v: string | string[] | undefined): string | undefined =>
    typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;

  const plan = pick(sp.plan);
  const cur = pick(sp.cur);
  const mode = pick(sp.mode);
  const addon = pick(sp.addon);
  const rawRef = pick(sp.ref);
  const reference = isValidBookingReference(rawRef)
    ? rawRef
    : generateBookingReference();

  return (
    <BookView
      initialPlanId={plan}
      initialCurrency={cur}
      initialMode={mode}
      initialAddonLogo={addon === "logo"}
      reference={reference}
    />
  );
}
