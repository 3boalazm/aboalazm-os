import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const ORIGIN = "https://aboalazm-os.vercel.app";
const SERVICE_WORKER_SOURCE = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
const OFFLINE_HTML = await readFile(new URL("../public/offline.html", import.meta.url), "utf8");
const NOT_FOUND_HTML = "<!doctype html><title>404 — Page not found</title><h1>DESIGNED 404 PAGE</h1>";
const LAST_GOOD_COPY = "<!doctype html><title>Last good copy</title><h1>LAST GOOD COPY</h1>";

function makeRequest({ mode = "navigate", path = "/missing-page", accept = "text/html" } = {}) {
  return {
    method: "GET",
    url: new URL(path, ORIGIN).href,
    mode,
    destination: mode === "navigate" ? "document" : "",
    headers: new Headers({ accept }),
  };
}

// networkStatus: an HTTP status, or "offline" when fetch() rejects because there is no connection.
// cachedBody: the last good copy of the requested page in the runtime cache (null = never visited).
function createHarness({
  networkStatus,
  serverBody = `server response ${networkStatus}`,
  serverHeaders = {},
  cachedBody = null,
  offlineStatus = 200,
  offlineBody = OFFLINE_HTML,
}) {
  const listeners = new Map();
  const puts = [];
  const runtimeCache = {
    async match() {
      if (cachedBody === null) return undefined;
      return new Response(cachedBody, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    },
    async put(request) {
      puts.push(request);
    },
  };
  const caches = {
    async open() {
      return runtimeCache;
    },
    async match(request) {
      assert.equal(request, "/offline.html");
      if (offlineStatus === null) return undefined;
      if (offlineStatus === "throw") throw new Error("CacheStorage unavailable");
      return new Response(offlineBody, {
        status: offlineStatus,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    },
  };
  const self = {
    location: { origin: ORIGIN },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
  };
  const context = {
    self,
    caches,
    fetch: async () => {
      if (networkStatus === "offline") throw new TypeError("Failed to fetch");
      return new Response(serverBody, { status: networkStatus, headers: serverHeaders });
    },
    Response,
    Headers,
    URL,
    console,
  };

  vm.runInNewContext(SERVICE_WORKER_SOURCE, context, { filename: "public/sw.js" });

  return {
    puts,
    dispatch(request) {
      let responsePromise;
      listeners.get("fetch")({
        request,
        respondWith(response) {
          responsePromise = Promise.resolve(response);
        },
      });
      return responsePromise ?? null;
    },
  };
}

test("top-level 404 keeps the site's own 404 page but delivers it with status 200", async () => {
  const harness = createHarness({
    networkStatus: 404,
    serverBody: NOT_FOUND_HTML,
    serverHeaders: {
      "content-type": "text/html; charset=utf-8",
      "content-encoding": "br",
      "content-length": "123",
    },
  });
  const response = await harness.dispatch(makeRequest());

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.equal(response.headers.get("content-encoding"), null);
  assert.equal(response.headers.get("content-length"), null);
  assert.equal(await response.text(), NOT_FOUND_HTML);
  assert.equal(harness.puts.length, 0, "a rewritten 404 must never be cached as a good page");
});

test("top-level 5xx without a cached copy gets the branded 200 fallback", async (t) => {
  for (const status of [500, 502, 503]) {
    await t.test(String(status), async () => {
      const harness = createHarness({ networkStatus: status });
      const response = await harness.dispatch(makeRequest());

      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /^text\/html/);
      const body = await response.text();
      assert.match(body, /Aboalazm/);
      assert.match(body, /This page isn’t available right now/);
      assert.equal(harness.puts.length, 0);
    });
  }
});

test("top-level 5xx serves the last cached copy of the page when there is one", async () => {
  const harness = createHarness({ networkStatus: 500, cachedBody: LAST_GOOD_COPY });
  const response = await harness.dispatch(makeRequest({ path: "/work" }));

  assert.equal(response.status, 200);
  assert.equal(await response.text(), LAST_GOOD_COPY);
});

test("offline navigation serves the cached copy first, then the branded fallback", async (t) => {
  await t.test("cached page", async () => {
    const harness = createHarness({ networkStatus: "offline", cachedBody: LAST_GOOD_COPY });
    const response = await harness.dispatch(makeRequest({ path: "/work" }));

    assert.equal(response.status, 200);
    assert.equal(await response.text(), LAST_GOOD_COPY);
  });

  await t.test("never-visited page", async () => {
    const harness = createHarness({ networkStatus: "offline" });
    const response = await harness.dispatch(makeRequest());

    assert.equal(response.status, 200);
    assert.match(await response.text(), /This page isn’t available right now/);
  });
});

test("top-level navigation has a branded 200 fallback if offline.html is missing or CacheStorage fails", async (t) => {
  for (const networkStatus of [503, "offline"]) {
    for (const offlineStatus of [null, 503, "throw"]) {
      await t.test(`${networkStatus} / offline.html ${offlineStatus}`, async () => {
        const harness = createHarness({ networkStatus, offlineStatus });
        const response = await harness.dispatch(makeRequest());

        assert.equal(response.status, 200);
        assert.match(response.headers.get("content-type"), /^text\/html/);
        assert.match(await response.text(), /Aboalazm OS/);
      });
    }
  }
});

test("a normal 200 navigation is passed through and cached", async () => {
  const harness = createHarness({ networkStatus: 200 });
  const response = await harness.dispatch(makeRequest({ path: "/work" }));

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "server response 200");
  assert.equal(harness.puts.length, 1);
});

test("top-level navigation preserves HTTP errors outside the specified 404/5xx cases", async (t) => {
  for (const status of [403, 429]) {
    await t.test(String(status), async () => {
      const harness = createHarness({ networkStatus: status });
      const response = await harness.dispatch(makeRequest());

      assert.equal(response.status, status);
      assert.equal(await response.text(), `server response ${status}`);
    });
  }
});

test("non-navigation HTML fetches keep the server's real 404 and 5xx statuses", async (t) => {
  for (const status of [404, 503]) {
    await t.test(String(status), async () => {
      const harness = createHarness({ networkStatus: status });
      const response = await harness.dispatch(
        makeRequest({ mode: "same-origin", path: "/fragment", accept: "text/html" }),
      );

      assert.equal(response.status, status);
      assert.equal(await response.text(), `server response ${status}`);
    });
  }
});

test("studio, admin and API requests are never handled by the worker", () => {
  const harness = createHarness({ networkStatus: 404 });

  for (const path of ["/studio/leads", "/admin", "/api/track"]) {
    assert.equal(harness.dispatch(makeRequest({ path })), null, path);
  }
});
