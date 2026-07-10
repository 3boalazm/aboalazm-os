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
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aboalazm.com"),
  title: {
    default: "Mustafa Aboalazm — Systemic Identity Architect",
    template: "%s · Aboalazm OS",
  },
  description:
    "Brand identity, design systems, and digital infrastructure for SaaS founders, AI startups, and design-driven teams.",
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
        {/* Anti-flash: set data-theme from localStorage before hydration,
            so a returning light-mode visitor doesn't see a dark flash. A
            plain inline script (no external src, no user input) is the
            standard Next.js pattern for this — see ThemeProvider for the
            reactive half of this same mechanism. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}`,
          }}
        />
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
