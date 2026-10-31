import { formatFxForUsd } from "@/lib/fx";

export function FxSubline({
  usdOrPrice,
  lang = "en",
  showValidity = true,
  compact = false,
  className = "",
}: {
  usdOrPrice: number | string;
  lang?: "en" | "ar";
  showValidity?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const fx = formatFxForUsd(usdOrPrice);
  const ar = lang === "ar";

  return (
    <div
      className={`flex flex-col gap-0.5 font-mono ${compact ? "text-[11px]" : "text-micro"} leading-snug text-text-tertiary ${className}`}
    >
      <span dir="ltr" className="inline-block w-fit">
        {ar ? fx.conversionLine.ar : fx.conversionLine.en}
      </span>
      {showValidity && fx.validityLine ? (
        <span className="text-[11px] text-text-tertiary/90">
          {ar ? fx.validityLine.ar : fx.validityLine.en}
        </span>
      ) : null}
    </div>
  );
}
