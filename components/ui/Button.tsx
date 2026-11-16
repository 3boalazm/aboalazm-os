import { forwardRef, type ButtonHTMLAttributes } from "react";
import { joinClasses } from "@/lib/utils";

/**
 * Base shape shared by every CTA in the codebase (13 sites audited):
 * pill, uppercase, disabled dimming. Font, size, padding, color, layout
 * (flex/inline-flex/gap), and — importantly — transition timing/hover
 * distance are NOT defaulted here: e.g. the CSS-trio family (not-found/
 * start/process) animates over 200ms at a 2px lift with a box-shadow
 * glow on primary, while most others use 400ms at a 4px lift with no
 * shadow; home-bands.tsx needs its own `flex w-fit items-center gap-2`,
 * which would collide with a baked-in `inline-flex`. Baking any of this
 * as a default would silently corrupt at least one real site, so every
 * site supplies its own layout/transition/hover className in full — see
 * sprint-button-primitive.md for the measured per-family values.
 */
const BASE = "x-bt rounded-pill uppercase disabled:opacity-60";

/**
 * variant="primary": bg-accent/text-obsidian — the one skin shared,
 * byte-for-byte on background+text color, across all 8 in-scope
 * accent-filled CTAs.
 *
 * variant="ghost": semantic "not filled" marker only. The 4 ghost call
 * sites (CtaBand/services "glass" pill vs not-found/start/process
 * bordered pill) share no actual CSS beyond the base shape above — one
 * uses the `.glass` backdrop-blur utility, the others a plain border +
 * transparent background. Baking either as a default would visually
 * break the other family, so ghost carries zero color/border defaults;
 * every ghost site supplies its own via `className`.
 */
const VARIANTS = {
  primary: "bg-accent text-obsidian",
  ghost: "",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

interface ButtonVariantsOptions {
  variant?: ButtonVariant;
  className?: string;
}

/**
 * Class-string builder for CTAs that must stay `<Link>`/`<a>` (Next.js
 * routing, external targets) rather than a real `<button>`. Apply
 * directly to the link's className — no polymorphic ref/asChild needed
 * since the element type never has to change at the call site.
 */
export function buttonVariants({ variant = "primary", className }: ButtonVariantsOptions = {}): string {
  return joinClasses(BASE, VARIANTS[variant], className);
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantsOptions {}

/**
 * Real `<button>` element — for the 2 in-scope sites that are actual
 * form/action buttons (error.tsx retry, resource-blocks.tsx unlock),
 * not navigation links.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, className, ...props },
  ref,
) {
  return <button ref={ref} className={buttonVariants({ variant, className })} {...props} />;
});
