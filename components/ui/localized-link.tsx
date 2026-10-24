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
  return <NextLink href={localized} {...props} />;
}
