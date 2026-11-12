"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageview } from "@/lib/analytics";

/**
 * Emits one first-party `pageview` per route change (P2).
 *
 * Mounted once in the (site) layout next to FunnelAnalytics. The vendor
 * <Analytics /> component still counts its own pageviews; this feeds the
 * first-party collector the Studio console can actually read back.
 * Deliberately path-only: the query string never leaves the browser in a
 * pageview, because that is where tokens and emails would hide.
 */
export function PageviewTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || last.current === pathname) return;
    last.current = pathname;
    trackPageview();
  }, [pathname]);

  return null;
}
