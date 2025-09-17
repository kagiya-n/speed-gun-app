const CACHE_NAME = "speed-gun-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/index.tsx",
  "/metadata.json",
  "/App.tsx",
  "/constants.ts",
  "/components/FileUpload.tsx",
  "/components/VideoProcessor.tsx",
  "/components/ResultDisplay.tsx",
  "/components/icons.tsx",
  "/components/AppIcon.tsx",
  "/manifest.json",
  "https://cdn.tailwindcss.com",
  "https://aistudiocdn.com/react@^19.1.1",
  "https://aistudiocdn.com/react-dom@^19.1.1/client",
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
