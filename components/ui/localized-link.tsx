"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { localeHref, stripLocale } from "@/lib/locale";

/** `/cv` is a route handler that redirects to a file; files and handlers have no RSC payload to prefetch (it 404s). */
const NOT_A_PAGE = /^\/(?:cv|.*\.(?:docx?|pdf|zip|xlsx?|pptx?|png|jpe?g|webp|gif|svg|mp4))(?:[?#]|$)/i;

export default function LocalizedLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { lang } = useLang();
  const pathname = usePathname();
  if (typeof href === "string" && /^\/(?:ar\/)?contact(?:[?#]|$)/.test(href)) {
    const url = new URL(href, "https://local.invalid");
    if (!url.searchParams.has("source")) url.searchParams.set("source", stripLocale(pathname));
    href = url.pathname + url.search + url.hash;
  }
  const localized = typeof href === "string" ? localeHref(href, lang) : { ...href, pathname: href.pathname ? localeHref(href.pathname, lang) : href.pathname };
  const prefetch = props.prefetch ?? (typeof href === "string" && NOT_A_PAGE.test(href) ? false : undefined);
  return <NextLink href={localized} {...props} prefetch={prefetch} />;
}
