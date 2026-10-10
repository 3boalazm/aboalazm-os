import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { resolveBlobToken } from "./blob-token";

const VALID = "vercel_blob_rw_store123_random456";
const OTHER_STORE = "vercel_blob_rw_otherstore_random789";
const originalWarn = console.warn;

afterEach(() => {
  console.warn = originalWarn;
});

test("returns undefined when no token is configured", () => {
  assert.equal(resolveBlobToken({}), undefined);
});

test("accepts a valid conventional token", () => {
  assert.equal(resolveBlobToken({ BLOB_READ_WRITE_TOKEN: VALID }), VALID);
});

test("ignores a malformed conventional token without throwing", () => {
  assert.equal(resolveBlobToken({ BLOB_READ_WRITE_TOKEN: "bad-token-value" }), undefined);
});

test("trims surrounding whitespace before validation", () => {
  assert.equal(resolveBlobToken({ BLOB_READ_WRITE_TOKEN: `  ${VALID}  ` }), VALID);
});

test("falls back to this project's connected store token when conventional token is malformed", () => {
  assert.equal(
    resolveBlobToken({
      BLOB_READ_WRITE_TOKEN: "malformed",
      aboalazmos_READ_WRITE_TOKEN: VALID,
    }),
    VALID,
  );
});

test("prefers the conventional token when both supported variables are valid", () => {
  assert.equal(
    resolveBlobToken({
      BLOB_READ_WRITE_TOKEN: VALID,
      aboalazmos_READ_WRITE_TOKEN: OTHER_STORE,
    }),
    VALID,
  );
});

test("does not accidentally select a valid token belonging to an unrelated store", () => {
  assert.equal(resolveBlobToken({ anotherstore_READ_WRITE_TOKEN: VALID }), undefined);
});

test("warns when configured tokens are invalid without logging their values", () => {
  const secret = "definitely-not-a-real-secret";
  const warnings: string[] = [];
  console.warn = (...args: unknown[]) => warnings.push(args.join(" "));
  assert.equal(resolveBlobToken({ BLOB_READ_WRITE_TOKEN: secret }), undefined);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0] ?? "", /Blob storage is disabled/);
  assert.doesNotMatch(warnings.join(" "), new RegExp(secret));
});
