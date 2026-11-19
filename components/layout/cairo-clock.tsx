"use client";

/**
 * CAIRO CLOCK — the studio's local time, live, in the footer. Clients in the
 * Gulf read it as "is he awake right now". Renders nothing on
 * the server (a clock in SSR HTML is wrong by the time it paints).
 */
import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false });

export function CairoClock({ label }: { label: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      <span aria-hidden className="size-[6px] rounded-full bg-accent" />
      {label}
      <span suppressHydrationWarning>{now ? ` · ${now}` : ""}</span>
    </span>
  );
}
