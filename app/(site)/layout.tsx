import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontVariables } from "@/lib/fonts";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { AmbientCanvas } from "@/components/layout/ambient-canvas";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { LangProvider } from "@/components/providers/lang-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PersonaProvider } from "@/components/providers/persona-provider";
import { TerminalOverlay } from "@/features/terminal/terminal-overlay";
import { getPersonSchema, getWebSiteSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import { BOOT_SCRIPT } from "@/lib/boot-script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mustafa Aboalazm — Senior Brand Identity Designer & Visual Systems Specialist",
    template: "%s · Aboalazm OS",
  },
  description:
    "Brand identities and visual systems for Arabic- and English-speaking brands. Nine years across healthcare, food, education, and consumer products.",
  icons: {
    icon: "/images/work/icon.png",
    shortcut: "/images/work/icon.png",
    apple: "/images/work/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    siteName: "Mustafa Aboalazm OS",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080710" },
    { media: "(prefers-color-scheme: light)", color: "#FBF9F6" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const personSchema = getPersonSchema();
  const webSiteSchema = getWebSiteSchema();
  // suppressHydrationWarning on <html>: the anti-flash script below (and
  // the lang/theme providers) legitimately mutate <html> attributes
  // (data-theme, lang, dir) before/around hydration — React #418
  // false-positive otherwise. Applies to this element's attributes only.
  return (
    <html lang="en" dir="ltr" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Anti-flash: set data-theme and lang/dir from localStorage before
            first paint, so a returning light-mode or Arabic visitor doesn't
            see a dark / LTR flash. A plain inline script (no external src,
            no user input) is the standard Next.js pattern for this — see
            lib/boot-script.ts, and ThemeProvider / LangProvider for the
            reactive half of this same mechanism. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {/* JSON-LD — see lib/structured-data.ts. dangerouslySetInnerHTML is
            the standard, documented Next.js pattern for this: it's static,
            server-generated JSON with no user input, not a script-injection
            risk. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="bg-surface-0 text-text-primary antialiased">
        <AmbientCanvas />
        <ThemeProvider>
          <LangProvider>
            <PersonaProvider>
              <SmoothScroll>
                <Nav />
                {children}
                <Footer />
              </SmoothScroll>
            </PersonaProvider>
          </LangProvider>
        </ThemeProvider>
        <TerminalOverlay />
        <Analytics />
      </body>
    </html>
  );
}
