import type { ClientOrigin } from "./client-origin";

/**
 * A small location seal: country first, then a quiet echo of GAD's own
 * "Closer to Every Heart" line. The country code is a visual anchor, not the
 * sole source of meaning—the full country name stays readable in both locales.
 */
export function ClientOriginStamp({
  origin,
  ar = false,
}: {
  origin: ClientOrigin;
  ar?: boolean;
}) {
  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      aria-label={
        ar
          ? `عميل من ${origin.countryAr} · أقرب لكل قلب`
          : `Client from ${origin.country} · Closer to Every Heart`
      }
      role="note"
      className="inline-flex max-w-full self-start items-center gap-3 rounded-card border border-border-default bg-surface-1/75 px-3 py-2"
    >
      <span
        aria-hidden="true"
        dir="ltr"
        className="grid size-8 shrink-0 place-items-center rounded-full border border-[#2f7a4d]/40 bg-[#2f7a4d]/10 font-mono text-micro font-semibold tracking-[0.06em] text-[#86c49b]"
      >
        {origin.code}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-micro uppercase tracking-[0.1em] text-text-ghost">
          {ar ? "عميل من" : "CLIENT FROM"}
        </span>
        <span className="block text-body-sm font-medium leading-snug text-text-primary">
          {ar ? origin.countryAr : origin.country}
        </span>
      </span>
      <span className="hidden shrink-0 border-s border-border-subtle ps-3 font-mono text-micro uppercase tracking-[0.08em] text-text-tertiary sm:block">
        {ar ? "أقرب لكل قلب" : "CLOSER TO EVERY HEART"}
      </span>
    </div>
  );
}
