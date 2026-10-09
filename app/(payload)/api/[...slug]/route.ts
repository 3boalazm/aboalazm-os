import config from "@payload-config";
import "@payloadcms/next/css";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

const restGet = REST_GET(config);
type RestArgs = Parameters<typeof restGet>[1];

/** Largest value of a Postgres integer (int4) id column. */
const INT4_MAX = 2_147_483_647;

/**
 * GET /api/<collection>/<id> with an id the database cannot take (serial
 * integer ids) reaches Drizzle as "NaN" or an out-of-range number and comes
 * back as a 500. Answer with the same 404 shape Payload uses for a missing
 * document instead.
 *
 * Only the public read path is guarded, and only for the exact shape
 * /api/<collection>/<segment>. A segment is left to Payload when it is an
 * integer within int4 range, or when it is the first segment of a GET
 * endpoint the collection registers (count, versions, me, init, access,
 * paste-url, …). Internal payload-* collections (string keys) and
 * collections with a custom id field are never guarded.
 */
async function isUnparseableId(args: RestArgs): Promise<boolean> {
  const slug = (await args.params).slug;
  if (slug?.length !== 2) return false;
  const [collectionSlug, segment] = slug as [string, string];
  const numeric = /^\d+$/.test(segment);
  if ((numeric && Number(segment) <= INT4_MAX) || collectionSlug.startsWith("payload-")) return false;

  const sanitized = await config;
  if (sanitized.db.defaultIDType !== "number") return false;
  const collection = sanitized.collections.find((c) => c.slug === collectionSlug);
  if (!collection || !Array.isArray(collection.endpoints)) return false;
  if (collection.fields.some((f) => "name" in f && f.name === "id")) return false;
  if (numeric) return true; // digits only, but beyond int4

  // `/count`, `/versions`, `/access/:id?` … — a static first segment followed
  // only by optional params. `/file/:filename` needs a filename, so a bare
  // `/file` is still just a bad id. Only GET endpoints count: a POST-only name
  // (`/login`, `/forgot-password`) is not served for GET and falls to `/:id`.
  const isReserved = collection.endpoints.some((endpoint) => {
    if (endpoint.method !== "get") return false;
    const [, first, ...rest] = endpoint.path.split("/");
    return first === segment && rest.every((part) => /^:\w+\?$/.test(part));
  });
  return !isReserved;
}

export const GET = async (request: Request, args: RestArgs) =>
  (await isUnparseableId(args))
    ? Response.json({ errors: [{ message: "Not Found" }] }, { status: 404 })
    : restGet(request, args);

/**
 * Next maps HEAD onto GET but keeps request.method === "HEAD", and Payload's
 * router matches endpoints by method, so every HEAD fell through to 404.
 * Run the GET handler with a real GET request and drop the body.
 */
export const HEAD = async (request: Request, args: RestArgs) => {
  const res = await GET(new Request(request.url, { method: "GET", headers: request.headers }), args);
  res.body?.cancel().catch(() => {});
  return new Response(null, { status: res.status, statusText: res.statusText, headers: res.headers });
};

export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
