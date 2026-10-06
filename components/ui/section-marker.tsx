import type { ReactNode } from "react";

type SectionMarkerProps = {
  index: string;
  label: ReactNode;
  className?: string;
};

export function SectionMarker({ index, label, className = "" }: SectionMarkerProps) {
  return (
    <div className={`narrative-marker ${className}`.trim()}>
      <span className="narrative-marker__index">{index}</span>
      <span className="narrative-marker__line" aria-hidden />
      <span className="narrative-marker__label">{label}</span>
    </div>
  );
}
