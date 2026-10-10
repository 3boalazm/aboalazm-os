/**
 * Resolve the Blob token for this project's connected Vercel Blob store.
 *
 * A malformed optional token must not prevent Payload from loading. Prefer
 * the conventional variable, then this project's known Vercel store variable.
 * Do not select arbitrary *_READ_WRITE_TOKEN variables: a project can have
 * multiple stores and silently using the wrong store is unsafe.
 */
const BLOB_TOKEN_SHAPE = /^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i;
const PROJECT_STORE_TOKEN_ENV = "aboalazmos_READ_WRITE_TOKEN";

export function resolveBlobToken(
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  const candidates = ["BLOB_READ_WRITE_TOKEN", PROJECT_STORE_TOKEN_ENV];
  let sawAny = false;

  for (const key of candidates) {
    const value = env[key]?.trim();
    if (!value) continue;
    sawAny = true;
    if (BLOB_TOKEN_SHAPE.test(value)) return value;
  }

  // Mention variable names only. Never log token contents.
  if (sawAny) {
    console.warn(
      "[payload] No valid Vercel Blob token found in " +
        candidates.filter((key) => env[key]?.trim()).join(", ") +
        ". Blob storage is disabled; uploads will not work until a valid " +
        "token is configured.",
    );
  }

  return undefined;
}
