"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { parseContactContextFromSearch, type ContactContext } from "@/lib/contact-context";

/**
 * Reads the funnel context (?service, ?tier, ?source, utm_*) in the browser so that /contact itself can be a
 * static page served by the CDN. Reading `searchParams` on the server made every visit and every <Link>
 * prefetch of /contact?source=… a serverless function run, on every page of the site.
 *
 * Renders nothing and sits in its own small <Suspense fallback={null}> (see contact-view.tsx): the rest of the
 * page hydrates normally, so text typed before hydration finishes is kept. Putting the whole view under the
 * Suspense boundary instead makes React throw the server HTML away and client-render it, which loses that text.
 */
export function ContactContextFromUrl({ onChange }: { onChange: (context: ContactContext) => void }) {
  const search = useSearchParams().toString();
  useEffect(() => {
    onChange(parseContactContextFromSearch(new URLSearchParams(search)));
  }, [search, onChange]);
  return null;
}
