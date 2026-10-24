/**
 * GLOBAL 404 — URLs that match no route at all (e.g. /nope, /wp-admin).
 *
 * The app has three root layouts ((site), (payload), (print)), so there is
 * no app/layout.tsx for a plain app/not-found.tsx to render inside, and Next
 * fell back to its bare default 404. `experimental.globalNotFound` (see
 * next.config.ts) lets this file own the whole document instead.
 *
 * It mirrors the (site) layout's document shell, minus the chrome that
 * needs the DB or heavy client code (ambient canvas, smooth scroll,
 * terminal), and reuses the same 404 content as app/(site)/not-found.tsx.
 */
import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { BOOT_SCRIPT } from "@/lib/boot-script";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import { NotFoundContent } from "@/features/errors/not-found-content";
import "./(site)/[locale]/globals.css";

export const metadata: Metadata = {
  title: "404 — Page not found · Aboalazm OS",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Same theme + language anti-flash script as the (site) layout. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="bg-surface-0 text-text-primary antialiased">
        <ThemeProvider>
          <LangProvider>
            <NotFoundContent />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
