import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/contact-details";

/**
 * SMART CARD REGISTRY (prototype, Nov 2026).
 *
 * One printed card = one entry here. The QR on the card only ever encodes
 * `/c/<token>`, so everything below can change after printing without a reprint.
 * This file is the stand-in for the future system (database + activation +
 * analytics): `status` and `serial` already have the shape that system needs.
 *
 * Every card page is prerendered at build time (see app/(card)/c/[token]/page.tsx):
 * a scan is a static file, never a function run.
 */
export type CardStatus = "unclaimed" | "active";
export type CardActionKind = "call" | "whatsapp" | "email" | "portfolio" | "linkedin" | "behance" | "location";

export interface CardAction {
  kind: CardActionKind;
  href: string;
  label: readonly [en: string, ar: string];
  value: string;
}

export interface SmartCard {
  token: string;
  /** Physical serial printed on the card back. */
  serial: string;
  edition: readonly [en: string, ar: string];
  status: CardStatus;
  name: readonly [en: string, ar: string];
  role: readonly [en: string, ar: string];
  tagline: readonly [en: string, ar: string];
  location: readonly [en: string, ar: string];
  portrait: string;
  /** Static .vcf under /public. */
  vcard: string;
  primary: readonly CardAction[];
  links: readonly CardAction[];
}

const PHONE_E164 = `+${WHATSAPP_NUMBER}`;

export const SMART_CARDS: readonly SmartCard[] = [
  {
    token: "k7m2aq",
    serial: "AZM-0001",
    edition: ["Edition 01 · Prototype", "الإصدار 01 · نموذج أولي"],
    status: "active",
    name: ["Mustafa Aboalazm", "مصطفى أبوالعزم"],
    role: ["Senior Brand Identity Designer", "مصمم هوية بصرية أول"],
    tagline: ["Bilingual (AR/EN) brand systems.", "أنظمة هوية ثنائية اللغة (عربي / إنجليزي)."],
    location: ["Al Obour, Egypt", "العبور، مصر"],
    portrait: "/images/work/portrait-512.png",
    vcard: "/cards/mustafa-aboalazm.vcf",
    primary: [
      { kind: "whatsapp", href: `https://wa.me/${WHATSAPP_NUMBER}`, label: ["WhatsApp", "واتساب"], value: WHATSAPP_DISPLAY },
      { kind: "call", href: `tel:${PHONE_E164}`, label: ["Call", "اتصال"], value: WHATSAPP_DISPLAY },
      { kind: "email", href: `mailto:${CONTACT_EMAIL}`, label: ["Email", "البريد"], value: CONTACT_EMAIL },
    ],
    links: [
      { kind: "portfolio", href: "/", label: ["Portfolio", "معرض الأعمال"], value: "aboalazm-os.vercel.app" },
      { kind: "linkedin", href: "https://www.linkedin.com/in/aboalazm/", label: ["LinkedIn", "لينكد إن"], value: "in/aboalazm" },
      { kind: "behance", href: "https://www.behance.net/aboalazm", label: ["Behance", "بيهانس"], value: "behance.net/aboalazm" },
      { kind: "location", href: "https://www.google.com/maps/search/?api=1&query=Al+Obour+City%2C+Egypt", label: ["Location", "الموقع"], value: "Al Obour, Egypt" },
    ],
  },
];

export function getSmartCard(token: string): SmartCard | undefined {
  return SMART_CARDS.find((card) => card.token === token);
}
