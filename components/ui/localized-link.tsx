"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { localeHref, stripLocale } from "@/lib/locale";

export default function LocalizedLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { lang } = useLang();
  const pathname = usePathname();
  if (typeof href === "string" && /^\/(?:ar\/)?contact(?:[?#]|$)/.test(href)) {
    const url = new URL(href, "https://local.invalid");
    if (!url.searchParams.has("source")) url.searchParams.set("source", stripLocale(pathname));
    href = url.pathname + url.search + url.hash;
  }
  const localized = typeof href === "string" ? localeHref(href, lang) : { ...href, pathname: href.pathname ? localeHref(href.pathname, lang) : href.pathname };
  // Never prefetch what is not a static page: /book is rendered per visit (it mints a booking reference) and /cv is
  // a redirect to a file. A prefetch is a request the CDN cannot answer, i.e. a serverless function run; the
  // production logs of 19 Nov show one for /cv and another for the .docx right after it. The footer links alone
  // would put these on every page view. The click still works; it just is not fetched ahead of time.
  const prefetch = typeof href === "string" && /^\/(?:ar\/)?(?:book|cv)(?:[?#]|$)/.test(href) ? false : undefined;
  return <NextLink href={localized} prefetch={prefetch} {...props} />;
}
