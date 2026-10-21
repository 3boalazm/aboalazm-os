"use client";

/**
 * Conversion event catalogue (overhaul S6 / ABO-29, M6).
 * docs/EVENTS.md is the human-readable source of truth — keep names and
 * props in sync with it. EventName makes a typo a type error, not a
 * silently lost dashboard metric.
 */
import { track } from "@vercel/analytics";

export type EventName =
  | "cta_start_project"
  | "case_study_open"
  | "track_see_more"
  | "contact_submit"
  | "insight_open"
  | "cv_download";

/** Allowed keys: placement / surface / slug / href / locale — see docs/EVENTS.md. */
export type EventProps = Record<string, string | undefined>;

export function trackEvent(name: EventName, props?: EventProps) {
  try {
    track(name, props);
  } catch {
    /* analytics must never break a user action */
  }
}
