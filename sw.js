const CACHE_NAME = "speed-gun-cache-v1";
const urlsToCache = [
  "/speed-gun-app/",
  "/speed-gun-app/index.html",
  "/speed-gun-app/index.js",
  "/speed-gun-app/metadata.json",
  "/speed-gun-app/App.js",
  "/speed-gun-app/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
