/*
 * The Pocket Chaplain service worker.
 *
 * - Saves the main pages and their files so prayers, Take a moment, and the
 *   on-device pastor/friend contacts open without a signal.
 * - Pages always come from the network first, so content stays current; the
 *   saved copy is used only when the network fails or is very slow.
 * - Never touches the admin area, APIs, or form submissions.
 * - Shows the optional daily reminder notification.
 */

const VERSION = "v1";
const PAGES_CACHE = `pc-pages-${VERSION}`;
const STATIC_CACHE = `pc-static-${VERSION}`;
const MAX_STATIC = 200;
const NETWORK_TIMEOUT_MS = 4000;

const PRECACHE_PAGES = [
  "/",
  "/offline",
  "/pocket-chaplain",
  "/pocket-chaplain/take-a-moment",
  "/reach/chaplain",
  "/reach/pastor",
  "/reach/friend",
  "/check-in",
  "/family",
  "/resources",
  "/privacy",
  "/about",
];

const STATIC_RE = /\/_next\/static\/[^"'\s)\\]+/g;

async function cacheAssetsFrom(html) {
  const urls = [...new Set(html.match(STATIC_RE) || [])];
  const cache = await caches.open(STATIC_CACHE);
  await Promise.all(
    urls.map(async (u) => {
      if (await cache.match(u)) return;
      try {
        const res = await fetch(u);
        if (res.ok) await cache.put(u, res);
      } catch {
        /* skip */
      }
    }),
  );
}

async function precache() {
  const cache = await caches.open(PAGES_CACHE);
  await Promise.all(
    PRECACHE_PAGES.map(async (path) => {
      try {
        const res = await fetch(path, { credentials: "same-origin" });
        if (!res.ok || res.redirected) return;
        await cache.put(path, res.clone());
        await cacheAssetsFrom(await res.text());
      } catch {
        /* offline during install; pages get saved as they're visited */
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = [PAGES_CACHE, STATIC_CACHE];
      for (const key of await caches.keys()) {
        if (key.startsWith("pc-") && !keep.includes(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

function isPrivatePath(pathname) {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/");
}

async function trimStatic() {
  const cache = await caches.open(STATIC_CACHE);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_STATIC; i++) await cache.delete(keys[i]);
}

async function handleNavigation(request) {
  const url = new URL(request.url);
  const cache = await caches.open(PAGES_CACHE);
  const network = fetch(request).then(async (res) => {
    if (res.ok && !res.redirected && !url.search) {
      const copy = res.clone();
      cache.put(url.pathname, copy.clone()).catch(() => {});
      copy.text().then(cacheAssetsFrom).catch(() => {});
    }
    return res;
  });

  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
    // Network is slow: use the saved copy if there is one, otherwise keep waiting.
    return (await cache.match(url.pathname)) || (await network);
  } catch {
    return (await cache.match(url.pathname)) || (await cache.match("/offline")) || Response.error();
  }
}

async function handleStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) {
    cache.put(request, res.clone()).then(trimStatic).catch(() => {});
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isPrivatePath(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  const isStatic =
    url.pathname.startsWith("/_next/static/") || /\.(?:png|webp|svg|ico|woff2?)$/.test(url.pathname);
  if (isStatic) event.respondWith(handleStatic(request));
});

// ---------------------------------------------------------------------------
// Daily reminder
// ---------------------------------------------------------------------------

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Today's encouragement", {
      body: data.body || "A moment of encouragement is waiting for you.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "pc-daily",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const w of windows) {
        if (new URL(w.url).origin === self.location.origin) {
          await w.focus();
          return w.navigate(target);
        }
      }
      return self.clients.openWindow(target);
    })(),
  );
});
