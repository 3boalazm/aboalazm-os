"use client";

/**
 * Conversion event catalogue (overhaul S6 / ABO-29, M6).
 * docs/EVENTS.md is the human-readable source of truth — keep names and
 * props in sync with it. EventName makes a typo a type error, not a
 * silently lost dashboard metric.
 */
import { parseCampaign } from "@/lib/contact-context";
import { track } from "@vercel/analytics";

export type EventName =
  | "cta_start_project"
  | "case_study_open"
  | "track_see_more"
  | "contact_submit"
  | "form_start"
  | "form_submit_attempt"
  | "form_error"
  | "contact_channel_click"
  | "resource_unlock"
  | "resource_download"
  | "resource_lead_saved"
  | "insight_open"
  | "cv_download";

/** Event-specific, non-PII context fields. Keep event meanings and the property privacy contract in docs/EVENTS.md. */
export type EventProps = Record<string, string | undefined>;

export function trackEvent(name: EventName, props?: EventProps) {
  try {
    track(name, props);
  } catch {
    /* analytics must never break a user action */
  }
}

/** First campaign in this tab; only short campaign identifiers, never free-text fields. */
export function rememberCampaign() {
  try {
    const campaign = parseCampaign(Object.fromEntries(new URLSearchParams(window.location.search)));
    if (Object.keys(campaign).length && !sessionStorage.getItem("abo-campaign-v1")) sessionStorage.setItem("abo-campaign-v1", JSON.stringify(campaign));
  } catch { /* storage can be disabled */ }
}
export function readCampaign(): Record<string, string> {
  try { return parseCampaign(JSON.parse(sessionStorage.getItem("abo-campaign-v1") ?? "{}") as Record<string, unknown>); }
  catch { return {}; }
}
