import { FunnelAnalytics } from "@/components/seo/funnel-analytics";
import { notFound } from "next/navigation";
import { LOCALES, localeDir, type Locale } from "@/lib/locale";
import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
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
import { getSiteGraphSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { BOOT_SCRIPT } from "@/lib/boot-script";
import { PwaRegistration } from "@/components/pwa/pwa-registration";
import { OsTray } from "@/components/layout/os-tray";
import "./globals.css";

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Short on purpose: Google cuts titles at ~60 characters and reads the site
  // name from here / the WebSite schema. The long tagline lives in the
  // description instead.
  title: {
    default: "Mustafa Aboalazm — Senior Brand Identity Designer",
    template: "%s · Mustafa Aboalazm",
  },
  description:
    "Mustafa Aboalazm — senior brand identity designer in Egypt, open to roles in Malaysia and the Gulf. Bilingual Arabic / English identity systems, brand guidelines and strategy for MENA and Southeast Asian brands.",
  applicationName: "Mustafa Aboalazm",
  authors: [{ name: "Mustafa Aboalazm", url: SITE_URL }],
  creator: "Mustafa Aboalazm",
  // "./" resolves per page, so every route canonicalises to its own URL
  // (previously no page had a canonical link at all).
  alternates: { canonical: "./" },
  // Only the snippet / preview-size allowances. index/follow are defaults and
  // are deliberately NOT restated: spelling them out here also landed on
  // notFound() pages, next to Next's own `noindex`, giving crawlers two
  // conflicting robots tags on a 404.
  robots: {
    googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/images/work/icon.png", sizes: "256x256", type: "image/png" },
      { url: "/icons/app-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/images/work/icon.png",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Aboalazm",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    siteName: "Mustafa Aboalazm",
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

export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    ar: { default: "مصطفى أبوالعزم — تصميم هوية ومواقع", template: "%s · مصطفى أبوالعزم" },
    ms: { default: "Mustafa Aboalazm — Reka Bentuk Identiti Jenama & Web", template: "%s · Mustafa Aboalazm" },
    en: { default: "Mustafa Aboalazm — Brand Identity & Web Design", template: "%s · Mustafa Aboalazm" },
  } as const;
  return { ...baseMetadata, title: titles[locale] };
}
export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: Locale }> }>) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) notFound();
  // The display face, on every route. Only Home preloaded it (hero.tsx), so on
  // every other page the headline was first painted in the fallback and then
  // re-set when GC EPICPRO arrived ~200 ms later — an extra-wide face, so the
  // H1 wrapped onto more lines and pushed the page down (CLS /services 0.29,
  // /for-hiring 0.17, against Home's 0.001). 13 KB, same file.
  preload("/fonts/Gc_Epicpro.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  // suppressHydrationWarning on <html>: the anti-flash script below (and
  // the lang/theme providers) legitimately mutate <html> attributes
  // (data-theme, lang, dir) before/around hydration — React #418
  // false-positive otherwise. Applies to this element's attributes only.
  return (
    <html lang={locale} dir={localeDir(locale)} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Anti-flash: set data-theme and lang/dir from localStorage before
            first paint, so a returning light-mode or Arabic visitor doesn't
            see a dark / LTR flash. A plain inline script (no external src,
            no user input) is the standard Next.js pattern for this — see
            lib/boot-script.ts, and ThemeProvider / LangProvider for the
            reactive half of this same mechanism. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {/* JSON-LD — Person + WebSite as one @graph, see lib/structured-data.ts.
            JsonLd escapes "<" so the payload can never close the script tag. */}
        <JsonLd data={getSiteGraphSchema()} />
      </head>
      <body className="bg-surface-0 text-text-primary antialiased">
        <PwaRegistration />
        <AmbientCanvas />
        <ThemeProvider>
          <LangProvider initialLang={locale}>
            <FunnelAnalytics />
            <PersonaProvider>
              <SmoothScroll>
                <Nav />
                <div className="site-stage">{children}</div>
                <Footer />
                {/* Persistent install + language dock. Sits inside
                    SmoothScroll so it shares the page's scroll context, and
                    below the nav in z-order. */}
                <OsTray />
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
