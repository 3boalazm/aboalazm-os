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
  | "contact_notification_issue"
  | "form_start"
  | "form_submit_attempt"
  | "form_error"
  | "contact_channel_click"
  | "resource_unlock"
  | "resource_download"
  | "resource_lead_saved"
  | "insight_open"
  | "reel_open"
  | "cv_download"
  | "deposit_click"
  | "whatsapp_click"
  | "booking_click"
  | "assessment_form_start"
  | "assessment_form_submit_attempt"
  | "assessment_form_error"
  | "assessment_submit"
  | "feedback_form_start"
  | "feedback_form_error"
  | "feedback_submit";

/** Event-specific, non-PII context fields. Keep event meanings and the property privacy contract in docs/EVENTS.md. */
export type EventProps = Record<string, string | undefined>;

export function trackEvent(name: EventName, props?: EventProps) {
  try {
    track(name, props);
  } catch {
    /* analytics must never break a user action */
  }
  sendFirstParty(name, props);
}

/* ── first-party collector (P2) ───────────────────────────────────────────
   Every event above is ALSO stored in our own Postgres via /api/track,
   because the vendor plan cannot return aggregates (HTTP 402 — see
   docs/EVENTS.md). The server re-validates everything against
   lib/analytics-events.ts; the sanitization here is just politeness.
   A tab-session id (random, sessionStorage, dies with the tab) lets the
   console count sessions and build an honest funnel. No IP, no UA, no
   fingerprint is ever sent. */

const SESSION_KEY = "abo-sid-v1";

function sessionId(): string | null {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null; // storage disabled: events still count, sessions undercount — stated in the console
  }
}

function localeFromPath(path: string): string | undefined {
  const first = path.split("/").filter(Boolean)[0];
  return first === "en" || first === "ar" ? first : undefined;
}

function sendFirstParty(name: string, props?: EventProps) {
  try {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    const cleanProps: Record<string, string> = {};
    for (const [k, v] of Object.entries(props ?? {})) {
      if (typeof v === "string" && v) cleanProps[k] = v;
    }
    const locale = cleanProps.locale ?? localeFromPath(path);
    if (locale) cleanProps.locale = locale;
    const campaign = readCampaign();
    for (const k of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      if (!cleanProps[k] && campaign[k]) cleanProps[k] = campaign[k]!;
    }
    const body = JSON.stringify({
      name,
      props: cleanProps,
      path,
      sessionId: sessionId(),
      referrer: document.referrer || undefined,
    });
    const url = "/api/track";
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      // text/plain keeps this a simple request — no CORS preflight on unload.
      if (navigator.sendBeacon(url, body)) return;
    }
    void fetch(url, { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
  } catch {
    /* analytics must never break a user action */
  }
}

/** One pageview per route change, emitted by components/seo/pageview-tracker.tsx. */
export function trackPageview() {
  sendFirstParty("pageview");
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
