import type { SVGProps } from "react";

/** Tiny inline stroke icons — the site has no icon-font dependency. Decorative: always aria-hidden. */
function Icon({ size = 20, children, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" {...rest}>
      {children}
    </svg>
  );
}
type P = SVGProps<SVGSVGElement> & { size?: number };

export const ArrowRight = (p: P) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const ChevronRight = (p: P) => <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>;
export const Award = (p: P) => <Icon {...p}><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></Icon>;
export const Eye = (p: P) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const Globe = (p: P) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Icon>;
export const Heart = (p: P) => <Icon {...p}><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z" /></Icon>;
export const Shield = (p: P) => <Icon {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /></Icon>;
export const Target = (p: P) => <Icon {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></Icon>;
export const TrendingUp = (p: P) => <Icon {...p}><path d="m3 17 6-6 4 4 8-8M15 7h6v6" /></Icon>;
export const Users = (p: P) => <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .6 3.2 2.4 3.5 5.2" /></Icon>;
export const Zap = (p: P) => <Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></Icon>;
