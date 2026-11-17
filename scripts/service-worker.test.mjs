import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const ORIGIN = "https://aboalazm-os.vercel.app";
const SERVICE_WORKER_SOURCE = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
const OFFLINE_HTML = await readFile(new URL("../public/offline.html", import.meta.url), "utf8");

function makeRequest({ mode = "navigate", path = "/missing-page", accept = "text/html" } = {}) {
  return {
    method: "GET",
    url: new URL(path, ORIGIN).href,
    mode,
    destination: mode === "navigate" ? "document" : "",
    headers: new Headers({ accept }),
  };
}

function createHarness({ networkStatus, offlineStatus = 200, offlineBody = OFFLINE_HTML }) {
  const listeners = new Map();
  const runtimeCache = {
    async match() {
      return undefined;
    },
    async put() {},
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
    fetch: async () => new Response(`server response ${networkStatus}`, { status: networkStatus }),
    Response,
    Headers,
    URL,
    console,
  };

  vm.runInNewContext(SERVICE_WORKER_SOURCE, context, { filename: "public/sw.js" });

  return {
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

test("top-level navigation turns HTTP 404 and 5xx responses into a branded 200 fallback", async (t) => {
  for (const status of [404, 500, 503]) {
    await t.test(String(status), async () => {
      const harness = createHarness({ networkStatus: status });
      const response = await harness.dispatch(makeRequest());

      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /^text\/html/);
      const body = await response.text();
      assert.match(body, /Aboalazm/);
      assert.match(body, /This page isn’t available right now/);
    });
  }
});

test("top-level navigation has a branded 200 fallback if offline.html is missing or CacheStorage fails", async (t) => {
  for (const offlineStatus of [null, 503, "throw"]) {
    await t.test(String(offlineStatus), async () => {
      const harness = createHarness({ networkStatus: 404, offlineStatus });
      const response = await harness.dispatch(makeRequest());

      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /^text\/html/);
      assert.match(await response.text(), /Aboalazm OS/);
    });
  }
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
