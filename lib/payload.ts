import { getPayload as getPayloadInstance } from "payload";
import config from "@payload-config";

/**
 * Cached Payload Local API instance — call `getPayload()` from any
 * Server Component or Route Handler. No HTTP round-trip; this runs
 * in-process since we're inside the same Next.js app Payload is mounted in.
 */
let cached: ReturnType<typeof getPayloadInstance> | undefined;

export function getPayload() {
  if (!cached) {
    cached = getPayloadInstance({ config });
  }
  return cached;
}
