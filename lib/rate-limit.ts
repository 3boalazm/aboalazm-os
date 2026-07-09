/**
 * RATE LIMIT — lightweight, in-memory, per-IP throttling for public
 * write endpoints (contact form, resource-lead capture).
 *
 * ⚠️ HONEST LIMITATION: this is process-memory state. On Vercel's
 * serverless runtime, each region/cold-start gets its own memory, so a
 * determined attacker spreading requests across invocations could still
 * get through more often than the limit implies. It stops casual bots
 * and accidental double-submits reliably; it is NOT a substitute for a
 * shared store (Upstash/Vercel KV Redis) if this ever needs to be
 * airtight — that requires provisioning a real Redis instance, which
 * wasn't set up here. Good enough for a portfolio site's contact form
 * and lead gate; revisit if abuse actually shows up in the Messages/
 * ResourceLeads collections.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodic cleanup so this Map doesn't grow unbounded across a long-lived
// warm instance.
let lastSweep = Date.now();
function sweep() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/**
 * @param key    Usually the client IP, optionally namespaced per-route
 *               (e.g. `contact:${ip}`) so different endpoints don't share
 *               one budget.
 * @param limit  Max requests allowed within the window.
 * @param windowMs  Window size in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
  sweep();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  bucket.count++;
  return { ok: true, remaining: limit - bucket.count };
}

/** Best-effort client IP extraction behind Vercel's proxy. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
