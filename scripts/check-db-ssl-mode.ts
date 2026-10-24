/**
 * Safe diagnostic for the pg-connection-string SSL-mode warning.
 *
 * Run with DATABASE_URI present in the process environment or local .env.local.
 * Never prints the URI, credentials, database name, query string, or host.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(here, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/u)) {
    const match = line.match(/^\s*(?:export\s+)?DATABASE_URI\s*=\s*(.*)\s*$/u);
    if (match?.[1]) {
      const value = match[1].replace(/^(['"])(.*)\1$/u, "$2");
      process.env.DATABASE_URI ??= value;
    }
  }
}

const raw = process.env.DATABASE_URI;
if (!raw) {
  console.log(JSON.stringify({ available: false, message: "DATABASE_URI is not available in this environment; no URI was printed." }, null, 2));
  process.exit(0);
}

try {
  const uri = new URL(raw);
  const sslmode = uri.searchParams.get("sslmode");
  const compat = uri.searchParams.get("uselibpqcompat");
  const mode = sslmode ?? "(not explicitly set; driver default applies)";
  const provider = /(?:^|\.)neon\.tech$/iu.test(uri.hostname) ? "Neon" : "PostgreSQL host";
  const warningAffected = ["prefer", "require", "verify-ca"].includes(sslmode ?? "");
  console.log(JSON.stringify({
    available: true,
    format: "URL",
    provider,
    sslmode: mode,
    uselibpqcompat: compat ?? "(not explicitly set)",
    warningAffected,
    recommendation: warningAffected
      ? "Do not change production blindly. Pick the intended semantics with the database owner: use uselibpqcompat=true&sslmode=require to preserve libpq-compatible require semantics, or explicitly choose sslmode=verify-full to retain full certificate/host verification. Validate this against the database provider supported connection format before changing Vercel."
      : sslmode === "verify-full"
        ? "Explicit full verification is configured; confirm the warning is from this same DATABASE_URI and deployment."
        : "No matching legacy sslmode was detected. Confirm which environment and connection string produced the build warning before editing production.",
  }, null, 2));
} catch {
  const mode = raw.match(/(?:^|\s)sslmode=([^\s]+)/iu)?.[1] ?? null;
  const compat = raw.match(/(?:^|\s)uselibpqcompat=([^\s]+)/iu)?.[1] ?? null;
  console.log(JSON.stringify({
    available: true,
    format: "keyword/value connection string",
    sslmode: mode ?? "(not explicitly set)",
    uselibpqcompat: compat ?? "(not explicitly set)",
    warningAffected: ["prefer", "require", "verify-ca"].includes(mode ?? ""),
    recommendation: "Inspect the sanitized mode only. Do not paste or log DATABASE_URI; change settings only after confirming the intended TLS semantics with the database provider.",
  }, null, 2));
}
