import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontVariables } from "@/lib/fonts";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { AmbientCanvas } from "@/components/layout/ambient-canvas";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { LangProvider } from "@/components/providers/lang-provider";
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
  themeColor: "#080710",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body className="bg-obsidian text-text-primary antialiased">
        <AmbientCanvas />
        <LangProvider>
          <SmoothScroll>
            <Nav />
            {children}
            <Footer />
          </SmoothScroll>
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
