/** Read-only SMTP connection check. Does not send an email or inspect enquiries. */
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import nodemailer from "nodemailer";
loadEnvConfig(process.cwd());
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, DATABASE_URI, PAYLOAD_SECRET } = process.env;
console.info(`Message-store configuration: ${DATABASE_URI && PAYLOAD_SECRET ? "present (delivery still needs an end-to-end check)" : "incomplete"}`);
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("SMTP configuration is incomplete. Set SMTP_HOST, SMTP_USER and SMTP_PASS in the deployment environment.");
  process.exitCode = 1;
} else {
  const port = Number(SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS }, connectionTimeout: 4000, greetingTimeout: 4000, socketTimeout: 8000 });
  try { await transport.verify(); console.info("SMTP connection and authentication succeeded. No email was sent; inbox arrival has not been tested."); }
  catch { console.error("SMTP verification failed. Check credentials, network access and sender permissions in the deployment environment."); process.exitCode = 1; }
  finally { transport.close(); }
}
