"use client";

import type { ReactNode } from "react";
import { useLang } from "@/components/providers/lang-provider";

type SectionMarkerProps = {
  index: string;
  label: ReactNode;
  /** Arabic label. Without it the English label shows in both languages —
   *  which is how six English eyebrows leaked into the Arabic home page. */
  labelAr?: ReactNode;
  className?: string;
};

export function SectionMarker({ index, label, labelAr, className = "" }: SectionMarkerProps) {
  const { lang } = useLang();
  const text = lang === "ar" && labelAr ? labelAr : label;
  return (
    <div className={`narrative-marker ${className}`.trim()}>
      <span className="narrative-marker__index">{index}</span>
      <span className="narrative-marker__line" aria-hidden />
      <span className="narrative-marker__label">{text}</span>
    </div>
  );
}
