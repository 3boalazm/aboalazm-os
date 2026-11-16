import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/contact-details";

/**
 * ═══════════════════════════════════════════════════════════════
 * EMAIL — outbound notifications over plain SMTP.
 * ───────────────────────────────────────────────────────────────
 * Contact-form submissions are stored in the `messages` collection
 * AND emailed to the studio inbox so nothing waits for a dashboard
 * visit. Deliberately transport-agnostic: any SMTP provider works
 * via env vars — Gmail (with an App Password) or Resend out of the
 * box (both documented in .env.example).
 *
 * FAILURE POLICY — an email failure must NEVER sink the submission:
 * the record is already in Postgres before we attempt to send, and
 * callers wrap this in try/catch anyway. If SMTP is unconfigured we
 * skip silently (log only), which keeps local dev friction-free.
 * ═══════════════════════════════════════════════════════════════
 */

/** Where submissions land. Overridable per environment. */
export const NOTIFY_INBOX = process.env.CONTACT_NOTIFY_TO || CONTACT_EMAIL;

function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    /* Port 465 implies implicit TLS; other ports upgrade via STARTTLS. */
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 8000,
  });
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  company?: string;
  brief: string;
  timeline?: string;
  budget?: string;
}

/** True when SMTP is configured and sending is actually attempted. */
export function emailConfigured(): boolean {
  return buildTransport() !== null;
}

/**
 * Send the "new commission brief" notification to the studio inbox.
 * The visitor's address rides as Reply-To, so hitting reply in Gmail
 * goes straight back to the client — no copy-paste needed.
 */
export async function sendContactNotification(d: ContactEmailPayload): Promise<boolean> {
  const transport = buildTransport();
  if (!transport) {
    console.info("[email] SMTP not configured — submission stored, email skipped.");
    return false;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const subject = `New commission brief — ${d.name}${d.budget ? ` (${d.budget})` : ""}`;

  const text = [
    `Name:     ${d.name}`,
    `Email:    ${d.email}`,
    d.company ? `Company:  ${d.company}` : null,
    d.budget ? `Budget:   ${d.budget}` : null,
    d.timeline ? `Timeline: ${d.timeline}` : null,
    "",
    "Brief:",
    d.brief,
    "",
    "— Sent by aboalazm-os contact form",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:4px 16px 4px 0;color:#8a8a93;font-family:monospace;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;vertical-align:top">${label}</td><td style="padding:4px 0;font-family:system-ui,sans-serif;font-size:14px;color:#f8f8fa">${esc(value)}</td></tr>`
      : "";

  const html = `
  <div style="background:#080710;padding:32px 24px;font-family:system-ui,sans-serif">
    <div style="max-width:560px;margin:0 auto">
      <p style="margin:0 0 4px;font-family:monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#FF754F">New commission brief</p>
      <h1 style="margin:0 0 20px;font-size:20px;color:#f8f8fa">${esc(d.name)}</h1>
      <table style="border-collapse:collapse;background:#0d0c18;border:1px solid rgba(255,255,255,0.10);border-radius:12px;padding:16px;width:100%">
        ${row("Email", d.email)}
        ${row("Company", d.company)}
        ${row("Budget", d.budget)}
        ${row("Timeline", d.timeline)}
      </table>
      <p style="margin:20px 0 6px;font-family:monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a93">Brief</p>
      <p style="margin:0;font-size:14px;line-height:1.65;color:#f8f8fa;white-space:pre-wrap">${esc(d.brief)}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#b1aebb">Reply to go straight back to ${esc(d.email)} · aboalazm-os</p>
    </div>
  </div>`;

  await transport.sendMail({
    from,
    to: NOTIFY_INBOX,
    replyTo: d.email,
    subject,
    text,
    html,
  });
  return true;
}
