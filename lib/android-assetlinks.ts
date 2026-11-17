/**
 * Android TWA Digital Asset Links response helpers.
 *
 * The package id is fixed before the first Play release; changing it afterward
 * creates a different Android app. SHA-256 fingerprints are deployment config,
 * not repository data, because the local signing key and Play App Signing key
 * do not exist until the owner creates the Android package.
 */
export const ANDROID_PACKAGE_NAME = "com.aboalazm.os";

const SHA256_FINGERPRINT = /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/;

/** Parse comma- or whitespace-separated, colon-delimited SHA-256 fingerprints. */
export function parseSha256Fingerprints(value: string | undefined): string[] | null {
  if (!value?.trim()) return null;

  const fingerprints = value
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((fingerprint) => fingerprint.toUpperCase());

  if (fingerprints.length === 0 || fingerprints.some((fingerprint) => !SHA256_FINGERPRINT.test(fingerprint))) {
    return null;
  }

  return [...new Set(fingerprints)];
}

/** Return the Digital Asset Links statement, or null until valid keys are configured. */
export function createAndroidAssetLinks(value: string | undefined) {
  const fingerprints = parseSha256Fingerprints(value);
  if (!fingerprints) return null;

  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE_NAME,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];
}
