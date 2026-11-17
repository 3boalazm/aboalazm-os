// Service Worker for Aboalazm OS PWA
// Cache policy:
//   - HTML navigations (/ , /work, /work/design, /work/development, etc.): network-first so published updates appear immediately.
//     Chrome treats an HTTP 404/5xx (or a failed offline load) inside a Trusted Web Activity as an app crash, so a controlled
//     top-level navigation never receives one as-is: a 404 keeps the site's own designed 404 page but is delivered with status 200;
//     a 5xx serves the last cached copy of that page, or the branded fallback; offline works the same way. The server's real status
//     is unchanged for crawlers and for clients that are not controlled by this worker.
//   - Built assets (/_next/static/*, /fonts/*): cache-first (content-hashed or immutable).
//   - Images (/images/*, /_next/image*): stale-while-revalidate so offline works without pinning stale thumbnails.
//   - Studio, Admin, API & machine-read files (/studio*, /admin*, /api*, /.well-known/*): network-only, never cached.
//     /.well-known/assetlinks.json is verified by Chrome and by the owner: an unset or invalid fingerprint list must show the
//     server's real 503 JSON, and updated fingerprints must show up at once, not a fallback page or a stale cached copy.
//   - Video / audio and any Range request (/reels/*.mp4 …): network-only. Media is
//     streamed with 206 partial responses, which the Cache API cannot store, and a
//     cached full 200 breaks seeking/playback (notably iOS Safari).

const CACHE_VERSION = "v7";
const STATIC_CACHE = `aboalazm-os-pwa-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `aboalazm-os-pwa-runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/offline.html",
  "/icons/app-192.png",
  "/icons/app-512.png",
];

// Last-resort branded HTML if the precached /offline.html is unavailable.
const BUILT_IN_NAVIGATION_FALLBACK = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#080710" />
    <title>Page unavailable · Aboalazm OS</title>
    <style>
      :root { color-scheme: dark; font-family: system-ui, sans-serif; background: #080710; color: #f8f6f1; }
      body { min-height: 100svh; margin: 0; display: grid; place-items: center; padding: 24px; }
      main { width: min(100%, 38rem); padding: 32px; border: 1px solid #ffffff20; border-radius: 24px; background: #ffffff08; }
      h1 { margin: 0; font-size: clamp(2rem, 8vw, 3rem); letter-spacing: -.04em; }
      p { color: #b8b5c2; line-height: 1.7; }
      a { display: inline-flex; margin-top: 12px; padding: 12px 18px; border-radius: 999px; background: #ff6b47; color: #080710; font-weight: 700; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <p>Aboalazm OS</p>
      <h1>This page isn’t available right now.</h1>
      <p>Check your connection and try again. Pages you’ve already visited may still be available from the app.</p>
      <a href="/">Try the homepage</a>
    </main>
  </body>
</html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => console.warn("[sw] optional precache unavailable", url)))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const { pathname } = url;

  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/.well-known/")
  ) {
    return;
  }

  if (
    request.headers.has("range") ||
    request.destination === "video" ||
    request.destination === "audio" ||
    /\.(mp4|webm|mov|m4v|mp3|m4a)$/i.test(pathname)
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, true));
    return;
  }

  if ((request.headers.get("accept") || "").includes("text/html")) {
    // HTML fetches that are not top-level navigations keep real HTTP errors.
    event.respondWith(networkFirst(request));
    return;
  }

  if (pathname.startsWith("/_next/static/") || pathname.startsWith("/fonts/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/_next/image")
  ) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});

async function networkFirst(request, isTopLevelNavigation = false) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (isTopLevelNavigation && response) {
      // Keep the site's own designed 404 page, but hand it over with status 200 (never cached).
      if (response.status === 404) return withOkStatus(response);
      // A server error is not worth showing: prefer the last good copy of this page, then the branded fallback.
      if (response.status >= 500) return (await cache.match(request)) || navigationFallback();
    }
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (isTopLevelNavigation) return navigationFallback();
    const shell = await caches.match("/offline.html");
    if (shell) return shell;
    throw err;
  }
}

function withOkStatus(response) {
  const headers = new Headers(response.headers);
  // The service worker receives the body already decoded, so the original framing headers no longer describe it.
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(response.body, { status: 200, statusText: "OK", headers });
}

async function navigationFallback() {
  try {
    const shell = await caches.match("/offline.html");
    if (shell && shell.status === 200) return shell;
  } catch {
    // CacheStorage can be unavailable; use the built-in page below.
  }

  return new Response(BUILT_IN_NAVIGATION_FALLBACK, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  return cached || (await networkFetch) || Response.error();
}
