/**
 * The single place gsap is imported from, so its house defaults are applied exactly once
 * and before any tween is built.
 *
 * gsap is ~27 kB gzipped and only a few surfaces need it: smooth scrolling (fine-pointer
 * devices only), the /work hover preview, the brand wall and scrolly case studies. Nothing
 * in the root layout may import this module statically — it would put gsap back into the
 * first-load JS of every page. Layout-level code loads it with `import("@/lib/gsap")`;
 * lib/bundle-guards.test.ts enforces both rules.
 */
import gsap from "gsap";
import { GSAP_DEFAULTS } from "@/lib/motion";

gsap.defaults(GSAP_DEFAULTS);

export default gsap;
