"use client";

/**
 * ROLE SCOPE — the inner pages' share of the X role colours.
 *
 * Orange stays the action colour everywhere; the supporting three only mark
 * a page's character: citron = proof (work, case studies, hiring), teal =
 * method (process, why, labs, reels, resources), violet = studio (about,
 * books, writing). Everything else is offer / start and keeps orange.
 * It replaces the old `<div className="site-stage">` and renders the same
 * element, so layout is untouched.
 */
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type XRole = "orange" | "citron" | "teal" | "violet";

const ROLES: readonly [RegExp, XRole][] = [
  [/^\/(work|case-studies|for-hiring)(\/|$)/, "citron"],
  [/^\/(process|why|labs|reels|resources|developer)(\/|$)/, "teal"],
  [/^\/(about|books|writing|type|capabilities|gallery)(\/|$)/, "violet"],
];

export function roleFor(pathname: string): XRole {
  const path = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  for (const [re, role] of ROLES) if (re.test(path)) return role;
  return "orange";
}

export function RoleScope({ children }: { children: ReactNode }) {
  const role = roleFor(usePathname() ?? "/");
  return (
    <div className="site-stage" data-x-role={role}>
      {children}
    </div>
  );
}
