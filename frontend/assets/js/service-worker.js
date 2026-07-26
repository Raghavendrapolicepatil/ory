const CACHE_NAME = "snackible-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/assets/css/style.css",
  "/assets/css/offline.css",
  "/assets/js/offline.js",
  "/assets/images/offline.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});