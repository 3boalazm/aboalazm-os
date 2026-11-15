/**
 * FIRST-PARTY ANALYTICS — the shared contract between the browser beacon,
 * the /api/track route and the Studio console.
 *
 * Why this exists: the site has emitted typed conversion events since the
 * M6 overhaul (lib/analytics.ts + docs/EVENTS.md), but the vendor plan
 * cannot return their aggregates (HTTP 402, recorded 2026-10-24). The
 * console therefore had no honest traffic numbers at all. This module is
 * the first-party collector that closes that gap: events are stored in
 * our own Postgres (the `analytics-events` collection) and aggregated by
 * lib/studio/analytics.ts. Vercel still receives a copy of every event —
 * nothing about the existing instrumentation changed.
 *
 * PRIVACY CONTRACT (enforced here, on the server, not by goodwill):
 *   · event names come from a fixed allowlist — a typo or an injected
 *     name is rejected, never stored;
 *   · properties are short contextual strings only. Anything that looks
 *     like an email address, a URL, or free text over the length cap is
 *     dropped key-by-key; a poisoned property never sinks the event, and
 *     an event with no valid properties is still just a name + a path;
 *   · paths are local paths only (no host, no query string — query
 *     strings are where tokens and emails hide);
 *   · the referrer contributes its HOST only, never the full URL;
 *   · no IP address, no user-agent string, no fingerprint. The session
 *     id is a random value the browser keeps in sessionStorage; it
 *     identifies a tab session, not a person, and dies with the tab.
 *
 * Everything in this file is pure so the contract is unit-tested
 * (lib/analytics-events.test.ts) without a database or a browser.
 */

export const PAGEVIEW_EVENT = "pageview";

/** The conversion taxonomy from docs/EVENTS.md, plus pageview. */
export const EVENT_NAMES = [
  PAGEVIEW_EVENT,
  "cta_start_project",
  "case_study_open",
  "track_see_more",
  "contact_submit",
  "contact_notification_issue",
  "form_start",
  "form_submit_attempt",
  "form_error",
  "contact_channel_click",
  "resource_unlock",
  "resource_download",
  "resource_lead_saved",
  "insight_open",
  "reel_open",
  "cv_download",
  "deposit_click",
  "whatsapp_click",
  "booking_click",
] as const;

export type AnalyticsEventName = (typeof EVENT_NAMES)[number];

const EVENT_SET = new Set<string>(EVENT_NAMES);

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === "string" && EVENT_SET.has(value);
}

/* ── field caps — one place, so client and server agree ─────────────────── */
export const LIMITS = {
  path: 200,
  sessionId: 64,
  locale: 8,
  referrerHost: 120,
  utm: 80,
  device: 16,
  propKey: 40,
  propValue: 120,
  propCount: 12,
} as const;

const EMAIL_LIKE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const KEY_OK = /^[a-z][a-z0-9_]*$/;
const UTM_OK = /^[A-Za-z0-9_-]+$/;
const SESSION_OK = /^[A-Za-z0-9_-]+$/;

/**
 * A local path or nothing. Absolute URLs, protocol-relative URLs and
 * anything carrying a query string or fragment are refused: the query
 * string is exactly where identifying parameters would leak in.
 */
export function sanitizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.includes("?") || path.includes("#") || path.includes("\\")) return null;
  if (path.includes("://")) return null;
  if (path.length > LIMITS.path) return null;
  return path;
}

/** Host only — "www.google.com", never the page the visitor came from. */
export function sanitizeReferrerHost(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const host = new URL(raw).hostname.toLowerCase();
    if (!host || host.length > LIMITS.referrerHost) return null;
    return host;
  } catch {
    return null;
  }
}

export function sanitizeUtm(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value || value.length > LIMITS.utm || !UTM_OK.test(value)) return null;
  return value;
}

export function sanitizeSessionId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value || value.length > LIMITS.sessionId || !SESSION_OK.test(value)) return null;
  return value;
}

export function sanitizeLocale(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  if (!value || value.length > LIMITS.locale) return null;
  return value;
}

/**
 * Properties survive key-by-key. A value that looks like an email, carries
 * a URL, or exceeds the cap is dropped — the event is kept. That asymmetry
 * is deliberate: analytics must never become a side channel for the form's
 * free-text fields, and one bad property must not erase a real signal.
 */
export function sanitizeProps(raw: unknown): Record<string, string> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Object.keys(out).length >= LIMITS.propCount) break;
    if (!KEY_OK.test(key) || key.length > LIMITS.propKey) continue;
    if (typeof value !== "string") continue;
    const v = value.trim();
    if (!v || v.length > LIMITS.propValue) continue;
    if (EMAIL_LIKE.test(v) || v.includes("://")) continue;
    out[key] = v;
  }
  return out;
}

/** Coarse device class from a user-agent string. The string itself is never stored. */
export function deviceClass(userAgent: string | null | undefined): "mobile" | "tablet" | "desktop" | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(ua)) return "mobile";
  if (/android/.test(ua)) return "tablet";
  return "desktop";
}

/** Known crawlers do not get to inflate the operator's funnel. */
export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime/i.test(userAgent);
}

export interface EventRecord {
  name: AnalyticsEventName;
  sessionId: string | null;
  path: string | null;
  locale: string | null;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  device: string | null;
  props: Record<string, string>;
}

export type ParseResult = { ok: true; record: EventRecord } | { ok: false; error: string };

/**
 * Validate one untrusted beacon payload into a storable record.
 * The user-agent arrives out-of-band (a header), so it is passed separately
 * and only ever reduced to a device class / bot verdict.
 */
export function parseEventPayload(body: unknown, userAgent: string | null): ParseResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "bad_body" };
  }
  const input = body as Record<string, unknown>;
  if (!isAnalyticsEventName(input.name)) return { ok: false, error: "unknown_event" };
  if (isBotUserAgent(userAgent)) return { ok: false, error: "bot" };

  const props = sanitizeProps(input.props);
  return {
    ok: true,
    record: {
      name: input.name,
      sessionId: sanitizeSessionId(input.sessionId),
      path: sanitizePath(input.path),
      locale: sanitizeLocale(input.locale) ?? sanitizeLocale(props.locale),
      referrerHost: sanitizeReferrerHost(input.referrer),
      utmSource: sanitizeUtm(input.utm_source) ?? sanitizeUtm(props.utm_source),
      utmMedium: sanitizeUtm(input.utm_medium) ?? sanitizeUtm(props.utm_medium),
      utmCampaign: sanitizeUtm(input.utm_campaign) ?? sanitizeUtm(props.utm_campaign),
      device: deviceClass(userAgent),
      props,
    },
  };
}
