"use client";

import { useEffect } from "react";

/** Register the root-scoped worker only for real production builds. */
export function PwaRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        // The site remains fully usable if a browser or privacy setting blocks SWs.
      });
  }, []);

  return null;
}
