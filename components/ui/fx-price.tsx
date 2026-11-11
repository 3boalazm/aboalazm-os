import type { Locale } from "@/lib/locale";
import { formatFxForUsd } from "@/lib/fx";

export function FxSubline({
  usdOrPrice,
  lang = "en",
  showValidity = true,
  compact = false,
  className = "",
}: {
  usdOrPrice: number | string;
  lang?: Locale;
  showValidity?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const fx = formatFxForUsd(usdOrPrice);
  const ar = lang === "ar";

  return (
    <div
      className={`flex flex-col gap-0.5 font-mono ${compact ? "text-caption" : "text-micro"} leading-snug text-text-tertiary ${className}`}
    >
      {/* LTR only for the numeric line ("≈ 9,850 EGP · ≈ 740 SAR"). The fallback is a
          full Arabic sentence and must keep the page direction, or it reads backwards. */}
      <span dir={fx.active ? "ltr" : undefined} className="inline-block w-fit">
        {ar ? fx.conversionLine.ar : fx.conversionLine.en}
      </span>
      {showValidity && fx.validityLine ? (
        <span className="text-caption text-text-tertiary">
          {ar ? fx.validityLine.ar : fx.validityLine.en}
        </span>
      ) : null}
    </div>
  );
}
