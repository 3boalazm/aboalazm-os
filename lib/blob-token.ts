/**
 * Vercel Blob token resolution for Payload's storage adapter.
 *
 * Why this exists: @payloadcms/storage-vercel-blob THROWS while the Payload
 * config is being built when a token is set but not shaped like
 * `vercel_blob_rw_<store>_<random>`. That config is built by every Payload
 * entry point, so one malformed (optional) storage token took down the whole
 * CMS: /admin and every /api/* answered 500, the sitemap, /writing and the
 * CMS-backed pages silently fell back to empty/static data.
 *
 * A store created with a custom prefix (ours: `aboalazmos`) exposes its
 * token as `<prefix>_READ_WRITE_TOKEN`, not `BLOB_READ_WRITE_TOKEN`, so a
 * hand-copied `BLOB_READ_WRITE_TOKEN` is easy to get wrong. We therefore take
 * the first candidate that actually has the right shape:
 *   1. BLOB_READ_WRITE_TOKEN
 *   2. any `<prefix>_READ_WRITE_TOKEN` (what Vercel injects for the store)
 * and if none is valid we disable the storage adapter (the plugin's own
 * "no token" mode) and log a loud warning instead of crashing. Token values
 * are never logged.
 */
const BLOB_TOKEN_SHAPE = /^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i;

export function resolveBlobToken(
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  const named = Object.keys(env).filter(
    (k) => k !== "BLOB_READ_WRITE_TOKEN" && k.endsWith("_READ_WRITE_TOKEN"),
  );
  const candidates = ["BLOB_READ_WRITE_TOKEN", ...named];

  let sawAny = false;
  for (const key of candidates) {
    const value = env[key]?.trim();
    if (!value) continue;
    sawAny = true;
    if (BLOB_TOKEN_SHAPE.test(value)) return value;
  }

  if (sawAny) {
    console.warn(
      "[payload] No Vercel Blob token has the expected shape " +
        "(vercel_blob_rw_<store>_<random>) in " +
        candidates.filter((k) => env[k]?.trim()).join(", ") +
        ". Blob storage is DISABLED so the CMS can still start; uploads will " +
        "not work until a valid token is set (for a prefixed store, copy " +
        "<prefix>_READ_WRITE_TOKEN into BLOB_READ_WRITE_TOKEN).",
    );
  }
  return undefined;
}
