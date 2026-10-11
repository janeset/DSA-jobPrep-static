// Service worker: makes the app work offline and repeat visits fast. Registered by js/app.js when the
// app is served over http (opening index.html as a file skips it).
// - The app's own files: network first, so an edit shows on the next reload; the cache is the
//   fallback when offline.
// - Versioned CDN files (Pyodide, about 10 MB, and the font files): cache first; their URLs never change content.
// - Everything else (YouTube, the Google Fonts stylesheet...) goes to the network as usual.
const CACHE = "dsa-prep-cache-v1";
const VERSIONED = [/^https:\/\/cdn\.jsdelivr\.net\/pyodide\/v[\d.]+\//, /^https:\/\/fonts\.gstatic\.com\//];

// Cached on install, so the app opens offline after one online visit. Keep in step with index.html,
// CONTENT_FILES in js/workspace.js and js/highlight.js; a missing file is skipped, not fatal.
const SHELL = ["./", "index.html", "css/style.css", "js/theme-init.js",
  "data/data.js", "data/faang.js", "data/videos.js", "data/prompts.js", "data/tests.js",
  "data/lessons/principles.js", "data/lessons/refresher.js", "data/lessons/bigo.js", "data/lessons/datastructures.js", "data/lessons/langlessons.js",
  "data/solutions/solutions1.js", "data/solutions/solutions2.js", "data/solutions/solutions3.js", "data/solutions/solutions4.js",
  "js/codecolors.js", "js/checker.js", "js/workspace.js", "js/nav.js", "js/interview.js", "js/router.js", "js/search.js",
  "js/app.js", "js/pyworker.js", "js/highlight.js", "js/vendor/highlight/core.min.js",
  "js/vendor/highlight/python.min.js", "js/vendor/highlight/java.min.js", "js/vendor/highlight/csharp.min.js"];

self.addEventListener("install", (e) => e.waitUntil(
  caches.open(CACHE).then((cache) => Promise.all(SHELL.map((f) => cache.add(f).catch(() => {})))).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin === self.location.origin) e.respondWith(networkFirst(req));
  else if (VERSIONED.some((re) => re.test(req.url))) e.respondWith(cacheFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    // Offline: the cached copy (ignoring ?query, so the page opens under any address).
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  // A worker's importScripts stores an opaque copy; a CORS request (a page script with integrity=) can't use it.
  if (hit && !(hit.type === "opaque" && req.mode === "cors")) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") cache.put(req, res.clone());
  return res;
}
