"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/providers/lang-provider";
import { stripLocale } from "@/lib/locale";
import { parseContactContext } from "@/lib/contact-context";
import { trackEvent, rememberCampaign, readCampaign } from "@/lib/analytics";

/** Count channel opens separately from successfully saved project enquiries. */
export function FunnelAnalytics() {
  const pathname = usePathname();
  const { lang } = useLang();
  useEffect(() => {
    rememberCampaign();
    function clicked(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      const source = stripLocale(pathname);
      const placement = anchor.closest("header") ? "header" : anchor.closest("footer") ? "footer" : "content";
      if (url.protocol === "mailto:" || url.hostname === "wa.me") {
        trackEvent("contact_channel_click", { channel: url.protocol === "mailto:" ? "email" : "whatsapp", source, placement, ...readCampaign(), locale: lang });
      } else if (url.origin === window.location.origin && stripLocale(url.pathname) === "/contact") {
        const context = parseContactContext(Object.fromEntries(url.searchParams));
        trackEvent("cta_start_project", { service: context.service, tier: context.tier, source, placement, ...readCampaign(), locale: lang });
      }
    }
    document.addEventListener("click", clicked, true);
    return () => document.removeEventListener("click", clicked, true);
  }, [pathname, lang]);
  return null;
}
