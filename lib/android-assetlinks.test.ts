import assert from "node:assert/strict";
import test from "node:test";
import {
  ANDROID_PACKAGE_NAME,
  createAndroidAssetLinks,
  parseSha256Fingerprints,
} from "./android-assetlinks";

const fingerprint = Array.from({ length: 32 }, (_, index) =>
  (index + 1).toString(16).padStart(2, "0"),
).join(":");

test("asset links remain unconfigured until a real SHA-256 fingerprint is provided", () => {
  assert.equal(parseSha256Fingerprints(undefined), null);
  assert.equal(parseSha256Fingerprints("  "), null);
  assert.equal(createAndroidAssetLinks(undefined), null);
});

test("accepts colon-delimited SHA-256 fingerprints and de-duplicates them", () => {
  assert.deepEqual(parseSha256Fingerprints(`${fingerprint}, ${fingerprint.toUpperCase()}`), [
    fingerprint.toUpperCase(),
  ]);
});

test("rejects malformed or incomplete fingerprints instead of publishing a partial statement", () => {
  assert.equal(parseSha256Fingerprints("AA:BB:CC"), null);
  assert.equal(parseSha256Fingerprints(`${fingerprint},not-a-fingerprint`), null);
});

test("builds the TWA statement for the proposed stable package id", () => {
  assert.deepEqual(createAndroidAssetLinks(fingerprint), [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE_NAME,
        sha256_cert_fingerprints: [fingerprint.toUpperCase()],
      },
    },
  ]);
});
